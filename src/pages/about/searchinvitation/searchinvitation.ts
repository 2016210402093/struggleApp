import { Component, ElementRef} from '@angular/core';
import { IonicPage, NavController, NavParams, ViewController } from 'ionic-angular';
import { Keyboard } from '@ionic-native/keyboard';
import {HttpService} from "../../../service/HttpService";
import {Config} from "../../../service/config";
import {EssayPage} from "../../essay/essay";


/**
 * Generated class for the SearchinvitationPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-searchinvitation',
  templateUrl: 'searchinvitation.html',
})
export class SearchinvitationPage {

  url = Config.url;
  textContent: string;
  results = [];
  isGetInfo = false;

  constructor(
    public navCtrl: NavController,
    public navParams: NavParams,
    private keyboard: Keyboard,
    public viewCtrl: ViewController,
    private httpService: HttpService
  ) {
    // this.keyboardUp();
  }

  // keyboardUp() {
  //   setTimeout(() => {
  //     this.keyboard.show();   //for android
  //   }, 500);     //至少 150 ms
  // }

  ionViewDidLoad() {

  }

  searchInfo() {
    this.isGetInfo = true;
    console.log(this.textContent, typeof this.textContent);
    if(this.textContent === "" || this.textContent === undefined){
      this.isGetInfo = false;
      return
    }

    this.httpService.post(`${this.url}searchEssay`, {
      keywords: this.textContent.replace(/\'/g,"")
    }).then(res=>{
      console.log(res);
      let result = (res as any);
      if(result.code === 1){
        this.isGetInfo = true;
        this.results = [];
        for(let i=0; i<result.data.length; ++i){
          let item = {essayId: result.data[i].ESSAY_ID, essayTitle: result.data[i].ESSAY_TITLE};
          this.results.push(item)
        }
      }
      else {
        this.isGetInfo = false;
      }

    }).catch(err=>{
      this.isGetInfo = false;
      alert(err);
    });
  }

  readEssay(item){
    console.log(item.essayId);
    this.navCtrl.push(EssayPage, {
      essayId: item.essayId,
      isAbout: 1
    });
  }

  dismiss() {
    this.viewCtrl.dismiss();
  }
}
