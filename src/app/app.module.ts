import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { AppComponent } from './app.component';
import { VideoDownloaderComponent } from './video-downloader/video-downloader.component';
import { WebSocketComponent } from './web-socket/web-socket.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import {NgxFilesizeModule} from 'ngx-filesize';

import {MatTabsModule} from '@angular/material/tabs';
import {MatProgressBarModule} from '@angular/material/progress-bar';
import { SettingsComponent } from './settings/settings.component';
import { MatGridListModule } from '@angular/material/grid-list';
import { MatCardModule } from '@angular/material/card';
import { MatMenuModule } from '@angular/material/menu';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { LayoutModule } from '@angular/cdk/layout';
import { ToolbarComponent } from './toolbar/toolbar.component';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatListModule } from '@angular/material/list';
import { MainComponent } from './main/main.component';
import {MatInputModule} from '@angular/material/input';
import {MatFormFieldModule} from '@angular/material/form-field';
import { MediumComponent } from './video-downloader/medium.component';
import {MatTableModule} from '@angular/material/table';
import {MatButtonToggleModule} from '@angular/material/button-toggle';
import { EditMediumComponent } from './video-downloader/edit-medium.component';
import {MatProgressSpinnerModule} from '@angular/material/progress-spinner';
import { PhoneComponent } from './phone/phone.component';

@NgModule({
  declarations: [
    AppComponent,
    VideoDownloaderComponent,
    WebSocketComponent,
    SettingsComponent,
    ToolbarComponent,
    MainComponent,
    MediumComponent,
    EditMediumComponent,
    PhoneComponent
  ],
  imports: [
    BrowserModule,
    FormsModule,
    ReactiveFormsModule,
    BrowserAnimationsModule,
    NgxFilesizeModule,
    MatProgressSpinnerModule, MatButtonToggleModule, MatTableModule,MatTabsModule,MatProgressBarModule, MatGridListModule, MatCardModule, MatMenuModule, MatIconModule, MatButtonModule, LayoutModule, MatToolbarModule, MatSidenavModule, MatListModule, MatFormFieldModule, MatInputModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
