import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import {OthersessaylistPage} from "./othersessaylist/othersessaylist";
import {HttpService} from "../../../service/HttpService";
import {Config} from "../../../service/config";

/**
 * Generated class for the ConcernedpeoplePage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-concernedpeople',
  templateUrl: 'concernedpeople.html',
})
export class ConcernedpeoplePage {

  url = Config.url;
  userTotalNum = -1;
  item = {userName: "XXX", signature: "将来的你一定会感谢XXX", userPhoto:"../../assets/imgs/user.jpg"};
  userList = [];

  constructor(
    public navCtrl: NavController,
    public navParams: NavParams,
    private httpService: HttpService) {
    // for(let i=0; i<8; ++i) {
    //   this.userList.push(this.item);
    // }
  }

  ionViewWillEnter() {
    this.userList = [];
    this.userTotalNum = -1;
    this.getUserInfo(-1);
  }

  getUserInfo(concernedId) {
    this.httpService.post(`${this.url}searchConcernedPerson`, {
      userId: window.localStorage.getItem("userId"),
      concernedId: concernedId
    }).then(res=>{
      console.log(res);
      let result = (res as any);
      if(result.code === 1){
        for(let i=0; i<result.data.list.length; ++i){
          let item = {
            userId: result.data.list[i].USER_ID,
            userName: result.data.list[i].USER_NAME,
            userSignature: result.data.list[i].USER_SIGNATURE,
            userImg: this.url+result.data.list[i].USER_IMG,
            concernedId: this.url+result.data.list[i].CONCERNED_ID,
          };
          this.userList.push(item);
          this.userTotalNum = result.data.userTotalNum;
        }
      }

    }).catch(err=>{
      alert(err);
    });

    //用户信息
  }

  doInfinite(infiniteScroll) {
    console.log('Begin async operation');
    if (this.userList.length  >= this.userTotalNum) {
      infiniteScroll.enable(false);
      return;
    }
    setTimeout(() => {
      this.httpService.post(`${this.url}searchConcernedPerson`, {
        userId: window.localStorage.getItem("userId"),
        concernedId: this.userList[this.userList.length - 1].concernedId
      }).then(res=>{
        console.log(res);
        let result = (res as any);
        if(result.code === 1){
          for(let i=0; i<result.data.list.length; ++i){
            let item = {
              userId: result.data.list[i].USER_ID,
              userName: result.data.list[i].USER_NAME,
              userSignature: result.data.list[i].USER_SIGNATURE,
              userImg: this.url+result.data.list[i].USER_IMG,
              concernedId: this.url+result.data.list[i].CONCERNED_ID,
            };
            this.userList.push(item);
            this.userTotalNum = result.data.userTotalNum;
            infiniteScroll.complete();
          }
        }

      }).catch(err=>{
        alert(err);
      });
    });
  }

  goOthersHome(item) {
    this.navCtrl.push(OthersessaylistPage, {
      userId: item.userId
    });
  }

  goBack() {
    this.navCtrl.pop();
  }

}
