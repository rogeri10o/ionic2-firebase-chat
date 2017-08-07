import { ProgressBarComponent } from './../components/progress-bar/progress-bar.component';
import { UserProfilePage } from './../pages/user-profile/user-profile';
import { UserMenuComponent } from './../components/user-menu/user-menu.component';
import { UserInfoComponent } from './../components/user-info/user-info.component';
import { MessageBoxComponent } from './../components/message-box/message-box.component';
import { MessageService } from './../providers/message.service';
import { ChatServive } from './../providers/chat.service';
import { CapitalizePipe } from './../pipes/capitalize.pipe';
import { CustomLoggedHeaderComponent } from './../components/custom-logged-header/custom-logged-header.component';
import { SigninPage } from './../pages/signin/signin';
import { AuthService } from './../providers/auth.service';
import { UserService } from './../providers/user.service';
import { SignupPage } from './../pages/signup/signup';
import { BrowserModule } from '@angular/platform-browser';
import { ErrorHandler, NgModule } from '@angular/core';
import { IonicApp, IonicErrorHandler, IonicModule } from 'ionic-angular';
import { SplashScreen } from '@ionic-native/splash-screen';
import { StatusBar } from '@ionic-native/status-bar';
import { HttpModule } from '@angular/http';

import { MyApp } from './app.component';
import { HomePage } from '../pages/home/home';

import { AngularFireModule, FirebaseAppConfig, AuthProviders, AuthMethods } from 'angularfire2';
import { ChatPage } from "../pages/chat/chat";

const firebaseAppConfig: FirebaseAppConfig = {
    apiKey: "AIzaSyBw9oHurJwmCattHQlZWsbBe0epFglQPys",
    authDomain: "ionic2-firebase-chat-e867e.firebaseapp.com",
    databaseURL: "https://ionic2-firebase-chat-e867e.firebaseio.com",
    storageBucket: "ionic2-firebase-chat-e867e.appspot.com",
    messagingSenderId: "1090370273340"
};

const firebaseAuthConfig = {
  provider: AuthProviders.Custom,
  method: AuthMethods.Password
}

@NgModule({
  declarations: [
    ChatPage,
    HomePage,
    MessageBoxComponent,
    MyApp,
    SigninPage,
    SignupPage,
    UserProfilePage,
    CapitalizePipe,
    CustomLoggedHeaderComponent,
    ProgressBarComponent,
    UserInfoComponent,
    UserMenuComponent
  ],
  imports: [
    BrowserModule,
    HttpModule,
    IonicModule.forRoot(MyApp),
    AngularFireModule.initializeApp(firebaseAppConfig, firebaseAuthConfig)
  ],
  bootstrap: [IonicApp],
  entryComponents: [
    ChatPage,
    HomePage,
    MyApp,
    SigninPage,
    SignupPage,
    UserProfilePage
  ],
  providers: [
    AuthService,
    ChatServive,
    MessageService,
    StatusBar,
    SplashScreen,
    UserService,
    {provide: ErrorHandler, useClass: IonicErrorHandler}
  ]
})
export class AppModule {}
