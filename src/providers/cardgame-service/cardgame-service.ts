// file: server-socket.service.ts
import {Injectable} from '@angular/core';
import {QueueingSubject} from 'queueing-subject';
import {Observable} from 'rxjs/Observable';
import {Subject} from "rxjs/Subject";
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

interface Error {
  field: string;
  message: string;
}

@Injectable()
export class CardgameService {
  private readonly BASE_URL: string = 'ws://127.0.0.1:8000/game/';
  private inputStream: QueueingSubject<string>;
  public messages: Observable<string>;
  public gameCode: string;
  public cardsInHand: Card[];
  public submitted: boolean;
  public submittedCard: Card;
  public submittedCards: Card[];
  public matchingCard: Card;
  public lastPickedCard: Card;
  public player: Person;
  public players: Person[];
  public judge: Person;
  public judging: boolean;
  public allPlayersSubmitted: boolean;
  public joinErrors: Error[];
  public joinSuccess = new Subject<boolean>();

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
    console.log("SENDING CREATE GAME REQUEST");
    // Connect to Card Game Service Socket

    //Send Create Game Message
    this.send(JSON.stringify({'stream': 'create_game', 'payload': {}}));
  }

  public joinGame(joinFormData) {
    console.log("SENDING JOIN GAME REQUEST");
    console.log(joinFormData);
    this.send(JSON.stringify(
      {'stream': 'join_game', 'payload': {'game_code': joinFormData.gameCode, 'player_name': joinFormData.playerName}}
    ));
  }

  public submitCard(card_pk: number) {
    console.log("SENDING SUBMIT CARD REQUEST");
    this.send(JSON.stringify(
      {'stream': 'submit_card', 'payload': {'game_code': this.gameCode, 'card_pk': card_pk}}
    ));
  }

  public pickCard(card_pk: string) {
    console.log("SENDING PICK CARD REQUEST");
    this.send(JSON.stringify(
      {'stream': 'pick_card', 'payload': {'game_code': this.gameCode, 'card_pk': card_pk}}
    ));
  }

  public getJoinSuccess(): Observable<boolean> {
    return this.joinSuccess.asObservable();
  }

  public eventListener(message: string) {
    let response = JSON.parse(message);
    console.log('MESSAGE RECEIVED');
    console.log(response);
    switch (response.stream) {
      case 'create_game':
        console.log('CREATE GAME RESPONSE RECEIVED');
        this.gameCode = response.payload.data.game_code;
        break;
      case 'join_game':
        console.log('JOIN GAME RESPONSE RECEIVED');
        console.log(response.payload.data);
        if (response.payload.data.errors) {
          this.joinErrors = response.payload.data.errors;
        } else {
          this.gameCode = response.payload.data.game_code;
          this.cardsInHand = response.payload.data.player_cards;
          this.submittedCards = response.payload.data.submitted_cards;
          this.matchingCard = response.payload.data.green_card;
          this.player = response.payload.data.player;
          this.judge = response.payload.data.judge;
          this.judging = this.judge.pk === this.player.pk;
          this.allPlayersSubmitted = response.payload.data.all_players_submitted;
          this.submitted = false;
          this.joinSuccess.next(true);
          this.joinErrors = [];
        }
        break;
      case 'submit_card':
        console.log('SUBMIT CARD RESPONSE RECEIVED');
        console.log(response.payload.data);
        this.cardsInHand = response.payload.data.cards;
        this.submitted = true;
        break;
      case 'card_was_submitted':
        console.log('CARD SUBMITTED BROADCAST RECEIVED');
        console.log(response.payload.data);
        this.submittedCard = response.payload.data.submitted_card;
        this.submittedCards = response.payload.data.submitted_cards;
        this.players = response.payload.data.players;
        this.allPlayersSubmitted = response.payload.data.all_players_submitted;
        break;
      case 'player_joined_game':
        console.log('PLAYER JOINED GAME BROADCAST RECEIVED');
        console.log(response.payload.data);
        this.players = response.payload.data.players;
        break;
      case 'pick_card':
        console.log('CARD PICKED BROADCAST RECEIVED');
        console.log(response.payload.data);
        this.players = response.payload.data.players;
        this.lastPickedCard = response.payload.data.card;
        break;
      case 'new_cards':
        console.log('NEW CARDS MESSAGE RECEIVED');
        console.log(response.payload.data);
        this.players = response.payload.data.players;
        this.cardsInHand = response.payload.data.cards;
        this.matchingCard = response.payload.data.green_card;
        this.judge = response.payload.data.judge;
        this.judging = this.judge.pk === this.player.pk;
        this.submittedCards = [];
        this.allPlayersSubmitted = false;
        this.submitted = false;
        break;
    }
  }

}
