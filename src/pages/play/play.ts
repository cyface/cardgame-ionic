import {Component} from '@angular/core';
import {NavController} from 'ionic-angular';
import {CardgameService} from '../../providers/cardgame-service/cardgame-service';
import {HomePage} from "../home/home";

@Component({
  selector: 'page-play',
  templateUrl: 'play.html'
})
export class PlayPage {
  constructor(public navCtrl: NavController, private cardgameService: CardgameService) {

  }

  goHome() {
    this.navCtrl.setRoot(HomePage);
  }

  playPage = PlayPage;
}
