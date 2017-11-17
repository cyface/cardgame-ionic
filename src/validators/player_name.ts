import {FormControl} from '@angular/forms';
import {CardgameService} from "../providers/cardgame-service/cardgame-service";

export class PlayerNameValidator {

  static checkPlayerName(cardgameService: CardgameService): any {

    // Return a promise to return the player name validate result
    return (control: FormControl) => {

      //Send Message to validate the player name
      cardgameService.validatePlayerName(control.value);

      //return observable
      return cardgameService.playerNameValidationResult;
    }
  }
}
