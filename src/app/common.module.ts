import { NgModule } from '@angular/core';
import { CommonModule as ngCommonModule } from '@angular/common'
import { GetValuesPipe } from './get-values.pipe';

@NgModule({
  declarations: [
    GetValuesPipe
  ],
  exports: [
    ngCommonModule,
    GetValuesPipe
  ],
})
export class CommonModule { }
