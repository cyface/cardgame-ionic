import {Component} from '@angular/core';
import {MenuController, ToastController} from 'ionic-angular';
import {CardgameService} from '../../providers/cardgame-service/cardgame-service';
import {Subscription} from "rxjs/Subscription";

@Component({
  selector: 'page-play',
  templateUrl: 'play.html'
})
export class PlayPage {
  playerJoinedSubscription: Subscription;
  cardPickedSubscription: Subscription;

  constructor(private cardgameService: CardgameService, public menuCtrl: MenuController, private toastCtrl: ToastController) {

    // Listen for a message from the service that a player joined, show toast
    this.playerJoinedSubscription = this.cardgameService.playerJoined.subscribe(message => {
      this.playerJoinedToast(message)
    });

    // Listen for a message that a card was picked, show toast
    this.cardPickedSubscription = this.cardgameService.cardPicked.subscribe(message => {
      this.cardPickedToast(message)
    });
  }

  ngOnDestroy() {
    this.playerJoinedSubscription.unsubscribe();
    this.cardPickedSubscription.unsubscribe();
  }

  ionViewDidLeave() {
    this.playerJoinedSubscription.unsubscribe();
    this.cardPickedSubscription.unsubscribe();
  }

  playerJoinedToast(message) {
    let toast = this.toastCtrl.create({
      message: message + ' has joined the game',
      duration: 3000,
      position: 'bottom'
    });

    toast.present();
  }

  cardPickedToast(message) {
    let toast = this.toastCtrl.create({
      message: message + '  wins!',
      duration: 3000,
      position: 'top'
    });

    toast.present();
  }

  newJudgeToast(message) {
    let toast = this.toastCtrl.create({
      message: 'Congratulations New Judge  ' + this.cardgameService.judge.name,
      duration: 3000,
      position: 'bottom'
    });

    toast.present();
  }

}
