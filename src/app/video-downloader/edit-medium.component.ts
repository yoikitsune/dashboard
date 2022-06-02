import { Component, OnInit, OnDestroy } from '@angular/core';
import { FormControl } from '@angular/forms';
import { MatTableDataSource } from '@angular/material/table';
import { ActivatedRoute, Router } from '@angular/router';

import { MediaService } from "../media.service";

@Component({
  selector: 'app-edit-medium',
  templateUrl: './edit-medium.component.html',
  styleUrls: ['./edit-medium.component.scss']
})
export class EditMediumComponent implements OnInit, OnDestroy {
  formatFilter:FormControl = new FormControl('video');
  displayedColumns: string[] = ['resolution', 'type', 'filesize', 'action' ];
  dataSource = new MatTableDataSource();
  sub;
  medium: any;

  delete = () => this.router.navigate (["/download"]);
  copy = () => this.router.navigate (["/phone"]);

  constructor(
    public media: MediaService,
    private route: ActivatedRoute,
    private router: Router
  ) {
    this.dataSource.filterPredicate = (data: any, filter: string) => {
      return data.type == filter;
    };
    this.formatFilter.registerOnChange ((val:any) => {
      this.dataSource.filter = val;
    });
    this.formatFilter.setValue ('video');
  }

  ngOnInit(): void {
    this.sub = this.route.paramMap.subscribe (params => {
      let id = this.route.snapshot.params['id'];
      if (id)
        this.medium = this.media.get(id);
      if (this.medium) {
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
      else
        this.router.navigate (["/download"])
    });
  }

  /*add () {
    this.parent.emit (["add", [this.msgCtrl.value]]);
    this.error = null;
    this.waiting = true;
  }*/

  initDownload (format:any) {
    this.medium.initDownload (format);
  }

  ngOnDestroy () {
    this.sub.unsubscribe();
  }
}
