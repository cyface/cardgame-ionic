import {Component} from '@angular/core';
import {NavController} from 'ionic-angular';
import {CreatePage} from "../create/create";
import {JoinPage} from "../join/join";
import {CardgameService} from "../../providers/cardgame-service/cardgame-service";

@Component({
  selector: 'page-home',
  templateUrl: 'home.html'
})
export class HomePage {
  constructor(public navCtrl: NavController, private cardgameService: CardgameService, ) {
    this.cardgameService.reinitialize();
  }

  goToCreate() {
    this.navCtrl.push(CreatePage);
  }

  goToJoin() {
    this.navCtrl.push(JoinPage);
  }
}
