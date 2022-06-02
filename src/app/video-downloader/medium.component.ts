import { Component, ChangeDetectionStrategy, Input, OnInit, OnDestroy } from '@angular/core';
import { MediaService } from "../media.service";
import { PhoneService } from "../phone.service";

@Component({
  selector: 'app-medium',
  templateUrl: './medium.component.html',
  styleUrls: ['./medium.component.scss'],
  // changeDetection: ChangeDetectionStrategy.OnPush
})
export class MediumComponent {
  @Input() medium: any;
  sub:any = null;

  previousState:string = "";

  constructor(
    public media: MediaService,
    public phone: PhoneService
  ) {}
}
