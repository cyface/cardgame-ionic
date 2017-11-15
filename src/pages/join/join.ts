import {Component} from '@angular/core';
import {NavController, NavParams} from 'ionic-angular';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {CardgameService} from '../../providers/cardgame-service/cardgame-service';
import {PlayPage} from "../play/play";
import {Subscription} from "rxjs/Subscription";

@Component({
  selector: 'page-join',
  templateUrl: 'join.html'
})
export class JoinPage {
  joinForm: FormGroup;
  joinSuccessSubscription: Subscription;
  constructor(public navCtrl: NavController, public navParams: NavParams, private cardgameService: CardgameService, private builder: FormBuilder) {
    // Connect if not already connected (you may have already connected because you did createGame first)
    if (!this.cardgameService.gameCode) {
      this.cardgameService.connect();
    }
    // Listen for a message from the service that the join was successful
    this.joinSuccessSubscription = this.cardgameService.getJoinSuccess().subscribe(message => { this.navCtrl.setRoot(PlayPage); });
    this.joinForm = this.builder.group({
      'playerName': ['', [Validators.minLength(2)]],
      'gameCode': [this.navParams.get('gameCode'), [Validators.minLength(4), Validators.maxLength(4)]]
    })
  }

  joinGame(joinFormData) {
    this.cardgameService.joinGame(joinFormData);
  }

  goToPlayPage(){

  }
}
