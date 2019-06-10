import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { EssayPage } from './essay';

@NgModule({
  declarations: [
    EssayPage,
  ],
  imports: [
    IonicPageModule.forChild(EssayPage),
  ],
})
export class EssayPageModule {}
