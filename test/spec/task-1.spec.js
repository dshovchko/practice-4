import { getResponse, jsonResult } from '../utils.js';
import { fetchMock } from '../fetch.mock.js';
import { json1 } from '../data.js';
import { status, json, getJSON } from '../../src/task-1.js';

describe('Task 1: status', () => {
  it('should pass through HTTP responses with 200-299 code', () => {
    let r = getResponse(200);
    expect(status(r)).toEqual(r);

    r = getResponse(226);
    expect(status(r)).toEqual(r);

    r = getResponse(299);
    expect(status(r)).toEqual(r);
  });

  it('should throw error with HTTP response text for non-20* HTTP responses', () => {
    expect(() => status(getResponse(307))).toThrowError('Temporary Redirect');
    expect(() => status(getResponse(404))).toThrowError('Not Found');
    expect(() => status(getResponse(503))).toThrowError('Service Unavailable');
  });
});

describe('Task 1: json', () => {
  it('should correctly parse JSON response', () => {
    return expect(json(jsonResult(json1))).resolves.toEqual(json1);
  });
});

describe('Task 1: getJSON', () => {
  beforeEach(() => {
    global.fetch = jest.fn(fetchMock);
  });

  it('should return Promise', () => {
    return expect(getJSON('/test/200')).toBeInstanceOf(Promise);
  });

  it('should correctly parse JSON response', () => {
      return expect(getJSON('/test/200')).resolves.toEqual(json1);
  });

  it('should correctly handle failed HTTP responses', () => {
    const v = getJSON('/test/404');
    return Promise.all([
      expect(v).rejects.toThrowError(Error),
      expect(v).rejects.toThrowError('Not Found')
    ]);
  });

  it('should correctly handle rejected fetch call', () => {
    const v = getJSON('/test/car');
    return Promise.all([
      expect(v).rejects.toThrowError(TypeError),
      expect(v).rejects.toThrowError('Failed to fetch')
    ]);
  });

});
