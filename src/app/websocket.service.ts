import { Injectable } from '@angular/core';
import { webSocket, WebSocketSubject } from 'rxjs/webSocket';
import { Observable, BehaviorSubject, Subject, Subscriber } from 'rxjs';
import { delay, tap, retryWhen } from 'rxjs/operators';
import { environment } from '../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class WebSocketService {
  status$:BehaviorSubject<string> = new BehaviorSubject ("close");
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
        // console.log ("ws connected with clientId " + clientId);
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
          url :`ws://${window.location.hostname}:${environment.wsPort}`,
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

export class Datum {
  change$:Subject<string> = new Subject ();
  constructor(
    public id:string,
    protected parent:WebSocketData<Datum>
  ) {}
}

export abstract class WebSocketData<T extends Datum> {
  data: { [key:string]: T } = {};
  data$: BehaviorSubject<any> = new BehaviorSubject ({});

  abstract createDatum (id:string, parent:WebSocketData<any>)

  constructor(public webSocket: WebSocketService, public command:string) {
  }

  _register (data) {
    return Object.assign (this.createDatum (data.id, this), data);
    //this._update (data)
  }

  _update (data) {
    let datum:T = this.data [data.id];
    Object.keys (data).forEach((element: string) => {
      if (element in datum) {
        let prop = element as (keyof typeof datum & keyof typeof element);
        datum [prop] = data [prop];
      }
    });
  }

  loadSync () {
    let state$:Subject<boolean> = new Subject ();
    let sub$:any;
    let actions = {
      "init" : (data: { [key:string]: keyof T }) => {
        let newData: typeof this.data = {};
        for (let id in data) {
          newData[id] = this._register (data[id]);
        }
        this.data = newData;
        state$.next (true);
        this.data$.next (this.data);
      },
      "add" : (data) => {
        this.data[data.id] = this._register (data);
        this.data$.next (this.data);
      },
      "change" : (data: { [key:string]: keyof Datum  }) => {
        this._update (data);
        this.data [data['id']].change$.next ("");
      },
      "delete" : (id:string) => {
        delete this.data[id];
        this.data$.next (this.data);
      }
    }
    this.webSocket.subscribe ({
      open : () => {
        sub$ = this.webSocket.createRequest ({
          command : this.command,
          method : "loadSync"
        }).subscribe ({
          next : (response:any) => {
            actions [response.action](response.data);
          },
          error : (message:string) => {
            console.log ("loadSync error : " + message);
          },
          complete : () => {
            console.log ("loadSync complete");
          }
        });
      },
      close : () => {
        state$.next (false);
        this.data = {};
        sub$ && sub$.unsubscribe ();
      }
    });
    return state$.asObservable();
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
