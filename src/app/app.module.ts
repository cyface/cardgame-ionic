import {NgModule, ErrorHandler} from '@angular/core';
import {BrowserModule} from '@angular/platform-browser';
import {IonicApp, IonicModule, IonicErrorHandler} from 'ionic-angular';
import {CardgameApp} from './app.component';

import {CreatePage} from '../pages/create/create';
import {PlayPage} from '../pages/play/play';
import {JoinPage} from '../pages/join/join';
import {HomePage} from '../pages/home/home';

import {StatusBar} from '@ionic-native/status-bar';
import {SplashScreen} from '@ionic-native/splash-screen';
import {CardgameService} from '../providers/cardgame-service/cardgame-service';
import {PlayMenuPage} from "../pages/play_menu/play_menu";
import {Keyboard} from "@ionic-native/keyboard";

@NgModule({
  declarations: [
    CardgameApp,
    CreatePage,
    HomePage,
    JoinPage,
    PlayPage,
    PlayMenuPage
  ],
  imports: [
    BrowserModule,
    IonicModule.forRoot(CardgameApp)
  ],
  bootstrap: [IonicApp],
  entryComponents: [
    CardgameApp,
    CreatePage,
    HomePage,
    JoinPage,
    PlayPage,
    PlayMenuPage
  ],
  providers: [
    StatusBar,
    SplashScreen,
    {provide: ErrorHandler, useClass: IonicErrorHandler},
    CardgameService,
    Keyboard
  ]
})
export class AppModule {
}
