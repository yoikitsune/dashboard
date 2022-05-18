import { Injectable } from '@angular/core';
import { WebSocketService } from "./websocket.service";
import { Observable, Subject, BehaviorSubject, concat, interval } from 'rxjs';
import { first, throttle } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class PhoneService {
  phones: { [key:string]: Phone } = {};

  constructor(public webSocket: WebSocketService) {
  }

  _register (data:Phone) {
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
  }

  isPhoneConnected () : boolean {
    return Object.entries(this.phones).length !== 0;
  }

  copy (type:string, file:string) {
    let subject = new Subject ();
    this.webSocket.createRequest ({
      command : "phone",
      method : "copy",
      params : [Object.keys(this.phones)[0], type, file]
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
      params : [Object.keys(this.phones)[0], type]
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

export class Phone {
  status:string = "offline";
  files:Files = new Files ();
  processes:{ [key:string]:any } = {};

  constructor (public id:string, public parent:PhoneService) {}
}

class Files {
  audio:string[] = [];
  video:string[] = [];
}
