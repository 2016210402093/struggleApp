import { Component } from '@angular/core';
import {AlertController, IonicPage, NavController, NavParams} from 'ionic-angular';
import {TabsPage} from "../tabs/tabs";
import {HttpService} from "../../service/HttpService";
import {Config} from "../../service/config";
import {RegisterPage} from "./register/register";
import {EmailverifyPage} from "./emailverify/emailverify";

/**
 * Generated class for the LoginPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-login',
  templateUrl: 'login.html',
})
export class LoginPage {

  url = Config.url;
  user = {
    username:'',
    password:'',
    isLogin: 'false'
  };

  constructor(
    public navCtrl: NavController,
    public navParams: NavParams,
    public alertCtrl: AlertController,
    private httpService: HttpService,
    ) {
  }


  ionViewDidLoad() {
    //若该用户上一次曾经正确输入过账号和密码，直接进入
    this.user.isLogin=window.localStorage.getItem('isLogin');
    this.user.username=window.localStorage.getItem('userName');
    this.user.password=window.localStorage.getItem('userPassword');

    if(this.user.isLogin == 'true'){
      this.login();
    }
  }

  login() {
    this.httpService.post(`${this.url}login`, {
      userName: this.user.username,
      password: this.user.password
    }).then(res=>{
      let result = (res as any);
      if(result.code===1){

        window.localStorage.setItem('userId',result.data.userId);
        this.user.isLogin = 'true';
        window.localStorage.setItem('userName',this.user.username);
        window.localStorage.setItem('userPassword',this.user.password);
        window.localStorage.setItem('isLogin',this.user.isLogin);

        this.navCtrl.push(TabsPage);
      }
      else {
        let alert = this.alertCtrl.create({
          message: result.msg,
          buttons: ['知道了']
        });
        alert.setMode("ios");
        alert.present();
      }
    }).catch(e=>{
      console.log(e);
    });
  }

  login_to_register(){
    this.navCtrl.push(RegisterPage);//push到注册页面
  }

  forgetPassword() {
    this.navCtrl.push(EmailverifyPage);
  }

}
