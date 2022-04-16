import { Injectable } from '@angular/core';
import { WebSocketService } from "./websocket.service";
import { Observable, Subject, BehaviorSubject, concat, interval } from 'rxjs';
import { first, throttle } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class PhoneService {
  status$:BehaviorSubject<string> = new BehaviorSubject("close");
  name:string = "test";

  constructor(public webSocket: WebSocketService) {
  }

  getPhone () {
    return new Observable (sub => {
      let sub$:any;
      this.webSocket.subscribe ({
        open : () => {
          sub$ = this.webSocket.createRequest ({
            command : "phone",
            method : "getPhone"
          }).subscribe ((request:any)=>{
            console.log ("test", request);
            sub.next (request.data)
          });
        },
        close : () => {
          if (sub$)
            sub$.unsubscribe ();
        }
      })
    });
  }
}
