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
  private readonly BASE_URL: string = 'ws://service.cardgame.cyface.com/game/';
  // private readonly BASE_URL: string = 'ws://127.0.0.1:8000/game/';
  private inputStream: QueueingSubject<string>;
  public messages: Observable<string>;
  public gameCode: string;
  public cardsInHand: Card[];
  public submitted: boolean = false;
  public submittedCard: Card;
  public submittedCards: Card[];
  public matchingCard: Card;
  public lastPickedCard: Card;
  public player: Person;
  public players: Person[];
  public judge: Person;
  public judging: boolean;
  public allPlayersSubmitted: boolean = false;
  public joinErrors: Error[];
  public joinResult = new Subject<boolean>();
  public gameCodeValidationResult = new Subject<object>();
  public playerNameValidationResult = new Subject<object>();
  public playerJoined = new Subject<object>();
  public cardPicked = new Subject<object>();

  public connect() {
    console.log("CONNECTING");
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

  public bootPlayer(playerPk) {
    console.log("SENDING BOOT PLAYER REQUEST");
    //Send Create Game Message
    this.send(JSON.stringify({'stream': 'boot_player', 'payload': {'game_code': this.gameCode, 'player_pk': playerPk}}));
  }

  public createGame() {
    console.log("SENDING CREATE GAME REQUEST");
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
    this.submitted = true;
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

  public validateGameCode(game_code: string) {
    if (game_code.length == 4) {
      console.log("SENDING VALIDATE GAME_CODE REQUEST");
      this.send(JSON.stringify(
        {'stream': 'validate_game_code', 'payload': {'game_code': game_code}}
      ));
    }
  }

  public validatePlayerName(player_name: string) {
    console.log("SENDING VALIDATE PLAYER NAME REQUEST");
    this.send(JSON.stringify(
      {'stream': 'validate_player_name', 'payload': {'game_code': this.gameCode, 'player_name': player_name}}
    ));
  }

  public eventListener(message: string) {
    let response = JSON.parse(message);
    console.log(response);
    switch (response.stream) {
      case 'boot_player':
        console.log('BOOT PLAYER RESPONSE RECEIVED');
        console.log(response.payload.data);
        if (!response.payload.data.valid) {
          console.log('BOOT PLAYER SIGNALLING FAILURE');
          this.players = response.payload.data.players;
        } else {
          console.log('BOOT PLAYER SIGNALLING SUCCESS');
          this.players = response.payload.data.players;
        }
        break;
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
          this.joinResult.next(true);
          this.joinErrors = [];
        }
        break;
      case 'submit_card':
        console.log('SUBMIT CARD RESPONSE RECEIVED');
        console.log(response.payload.data);
        this.cardsInHand = response.payload.data.cards;
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
        this.playerJoined.next(response.payload.data.player.name);
        break;
      case 'pick_card':
        console.log('CARD PICKED BROADCAST RECEIVED');
        console.log(response.payload.data);
        this.players = response.payload.data.players;
        this.lastPickedCard = response.payload.data.card;
        this.judge = response.payload.data.picked_player;
        this.cardPicked.next(response.payload.data.card.name);
        break;
      case 'new_cards':
        console.log('NEW CARDS MESSAGE RECEIVED');
        console.log(response.payload.data);
        this.cardsInHand = response.payload.data.cards;
        this.matchingCard = response.payload.data.green_card;
        this.judging = this.judge.pk === this.player.pk;
        this.submittedCards = [];
        this.allPlayersSubmitted = false;
        this.submitted = false;
        break;
      case 'validate_game_code':
        console.log('VALIDATE GAME_CODE MESSAGE RECEIVED');
        console.log(response.payload.data);
        if (!response.payload.data.valid) {
          console.log('VALIDATE GAME_CODE SIGNALLING INVALID');
          this.gameCodeValidationResult.next({"gameCodeInvalid": true});
        } else {
          console.log('VALIDATE GAME_CODE SIGNALLING VALID');
          this.gameCode = response.payload.data.game_code;
          this.gameCodeValidationResult.next(null);
        }
        this.gameCodeValidationResult.complete();
        this.gameCodeValidationResult = new Subject<object>(); //Once complete, have to start again
        break;
      case 'validate_player_name':
        console.log('VALIDATE PLAYER NAME MESSAGE RECEIVED');
        console.log(response.payload.data);
        if (!response.payload.data.valid) {
          console.log('VALIDATE PLAYER NAME SIGNALLING INVALID');
          this.playerNameValidationResult.next({"playerNameTaken": true});
        } else {
          console.log('VALIDATE PLAYER NAME SIGNALLING VALID');
          this.playerNameValidationResult.next(null);
        }
        this.playerNameValidationResult.complete();
        this.playerNameValidationResult = new Subject<object>(); //Once complete, have to start again
        break;
    }
  }

}
