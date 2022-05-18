import { Component, OnInit, Pipe, PipeTransform } from '@angular/core';
import { PhoneService } from "../phone.service";
import { filter, switchMap } from "rxjs/operators";
import { Observable } from 'rxjs';

@Component({
  selector: 'app-phone',
  templateUrl: './phone.component.html',
  styleUrls: ['./phone.component.css']
})
export class PhoneComponent implements OnInit {

  constructor(public phoneService:PhoneService) { }

  ngOnInit(): void {
    this.phoneService.loadSync ();
  }

  log (val) {
    console.log (val);
  }
}
