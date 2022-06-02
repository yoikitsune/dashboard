import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

//import { MaterialModule } from '../material.module';

import { CommonModule } from '../common.module'
//import { NgxFilesizeModule } from 'ngx-filesize';

import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatInputModule } from '@angular/material/input';


import { PhoneComponent } from './phone.component';


const routes:Routes = [
  {
    path: '',
    component: PhoneComponent,
    data: { title: 'Téléphone' },
    pathMatch: 'full',
  }
];

@NgModule({
  imports: [
    CommonModule,
    MatInputModule,
    MatProgressSpinnerModule,
    RouterModule.forChild(routes)
  ],
  declarations: [
    PhoneComponent
  ],
  exports: [ RouterModule ]
})
export class PhoneModule { }
