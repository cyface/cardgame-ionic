// file: server-socket.service.ts
import {Injectable} from '@angular/core';
import {QueueingSubject} from 'queueing-subject';
import {Observable} from 'rxjs/Observable';
import websocketConnect from 'rxjs-websockets';
import 'rxjs/add/operator/share';

@Injectable()
export class CardgameService {
  private readonly BASE_URL: string = 'ws://127.0.0.1:8000/game/';
  private inputStream: QueueingSubject<string>;
  public messages: Observable<string>;
  public gameCode: string;
  public cardsInHand: object;

  public connect() {
    if (this.messages)
      return;

    // Using share() causes a single websocket to be created when the first
    // observer subscribes. This socket is shared with subsequent observers
    // and closed when the observer count falls to zero.
    this.messages = websocketConnect(
      this.BASE_URL,
      this.inputStream = new QueueingSubject<string>()
    ).messages.share();

    // Connect Event Listener to Socket
    this.messages.subscribe((message: string) => {
      this.eventListener(message);
    });
  }

  public send(message: string): void {
    // If the websocket is not connected then the QueueingSubject will ensure
    // that messages are queued and delivered when the websocket reconnects.
    // A regular Subject can be used to discard messages sent when the websocket
    // is disconnected.
    this.inputStream.next(message)
  }

  public createGame() {
    console.log("Hello createGame");
    // Connect to Card Game Service Socket

    //Send Create Game Message
    this.send(JSON.stringify({'stream': 'create_game', 'payload': {}}));
  }

  public joinGame(playerName: string) {
    console.log(playerName);
    console.log("Hello joinGame");
    this.send(JSON.stringify(
      {'stream': 'join_game', 'payload': {'game_code': this.gameCode, 'player_name': playerName}}
    ));
  }

  public eventListener(message: string) {
    let response = JSON.parse(message);
    console.log('EventListener: ');
    console.log(response);
    switch (response.stream) {
      case 'create_game':
        console.log('CREATING GAME');
        this.gameCode = response.payload.data.game_code;
        break;
      case 'join_game':
        console.log('JOINING GAME');
        this.cardsInHand = response.payload.data.player_cards;
        console.log(this.cardsInHand);
        break;
      case 'player_joined_game':
        console.log('PLAYER JOINED GAME');
        console.log(response.payload.data.player_name);
        break;
    }
  }

}
