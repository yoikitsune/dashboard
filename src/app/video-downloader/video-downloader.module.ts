import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { MaterialModule } from '../material.module';

import { NgxFilesizeModule } from 'ngx-filesize';

import { CommonModule } from '../common.module'

import { VideoDownloaderComponent } from './video-downloader.component';
import { EditMediumComponent } from './edit-medium.component';
import { MediumComponent } from './medium.component';
import { AddMediumComponent } from './add-medium.component';
import { MediumActionsComponent } from './medium-actions.component';
import { MediumStatusComponent } from './medium-status.component';

const routes:Routes = [
  {
    path: '',
    component: VideoDownloaderComponent,
    data: { title: 'Téléchargements' },
    pathMatch: 'full'
  },
  {
    path: 'edit/:id',
    component: EditMediumComponent,
  },
  {
    path: 'add',
    component: AddMediumComponent,
  },
];

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    MaterialModule,
    NgxFilesizeModule,
    RouterModule.forChild(routes)
  ],
  declarations: [
    VideoDownloaderComponent,
    EditMediumComponent,
    MediumComponent,
    AddMediumComponent,
    MediumActionsComponent,
    MediumStatusComponent
  ],
  exports: [ RouterModule ]
})
export class VideoDownloaderModule { }
