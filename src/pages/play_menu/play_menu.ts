import {Component} from '@angular/core';
import {NavController} from 'ionic-angular';
import {CardgameService} from '../../providers/cardgame-service/cardgame-service';
import {HomePage} from "../home/home";
import {PlayPage} from "../play/play";

@Component({
  selector: 'page-play-menu',
  templateUrl: 'play_menu.html'
})
export class PlayMenuPage {
  constructor(public navCtrl: NavController, private cardgameService: CardgameService) {
    let judging = cardgameService.judging;  // Only here to suppress unused errors for cardgameService (mostly used from template)
  }

  goHome() {
    this.navCtrl.setRoot(HomePage);
  }

  rootPage = PlayPage;
}
