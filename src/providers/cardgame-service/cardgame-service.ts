// file: server-socket.service.ts
import {Injectable} from '@angular/core';
import {QueueingSubject} from 'queueing-subject';
import {Observable} from 'rxjs/Observable';
import websocketConnect from 'rxjs-websockets';
import 'rxjs/add/operator/share';

interface Card {
  pk: number;
  name: string;
  text?: string;
  status: string;
}

interface Person {
  pk: number;
  name: string;
  status: string;
  score: number;
}

@Injectable()
export class CardgameService {
  private readonly BASE_URL: string = 'ws://127.0.0.1:8000/game/';
  private inputStream: QueueingSubject<string>;
  public messages: Observable<string>;
  public gameCode: string;
  public cardsInHand: Card[];
  public submittedCard: Card;
  public submittedCards: Card[];
  public matchingCard: Card;
  public player: Person;
  public players: Person[];
  public judge: Person;
  public judging: boolean;
  public allPlayersSubmitted: boolean;

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

  public joinGame(joinFormData) {
    console.log(joinFormData);
    console.log("Hello joinGame");
    this.send(JSON.stringify(
      {'stream': 'join_game', 'payload': {'game_code': joinFormData.gameCode, 'player_name': joinFormData.playerName}}
    ));
  }

  public submitCard(card_pk: number) {
    console.log("Hello submitCard");
    this.send(JSON.stringify(
      {'stream': 'submit_card', 'payload': {'game_code': this.gameCode, 'card_pk': card_pk}}
    ));
  }

  public pickCard(cardgameplayerPk: string) {
    console.log("Hello pickCard");
    this.send(JSON.stringify(
      {'stream': 'pick_card', 'payload': {'game_code': this.gameCode, 'cardgameplayer_pk': cardgameplayerPk}}
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
        console.log(response.payload.data);
        this.gameCode = response.payload.data.game_code;
        this.cardsInHand = response.payload.data.player_cards;
        this.submittedCards = response.payload.data.submitted_cards;
        this.matchingCard = response.payload.data.green_card;
        this.player = response.payload.data.player;
        this.judge = response.payload.data.judge;
        this.judging = this.judge.pk === this.player.pk;
        this.allPlayersSubmitted = response.payload.data.all_players_submitted;
        break;
      case 'submit_card':
        console.log('REPLY FROM SUBMIT CARD');
        console.log(response.payload.data.player_name);
        this.cardsInHand = response.payload.data.cards;
        break;
      case 'card_was_submitted':
        console.log('A CARD WAS SUBMITTED');
        console.log(response.payload.data.player_name);
        this.submittedCard = response.payload.data.submitted_card;
        this.submittedCards = response.payload.data.submitted_cards;
        this.players = response.payload.data.players;
        break;
      case 'player_joined_game':
        console.log('PLAYER JOINED GAME');
        console.log(response.payload.data.player_name);
        this.players = response.payload.data.players;
        break;
      case 'new_cards':
        console.log('NEW CARDS');
        console.log(response.payload.data.player_name);
        this.players = response.payload.data.players;
        this.cardsInHand = response.payload.data.cards;
        this.matchingCard = response.payload.data.green_card;
        this.judge = response.payload.data.judge;
        this.judging = this.judge.pk === this.player.pk;
        this.allPlayersSubmitted = false;
        break;
    }
  }

}
