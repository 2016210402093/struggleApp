import { Injectable } from '@angular/core';
import "rxjs/add/operator/map";
import {AlertController} from "ionic-angular";

@Injectable()
export class Alertmsg {

  constructor(
    public alertCtrl: AlertController,
  )
  {}

  alertMsg(msg) {
    let alert = this.alertCtrl.create({
      message: msg,
      buttons: ['知道了']
    });
    alert.setMode("ios");
    alert.present();
  }

}
