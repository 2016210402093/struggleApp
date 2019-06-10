import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { MeansPage } from './means';

@NgModule({
  declarations: [
    MeansPage,
  ],
  imports: [
    IonicPageModule.forChild(MeansPage),
  ],
})
export class MeansPageModule {}
