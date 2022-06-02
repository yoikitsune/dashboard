import { NgModule } from '@angular/core';

import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { Routes, RouterModule } from '@angular/router';

import { MatButtonModule } from '@angular/material/button';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatIconModule } from '@angular/material/icon';
import { MatListModule } from '@angular/material/list';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';


import { AppComponent } from './app.component';
/*import { ToolbarComponent } from './toolbar/toolbar.component';
import { SettingsComponent } from './settings/settings.component';
import { WebSocketComponent } from './web-socket/web-socket.component';*/


const routes:Routes = [
  {
    path: 'download',
    loadChildren: () => import('./video-downloader/video-downloader.module').then(m => m.VideoDownloaderModule)
  },
  {
    path: 'phone',
    loadChildren: () => import('./phone/phone.module').then(m => m.PhoneModule),
    data: { title: 'Mobile' }
  },
  { path: '',   redirectTo: '/download', pathMatch: 'full' }
];

@NgModule({
  declarations: [
    AppComponent,
    // WebSocketComponent,
    // SettingsComponent,
    // ToolbarComponent,
  ],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    MatButtonModule,
    MatToolbarModule,
    MatIconModule,
    MatSidenavModule,
    MatListModule,
    MatProgressSpinnerModule,
    RouterModule.forRoot(routes)
  ],
  exports: [ RouterModule ],
  providers: [],
  bootstrap: [ AppComponent ]
})
export class AppModule { }
