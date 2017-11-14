import {Component} from '@angular/core';
import {NavController} from 'ionic-angular';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {CardgameService} from '../../providers/cardgame-service/cardgame-service';
import {PlayPage} from "../play/play";

@Component({
  selector: 'page-join',
  templateUrl: 'join.html'
})
export class JoinPage {
  joinForm: FormGroup;
  constructor(public navCtrl: NavController, private cardgameService: CardgameService, private builder: FormBuilder) {
    this.joinForm = builder.group({
      'playerName': ['', Validators.required],
      'gameCode': ['', Validators.required]
    })
  }

  joinGame(joinFormData) {
    this.cardgameService.joinGame(joinFormData);
    this.navCtrl.setRoot(PlayPage);
  }
}
