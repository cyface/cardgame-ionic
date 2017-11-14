import {Component} from '@angular/core';
import {CardgameService} from '../../providers/cardgame-service/cardgame-service';
import {JoinPage} from "../join/join";
import {NavController} from "ionic-angular";

@Component({
  selector: 'page-create',
  templateUrl: 'create.html'
})
export class CreatePage {
  constructor(public navCtrl: NavController, private cardgameService: CardgameService) {
    this.cardgameService.connect();
    this.cardgameService.createGame();
  }

  goToJoin(gameCode) {
    this.navCtrl.push(JoinPage, {gameCode: gameCode});
  }
}
