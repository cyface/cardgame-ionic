import {browser, by, element} from 'protractor';

export class Page {

  navigateTo(destination) {
    return browser.get(destination);
  }

  getBrowserTitle() {
    return browser.getTitle();
  }

}
