import {Component} from '@angular/core';
import {NavController} from 'ionic-angular';
import {FormBuilder, FormGroup} from '@angular/forms';
import {CardgameService} from '../../providers/cardgame-service/cardgame-service';

@Component({
  selector: 'page-home',
  templateUrl: 'home.html'
})
export class HomePage {
  playerNameForm: FormGroup;
  constructor(public navCtrl: NavController, private cardgameService: CardgameService, private builder: FormBuilder) {
    this.cardgameService.connect();
    this.cardgameService.createGame();
    this.playerNameForm = builder.group({
      'playerName': ''
    })
  }
}
