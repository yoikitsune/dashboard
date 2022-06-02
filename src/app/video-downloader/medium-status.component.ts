import { Component, OnInit, Input } from '@angular/core';
import { Medium } from '../media.service';
@Component({
  selector: 'app-medium-status',
  templateUrl: './medium-status.component.html',
  styleUrls: ['./medium-status.component.css']
})
export class MediumStatusComponent implements OnInit {
  @Input() status:any;

  constructor() { }

  ngOnInit(): void {
  }

}
