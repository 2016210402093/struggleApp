import { Component } from '@angular/core';
import { NavController, AlertController, ModalController } from 'ionic-angular';
import { LocalNotifications } from '@ionic-native/local-notifications';
import {AddTaskPage} from "./add-task/add-task"
import {EditinfoPage} from "../contact/editinfo/editinfo";
import {HttpService} from "../../service/HttpService";
import {Config} from "../../service/config";

@Component({
  selector: 'page-home',
  templateUrl: 'home.html'
})
export class HomePage {

  url = Config.url;
  todayType = 1;
  weekType = 2;
  monthType = 3;
  currentDate = "";
  userSignature = "";
  testYear = "";
  daysRemaining = 220;
  todayTask = [];
  weekTask = [];
  monthTask = [];
  hasTodayTask = false;
  hasWeekTask = false;
  hasMonthTask = false;

  constructor(
    public navCtrl: NavController,
    private localNotifications: LocalNotifications,
    private alertCtrl: AlertController,
    public modalCtrl: ModalController,
    private httpService: HttpService,
  ) {
  }

  ionViewWillEnter(){
    this.getCurrentDate();
    this.getUserInfo();
    this.getTask();
  }

  exchangeTaskInfo = (result) => {
    let array = [];
    for(let i=0; i<result.length; ++i){
      let item = {
        taskId: result[i].TASK_ID,
        title: result[i].TASK_NAME,
        deadLine: result[i].DEAD_LINE,
        description: result[i].TASK_CONTENT,
        isCompleted: result[i].IS_COMPLETED,
        isNotified: result[i].IS_NOTIFIED,
        remindTime: result[i].REMIND_TIME
      };
      array.push(item);
    }
    return array;
  };

  getTask(){
    this.httpService.post(`${this.url}querryTasks`, {
      userId: window.localStorage.getItem("userId")
    }).then(res=>{
      let result = (res as any);
      this.todayTask = this.exchangeTaskInfo(result.data.todayTask);
      this.weekTask = this.exchangeTaskInfo(result.data.weekTask);
      this.monthTask = this.exchangeTaskInfo(result.data.monthTask);
      this.todayTask.length>0 ? this.hasTodayTask = true : this.hasTodayTask = false;
      this.weekTask.length>0 ? this.hasWeekTask = true : this.hasWeekTask = false;
      this.monthTask.length>0 ? this.hasMonthTask = true : this.hasMonthTask = false;

    }).catch(err=>{})
  }

  getCurrentDate(){
    let date = new Date();
    let weekday=["周日","周一","周二","周三","周四","周五","周六"];
    this.currentDate = `${date.getMonth()+1}月${date.getDate()}日  ${weekday[date.getDay()]}`;
  }


  getUserInfo(){
    this.httpService.post(`${this.url}getUserInfo`, {
      userId: window.localStorage.getItem("userId")
    }).then(res=>{
      let result = (res as any);
      this.userSignature = result.data.userSignature;
      this.testYear = result.data.testYear;
      window.localStorage.setItem("userId", result.data.userId);
      window.localStorage.setItem('userName',result.data.userName);
      window.localStorage.setItem("userEmail", result.data.userEmail);
      window.localStorage.setItem("userSignature", result.data.userSignature);
      window.localStorage.setItem("testYear", result.data.testYear);
      window.localStorage.setItem("goalSchool", result.data.goalSchool);
      window.localStorage.setItem("userImg", this.url+result.data.userImg);
      let date = new Date();
      let date2 = new Date(`${this.testYear}-12-22`);
      this.daysRemaining = parseInt(((date2.getTime() - date.getTime()) / (24 * 60 * 60 * 1000)-365).toString());
    }).catch(err=>{});
  }

  showTaskDetail(item){
    let alert;
    if (!item.isCompleted) {
      alert = this.alertCtrl.create({
        title: item.title,
        subTitle: item.description,
        message: `DeadLine: ${item.deadLine}`,
        buttons: [
          {
            text: '继续',
            role: 'cancel',
            handler: () => {}
          },
          {
            text: '完成',
            handler: () => {
              this.httpService.post(`${this.url}completeTask`, {
                taskId: item.taskId
              }).then(res=>{
                item.isCompleted = true;
              }).catch();
            }
          }
        ]
      });
    }
    else {
      alert = this.alertCtrl.create({
        title: item.title,
        subTitle: item.description,
        message: `DeadLine: ${item.deadLine}`,
        buttons: ["OK"]
      });
    }
    alert.setMode("ios");
    alert.present();
  }

  addTask(type){

    console.log(type);
    let profileModal;
    if (type === "today") {
      profileModal = this.modalCtrl.create(AddTaskPage, { type: type });
    }
    else {
      profileModal = this.modalCtrl.create(AddTaskPage, { type: type });
    }

    profileModal.onDidDismiss(data => {
      this.getTask();
    });
    profileModal.present();
  }


  goEditInfo() {
    this.navCtrl.push(EditinfoPage);
  }

}
