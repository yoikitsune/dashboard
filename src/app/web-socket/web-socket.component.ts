import { Component, OnInit } from '@angular/core';
import { WebSocketService, Request, Response } from "../websocket.service";
import { FormControl } from '@angular/forms';

@Component({
  selector: 'app-web-socket',
  templateUrl: './web-socket.component.html',
  styleUrls: ['./web-socket.component.css']
})

export class WebSocketComponent implements OnInit {

  messages : String[] = [];
  msgCtrl = new FormControl('');

  constructor(private webSocket: WebSocketService) {}

  ngOnInit() {
    /*.pipe(
      takeUntil(this.destroyed$)
    ).subscribe(data => {
      if (data.message)
        this.messages.push(data.message);
    });*/
  }

  send() {
    //this.webSocket.send({ message: this.msgCtrl.value });
    this.msgCtrl.setValue('');
  }
}
