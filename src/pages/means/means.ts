import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import {HttpService} from "../../service/HttpService";
import {Config} from "../../service/config";

/**
 * Generated class for the MeansPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-means',
  templateUrl: 'means.html',
})


export class MeansPage {

  url = Config.url;
  type = 'politics';
  politics = [];
  english = [];
  math = [];
  major = [];

  constructor(
    public navCtrl: NavController,
    public navParams: NavParams,
    private httpService: HttpService,
    ) {
  }

  ionViewWillEnter() {
    this.httpService.post(`${this.url}getFileInfo`, {})
      .then(res=>{
      console.log(res);
      let result = (res as any);
      if(result.code === 1){
        for(let i=0; i<result.data.length; ++i){
          let item = {
            fileId: result.data[i].FILE_ID,
            fileName: result.data[i].FILE_NAME,
            fileContent: result.data[i].FILE_CONTENT,
            fileType: result.data[i].FILE_TYPE,
            fileUrl: result.data[i].FILE_URL,
          };
          if(item.fileType === 1){
            this.politics.push(item);
          }
          else if(item.fileType === 2){
            this.english.push(item);
          }
          else if(item.fileType === 3){
            this.math.push(item);
          }
          else if(item.fileType === 4){
            this.major.push(item);
          }
        }
      }

    }).catch(err=>{
      alert(err);
    });
  }


  download(item){
    window.open(item.fileUrl, "_self")
  }

  goBack() {
    this.navCtrl.pop();
  }


}
