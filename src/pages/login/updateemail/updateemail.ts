import { Component } from '@angular/core';
import {AlertController, IonicPage, NavController, NavParams} from 'ionic-angular';
import {HttpService} from "../../../service/HttpService";
import {Alertmsg} from "../../../service/alertmsg";
import {Config} from "../../../service/config";

/**
 * Generated class for the UpdateemailPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-updateemail',
  templateUrl: 'updateemail.html',
})
export class UpdateemailPage {

  url = Config.url;
  email = '';
  time = 180;
  verifyCode = '';
  isEmailCorrect = true;
  t;

  constructor(
    public navCtrl: NavController,
    public navParams: NavParams,
    public alertCtrl: AlertController,
    private httpService: HttpService,
    public alertMsg: Alertmsg
  ) {
    console.log(this.time);
    console.log(window.localStorage.getItem("userName"));
  }



  verifyEmail() {
    console.log('email:', this.email);
    let format = /^\w+((-\w+)|(\.\w+))*\@[A-Za-z0-9]+((\.|-)[A-Za-z0-9]+)*\.[A-Za-z0-9]+$/;
    if(format.test(this.email)){
      this.isEmailCorrect = true;
    }
    else {
      this.isEmailCorrect = false;
    }
  }

  ionViewDidLeave(){
    clearInterval(this.t);
  }

  sendMessage(){

    if(!this.email.length || !this.isEmailCorrect){
      this.alertMsg.alertMsg("邮箱格式错误!");
      return;
    }

    this.httpService.post(`${this.url}sendMail`, {
      email: this.email
    }).then(res=>{
      let that = this;
      function run() {
        that.time--;
        if(that.time === 0){
          clearInterval(that.t);
          that.time = 180;
        }
        console.log(that.time);
      }
      this.t = setInterval( run, 1000)
    }).catch(err=>{
      this.alertMsg.alertMsg(err)
    });
  }

  goBack() {
    this.navCtrl.pop();
  }

  submit(){
    if(this.verifyCode!=='' && this.isEmailCorrect && this.email.length>0){

      this.httpService.post(`${this.url}updateEmail`, {
        userName: window.localStorage.getItem("userName"),
        email : this.email.toLowerCase(),
        verifyCode: this.verifyCode
      }).then(res=>{
        let result = (res as any);
        if(result.code === 2){
          let alert = this.alertCtrl.create({
            message: result.msg,
            buttons: [{
              text:'知道了',
              handler: data => {
                this.navCtrl.pop();
              }
            }]
          });
          alert.setMode("ios");
          alert.present();
        }
        else {
          this.alertMsg.alertMsg(result.msg);
        }
      }).catch(err=>{
        alert(err);
      });
    }
    else {
      let alert = this.alertCtrl.create({
        message: '信息填写错误!',
        buttons: ['知道了']
      });
      alert.setMode("ios");
      alert.present();
    }
  }

}
