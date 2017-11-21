import {Component} from '@angular/core';
import {AlertController, NavController} from 'ionic-angular';
import {CardgameService} from '../../providers/cardgame-service/cardgame-service';
import {HomePage} from "../home/home";
import {PlayPage} from "../play/play";

@Component({
  selector: 'page-play-menu',
  templateUrl: 'play_menu.html'
})
export class PlayMenuPage {
  rootPage = PlayPage;

  constructor(public navCtrl: NavController, private cardgameService: CardgameService, private alertCtrl: AlertController) {
  }

  goHome() {
    this.navCtrl.setRoot(HomePage);
  }

  bootConfirm(playerPk: number) {
    let alert = this.alertCtrl.create({
      title: 'Boot From Game?',
      subTitle: 'There is no Undo!',
      buttons: [
        {
          text: 'Cancel',
          role: 'cancel',
          handler: () => {
            console.log('Boot Player Canceled');
          }
        },
        {
          text: 'Boot Them!',
          handler: () => {
            console.log('Boot Clicked');
            this.cardgameService.bootPlayer(playerPk)
          }
        }
      ]
    });
    alert.present();
  }
}
