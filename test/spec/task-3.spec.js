import { fetchMock } from '../fetch.mock.js';
import { json1, json2 } from '../data.js';
import getSeries from '../../src/task-3.js';

describe('Task 3: getSeries', () => {
  beforeEach(() => {
    global.fetch = jest.fn(fetchMock);
  });

  it('should return Promise', () => {
    return expect(getSeries('/test/200/1', '/test/200/2')).toBeInstanceOf(Promise);
  });

  it('should correctly get', () => {
    return expect(getSeries('/test/200/1', '/test/200/22')).resolves.toEqual([json1, json2]);
  });

  it("should throw Error('first fetch failed') if first failed", () => {
    const v = getSeries('/test/failed', '/test/200/2');
    return Promise.all([
      expect(v).rejects.toThrowError(Error),
      expect(v).rejects.toThrowError('First fetch failed')
    ]);
  });

  it("should throw Error('second fetch failed') if second failed", () => {
    const v = getSeries('/test/200/1', '/test/failed');
    return Promise.all([
      expect(v).rejects.toThrowError(Error),
      expect(v).rejects.toThrowError('Second fetch failed')
    ]);
  });

  it("should throw Error('first fetch failed') if both failed", () => {
    const v = getSeries('/test/failed', '/test/failed');
    return Promise.all([
      expect(v).rejects.toThrowError(Error),
      expect(v).rejects.toThrowError('First fetch failed')
    ]);
  });

});
