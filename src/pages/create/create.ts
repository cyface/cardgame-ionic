import {Component} from '@angular/core';
import {NavController} from 'ionic-angular';
import {CardgameService} from '../../providers/cardgame-service/cardgame-service';

@Component({
  selector: 'page-create',
  templateUrl: 'create.html'
})
export class CreatePage {
  constructor(public navCtrl: NavController, private cardgameService: CardgameService) {
    this.cardgameService.connect();
    this.cardgameService.createGame();
  }
}