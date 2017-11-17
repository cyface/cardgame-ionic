import {FormControl} from '@angular/forms';
import {CardgameService} from "../providers/cardgame-service/cardgame-service";

export class GameCodeValidator {

  static checkGameCode(cardgameService: CardgameService): any {

    // Return a promise to return the game code validate result
    return (control: FormControl) => {

      //Send Message to validate the game code
      cardgameService.validateGameCode(control.value);

      //return observable
      return cardgameService.gameCodeValidationResult;
    }
  }
}
