import {Component} from '@angular/core';
import {NavController} from 'ionic-angular';
import {CreatePage} from "../create/create";
import {JoinPage} from "../join/join";

@Component({
  selector: 'page-home',
  templateUrl: 'home.html'
})
export class HomePage {
  constructor(public navCtrl: NavController) {
  }

  goToCreate() {
    this.navCtrl.push(CreatePage);
  }

  goToJoin() {
    this.navCtrl.push(JoinPage);
  }
}
