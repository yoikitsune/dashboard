import { Component, OnInit } from '@angular/core';
import { FormControl } from '@angular/forms';
import { MediaService } from "../media.service";
import { Router } from '@angular/router';

@Component({
  selector: 'app-add-medium',
  templateUrl: './add-medium.component.html',
  styleUrls: ['./add-medium.component.css']
})
export class AddMediumComponent implements OnInit {

  msgCtrl = new FormControl('');
  error:string|null = null;
  waiting = false;

  constructor(
    public media: MediaService,
    public router: Router,
  ) { }

  ngOnInit(): void {
  }

  add () {
    this.waiting = true;
    let mediumId:number;
    this.media.add(this.msgCtrl.value).subscribe ({
      next : id => {
        mediumId = +id;
      },
      error : error => {
        this.waiting = false;
        this.error = error;
      },
      complete : () => {
        this.waiting = false;
        this.router.navigate (["/download/edit", mediumId]);
      }
    })
  }


}
