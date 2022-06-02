import { Injectable } from '@angular/core';
import { WebSocketService, WebSocketData, Datum } from "./websocket.service";
import { Observable, Subject, BehaviorSubject, concat, interval } from 'rxjs';
import { first, throttle } from 'rxjs/operators';
import { MediaService, Medium } from "./media.service";
@Injectable({
  providedIn: 'root'
})
export class PhoneService  extends WebSocketData<Phone>{

  constructor(
    webSocket: WebSocketService,
    public media:MediaService
  ) {
    super (webSocket, "phone");
  }

  createDatum (id:string, parent:WebSocketData<Phone>):Phone {
    return new Phone (id, parent);
  }

/*  _register (data:Phone) {
    this.phones [data.id] = new Phone (data.id, this);
    this._update (data)
  }

  _update (data:Phone) {
    let phone:Phone = this.phones [data.id];
    Object.keys (data).forEach((element: string) => {
      if (element in phone) {
        let prop = element as (keyof typeof phone & keyof typeof element);
        phone [prop] = data [prop];
      }
    });
  }

  loadSync () {
    let sub$:any;
    let actions = {
      "init" : (phones: { [key:string]: any }) => {
        this.phones = {};
        for (let id in phones) {
          this._register (phones[id]);
        }
      },
      "add" : (phone:Phone) => {
        this._register (phone);
      },
      "change" : (phone:Phone) => {
        this._update (phone);
      },
      "delete" : (id:string) => {
        delete this.phones [id];
      }
    }
    this.webSocket.subscribe ({
      open : () => {
        sub$ = this.webSocket.createRequest ({
          command : "phone",
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
        this.phones = {};
        sub$ && sub$.unsubscribe ();
      }
    })
  }*/

  isPhoneConnected () : boolean {
    return Object.keys(this.data).length !== 0;
  }

  copy (type:string, file:string) {
    let subject = new Subject ();
    this.webSocket.createRequest ({
      command : "phone",
      method : "copy",
      params : [Object.keys(this.data)[0], type, file]
    }).subscribe ({
      complete : () => {
        subject.complete ()
      }
    });
    return subject;
  }

  list (type:string) {
    this.webSocket.createRequest ({
      command : "phone",
      method : "list",
      params : [Object.keys(this.data)[0], type]
    }).subscribe ({
      next : (data) => {
        console.log (data);
      },
      error : (error) => {
        console.log (error);
      },
      complete : () => {
        console.log ("Copy done");
      }
    });
  }
}

export class Phone extends Datum {
  status:string = "offline";
  files:Files = new Files ();
  copyInProgress:boolean = false;
  processes:{ [key:string]:any } = {};

  fileCanBeCopied (medium:Medium) {
    if (this.copyInProgress) return false;
    if (medium.status.state != 'downloaded'
     || !(this.parent as PhoneService).isPhoneConnected())
      return false;
    else {
      let phone = this.parent.data[Object.keys(this.parent.data)[0]] as Phone;
      return phone.files[medium.format.type].indexOf (medium.file) == -1;
    }
  }

  copy (medium:Medium) {
    this.copyInProgress = true;
    (this.parent as PhoneService).copy (medium.format.type, medium.file).subscribe ({
      error : error => {
        this.copyInProgress = false;
      },
      complete : () => {
        this.copyInProgress = false;
      }
    });
  }
}

class Files {
  audio:string[] = [];
  video:string[] = [];
}
