import { Injectable } from '@angular/core';
import { WebSocketService } from "./websocket.service";
import { Observable, Subject, BehaviorSubject, concat } from 'rxjs';
import { first } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class MediaService {
  media: { [key:string]: Medium } = {};

  constructor(public webSocket: WebSocketService) { }

  _register (data:Medium) {
    this.media [data.url] = new Medium (data.url, this);
    this._update (data)
  }

  _update (data:Medium) {
    let medium:Medium = this.media [data.url];
    Object.keys (data).forEach((element: string) => {
      if (element in medium) {
        let prop = element as (keyof typeof medium & keyof typeof element);
        medium [prop] = data [prop];
      }
    });
  }

  /*_waitForUpdate (observable:Observable<any>) {
    return concat (
      observable,
      this.update$.pipe (first())
    ).pipe (first ());
  }*/

  loadSync () {
    let sub$:any;
    let actions = {
      "init" : (media: { [key:string]: Medium }) => {
        this.media = {};
        for (let url in media) {
          this._register (media[url]);
        }
      },
      "add" : (medium:Medium) => {
        this._register (medium);
      },
      "change" : (medium:Medium) => {
        this._update (medium);
      },
      "delete" : (url:string) => {
        delete this.media[url];
      }
    }
    this.webSocket.subscribe ({
      open : () => {
        sub$ = this.webSocket.createRequest ({
          command : "download",
          method : "loadSync"
        }).subscribe ({
          next : (response:any) => {
            actions [response.action](response.data);
          },
          error : (message:string) => {
            console.log ("getList error : " + message);
          },
          complete : () => {
            console.log ("getList complete");
          }
        });
      },
      close : () => {
        this.media = {};
        sub$ && sub$.unsubscribe ();
      }
    })
  }

  add (url:string) {
    return this.webSocket.createRequest ({
      command : "download",
      method : "getInfos",
      params : [ url ],
    });
  }

  get (url:string) {
    return this.media [url];
  }

  delete (url:string) {
    this.webSocket.createRequest ({
      command : "download",
      method : "delete",
      params : [ url ]
    }).subscribe ();
  }

}

interface DownloadStatus {
  state:string;
  percentage:number;
  size : string;
  speed : string,
  ETA : string
}

export class Medium {
  observers : { [key : string]: BehaviorSubject<string> } = {};

  status:DownloadStatus = {
    state : "noformat",
    percentage : 0,
    size : "N/A",
    speed : "0",
    ETA : ""
  };
  formats:any [] = [];
  format:any = {};
  title:string = "";
  thumbnail:string = "";
  file:string = "";

  constructor(public url:string, private parent:MediaService)  {
    this.url = url;
    this.parent = parent;
  }

  initDownload (format:any) {
    this.parent.webSocket.createRequest ({
      command : "download",
      method : "initDownload",
      params : [ this.url, format ]
    }).subscribe ({
      error : (error) => {
        console.log ("cannot start download", error)
      }
    });
  }

  startDownload () {
    this.parent.webSocket.createRequest ({
      command : "download",
      method : "startDownload",
      params : [ this.url, this.format ]
    }).subscribe ();
  }

  stopDownload () {
    this.parent.webSocket.createRequest ({
      command : "download",
      method : "stopDownload",
      params : [ this.url ]
    }).subscribe ();
  }
}
