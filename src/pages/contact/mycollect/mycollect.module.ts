import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { MycollectPage } from './mycollect';

@NgModule({
  declarations: [
    MycollectPage,
  ],
  imports: [
    IonicPageModule.forChild(MycollectPage),
  ],
})
export class MycollectPageModule {}
