import { Component, OnInit } from '@angular/core';
import { MediaService, Medium } from "../media.service";
import { FormControl } from '@angular/forms';

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

  constructor(public media: MediaService) { }

  ngOnInit(): void {
    this.media.loadSync ();
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
        this.editError = error;
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
