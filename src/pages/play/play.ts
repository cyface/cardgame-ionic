import {Component} from '@angular/core';
import {NavController} from 'ionic-angular';
import {CardgameService} from '../../providers/cardgame-service/cardgame-service';

@Component({
  selector: 'page-play',
  templateUrl: 'play.html'
})
export class PlayPage {
  constructor(public navCtrl: NavController, private cardgameService: CardgameService) {
    console.debug(cardgameService.judging);  // Only here to suppress unused errors for cardgameService (mostly used from template)
  }
}
