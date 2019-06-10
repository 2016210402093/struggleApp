import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, ViewController, AlertController } from 'ionic-angular';
import {Alertmsg} from "../../../service/alertmsg";
import {HttpService} from "../../../service/HttpService";
import {getMonthStartAndEnd} from "../../../service/verifyTime";
import {getWeekStartAndEnd} from "../../../service/verifyTime";
import {Config} from "../../../service/config";
import {LocalNotifications} from "@ionic-native/local-notifications";


/**
 * Generated class for the AddTaskPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-add-task',
  templateUrl: 'add-task.html',
})
export class AddTaskPage {

  url = Config.url;
  deadLine = "";
  title = "";
  type: 1;
  description = "";
  isNotified = true;
  remindTime = null;
  isTaskTypeToday = false;

  constructor(
    public navCtrl: NavController,
    public navParams: NavParams,
    public viewCtrl: ViewController,
    private alertCtrl: AlertController,
    private httpService: HttpService,
    private localNotifications: LocalNotifications,
    public alertMsg: Alertmsg
    ) {
    this.type = navParams.get("type");
    if (this.type === 1){
      this.isTaskTypeToday = true;
    }
  }

  dismiss() {
    let data = { 'isAdd': false };
    this.viewCtrl.dismiss(data);
  }

  compareTime(date1,date2){
    let oDate1 = new Date(date1);
    let oDate2 = new Date(date2);
    console.log(oDate1, oDate2)
    return oDate1.getTime() > oDate2.getTime();
  }

  remindUser(){
    let date = new Date(new Date(this.deadLine).getTime() - 60 * 60 * 1000);
    let date1 = `${date.getFullYear()}-${date.getMonth()+1}-${date.getDate()} ${date.getHours()}:${date.getMinutes()}:${date.getSeconds()}`;
    this.remindTime = date1;
    if (this.compareTime(date1, this.getNow())){
      this.localNotifications.schedule({
        text: this.title+"完成了吗",
        trigger: {at: new Date(new Date(date1).getTime() + 60)},
        led: 'FF0000',
        icon: '../../../../assets/logo_for_app.png'
      });
    }
    else {
      this.isNotified = false;
    }
  }

  verifyTime(time, type) {
    if(type === 2){
      let oDate1 = new Date(getWeekStartAndEnd(0)[0]);
      let oDate2 = new Date(getWeekStartAndEnd(0)[1]);
      let oDate3 = new Date(time);
      return oDate1.getTime() < oDate3.getTime() && oDate3.getTime() < oDate2.getTime();
    }
    if(type === 3){
      let oDate1 = new Date(getMonthStartAndEnd(0)[0]);
      let oDate2 = new Date(getMonthStartAndEnd(0)[1]);
      let oDate3 = new Date(time);
      return oDate1.getTime() < oDate3.getTime() && oDate3.getTime() < oDate2.getTime();
    }
  }

  getNow(){
    let date = new Date();
    return `${date.getFullYear()}-${date.getMonth()+1}-${date.getDate()} ${date.getHours()}:${date.getMinutes()}:${date.getSeconds()}`
  }

  addTask(){

    //非空判断
    if (this.title != "" && this.deadLine != "" && this.description !=""){
      console.log(this.title, this.description, this.title);
      if(this.isTaskTypeToday) {
        let date = new Date();
        this.deadLine = `${date.getFullYear()}-${date.getMonth()+1}-${date.getDate()} ${this.deadLine}:00`;
        if(!this.compareTime(this.deadLine, this.getNow())){
          this.alertMsg.alertMsg("任务截止时间小于当前时间");
          return;
        }
      }
      else {
        this.deadLine = `${this.deadLine.replace("T", " ")}:00`.substr(0, this.deadLine.length-5);
        console.log(this.deadLine);
        if(!this.compareTime(this.deadLine, this.getNow())){
          this.alertMsg.alertMsg("任务截止时间小于当前时间");
          return;
        }
        if(!this.verifyTime(this.deadLine, this.type)){
          this.alertMsg.alertMsg("时间范围选择错误!");
          return;
        }
      }
      this.remindUser();
      // let data = { 'isAdd': true, type: this.type, 'task': {isNotified: this.isNotified,title: this.title, deadLine: this.deadLine, description: this.description, isCompleted: false}};
      this.httpService.post(`${this.url}addTask`, {
        "userId": window.localStorage.getItem("userId"),
        "taskName": this.title,
        "taskContent": this.description,
        "taskType": this.type,
        "deadLine":	this.deadLine,
        "remindTime": this.remindTime,
        "isNotification": this.isNotified ? 1 : 0
      }).then(res=>{

      }).catch(err=>{

      });
      this.viewCtrl.dismiss();
    }

    else {
      let alert = this.alertCtrl.create({
        subTitle: "任务信息一定要填满哦!",
        buttons: ["OK"]
      });
      alert.setMode("ios");
      alert.present();
    }

  }

}
