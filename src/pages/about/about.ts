import { Component } from '@angular/core';
import {NavController, ModalController, NavParams,} from 'ionic-angular';
import {SearchinvitationPage} from "./searchinvitation/searchinvitation";
import {CreateclockPage} from "../createclock/createclock";
import {WriteessayPage} from "../writeessay/writeessay";
import { Keyboard } from '@ionic-native/keyboard';
import {EssayPage} from "../essay/essay";
import {MeansPage} from "../means/means";
import {HttpService} from "../../service/HttpService";
import {Config} from "../../service/config";
import {SchoolinfoPage} from "../essay/schoolinfo/schoolinfo";

@Component({
  selector: 'page-about',
  templateUrl: 'about.html'
})
export class AboutPage {

  url = Config.url;
  type = "essay";
  clockIn = [];
  clockTotalNum = -1;
  essay = [];
  essayTotalNum = -1;
  schoolInfo = [];
  schoolInfoTotalNum = -1;

  constructor(
    public navCtrl: NavController,
    public modalCtrl: ModalController,
    private httpService: HttpService,
    public navParams: NavParams,
    // private keyboard: Keyboard,
  ) {

  }

  getClockInfo(clockId) {
    this.httpService.post(`${this.url}queryClockInfo`, {
      userId: -1,
      clockId: clockId
    }).then(res=>{
      console.log(res);
      let result = (res as any);
      if(result.code === 1){
        for(let i=0; i<result.data.list.length; ++i){
          let item = {
            userName: result.data.list[i].USER_NAME,
            clockId: result.data.list[i].CLOCK_ID,
            clockContent: result.data.list[i].CLOCK_CONTENT,
            userImg: this.url+result.data.list[i].USER_IMG,
            cardImg: this.url+result.data.list[i].IMG_URL,
            creationTime: result.data.list[i].CREATION_TIME,
          };
          this.clockIn.push(item);
          this.clockTotalNum = result.data.clockTotalNum;
        }
      }

    }).catch(err=>{
      alert(err);
    });
  }

