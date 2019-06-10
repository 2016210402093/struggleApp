import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { MyclockPage } from './myclock';

@NgModule({
  declarations: [
    MyclockPage,
  ],
  imports: [
    IonicPageModule.forChild(MyclockPage),
  ],
})
export class MyclockPageModule {}
