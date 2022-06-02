import { Component } from '@angular/core';
import { MediaService, Medium } from "../media.service";
import { Observable } from "rxjs";
import { map } from "rxjs/operators";
//import { FormControl } from '@angular/forms';

@Component({
  selector: 'app-video-downloader',
  templateUrl: './video-downloader.component.html',
  styleUrls: ['./video-downloader.component.css'],
})
export class VideoDownloaderComponent {
  output:string = "";
  media$:Observable<Medium[]>;

  constructor(
    public media: MediaService
  ) {
    this.media$ = this.media.data$.pipe (map (data => {
       let arr:Medium[] = [];
       for (var p in data)
         arr.push (data[p])
       return arr;
     }));
  }
}
