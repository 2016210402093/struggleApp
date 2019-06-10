import { NgModule, ErrorHandler } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { IonicApp, IonicModule, IonicErrorHandler } from 'ionic-angular';
import { MyApp } from './app.component';

//插件
import { StatusBar } from '@ionic-native/status-bar';
import { SplashScreen } from '@ionic-native/splash-screen';
import { LocalNotifications } from '@ionic-native/local-notifications';
import { Camera } from '@ionic-native/camera';
import { ImagePicker } from '@ionic-native/image-picker';
import { Keyboard } from '@ionic-native/keyboard';
import { FileTransfer, FileUploadOptions, FileTransferObject } from '@ionic-native/file-transfer';
import { File } from '@ionic-native/file';


//封装的服务
import {HttpService} from "../service/HttpService";
import {HttpModule} from "@angular/http";
import {Alertmsg} from "../service/alertmsg";

//页面
import { AboutPage } from '../pages/about/about';
import { ContactPage } from '../pages/contact/contact';
import { HomePage } from '../pages/home/home';
import { TabsPage } from '../pages/tabs/tabs';
import {AddTaskPage} from "../pages/home/add-task/add-task";
import {SearchinvitationPage} from "../pages/about/searchinvitation/searchinvitation";
import {CreateclockPage} from "../pages/createclock/createclock";
import {WriteessayPage} from "../pages/writeessay/writeessay";
import {ConcernedpeoplePage} from "../pages/contact/concernedpeople/concernedpeople";
import {EssayPage} from "../pages/essay/essay";
import {LoginPage} from "../pages/login/login";
import {MyclockPage} from "../pages/contact/myclock/myclock";
import {MycollectPage} from "../pages/contact/mycollect/mycollect";
import {MyessayPage} from "../pages/contact/myessay/myessay";
import {EditinfoPage} from "../pages/contact/editinfo/editinfo";
import {OthersessaylistPage} from "../pages/contact/concernedpeople/othersessaylist/othersessaylist";
import {MeansPage} from "../pages/means/means";
import {RegisterPage} from "../pages/login/register/register";
import {UpdatepasswordPage} from "../pages/login/updatepassword/updatepassword";
import {EmailverifyPage} from "../pages/login/emailverify/emailverify";
import {UpdateemailPage} from "../pages/login/updateemail/updateemail";
import {SchoolinfoPage} from "../pages/essay/schoolinfo/schoolinfo";


@NgModule({
  declarations: [
    MyApp,
    AboutPage,
    ContactPage,
    HomePage,
    TabsPage,
    AddTaskPage,
    SearchinvitationPage,
    CreateclockPage,
    WriteessayPage,
    ConcernedpeoplePage,
    EssayPage,
    LoginPage,
    EditinfoPage,
    MyclockPage,
    MycollectPage,
    MyessayPage,
    OthersessaylistPage,
    MeansPage,
    UpdatepasswordPage,
    RegisterPage,
    EmailverifyPage,
    UpdateemailPage,
    SchoolinfoPage
  ],
  imports: [
    BrowserModule,
    IonicModule.forRoot(MyApp,{ tabsHideOnSubPages: 'true', backButtonText:'' }),
    HttpModule
  ],
  bootstrap: [IonicApp],
  entryComponents: [
    MyApp,
    AboutPage,
    ContactPage,
    HomePage,
    TabsPage,
    AddTaskPage,
    SearchinvitationPage,
    CreateclockPage,
    WriteessayPage,
    ConcernedpeoplePage,
    EssayPage,
    LoginPage,
    EditinfoPage,
    MyclockPage,
    MycollectPage,
    MyessayPage,
    OthersessaylistPage,
    MeansPage,
    UpdatepasswordPage,
    RegisterPage,
    EmailverifyPage,
    UpdateemailPage,
    SchoolinfoPage
  ],
  providers: [
    StatusBar,
    SplashScreen,
    {provide: ErrorHandler, useClass: IonicErrorHandler},
    LocalNotifications,
    Camera,
    ImagePicker,
    Keyboard,
    HttpService,
    Alertmsg,
    File,
    FileTransfer,
    FileTransferObject
  ]
})
export class AppModule {}
