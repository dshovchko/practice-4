import { jsonResult, getResponse } from '../utils.js';
import Cart from '../../src/task-5/cart-model.js';

const item1 = { 'id': 1, 'name': 'Item 1', 'price': 15, 'quantity': 10 };
const item2 = { 'id': 2, 'name': 'Item 2', 'price': 43, 'quantity': 21 };
const item3 = { 'id': 3, 'name': 'Item 3', 'price': 82, 'quantity': 17 };

describe('Task 5', () => {
  describe('load()', () => {
    it('should make GET /cart/items', () => {
      expect.assertions(2);

      global.fetch = jest.fn((url, params) => {
        expect(url).toBe('http://localhost:3001/cart/items/');
        expect(params.method).toBe('GET');
        return Promise.resolve(jsonResult([item1]));
      });
      const c = new Cart();
      return c.load();
    });

    it('should change items', () => {
      expect.assertions(1);

      global.fetch = jest.fn(() => {
        return Promise.resolve(jsonResult([item1]));
      });
      const c = new Cart();
      return c.load()
        .then(() => {
          expect(c.items).toEqual([item1]);
        });
    });
  });

  describe('addItem()', () => {

    it('should make POST /cart/items', () => {
      expect.assertions(3);

      global.fetch = jest.fn((url, params) => {
        expect(url).toBe('http://localhost:3001/cart/items/');
        expect(params.method).toBe('POST');
        expect(params.body).toBe(JSON.stringify(item1));
        return Promise.resolve(getResponse(201));
      });
      const c = new Cart();
      return c.addItem(item1);
    });

    it('should change items: case 1', () => {
      expect.assertions(1);

      global.fetch = jest.fn(() => {
        return Promise.resolve(getResponse(201));
      });
      const c = new Cart();
      return c.addItem(item2)
        .then(() => {
          expect(c.items).toEqual([item2]);
        });
    });

    it('should change items: case 2', () => {
      expect.assertions(1);

      global.fetch = jest.fn(() => {
        return Promise.resolve(getResponse(201));
      });
      const c = new Cart();

      return Promise.all([
        c.addItem(item1),
        c.addItem(item2),
        c.addItem(item3)
      ])
        .then(() => {
          expect(c.items).toEqual([item1, item2, item3]);
        });
    });
  });

  describe('updateItem()', () => {

    it('should make PUT /cart/items', () => {
      expect.assertions(3);

      global.fetch = jest.fn((url, params) => {
        expect(url).toBe('http://localhost:3001/cart/items/1');
        expect(params.method).toBe('PUT');
        expect(params.body).toBe(JSON.stringify(item2));
        return Promise.resolve(getResponse(204));
      });
      const c = new Cart();
      return c.updateItem(item1.id, item2);
    });

    it('should change items: case 1', () => {
      expect.assertions(1);

      global.fetch = jest.fn(() => {
        return Promise.resolve(getResponse(204));
      });
      const c = new Cart();
      c.items = [item1];
      return c.updateItem(item1.id, item2)
        .then(() => {
          expect(c.items).toEqual([item2]);
        });
    });

    it('should change items: case 2', () => {
      expect.assertions(1);

      global.fetch = jest.fn(() => {
        return Promise.resolve(getResponse(204));
      });
      const c = new Cart();
      c.items = [item1, item2];
      return Promise.all([
        c.updateItem(item1.id, item3),
        c.updateItem(item2.id, item3)
      ])
        .then(() => {
          expect(c.items).toEqual([item3, item3]);
        });
    });
  });

  describe('removeItem()', () => {

    it('should make DELETE /cart/items', () => {
      expect.assertions(2);

      global.fetch = jest.fn((url, params) => {
        expect(url).toBe('http://localhost:3001/cart/items/3');
        expect(params.method).toBe('DELETE');
        return Promise.resolve(getResponse(204));
      });
      const c = new Cart();
      return c.removeItem(item3.id);
    });

    it('should change items: case 1', () => {
      expect.assertions(1);

      global.fetch = jest.fn(() => {
        return Promise.resolve(getResponse(204));
      });
      const c = new Cart();
      c.items = [item1];
      return c.removeItem(item1.id)
        .then(() => {
          expect(c.items).toEqual([]);
        });
    });

    it('should change items: case 2', () => {
      expect.assertions(1);

      global.fetch = jest.fn(() => {
        return Promise.resolve(getResponse(204));
      });
      const c = new Cart();
      c.items = [item1, item2, item3];
      return Promise.all([
        c.removeItem(item1.id),
        c.removeItem(item2.id)
      ])
        .then(() => {
          expect(c.items).toEqual([item3]);
        });
    });
  });

  describe('removeAll()', () => {

    it('should make DELETE /cart/items', () => {
      expect.assertions(2);

      global.fetch = jest.fn((url, params) => {
        expect(url).toBe('http://localhost:3001/cart/items/');
        expect(params.method).toBe('DELETE');
        return Promise.resolve(getResponse(204));
      });
      const c = new Cart();
      return c.removeAll();
    });

    it('should change items: case 1', () => {
      expect.assertions(1);

      global.fetch = jest.fn(() => {
        return Promise.resolve(getResponse(204));
      });
      const c = new Cart();
      c.items = [item1, item2, item3];
      return c.removeAll()
        .then(() => {
          expect(c.items).toEqual([]);
        });
    });

    it('should change items: case 2', () => {
      expect.assertions(1);

      global.fetch = jest.fn(() => {
        return Promise.resolve(getResponse(204));
      });

      const c = new Cart();
      return c.removeAll()
        .then(() => {
          expect(c.items).toEqual([]);
        });
    });
  });

  describe('getTotalQuantity()', () => {

    it('should return 0 for empty cart', () => {
      const c = new Cart();
      expect(c.getTotalQuantity()).toBe(0);
    });

    it('boring case', () => {
      const c = new Cart();
      c.items = [item1, item2, item3];
      expect(c.getTotalQuantity()).toBe(48);
    });
  });

  describe('getTotalPrice()', () => {

    it('should return 0 for empty cart', () => {
      const c = new Cart();
      expect(c.getTotalPrice()).toBe(0);
    });

    it('boring case', () => {
      const c = new Cart();
      c.items = [item1, item2, item3];
      expect(c.getTotalPrice()).toBe(2447);
    });
  });
});
