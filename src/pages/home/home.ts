import {Component} from '@angular/core';
import {NavController} from 'ionic-angular';
import {Subscription} from 'rxjs/Subscription';
import {CardgameService} from '../../providers/cardgame-service/cardgame-service';

@Component({
  selector: 'page-home',
  templateUrl: 'home.html'
})
export class HomePage {

  private socketSubscription: Subscription;
  private game_code: string;

  constructor(public navCtrl: NavController, private cardgameService: CardgameService) {
    this.createGame();
  }

  createGame() {
    console.log("Hello createGame");
    // Connect to Card Game Service Socket
    this.cardgameService.connect();

    // Connect Event Listener to Socket
    this.socketSubscription = this.cardgameService.messages.subscribe((message: string) => {
      this.eventListener(message);
    });

    //Send Create Game Message
    this.cardgameService.send(JSON.stringify({'stream': 'create_game', 'payload': {}}));
  }

  eventListener(message: string) {
    let response = JSON.parse(message);
    console.log('Received message from server: ');
    console.log(response);
    console.log(response.stream);
    if (response.stream === 'create_game') {
      console.log('CREATING GAME');
      this.game_code = response.payload.data.game_code;
    }
  }

  joinGame() {
    console.log("Join Game Was Clicked");
    this.cardgameService.send(JSON.stringify(
      {'stream': 'join_game', 'payload': {'game_code': this.game_code, 'player_name': 'tim'}}
    ));
  }

}
