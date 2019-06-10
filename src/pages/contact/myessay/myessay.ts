import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import {EssayPage} from "../../essay/essay";
import {HttpService} from "../../../service/HttpService";
import {Config} from "../../../service/config";

/**
 * Generated class for the MyessayPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-myessay',
  templateUrl: 'myessay.html',
})
export class MyessayPage {

  url = Config.url;
  myEssay = [];
  essayTotalNum = -1;

  constructor(
    public navCtrl: NavController,
    public navParams: NavParams,
    private httpService: HttpService
  ) {

  }

  ionViewWillEnter() {
    this.myEssay = [];
    this.essayTotalNum = -1;
    this.getEssayInfo(-1);
  }

  getEssayInfo(essayId) {
    this.httpService.post(`${this.url}queryEssayInfo`, {
      userId: window.localStorage.getItem("userId"),
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
          this.myEssay.push(item);
          this.essayTotalNum = result.data.essayTotalNum;
        }
      }

    }).catch(err=>{
      alert(err);
    });
  }

  doInfinite(infiniteScroll) {
    console.log('Begin async operation');
    if (this.myEssay.length  >= this.essayTotalNum) {
      infiniteScroll.enable(false);
      return;
    }
    setTimeout(() => {
      this.httpService.post(`${this.url}queryEssayInfo`, {
        userId: window.localStorage.getItem("userId"),
        essayId: this.myEssay[this.myEssay.length - 1].essayId
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
            this.myEssay.push(item);
            this.essayTotalNum = result.data.essayTotalNum;
            infiniteScroll.complete();
          }
        }

      }).catch(err=>{
        alert(err);
      });
    });
  }


  goBack() {
    this.navCtrl.pop();
  }

  readEssay(item) {
    console.log(item.essayId);
    this.navCtrl.push(EssayPage, {
      essayId: item.essayId,
      isAbout: 0
    });
  }

}
