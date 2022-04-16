import { Component, OnInit } from '@angular/core';
import { PhoneService } from "../phone.service";
import { filter, switchMap } from "rxjs/operators";
import { Observable } from 'rxjs';

@Component({
  selector: 'app-phone',
  templateUrl: './phone.component.html',
  styleUrls: ['./phone.component.css']
})
export class PhoneComponent implements OnInit {
  phone:any = null;

  constructor(public phoneService:PhoneService) { }

  ngOnInit(): void {
  }

  getPhone () {
    return this.phoneService.getPhone ().subscribe (phone => {
      this.phone = phone;
    });
  }
}
