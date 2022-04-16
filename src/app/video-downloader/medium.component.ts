import { Component, EventEmitter, Input, Output, OnInit, OnDestroy } from '@angular/core';
import { WebSocketService } from "../websocket.service";
import { MediaService, Medium } from "../media.service";

@Component({
  selector: 'app-medium',
  templateUrl: './medium.component.html',
  styleUrls: ['./medium.component.css']
})
export class MediumComponent implements OnInit, OnDestroy {
  @Input() medium: any;
  @Output() parent = new EventEmitter<any>();
  sub:any = null;

  constructor(private webSocket: WebSocketService, public media: MediaService) {}

  ngOnInit(): void {
    this.sub = this.medium.observe ('status').subscribe ((value:any) => {
      this.medium.status = value;
    })
  }

  edit () {
    this.parent.emit (["edit", [this.medium]])
  }

  ngOnDestroy(): void {
    this.sub.unsubscribe ();
  }
}
