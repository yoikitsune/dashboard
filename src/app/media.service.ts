import { Injectable } from '@angular/core';
import { WebSocketService } from "./websocket.service";
import { Observable, Subject, BehaviorSubject, concat, interval } from 'rxjs';
import { first, throttle } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class MediaService {
  media: { [key:string]: Medium } = {};
  update$:Subject<null> = new Subject ();
  oldMediums:string[] = [];

  constructor(public webSocket: WebSocketService) { }

  _register (data:Medium) {
    let medium:Medium = this.media [data.url];
    if (!medium) {
      medium = new Medium (data.url, this);
      this.media [data.url] = medium;
    }
    else
      this.oldMediums.splice (this.oldMediums.indexOf (medium.url), 1);

    Object.keys (data).forEach((element: string) => {
      if (element in medium) {
        let prop = element as (keyof typeof medium & keyof typeof element);
        medium [prop] = data [prop];
      }
    });
  }

  _waitForUpdate (observable:Observable<any>) {
    return concat (
      observable,
      this.update$.pipe (first())
    ).pipe (first ());
  }

  getList () {
    return new Observable (sub => {
      this.webSocket.createRequest ({
        command : "download",
        method : "getList"
      }).subscribe ({
        next : (data:any) => {
          this.oldMediums = Object.keys (this.media);
          for (let url in data.data) {
            this._register (data.data[url]);
          }
          this.oldMediums.forEach(element => {
            delete this.media [element];
          });
          sub.next ();
          this.update$.next (null);
          console.log (this.media);
        },
        error : (message:string) => {
          console.log ("getList error : " + message);
          sub.error (message);
        },
        complete : () => {
          console.log ("getList complete");
        }
      });
    })
  }

  add (url:string) {
    return this._waitForUpdate (this.webSocket.createRequest ({
      command : "download",
      method : "getInfos",
      params : [ url ],
    }));
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
  parent : MediaService;
  observers : { [key : string]: BehaviorSubject<string> } = {};

  url:string;
  status:DownloadStatus = {
    state : "noformat",
    percentage : 0,
    size : "N/A",
    speed : "0",
    ETA : ""
  };
  formats:any [] = [];
  format:any;
  title:string = "";
  thumbnail:string = "";

  constructor(url:string, parent:MediaService)  {
    this.url = url;
    this.parent = parent;
  }

  observe (prop : keyof Medium):Observable<string> {
    if (!(prop in this.observers)) {
      this.observers[prop] = new BehaviorSubject<any> (this[prop]);
    }
    return this.observers[prop];
  }

  set (prop : keyof Medium, value:any) {
    let element = prop as (keyof typeof this & keyof typeof prop);
    this [element] = value;
    if (this.observers [prop]) {
      this.observers [prop].next (value);
    }
  }

  initDownload (format:any) {
    this.parent.webSocket.createRequest ({
      command : "download",
      method : "initDownload",
      params : [ this.url, format ]
    }).subscribe ({
      complete: () => {
        this.startDownload ();
      }
    });
  }

  startDownload () {
    this.parent.webSocket.createRequest ({
      command : "download",
      method : "startDownload",
      params : [ this.url, this.format ]
    }).pipe(throttle(() => interval(1000))).subscribe ({
      next: (response:any) => {
        this.set ('status', response.data);
      }
    });
  }

  stopDownload () {
    this.parent.webSocket.createRequest ({
      command : "download",
      method : "stopDownload",
      params : [ this.url ]
    }).subscribe ();
  }
}
