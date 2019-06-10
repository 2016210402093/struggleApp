import { Component } from '@angular/core';
import { ModalController, NavController, App, AlertController } from 'ionic-angular';
import {ConcernedpeoplePage} from "./concernedpeople/concernedpeople";
import {LoginPage} from "../login/login";
import {MyessayPage} from "./myessay/myessay";
import {MyclockPage} from "./myclock/myclock";
import {MycollectPage} from "./mycollect/mycollect";
import {EditinfoPage} from "./editinfo/editinfo";


@Component({
  selector: 'page-contact',
  templateUrl: 'contact.html'
})
export class ContactPage {

  userName = window.localStorage.getItem("userName");
  goalSchool = window.localStorage.getItem("goalSchool");
  userImg = window.localStorage.getItem("userImg");

  constructor(public navCtrl: NavController,
              private app: App,
              private alertCtrl: AlertController,
              public modalCtrl: ModalController) {

  }

  goConcernedpeoplePage() {
    this.navCtrl.push(ConcernedpeoplePage);
  }

  goMyEssay() {
    this.navCtrl.push(MyessayPage);
  }

  goMyCollect() {
    this.navCtrl.push(MycollectPage);
  }

  goMyClock() {
    this.navCtrl.push(MyclockPage);
  }

  goEditInfo() {
    this.navCtrl.push(EditinfoPage);
  }


  ionViewWillEnter(){
    this.userName = window.localStorage.getItem("userName");
    this.goalSchool = window.localStorage.getItem("goalSchool");
    this.userImg = window.localStorage.getItem("userImg");
  }


  exit() {
    let alert = this.alertCtrl.create({
      subTitle: "确定要退出应用吗",
      buttons: [
        {
          text: '取消',
          role: 'cancel',
          handler: () => {
          }
        },
        {
          text: '确定',
          handler: () => {
            //清除内存
            window.localStorage.clear();
            this.app.getRootNav().push(LoginPage);
            setTimeout(() => {
              this.navCtrl.popToRoot();
            }, 1000);
          }
        }
      ]
    });
    alert.setMode("ios");
    alert.present();
  }

}
