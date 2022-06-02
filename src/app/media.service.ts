import { Injectable } from '@angular/core';
import { WebSocketService, WebSocketData, Datum } from "./websocket.service";
import { Observable, Subject, BehaviorSubject, concat } from 'rxjs';
import { first } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class MediaService extends WebSocketData<Medium> {

  constructor(webSocket: WebSocketService) {
    super (webSocket, "download");
  }

  createDatum (id:string, parent:WebSocketData<Medium>):Medium {
    return new Medium (id, parent);
  }

  add (url:string) {
    return this.webSocket.createRequest ({
      command : "download",
      method : "getInfos",
      params : [ url ],
    });
  }

  get (id:string) {
    return this.data [id];
  }

  delete (id:string) {
    this.webSocket.createRequest ({
      command : "download",
      method : "delete",
      params : [ id ]
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

export class Medium extends Datum {
  // observers : { [key : string]: BehaviorSubject<string> } = {};

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

  initDownload (format:any) {
    this.parent.webSocket.createRequest ({
      command : "download",
      method : "initDownload",
      params : [ this.id, format ]
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
      params : [ this.id, this.format ]
    }).subscribe ();
  }

  stopDownload () {
    this.parent.webSocket.createRequest ({
      command : "download",
      method : "stopDownload",
      params : [ this.id ]
    }).subscribe ();
  }

  delete () {
    (this.parent as MediaService).delete (this.id);
  }
}
