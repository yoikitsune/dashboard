import { Component, OnInit, ChangeDetectorRef, OnDestroy } from '@angular/core';
import { Title } from '@angular/platform-browser';
import { Router, NavigationEnd, ActivatedRoute } from '@angular/router';
import { filter, map, combineLatestWith } from 'rxjs/operators';
import { MediaMatcher } from '@angular/cdk/layout';

import { MediaService } from "./media.service";
import { PhoneService } from "./phone.service";

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
  // changeDetection: ChangeDetectionStrategy.OnPush
})
export class AppComponent implements OnInit, OnDestroy {
  title = 'My dashboard';
  mobileQuery: MediaQueryList;

  private _mobileQueryListener: () => void;

  isOpened$ = this.media.loadSync ().pipe (
    combineLatestWith (this.phone.loadSync()),
    map (res => {
      let i = 0;
      let state = true;
      while (i < res.length && state) {
        state = res[i];
        i++;
      }
      return state;
    })
  );

  constructor(
    public media: MediaService,
    public phone: PhoneService,
    private router: Router,
    public titleService: Title,
    changeDetectorRef: ChangeDetectorRef,
    mediaMatch: MediaMatcher,
  ) {
    this.mobileQuery = mediaMatch.matchMedia('(max-width: 600px)');
    this._mobileQueryListener = () => changeDetectorRef.detectChanges();
    this.mobileQuery.addListener(this._mobileQueryListener);
  }

  ngOnInit() {
    this.router.events
      .pipe(
        filter((event) => event instanceof NavigationEnd),
        map(() => {
          let route: ActivatedRoute = this.router.routerState.root;
          let routeTitle = '';
          while (route!.firstChild) {
            route = route.firstChild;
          }
          if (route.snapshot.data['title']) {
            routeTitle = route!.snapshot.data['title'];
          }
          return routeTitle;
        })
      )
      .subscribe((title: string) => {
        if (title) {
          this.titleService.setTitle(`Dashboard - ${title}`);
        }
      });
  }

  ngOnDestroy(): void {
    this.mobileQuery.removeListener(this._mobileQueryListener);
  }
}
