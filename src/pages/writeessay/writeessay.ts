import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, AlertController, ViewController, ActionSheetController  } from 'ionic-angular';
import {Camera, CameraOptions} from '@ionic-native/camera';
import { ImagePicker, ImagePickerOptions } from '@ionic-native/image-picker';
import {Alertmsg} from "../../service/alertmsg";
import {Config} from "../../service/config";

/**
 * Generated class for the WriteessayPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-writeessay',
  templateUrl: 'writeessay.html',
})
export class WriteessayPage {

  url=Config.url;
  path = "../../assets/imgs/uploadPhoto.png";
  showPhoto = false;
  textContent = "";
  textTitle = "";
  textSubTitle = "";
  textNum = 0;

  constructor(
    public navCtrl: NavController,
    public navParams: NavParams,
    public viewCtrl: ViewController,
    private alertCtrl: AlertController,
    private camera: Camera,
    public actionSheetCtrl: ActionSheetController,
    private imagePicker: ImagePicker,
    public alertMsg: Alertmsg
  ) {
  }

  openCamera() {
    const options: CameraOptions = {
      quality: 100,                                                   //相片质量 0 -100
      destinationType: this.camera.DestinationType.DATA_URL,        //DATA_URL 是 base64   FILE_URL 是文件路径
      encodingType: this.camera.EncodingType.JPEG,
      mediaType: this.camera.MediaType.PICTURE,
      targetWidth: 200,
      targetHeight: 200,
      saveToPhotoAlbum: true,                                       //是否保存到相册
      // sourceType: this.camera.PictureSourceType.CAMERA ,         //是打开相机拍照还是打开相册选择  PHOTOLIBRARY : 相册选择, CAMERA : 拍照,
    };

    this.camera.getPicture(options).then((imageData) => {
      console.log("got file: " + imageData);

      // If it's base64:
      this.path = 'data:image/jpeg;base64,' + imageData;
      this.showPhoto = true;

      //If it's file URI
      // this.path = imageData;

      // this.upload();

    }, (err) => {
      // Handle error
      alert(err);
    });
  }


  chosePhoto() {

    const options: ImagePickerOptions = {
      maximumImagesCount: 1,
      width: 200,
      height: 200,
      outputType:1
    };

    this.imagePicker.getPictures(options).then((results) => {
      for (let i = 0; i < results.length; i++) {
        console.log('Image URI: ' + results[i]);
        // alert(results[i]);
        this.path = 'data:image/jpeg;base64,' + results[i];
        this.showPhoto = true;
      }
    }, (err) => {
      alert(err);
    });

  }


  ionViewDidLoad() {
    console.log('ionViewDidLoad CreateclockPage');
  }


  dismiss() {
    if (this.path!=="../../assets/imgs/uploadPhoto.png"||this.textNum>0 || this.showPhoto === true || this.textTitle.length>0 || this.textSubTitle.length>0) {
      let alert = this.alertCtrl.create({
        subTitle: "要保存未完成的帖子吗?",
        buttons: [
          {
            text: '继续做',
            role: 'cancel',
            handler: () => {

            }
          },
          {
            text: '离开',
            handler: () => {
              this.viewCtrl.dismiss({publish: false});
            }
          }
        ]
      });
      alert.setMode("ios");
      alert.present();
    }
    else {
      this.viewCtrl.dismiss({publish: false});
    }
  }


  deletePhoto() {
    let alert = this.alertCtrl.create({
      title: "要删除图片吗",
      buttons: [
        {
          text: '取消',
          role: 'cancel',
          handler: () => {}
        },
        {
          text: '删除',
          handler: () => {
            this.showPhoto = false;
            this.path = "";
          }
        }
      ]
    });
    alert.setMode("ios");
    alert.present();
  }

  presentActionSheet() {

    if(this.showPhoto) {
      this.deletePhoto();
    }
    else{
      const actionSheet = this.actionSheetCtrl.create({
        title: '上传图片',
        cssClass: 'zm-action-button',
        buttons: [
          {
            text: '从手机相册选择',
            cssClass: 'zm-action-button',
            role: 'destructive',
            handler: () => {
              this.chosePhoto();
            }
          },{
            text: '拍摄',
            cssClass: 'zm-action-button',
            handler: () => {
              this.openCamera();
            }
          },{
            text: '取消',
            cssClass: 'zm-action-button',
            role: 'cancel',
            handler: () => {
              console.log('Cancel clicked');
            }
          }
        ]
      });
      actionSheet.present();
    }
  }

  getText() {
    console.log(this.textContent);
    this.textNum = this.textContent.length;

  }

  PrefixInteger(num, length) {
    return (Array(length).join('0') + num).slice(-length);
  }

  //发表
  publish() {
    console.log(this.showPhoto, this.textNum, this.textTitle.length, this.textSubTitle.length);
    if(this.showPhoto === false || this.textNum === 0 || this.textTitle.length===0 || this.textSubTitle.length===0){
      let alert = this.alertCtrl.create({
        subTitle: "请把帖子内容填写完整哦",
        buttons: ["OK"]
      });
      alert.setMode("ios");
      alert.present();
    }
    else {
      let form =  new FormData();
      let oDate = new Date(); //实例一个时间对象；
      let imgName = `${window.localStorage.getItem("userId")}${window.localStorage.getItem("userName")}${oDate.getFullYear()}${this.PrefixInteger(oDate.getMonth()+1,2)}${this.PrefixInteger(oDate.getDate(),2)}${this.PrefixInteger(oDate.getHours(),2)}${this.PrefixInteger(oDate.getMinutes(),2)}${this.PrefixInteger(oDate.getSeconds(),2)}`;
      form.append('imgData', this.path);
      form.append('imgName', imgName);
      form.append('userId', window.localStorage.getItem("userId"));
      form.append('essayTitle', this.textTitle);
      form.append('essaySubTitle', this.textSubTitle);
      form.append('essayContent', this.textContent);

      let xhr = new XMLHttpRequest();

      let that = this;
      xhr.open('POST', `${this.url}addEssay`, true);
      xhr.send(form);
      xhr.onreadystatechange = function(){
        if (xhr.readyState == 4 && xhr.status == 200){
          let result = JSON.parse(xhr.responseText);
          if(result.code === 0){
            that.alertMsg.alertMsg(result.msg);
            that.viewCtrl.dismiss({publish: false});
          }
          else{
            that.viewCtrl.dismiss({publish: true});
          }
        }
      };
    }
  }

}
