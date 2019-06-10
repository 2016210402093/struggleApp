import { Component } from '@angular/core';
import {AlertController, IonicPage, NavController, NavParams} from 'ionic-angular';
import {EssayPage} from "../../../essay/essay";
import {HttpService} from "../../../../service/HttpService";
import {Config} from "../../../../service/config";
import {Alertmsg} from "../../../../service/alertmsg";

/**
 * Generated class for the OthersessaylistPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-othersessaylist',
  templateUrl: 'othersessaylist.html',
})
export class OthersessaylistPage {

  url = Config.url;
  hisEssay = [];
  essayTotalNum = -1;
  userId =0;
  signature = "";
  userName = "";
  userImg = "";
  concernedNum = 3;

  constructor(
    public navCtrl: NavController,
    public navParams: NavParams,
    public alertCtrl: AlertController,
    private httpService: HttpService,
    public alertMsg: Alertmsg
  ) {

  }

  ionViewWillEnter() {
    this.hisEssay = [];
    this.essayTotalNum = -1;
    this.getEssayInfo(-1);
    this.getUserInfo();
    this.getConcernedNum();
  }

  getEssayInfo(essayId) {
    this.userId = this.navParams.data.userId;
    this.httpService.post(`${this.url}queryEssayInfo`, {
      userId: this.userId,
      essayId: essayId
    }).then(res=>{
      console.log(res);
      let result = (res as any);
      if(result.code === 1){
        for(let i=0; i<result.data.list.length; ++i){
          let item = {
            essayId: result.data.list[i].ESSAY_ID,
            essayTitle: result.data.list[i].ESSAY_TITLE,
            essaySubTitle: result.data.list[i].ESSAY_SUBTITLE,
            likeNum: result.data.list[i].LIKE_NUMBER,
            essayImg: this.url+result.data.list[i].IMG_URL,
            creationTime: result.data.list[i].CREATION_TIME,
          };
          this.hisEssay.push(item);
          this.essayTotalNum = result.data.essayTotalNum;
        }
      }

    }).catch(err=>{
      alert(err);
    });
  }

  getConcernedNum(){
    this.httpService.post(`${this.url}getConcernedNum`, {
      concernedPersonId: this.navParams.data.userId
    }).then(res=>{
      console.log(111111111111,res);
      let result = (res as any);
      if(result.code === 1){
        this.concernedNum = result.data;
      }

    }).catch(err=>{
      alert(err);
    });
  }

  getUserInfo(){
    this.httpService.post(`${this.url}getUserInfo`, {
      userId: this.navParams.data.userId
    }).then(res=>{
      let result = (res as any);
      this.signature = result.data.userSignature;
      this.userImg = this.url+result.data.userImg;
      this.userName = result.data.userName;
    }).catch(err=>{});
  }

  doInfinite(infiniteScroll) {
    console.log('Begin async operation');
    if (this.hisEssay.length  >= this.essayTotalNum) {
      infiniteScroll.enable(false);
      return;
    }
    setTimeout(() => {
      this.httpService.post(`${this.url}queryEssayInfo`, {
        userId: this.userId,
        essayId: this.hisEssay[this.hisEssay.length - 1].essayId
      }).then(res=>{
        console.log(res);
        let result = (res as any);
        if(result.code === 1){
          for(let i=0; i<result.data.list.length; ++i){
            let item = {
              essayId: result.data.list[i].ESSAY_ID,
              essayTitle: result.data.list[i].ESSAY_TITLE,
              essaySubTitle: result.data.list[i].ESSAY_SUBTITLE,
              likeNum: result.data.list[i].LIKE_NUMBER,
              essayImg: this.url+result.data.list[i].IMG_URL,
              creationTime: result.data.list[i].CREATION_TIME,
            };
            this.hisEssay.push(item);
            this.essayTotalNum = result.data.essayTotalNum;
            infiniteScroll.complete();
          }
        }

      }).catch(err=>{
        alert(err);
      });
    });
  }

  cancelConcern(){
    let alert = this.alertCtrl.create({
      message: '确定不再关注该用户吗?',
      buttons: [
        {
          text: '确定',
          handler: () => {
            this.httpService.post(`${this.url}isConcernedUser`, {
              type:  "remove",
              userId: window.localStorage.getItem("userId"),
              concernedPersonId: this.userId
            }).then(res=>{
              console.log(res);
              let result = (res as any);
              if(result.code === 1){
                this.navCtrl.pop();
              }
              else if(result.code === 2){
                this.alertMsg.alertMsg("已经不再关注该用户!");
                this.navCtrl.pop();
              }
            }).catch(err=>{
            });
          }
        },{
          text: '取消',
          role: 'cancel',
          handler: () => {}
        }
      ]
    });
    alert.setMode("ios");
    alert.present();
  }

  goBack() {
    this.navCtrl.pop();
  }

  readEssay(item) {
    console.log(item.essayId);
    this.navCtrl.push(EssayPage, {
      essayId: item.essayId
    });
  }
}
