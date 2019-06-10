import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, AlertController  } from 'ionic-angular';
import { ImagePicker, ImagePickerOptions } from '@ionic-native/image-picker';
import {EmailverifyPage} from "../../login/emailverify/emailverify";
import {UpdateemailPage} from "../../login/updateemail/updateemail";
import {Alertmsg} from "../../../service/alertmsg";
import {HttpService} from "../../../service/HttpService";
import {Config} from "../../../service/config";
import {ContactPage} from "../contact";

/**
 * Generated class for the EditinfoPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-editinfo',
  templateUrl: 'editinfo.html',
})
export class EditinfoPage {

  url = Config.url;

  userInfo = {
    userImg: window.localStorage.getItem("userImg"),
    userName: window.localStorage.getItem("userName"),
    testYear: window.localStorage.getItem("testYear"),
    goalSchool: window.localStorage.getItem("goalSchool"),
    userSignature: window.localStorage.getItem("userSignature"),
    userEmail: window.localStorage.getItem("userEmail"),
  };

  constructor(
    public navCtrl: NavController,
    public navParams: NavParams,
    public alertCtrl: AlertController,
    private imagePicker: ImagePicker,
    private httpService: HttpService,
    public alertMsg: Alertmsg) {
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad EditinfoPage');
  }

  prompt() {
    let alert = this.alertCtrl.create({
      message: '输入信息过长，请重新输入',
      buttons: ['知道了']
    });
    alert.setMode("ios");
    alert.present();
  }

  cantUpdate(){
    this.alertMsg.alertMsg("用户名不可修改");
  }

  updateInfo(type) {
    let title;
    let placeholder;
    if(type === 'goal') {
      title = "修改目标";
      placeholder = '不超过20个字符';
    }
    else if(type === 'signature') {
      title = "修改签名";
      placeholder = '不超过20个字符';
    }

    const prompt = this.alertCtrl.create({
      title: title,
      inputs: [
        {
          name: "info",
          placeholder: placeholder
        },
      ],
      buttons: [
        {
          text: '取消',
          handler: data => {}
        },
        {
          text: '确定',
          handler: data => {
            if(type === 'goal') {
              if(data.info.length<=20){
                this.httpService.post(`${this.url}updateUserInfo`, {
                  "column": "GOAL_SCHOOL",
                  "updateInfo": data.info,
                  "userName": window.localStorage.getItem("userName")
                }).then(res=>{
                  let result = (res as any);
                  if(result.code === 0){
                    this.alertMsg.alertMsg(result.msg);
                  }
                  else{
                    this.userInfo.goalSchool = data.info;
                    console.log(data.info);
                    window.localStorage.setItem("goalSchool", data.info);
                  }
                }).catch(err=>{
                  this.alertMsg.alertMsg(err);
                })
              } else{
                this.prompt();
              }
            }
            else if(type === 'signature') {
              if(data.info.length<=20){
                this.httpService.post(`${this.url}updateUserInfo`, {
                  "column": "USER_SIGNATURE",
                  "updateInfo": data.info,
                  "userName": window.localStorage.getItem("userName")
                }).then(res=>{
                  let result = (res as any);
                  if(result.code === 0){
                    this.alertMsg.alertMsg(result.msg);
                  }
                  else{
                    this.userInfo.userSignature = data.info;
                    window.localStorage.setItem("userSignature", data.info);
                  }
                }).catch(err=>{
                  this.alertMsg.alertMsg(err);
                })
              } else{
                this.prompt();
              }
            }
          }
        }
      ]
    });
    prompt.setMode("ios");
    prompt.present();
  }

  updateTestYear() {
    let alert = this.alertCtrl.create();
    alert.setTitle('选择考试年份');

    alert.addInput({
      type: 'radio',
      label: '2020',
      value: '2020',
      checked: true
    });

    alert.addInput({
      type: 'radio',
      label: '2021',
      value: '2021',
      checked: false
    });

    alert.addInput({
      type: 'radio',
      label: '2022',
      value: '2022',
      checked: false
    });

    alert.addInput({
      type: 'radio',
      label: '2023',
      value: '2023',
      checked: false
    });

    alert.addInput({
      type: 'radio',
      label: '2024',
      value: '2024',
      checked: false
    });

    alert.addButton('取消');
    alert.addButton({
      text: '确定',
      handler: data => {
        this.httpService.post(`${this.url}updateUserInfo`, {
          "column": "TEST_YEAR",
          "updateInfo": data,
          "userName": window.localStorage.getItem("userName")
        }).then(res=>{
          let result = (res as any);
          if(result.code === 0){
            this.alertMsg.alertMsg(result.msg);
          }
          else{
            this.userInfo.testYear = data;
            window.localStorage.setItem("testYear", data);
          }
        }).catch(err=>{
          this.alertMsg.alertMsg(err);
        })
      }
    });
    alert.setMode("ios");
    alert.present();
  }

  PrefixInteger(num, length) {
    return (Array(length).join('0') + num).slice(-length);
  }

  chosePhoto() {

    const options: ImagePickerOptions = {
      maximumImagesCount: 1,
      width: 200,
      height: 200,
      outputType:1
    };

    this.imagePicker.getPictures(options).then((results) => {
      for (let i = 0; i < results.length; i++) {
        this.userInfo.userImg = 'data:image/jpeg;base64,' + results[i];

        let form =  new FormData();
        let oDate = new Date(); //实例一个时间对象；
        let imgName = `${this.userInfo.userName}${oDate.getFullYear()}${this.PrefixInteger(oDate.getMonth()+1,2)}${this.PrefixInteger(oDate.getDate(),2)}${this.PrefixInteger(oDate.getHours(),2)}${this.PrefixInteger(oDate.getMinutes(),2)}${this.PrefixInteger(oDate.getSeconds(),2)}`;
        form.append('imgData', this.userInfo.userImg);
        form.append('imgName', imgName);
        form.append('userName', this.userInfo.userName);
        form.append('column', 'USER_IMG');
        form.append('updateInfo', `userImg/${imgName}.png`);

        let xhr = new XMLHttpRequest();

        let that = this;
        xhr.open('POST', `${this.url}updateUserImg`, true);
        xhr.send(form);
        xhr.onreadystatechange = function(){
          if (xhr.readyState == 4 && xhr.status == 200){
            let result = JSON.parse(xhr.responseText);
            if(result.code === 0){
              that.alertMsg.alertMsg(result.msg);
            }
            else{
              that.userInfo.userImg = `${that.url}userImg/${imgName}.png`;
              window.localStorage.setItem("userImg", `${that.url}userImg/${imgName}.png`);
            }
          }
        }

        /*fetch(`${this.url}updateUserImg`,{
          method: "POST",
          body: form
        }).then(res=>{
          let result = (res as any);
          if(result.code === 0){
            this.alertMsg.alertMsg(result.msg);
          }
          else{
            this.userInfo.userImg = `${this.url}userImg/${imgName}.png`;
            window.localStorage.setItem("userImg", `${this.url}userImg/${imgName}.png`);
          }
        }).catch(err=>{
          this.alertMsg.alertMsg(err);
        })*/
      }
    }, (err) => {
      alert(err);
    });
  }

  goBack() {
    this.navCtrl.popTo(ContactPage);
  }

  updateEmail() {
    this.navCtrl.push(UpdateemailPage);
  }

  updatePassword() {
    this.navCtrl.push(EmailverifyPage);
  }

}
