import {Component} from '@angular/core';
import {MenuController, NavController} from 'ionic-angular';
import {CardgameService} from '../../providers/cardgame-service/cardgame-service';

@Component({
  selector: 'page-play',
  templateUrl: 'play.html'
})
export class PlayPage {
  constructor(private cardgameService: CardgameService, public menuCtrl: MenuController) {
  }
}
