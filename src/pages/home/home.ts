import {Component} from '@angular/core';
import {NavController} from 'ionic-angular';
import {CreatePage} from "../create/create";
import {JoinPage} from "../join/join";
import {ToastController} from 'ionic-angular';

@Component({
  selector: 'page-home',
  templateUrl: 'home.html'
})
export class HomePage {
  constructor(public navCtrl: NavController, private toastCtrl: ToastController) {
    //this.presentToast();
  }

  goToCreate() {
    this.navCtrl.push(CreatePage);
  }

  goToJoin() {
    this.navCtrl.push(JoinPage);
  }

  presentToast() {
    let toast = this.toastCtrl.create({
      message: 'HELLO DOLLY',
      duration: 3000,
      position: 'center'
    });

    toast.onDidDismiss(() => {
      console.log('Dismissed toast');
    });

    toast.present();
  }

}
