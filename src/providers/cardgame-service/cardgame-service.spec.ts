import {async, inject, TestBed} from '@angular/core/testing';
import {IonicModule, Platform} from 'ionic-angular';

import {SplashScreen} from "@ionic-native/splash-screen";
import {StatusBar} from "@ionic-native/status-bar";

import {CardgameApp} from '../../app/app.component';
import {PlatformMock, StatusBarMock, SplashScreenMock} from '../../../test-config/mocks-ionic';
import {HttpClientTestingModule, HttpTestingController} from "@angular/common/http/testing";
import {HttpClient} from "@angular/common/http";
import {CardgameService} from "./cardgame-service";
import {QueueingSubject} from "queueing-subject";

describe('Cardgame Service', () => {
  let fixture;
  let component;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [CardgameApp],
      imports: [
        IonicModule.forRoot(CardgameApp),
        HttpClientTestingModule,
      ],
      providers: [
        {provide: StatusBar, useClass: StatusBarMock},
        {provide: SplashScreen, useClass: SplashScreenMock},
        {provide: Platform, useClass: PlatformMock},
        {provide: CardgameService, useClass: CardgameService}
      ]
    })
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CardgameApp);
    component = fixture.componentInstance;
  });

  afterEach(inject([HttpTestingController], (httpMock: HttpTestingController) => {
    httpMock.verify();
  }));

  it('connects to the CardGameService', inject([HttpClient, HttpTestingController, CardgameService], (http: HttpClient, httpMock: HttpTestingController, cardgameService: CardgameService) => {
    console.log("testing connect.");
    cardgameService.connect();
  }));

});
