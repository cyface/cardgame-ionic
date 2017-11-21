import {Component} from '@angular/core';
import {NavController, NavParams} from 'ionic-angular';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {CardgameService} from '../../providers/cardgame-service/cardgame-service';
import {Subscription} from "rxjs/Subscription";
import {GameCodeValidator} from "../../validators/game_code";
import {PlayerNameValidator} from "../../validators/player_name";
import {PlayMenuPage} from "../play_menu/play_menu";

@Component({
  selector: 'page-join',
  templateUrl: 'join.html'
})
export class JoinPage {
  joinForm: FormGroup;
  joinSuccessSubscription: Subscription;


  constructor(public navCtrl: NavController, public navParams: NavParams, private cardgameService: CardgameService, private builder: FormBuilder) {
    // Connect if not already connected (you may have already connected because you did createGame first)
    if (!this.cardgameService.gameCode) {
      this.cardgameService.connect();
    }
    // Listen for a message from the service that the join was successful, and redirect to play page
    this.joinSuccessSubscription = this.cardgameService.joinResult.subscribe(message => {
      this.joinSuccessSubscription.unsubscribe(); // Stop listening for changes to join success to prevent double-loading the success page
      this.navCtrl.setRoot(PlayMenuPage);
    });

    //Define the form used to let players join the game
    this.joinForm = this.builder.group({
      'gameCode': [this.navParams.get('gameCode'), Validators.compose([Validators.required, Validators.minLength(4), Validators.maxLength(4), Validators.pattern('[a-zA-Z]*')]), GameCodeValidator.checkGameCode(this.cardgameService)],
      'playerName': ['', Validators.compose([Validators.required, Validators.minLength(2), Validators.maxLength(10), Validators.pattern('[a-zA-Z]*')]), PlayerNameValidator.checkPlayerName(this.cardgameService)]
    })
  }

  //Function to call the join form
  joinGame(joinFormData) {
    this.cardgameService.joinGame(joinFormData);
  }

  //Trying to set the focus
  // @ViewChild('gameCodeInput') gameCodeInput: any;
  // @ViewChild('playerNameInput') playerNameInput: any;
  // ionViewDidLoad() {
  //   setTimeout(() => {
  //     if (this.navParams.get('gameCode')) {
  //       this.playerNameInput.setFocus();
  //     } else {
  //       this.gameCodeInput.setFocus();
  //     }
  //     this.keyboard.show();
  //   }, 200);
  // }
}
