import { Page } from './app.po';
import {by, element} from "protractor";

describe('CyCard App', () => {
  let page: Page;

  beforeEach(() => {
    page = new Page();
  });

  describe('Home Page', () => {
    beforeEach(() => {
      page.navigateTo('/');
    });

    it('should have a browser title of CyCard', () => {
      page.getBrowserTitle().then(title => {
        expect(title).toEqual('CyCard');
      });
    });

    it('should have a toolbar title of CyCard', () => {
      element(by.css('.header')).element(by.css('.toolbar-title')).getText().then(text => {
        expect(text).toEqual('CyCard');
      });
    });

    it('should have a hidden hamburger menu', () => {
      element(by.css('.bar-button')).getCssValue('display').then(display => {
        expect(display).toEqual('none');
      });
    });

    it('should have a button named Join With A Code', () => {
      element(by.id('join-game-button')).getText().then((text) => {
        expect(text).toEqual("JOIN WITH A CODE");
      });
    });

    it('should have a button named Create New Game', () => {
      element(by.id('create-game-button')).getText().then((text) => {
        expect(text).toEqual("CREATE NEW GAME");
      });
    });
  })
});