  getEssayInfo(essayId) {
    this.httpService.post(`${this.url}queryEssayInfo`, {
      userId: -1,
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
          this.essay.push(item);
          this.essayTotalNum = result.data.essayTotalNum;
        }
      }

    }).catch(err=>{
      alert(err);
    });
  }

  getSchoolInfo(schoolInfoId) {
    this.httpService.post(`${this.url}querySchoolInfo`, {
      schoolInfoId: schoolInfoId
    }).then(res=>{
      console.log(res);
      let result = (res as any);
      if(result.code === 1){
        for(let i=0; i<result.data.list.length; ++i){
          let item = {
            schoolInfoId: result.data.list[i].INFO_ID,
            infoTitle: result.data.list[i].INFO_TITLE,
            infoSubTitle: result.data.list[i].INFO_SUBTITLE,
            likeNum: result.data.list[i].LIKE_NUMBER,
            infoImg: this.url+result.data.list[i].IMG_URL,
            creationTime: result.data.list[i].CREATION_TIME,
          };
          this.schoolInfo.push(item);
          this.schoolInfoTotalNum = result.data.schoolInfoTotalNum;
        }
      }

    }).catch(err=>{
      alert(err);
    });
  }

  ionViewWillEnter() {
    if(this.clockTotalNum<this.clockIn.length){
      this.getClockInfo(-1);
    }
    if(this.essayTotalNum<this.essay.length){
      this.getEssayInfo(-1);
    }
    if(this.schoolInfoTotalNum<this.schoolInfo.length){
      this.getSchoolInfo(-1);
    }
  }


  // ionViewWillLeave(){
  //   this.clockIn = [];
  //   this.newInvitation = [];
  //   this.schoolInfo = [];
  // }

  call(){

  }

  //下拉刷新
  doInfinite(infiniteScroll) {
    console.log('Begin async operation');

    switch (this.type) {

      case "essay":
        if (this.essay.length  >= this.essayTotalNum) {
          infiniteScroll.enable(false);
          return;
        }
        setTimeout(() => {
          this.httpService.post(`${this.url}queryEssayInfo`, {
            userId: -1,
            essayId: this.essay[this.essay.length - 1].essayId
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
                this.essay.push(item);
                this.essayTotalNum = result.data.essayTotalNum;
                infiniteScroll.complete();
              }
            }

          }).catch(err=>{
            alert(err);
          });
        });
        break;

      case "clockIn":
        if (this.clockIn.length  >= this.clockTotalNum) {
          infiniteScroll.enable(false);
          // infiniteScroll.complete();
          return;
        }
        setTimeout(() => {
          this.httpService.post(`${this.url}queryClockInfo`, {
            userId: -1,
            clockId: this.clockIn[this.clockIn.length - 1].clockId
          }).then(res=>{
            console.log(res);
            let result = (res as any);
            if(result.code === 1){
              for(let i=0; i<result.data.list.length; ++i){
                let item = {
                  userName: result.data.list[i].USER_NAME,
                  clockId: result.data.list[i].CLOCK_ID,
                  clockContent: result.data.list[i].CLOCK_CONTENT,
                  userImg: this.url+result.data.list[i].USER_IMG,
                  cardImg: this.url+result.data.list[i].IMG_URL,
                  creationTime: result.data.list[i].CREATION_TIME,
                };
                this.clockIn.push(item);
                this.clockTotalNum = result.data.clockTotalNum;
                infiniteScroll.complete();
              }
            }

          }).catch(err=>{
            alert(err);
          });
        });
        break;


      case "schoolInfo":
        console.log("xuexiaoyingsu")
        if (this.schoolInfo.length  >= this.schoolInfoTotalNum) {
          infiniteScroll.enable(false);
          return;
        }
        setTimeout(() => {
          this.httpService.post(`${this.url}querySchoolInfo`, {
            schoolInfoId: this.schoolInfo[this.schoolInfo.length - 1].schoolInfoId
          }).then(res=>{
            console.log(res);
            let result = (res as any);
            if(result.code === 1){
              for(let i=0; i<result.data.list.length; ++i){
                let item = {
                  schoolInfoId: result.data.list[i].INFO_ID,
                  infoTitle: result.data.list[i].INFO_TITLE,
                  infoSubTitle: result.data.list[i].INFO_SUBTITLE,
                  likeNum: result.data.list[i].LIKE_NUMBER,
                  infoImg: this.url+result.data.list[i].IMG_URL,
                  creationTime: result.data.list[i].CREATION_TIME,
                };
                this.schoolInfo.push(item);
                this.schoolInfoTotalNum = result.data.schoolInfoTotalNum;
                infiniteScroll.complete();
              }
            }

          }).catch(err=>{
            alert(err);
          });
        });
        break;
    }
  }

  clock(){
    console.log(123465);
    let profileModal = this.modalCtrl.create(CreateclockPage);
    profileModal.present();
    profileModal.onDidDismiss(data => {
      console.log(data);
      if(data.publish){
        this.clockIn = [];
        this.getClockInfo(-1);
      }
    });
  }


  writeEssayPage(){
    console.log(123465);
    let profileModal = this.modalCtrl.create(WriteessayPage);
    profileModal.present();
    profileModal.onDidDismiss(data => {
      console.log(data);
      if(data.publish){
        this.essay = [];
        this.getEssayInfo(-1);
      }
    });
  }

  searchInvitation() {
    // this.keyboard.hide();   //for android
    let profileModal = this.modalCtrl.create(SearchinvitationPage);
    profileModal.present();
  }

  readEssay(item){
    console.log(item.essayId);
    this.navCtrl.push(EssayPage, {
      essayId: item.essayId,
      isAbout: 1
    });
  }

  readySchoolInfo(item) {
    this.navCtrl.push(SchoolinfoPage, {
      infoId: item.schoolInfoId
    });
  }

  goMeans() {
    this.navCtrl.push(MeansPage);
  }

}
