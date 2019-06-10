import { Component } from '@angular/core';
import {AlertController, IonicPage, NavController, NavParams} from 'ionic-angular';
import Verifypassword from "../../../service/verifypassword";
import {HttpService} from "../../../service/HttpService";
import {Alertmsg} from "../../../service/alertmsg";
import {Config} from "../../../service/config";

/**
 * Generated class for the UpdatepasswordPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-updatepassword',
  templateUrl: 'updatepassword.html',
})
export class UpdatepasswordPage {

  url = Config.url;
  password = '';
  confirm = '';
  userName = '';
  isStrong = '';
  isSame = true;

  constructor(
    public navCtrl: NavController,
    public navParams: NavParams,
    public alertCtrl: AlertController,
    private httpService: HttpService,
    public alertMsg: Alertmsg
  ) {
    this.userName = this.navParams.data.userName;
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


  ionViewDidLoad() {
    console.log('ionViewDidLoad RegisterPage');
  }

  goBack() {
    this.navCtrl.pop();
  }

  submit(){
    if( this.isSame && this.password.length>0){
      this.httpService.post(`${this.url}updatePassword`, {
        userName: this.userName,
        password: this.password
      }).then(res=>{
        let result = (res as any);
        if(result.code === 1){
          this.navCtrl.popToRoot();
        }
        else {
          this.alertMsg.alertMsg(result.msg);
        }
      }).catch(e=>{
        this.alertMsg.alertMsg(e)
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
