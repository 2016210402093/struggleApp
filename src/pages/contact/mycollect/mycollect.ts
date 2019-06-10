import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import {EssayPage} from "../../essay/essay";
import {HttpService} from "../../../service/HttpService";
import {Config} from "../../../service/config";

/**
 * Generated class for the MycollectPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-mycollect',
  templateUrl: 'mycollect.html',
})
export class MycollectPage {

  url = Config.url;
  myCollectEssay = [];
  essayTotalNum = -1;

  constructor(
    public navCtrl: NavController,
    public navParams: NavParams,
    private httpService: HttpService) {

  }

  ionViewWillEnter() {
      this.essayTotalNum = -1;
      this.myCollectEssay = [];
      this.getEssayInfo(-1);
  }


  getEssayInfo(collectionId) {
    this.httpService.post(`${this.url}searchCollectEssay`, {
      userId: window.localStorage.getItem("userId"),
      collectionId: collectionId
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
            collectionId: result.data.list[i].COLLECTION_ID,
          };
          this.myCollectEssay.push(item);
          this.essayTotalNum = result.data.essayTotalNum;
        }
      }

    }).catch(err=>{
      alert(err);
    });
  }

  doInfinite(infiniteScroll) {
    console.log('Begin async operation');
    if (this.myCollectEssay.length  >= this.essayTotalNum) {
      infiniteScroll.enable(false);
      return;
    }
    setTimeout(() => {
      this.httpService.post(`${this.url}searchCollectEssay`, {
        userId: window.localStorage.getItem("userId"),
        collectionId: this.myCollectEssay[this.myCollectEssay.length - 1].collectionId
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
              collectionId: result.data.list[i].COLLECTION_ID,
            };
            this.myCollectEssay.push(item);
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
    this.navCtrl.push(EssayPage,{
      essayId: item.essayId
    });
  }

}
