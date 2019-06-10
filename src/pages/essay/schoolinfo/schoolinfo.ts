import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import {HttpService} from "../../../service/HttpService";
import {Config} from "../../../service/config";

/**
 * Generated class for the SchoolinfoPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-schoolinfo',
  templateUrl: 'schoolinfo.html',
})
export class SchoolinfoPage {

  url = Config.url;
  infoId = 0;
  essay ={
    title: "",
    userName: "",
    userId: 0,
    userImg: "../../../assets/imgs/user.jpg",
    content: "",
    likeNum: 0,
    creationTime: "",
    infoId: 0
  };
  isLike = false;
  essayContent = [];

  constructor(
    public navCtrl: NavController,
    public navParams: NavParams,
    private httpService: HttpService) {
  }

  ionViewWillEnter() {
    this.infoId = this.navParams.data.infoId;
    this.httpService.post(`${this.url}getEssayDetail`, {
      type: "info",
      Id: this.infoId
    }).then(res=>{
      console.log(res);
      let result = (res as any);
      if(result.code === 1){
        this.essay ={
          title: result.data[0].INFO_TITLE,
          userName: result.data[0].USER_NAME,
          userId: result.data[0].USER_ID,
          userImg: this.url+result.data[0].USER_IMG,
          content: result.data[0].INFO_CONTENT,
          likeNum: result.data[0].LIKE_NUMBER,
          creationTime: result.data[0].CREATION_TIME,
          infoId: result.data[0].INFO_ID
        };
        this.essayContent = this.essay.content.split("\n");
        this.httpService.post(`${this.url}getOtherEssayDetail`, {
          type: "info",
          userId: window.localStorage.getItem("userId"),
          infoId: this.infoId
        }).then(res=>{
          console.log(res);
          let result = (res as any);
          if(result.code === 1){
            this.isLike = result.data.isLike === 1;
          }
        }).catch(err=>{
          alert(err);
        });
      }

    }).catch(err=>{
      alert(err);
    });
  }

  goBack(){
    this.navCtrl.pop();
  }

  goodEssay() {
    this.isLike ? this.essay.likeNum-- :this.essay.likeNum++;
    this.isLike = !this.isLike;
    this.httpService.post(`${this.url}isLike`, {
      type: "info",
      isLike: this.isLike? 1 : -1,
      userId: window.localStorage.getItem("userId"),
      id: this.infoId
    }).then(res=>{
      console.log(res);
      let result = (res as any);
      if(result.code === 1){

      }
    }).catch(err=>{
      alert(err);
    });
  }

}
