import { Component, EventEmitter, Input, Output, OnInit, OnChanges } from '@angular/core';
import { FormControl } from '@angular/forms';
import {MatTableDataSource} from '@angular/material/table';

@Component({
  selector: 'app-edit-medium',
  templateUrl: './edit-medium.component.html',
  styleUrls: ['./edit-medium.component.css']
})
export class EditMediumComponent implements OnInit {
  @Input() medium: any;
  @Input() error:any;
  @Input() selected: any;
  @Output() parent = new EventEmitter<any>();
  msgCtrl = new FormControl('');
  formatFilter:FormControl = new FormControl('video');
  displayedColumns: string[] = ['resolution', 'type', 'filesize', 'action' ];
  dataSource = new MatTableDataSource();
  waiting:boolean = false;

  constructor() {
    this.dataSource.filterPredicate = (data: any, filter: string) => {
      return data.type == filter;
    };
    this.formatFilter.registerOnChange ((val:any) => {
      this.dataSource.filter = val;
    });
  }

  ngOnInit(): void {
    this.formatFilter.setValue ('video');
  }

  ngOnChanges(): void {
    console.log ("changes");
    if (this.medium) {
      this.waiting = false;
      this.msgCtrl.setValue (this.medium.url);
      this.medium.formats.sort ((a,b) => {
        let aRes = a.resolution.indexOf('video_only') != -1
        let bRes = b.resolution.indexOf('video_only') != -1
        if (aRes)
          return bRes?0:1;
        else
          return bRes?-1:0;
      })
      this.dataSource.data = this.medium.formats;
    }
    else if (!this.error)
      this.msgCtrl.setValue ("");
  }

  add () {
    this.parent.emit (["add", [this.msgCtrl.value]]);
    this.error = null;
    this.waiting = true;
  }

  initDownload (format:any) {
    this.medium.initDownload (format);
    this.selected.setValue (0);
  }
}
