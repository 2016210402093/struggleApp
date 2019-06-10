import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, AlertController } from 'ionic-angular';
import {UpdatepasswordPage} from "../updatepassword/updatepassword";
import {HttpService} from "../../../service/HttpService";
import {Alertmsg} from "../../../service/alertmsg";
import {Config} from "../../../service/config";

/**
 * Generated class for the EmailverifyPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-emailverify',
  templateUrl: 'emailverify.html',
})
export class EmailverifyPage {

  url = Config.url;
  userName = '';
  email = '';
  time = 180;
  verifyCode = '';
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

  ionViewDidLeave(){
    clearInterval(this.t);
  }

  sendMessage(){

    if(!this.userName.length){
      this.alertMsg.alertMsg("请填写用户名!");
      return;
    }

    this.httpService.post(`${this.url}searchEmail`, {
      userName: this.userName
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

  verify(){
    if(this.verifyCode!==''&& this.userName!==''){
      this.httpService.post(`${this.url}verifyEmailCode`, {
        userName: this.userName,
        verifyCode: this.verifyCode
      }).then(res=>{
        let result = (res as any);
        if(result.code === 1){
          this.navCtrl.push(UpdatepasswordPage,{
            userName: this.userName
          });
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
