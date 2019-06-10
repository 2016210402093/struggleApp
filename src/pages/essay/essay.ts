import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import {HttpService} from "../../service/HttpService";
import {Config} from "../../service/config";
import * as io from 'socket.io-client';

/**
 * Generated class for the EssayPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-essay',
  templateUrl: 'essay.html',
})
export class EssayPage {

  url = Config.url;
  socketUrl = Config.socketUrl;
  essayId = 0;
  essay ={
    title: "",
    userName: "",
    userId: 0,
    userImg: "../../../assets/imgs/user.jpg",
    content: "",
    likeNum: 0,
    creationTime: "",
    essayId: 0
  };
  isLike = false;
  isCollect = false;
  isCarePerson = false;
  isSelf = false;
  userInput="";
  commentList = [];
  socket;
  isAbout = false; //是否从about过来
  isShow = false;
  essayContent = [];


  constructor(
    public navCtrl: NavController,
    public navParams: NavParams,
    private httpService: HttpService) {
  }

  listenSocket(){
    this.socket.on('server-message',(data)=>{
      if(data.essayId === this.essayId){
        this.commentList.push({
          userName: data.userName,
          creationTime:  data.creationTime,
          commentContent: data.commentContent,
          userImg: data.userImg
        });
      }
    })
  }

  ionViewWillEnter() {
    this.socket = io.connect(this.socketUrl);
    this.essayId = this.navParams.data.essayId;
    this.httpService.post(`${this.url}getEssayDetail`, {
      type: "essay",
      Id: this.essayId
    }).then(res=>{
      console.log(res);
      let result = (res as any);
      if(result.code === 1){
        this.essay ={
          title: result.data[0].ESSAY_TITLE,
          userName: result.data[0].USER_NAME,
          userId: result.data[0].USER_ID,
          userImg: this.url+result.data[0].USER_IMG,
          content: result.data[0].ESSAY_CONTENT,
          likeNum: result.data[0].LIKE_NUMBER,
          creationTime: result.data[0].CREATION_TIME,
          essayId: result.data[0].ESSAY_ID
        };
        this.essayContent = this.essay.content.split("\n");
        if(String(this.essay.userId) === window.localStorage.getItem("userId")){
          this.isAbout = this.navParams.data.isAbout === 1;
          this.isSelf = true;
          if(!this.isAbout && this.isSelf){
            this.isShow = true;
          }
        }
        else{
          this.isSelf = false;
          this.isShow = false;
          this.httpService.post(`${this.url}getOtherEssayDetail`, {
            type: "essay",
            userId: window.localStorage.getItem("userId"),
            essayId: this.essay.essayId,
            personId: this.essay.userId,

          }).then(res=>{
            let result = (res as any);
            if(result.code === 1){
              this.isLike = result.data.isLike === 1;
              this.isCollect = result.data.isCollect === 1;
              this.isCarePerson = result.data.isConcerned === 1;
            }
          }).catch(err=>{
            alert(err);
          });
        }
      }

    }).catch(err=>{
      alert(err);
    });
    this.getCommentInfo();
  }

  goBack(){
    this.navCtrl.pop();
  }


  getCommentInfo(){
    this.httpService.post(`${this.url}getCommentInfo`, {
      essayId: this.navParams.data.essayId
    }).then(res=>{
      let result = (res as any);
      if(result.code === 1){
        for(let i=0; i<result.data.length; ++i){
          this.commentList.push({
            userName: result.data[i].USER_NAME,
            creationTime: result.data[i].CREATION_TIME,
            commentContent: result.data[i].COMMENT_CONTENT,
            userImg:  this.url+result.data[i].USER_IMG,
          });
        }
        //开始socket监听
        this.listenSocket();
      }
    }).catch(err=>{
      alert(err);
    });
  }

  goodEssay() {
    this.isLike ? this.essay.likeNum-- :this.essay.likeNum++;
    this.isLike = !this.isLike;
    this.httpService.post(`${this.url}isLike`, {
      type: "essay",
      isLike: this.isLike? 1 : -1,
      userId: window.localStorage.getItem("userId"),
      id: this.essayId
    }).then(res=>{
      console.log(res);
      let result = (res as any);
      if(result.code === 1){

      }
    }).catch(err=>{
      alert(err);
    });
  }

  collectEssay() {
    this.httpService.post(`${this.url}isCollectEssay`, {
      type: this.isCollect ? "remove" : "add",
      userId: window.localStorage.getItem("userId"),
      essayId: this.essay.essayId
    }).then(res=>{
      console.log(res);
      let result = (res as any);
      if(result.code === 1){

      }
    }).catch(err=>{
      alert(err);
    });
    this.isCollect = !this.isCollect;
  }

  carePerson() {
    this.httpService.post(`${this.url}isConcernedUser`, {
      type: this.isCarePerson ? "remove" : "add",
      userId: window.localStorage.getItem("userId"),
      concernedPersonId: this.essay.userId
    }).then(res=>{
      console.log(res);
      let result = (res as any);
      if(result.code === 1){

      }
    }).catch(err=>{
      alert(err);
    });
    this.isCarePerson = !this.isCarePerson;
  }

  deleteEssay(){
    this.httpService.post(`${this.url}deleteEssay`, {
      essayId: this.essay.essayId
    }).then(res=>{
      console.log(res);
      let result = (res as any);
      if(result.code === 0){
        alert("删除失败!")
      }
      else {
        this.navCtrl.pop();
      }
    }).catch(err=>{
      alert(err);
    });
  }


  //离开
  ionViewDidLeave() {
    this.socket.disconnect(true);
  }


  sendComment(){

    this.httpService.post(`${this.url}addComment`, {
      userId: window.localStorage.getItem("userId"),
      commentContent: this.userInput,
      essayId: this.essayId
    }).then(res=>{
      let result = (res as any);
      if(result.code === 0){
        alert("评论失败!")
      }
      else {
        this.socket.emit('message', {
          essayId: this.essayId,
          userName: window.localStorage.getItem("userName"),
          creationTime:  this.curentTime(),
          commentContent: this.userInput,
          userImg: window.localStorage.getItem("userImg")
        });
        this.userInput = "";
      }
    }).catch(err=>{
      alert(err);
    });

  }

   curentTime() {
    let now = new Date();
    let year = now.getFullYear();
    let month = now.getMonth() + 1;
    let day = now.getDate();
    let hh = now.getHours();
    let mm = now.getMinutes();
    let ss = now.getSeconds();

    let clock = year + "-";
    if(month < 10)
      clock += "0";
    clock += month + "-";
    if(day < 10)
      clock += "0";
    clock += day + " ";
    if(hh < 10)
      clock += "0";
    clock += hh + ":";
    if (mm < 10)
      clock += '0';
    clock += mm + ":";
    if (ss < 10)
      clock += '0';
    clock += ss;
    return(clock);
  }

}
