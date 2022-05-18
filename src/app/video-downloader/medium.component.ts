import { Component, EventEmitter, Input, Output, OnInit, OnDestroy } from '@angular/core';
import { MediaService } from "../media.service";
import { PhoneService } from "../phone.service";

@Component({
  selector: 'app-medium',
  templateUrl: './medium.component.html',
  styleUrls: ['./medium.component.css']
})
export class MediumComponent implements OnInit, OnDestroy {
  @Input() medium: any;
  @Output() parent = new EventEmitter<any>();
  sub:any = null;
  copyInProgress:boolean = false;

  constructor(public media: MediaService, public phone: PhoneService) {}

  ngOnInit(): void {
    /*this.sub = this.medium.observe ('status').subscribe ((value:any) => {
      this.medium.status = value;
    })*/
  }

  edit () {
    this.parent.emit (["edit", [this.medium]])
  }

  fileCanBeCopied () {
    if (this.copyInProgress) return false;
    if (this.medium.status.state != 'downloaded'
     || !this.phone.isPhoneConnected())
      return false;
    else
      return this.phone.phones[Object.keys(this.phone.phones)[0]]
        .files[this.medium.format.type].indexOf (this.medium.file) == -1;
  }
  copyToPhone () {
    this.copyInProgress = true;
    this.phone.copy (this.medium.format.type, this.medium.file).subscribe ({
      error : error => {
        this.copyInProgress = false;
      },
      complete : () => {
        this.copyInProgress = false;
      }
    });
  }

  ngOnDestroy(): void {
    //this.sub.unsubscribe ();
  }
}
