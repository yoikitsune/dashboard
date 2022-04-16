import { Component, OnInit } from '@angular/core';
import { WebSocketService } from "../websocket.service";
import { MediaService, Medium } from "../media.service";
import { FormControl } from '@angular/forms';
import { Observable } from "rxjs";
@Component({
  selector: 'app-video-downloader',
  templateUrl: './video-downloader.component.html',
  styleUrls: ['./video-downloader.component.css']
})
export class VideoDownloaderComponent implements OnInit, ChildMethods {
  editMedium:Medium|null = null;
  editError:string|null = null;
  output:string = "";
  selected = new FormControl(0);
  mediaList:any = null;

  constructor(private webSocket: WebSocketService, public media: MediaService) { }

  ngOnInit(): void {
    let sub$:any;
    this.webSocket.subscribe ({
      open : () => {
        sub$ = this.media.getList().subscribe (()=>{
          this.mediaList = this.media.media;
        });
      },
      close : () => {
        sub$ && sub$.unsubscribe ();
      }
    })

  }

  tabChanged (id:number) {
    this.selected.setValue(id);
    if (id == 0) {
      this.editMedium = null;
    }
  }

  add (url:string) {
    this.media.add(url).subscribe ({
      error : error => {
        this.editError = error.data;
      },
      complete : () => {
        this.editMedium = this.media.get (url);
      }
    })
  }

  edit (medium:Medium) {
    this.editMedium = medium;
    this.selected.setValue (1);
  }

  exec (data:any[]) {
    let method = data[0] as (keyof ChildMethods);
    return (this[method] as Function).apply (this, data[1]);
  }
}

interface ChildMethods {
  add : (this:this, url:string) => void;
  edit : (this:this, medium:Medium) => void;
}
