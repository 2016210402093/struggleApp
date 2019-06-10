import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { CreateclockPage } from './createclock';

@NgModule({
  declarations: [
    CreateclockPage,
  ],
  imports: [
    IonicPageModule.forChild(CreateclockPage),
  ],
})
export class CreateclockPageModule {}
