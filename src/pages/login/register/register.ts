import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, AlertController } from 'ionic-angular';
import Verifypassword from '../../../service/verifypassword'
import {HttpService} from "../../../service/HttpService";
import {Config} from "../../../service/config";
import {Alertmsg} from "../../../service/alertmsg";

/**
 * Generated class for the RegisterPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-register',
  templateUrl: 'register.html',
})
export class RegisterPage {

  url = Config.url;
  password = '';
  confirm = '';
  userName = '';
  email = '';
  time = 180;
  verifyCode = '';
  isStrong = '';
  isSame = true;
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
  }

  passwordVerify(){
    console.log('password', this.password);
    if(this.password.length>0){
      this.isStrong = Verifypassword(this.password)
    }
    else {
      this.isStrong = ''
    }
  }

  confirmPassword() {
    console.log('confirm:', this.confirm);
    if(this.password != this.confirm && this.password.length>0 && this.confirm.length>0){
      this.isSame = false;
    }
    else {
      this.isSame = true;
    }
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

  ionViewDidLoad() {
    console.log('ionViewDidLoad RegisterPage');
  }

  goBack() {
    this.navCtrl.pop();
  }

  register(){
    if(this.verifyCode!=='' && this.isEmailCorrect && this.isSame && this.userName!==''){
      this.httpService.post(`${this.url}register`, {
        userName: this.userName,
        password: this.password,
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
                this.navCtrl.popToRoot();
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
      this.alertMsg.alertMsg('信息填写错误!')
    }
  }

}
