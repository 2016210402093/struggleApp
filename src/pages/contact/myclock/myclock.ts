import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import {HttpService} from "../../../service/HttpService";
import {Config} from "../../../service/config";

/**
 * Generated class for the MyclockPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-myclock',
  templateUrl: 'myclock.html',
})
export class MyclockPage {

  url = Config.url;
  myClock = [];
  clockTotalNum = -1;

  constructor(
    public navCtrl: NavController,
    public navParams: NavParams,
    private httpService: HttpService) {
  }

  ionViewWillEnter() {
    if(this.clockTotalNum<this.myClock.length){
      this.getClockInfo(-1);
    }
  }

  getClockInfo(clockId) {
    this.httpService.post(`${this.url}queryClockInfo`, {
      userId: window.localStorage.getItem("userId"),
      clockId: clockId
    }).then(res=>{
      console.log(res);
      let result = (res as any);
      if(result.code === 1){
        for(let i=0; i<result.data.list.length; ++i){
          let item = {
            userName: window.localStorage.getItem("userName"),
            clockId: result.data.list[i].CLOCK_ID,
            clockContent: result.data.list[i].CLOCK_CONTENT,
            userImg: window.localStorage.getItem("userImg"),
            cardImg: this.url+result.data.list[i].IMG_URL,
            creationTime: result.data.list[i].CREATION_TIME,
          };
          this.myClock.push(item);
          this.clockTotalNum = result.data.clockTotalNum;
        }
      }

    }).catch(err=>{
      alert(err);
    });
  }


  doInfinite(infiniteScroll) {
    console.log(1111111111,this.myClock.length);
    console.log('Begin async operation');
      if (this.myClock.length  >= this.clockTotalNum) {
        infiniteScroll.enable(false);
        // infiniteScroll.complete();
        return;
      }
    setTimeout(() => {
      this.httpService.post(`${this.url}queryClockInfo`, {
        userId: window.localStorage.getItem("userId"),
        clockId: this.myClock[this.myClock.length - 1].clockId
      }).then(res=>{
        console.log(res);
        let result = (res as any);
        if(result.code === 1){
          for(let i=0; i<result.data.list.length; ++i){
            let item = {
              userName: result.data.list[i].USER_NAME,
              clockId: result.data.list[i].CLOCK_ID,
              clockContent: result.data.list[i].CLOCK_CONTENT,
              userImg: result.data.list[i].USER_IMG,
              cardImg: this.url+result.data.list[i].IMG_URL,
              creationTime: result.data.list[i].CREATION_TIME,
            };
            this.myClock.push(item);
            this.clockTotalNum = result.data.clockTotalNum;
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

}
