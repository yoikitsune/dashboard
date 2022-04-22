import { Injectable } from '@angular/core';
import { webSocket, WebSocketSubject } from 'rxjs/webSocket';
import { Observable, Subject, Subscriber } from 'rxjs';
import { delay, tap, retryWhen } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class WebSocketService {
  status$:Subject<any> = new Subject ();
  connection$: WebSocketSubject<any>|null = null;
  requests : any = {};
  RETRY_SECONDS = 10;
  requestsCurrentId:number = 0;
  clientId:string = "";

  constructor() {
    let next:string;
    let ws$ : WebSocketSubject<any>;
    let choices:any = {
      first : (clientId:any) => {
        this.clientId = clientId;
        next = "others";
        console.log ("ws connected with clientId " + clientId);
        this.connection$ = ws$;
        this.status$.next ("open");
      },
      others : (response:any) => {
        var request = this.requests [response.id];
        if (request) {
          request [ response.type ] (response.data);
        }
      }
    }
    new Observable (sub => {
      try {
        next = "first";
        ws$ = webSocket({
          url :'ws://localhost:3000',
          closeObserver: {
            next : () => {
                sub.error ("ws close");
            }
          }
        });
        ws$.asObservable().subscribe({
          next : data => sub.next(data),
          error : error => sub.error(error),
          complete : () => sub.complete()
        });
      }
      catch (e) {
        sub.error ("socket error");
      }
    }).pipe(
        retryWhen ((error:any)  => {
          return error.pipe(
            tap(()=> {
              this.connection$ = null;
              this.status$.next ("close");
              console.log ("ws retry in 5");
            }),
            delay(5000),
          );
        }),
    ).subscribe ({
      next : (data:any) => choices[next](data),
      error : (error:any) => {
        console.log ("ws error", error);
      },
      complete : () => console.log ("ws end")
    });
  }

  getSync (path:string, events:{[key:string]:Function}) {

  }

  subscribe (params:{ open ?: Function, close ?: Function}) {
    this.status$.subscribe ((status:string) => {
      status == "open" && params.open && params.open ();
      status == "close" && params.close && params.close ();
    })
  }
  /**
    Send a new request.
  */
  createRequest (data:Request) {
    return new Observable<string> (subscriber => {
      let id = this.clientId + "-" + ++this.requestsCurrentId;
      this.requests [id] = subscriber;
      data.id = id;
      this.sendRequest (data, subscriber);
    });
  }

  /**
    Send a request.
  */
  sendRequest (request:Request, subscriber:Subscriber<string>) {
    if (this.connection$) {
      this.connection$.next(request);
    } else {
      subscriber.error ('Did not send data, open a connection first');
    }
  }

  closeConnection() {
    if (this.connection$) {
      this.connection$.complete();
      console.log ("ws end");
    }
  }

  ngOnDestroy() {
    this.closeConnection();
  }
}

export interface Request {
  id? : string;
  command : string;
  method : string;
  params? : any;
}

export class Response {
}
