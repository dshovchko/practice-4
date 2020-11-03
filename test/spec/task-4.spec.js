import { JSDOM } from 'jsdom';
import showDialog from '../../src/task-4/task-4.js';
import renderDialog from '../../src/task-4/render.js';

const ID = 'test';

const dom = new JSDOM('<!doctype html><html><body></body></html>');
global.window = dom.window;
global.document = dom.window.document;

describe('Task 4: showDialog()', () => {

  beforeEach(() => {
    global.$ = jest.fn(() => {
      return {
        modal: () => {}
      };
    });

    renderDialog(document.body, ID);
  });

  it('should return Promise', () => {
    return expect(showDialog(ID)).toBeInstanceOf(Promise);
  });

  it('should resolves by clicking Yes', () => {
    const d = showDialog(ID);
    const buttonYes = document.querySelector('#test .btn-outline-success');
    buttonYes.click();
    return expect(d).resolves.toBe('Yes');
  });

  it('should resolves by clicking No', () => {
    const d = showDialog(ID);
    const buttonNo = document.querySelector('#test .btn-outline-danger');
    buttonNo.click();
    return expect(d).rejects.toBe('No');
  });
});
