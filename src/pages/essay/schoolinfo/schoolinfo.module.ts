import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { SchoolinfoPage } from './schoolinfo';

@NgModule({
  declarations: [
    SchoolinfoPage,
  ],
  imports: [
    IonicPageModule.forChild(SchoolinfoPage),
  ],
})
export class SchoolinfoPageModule {}
