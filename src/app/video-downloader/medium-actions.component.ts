import { Component, Input, Output, EventEmitter, OnInit } from '@angular/core';
import { Observable, BehaviorSubject } from 'rxjs';
import { MediaService, Medium } from "../media.service";
import { PhoneService, Phone } from "../phone.service";
interface Action {
  name:string;
  icon?:string;
  action:Function;
}

@Component({
  selector: 'app-medium-actions',
  templateUrl: './medium-actions.component.html',
  styleUrls: ['./medium-actions.component.scss']
})
export class MediumActionsComponent implements OnInit {
  @Input() status:any;
  @Input() id:any;
  @Input() type:string = "";
  @Input() delete:Function|null = null;
  @Input() copy:Function|null = null;
  previousState:string = "";

  actions:Action[] = [];
  actions$:BehaviorSubject<Action[]> = new BehaviorSubject ([] as Action[]);

  constructor(
    private media:MediaService,
    private phones:PhoneService
  ) {
    this.phones.data$.subscribe (data => {
      for (let p in data) {
        data[p].change$.subscribe (()=>{
          this.setActions ();
        });
      }
    })
  }

  ngOnInit(): void {
  }

  ngOnChanges(): void {
    if (this.previousState != this.status.state) {
      this.setActions();
    }
  }

  setActions () {
    this.previousState = this.status.state;
    let actions:Action[] = [];
    let medium = this.media.get(this.id);
    switch (this.status.state) {
      case "init":
      case "downloading":
      case "finalize":
        actions.push ({
          name : "Stopper",
          icon : "stop",
          action:()=>medium.stopDownload()
        });
        break;
      case "paused":
        actions.push ({
          name : "Continuer",
          icon : "play_arrow",
          action:()=>medium.startDownload()
        });
        break;
      case "error":
        actions.push ({
          name : "Relancer",
          icon : "play_arrow",
          action:()=>medium.startDownload()
        });
        break;
    }
    for (let id in this.phones.data) {
      let phone = this.phones.data[id];
      if (phone.fileCanBeCopied(medium))
        actions.push ({
          name : "Copier dans le " + id,
          icon : "add_to_home_screen",
          action: ()=>{
            phone.copy (medium)
            if (this.copy)
              this.copy();
          }
        });
    }
    actions.push ({
      name : "Supprimer",
      icon : "delete",
      action:()=>{
        this.media.delete(this.id)
        if (this.delete)
          this.delete();
      }
    });
    this.actions = actions;
  }
}
