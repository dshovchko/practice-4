import { fetchMock } from '../fetch.mock.js';
import { json1, json2 } from '../data.js';
import getParallel from '../../src/task-2.js';

describe('Task 2: getParallel', () => {
  beforeEach(() => {
    global.fetch = jest.fn(fetchMock);
  });

  it('should return Promise', () => {
    return expect(getParallel(['/test/200/1'])).toBeInstanceOf(Promise);
  });

  it('should resolve for resolved fetches', () => {
    return expect(getParallel(['/test/200/1', '/test/200/2'])).resolves.toEqual([json1, json2]);
  });

  it('should reject [200, 404]', () => {
    const v = getParallel(['/test/200/1', '/test/404']);
    return Promise.all([
      expect(v).rejects.toThrowError(Error),
      expect(v).rejects.toThrowError('Not Found')
    ]);
  });

  it('should reject [500, 200]', () => {
    const v = getParallel(['/test/500', '/test/200/2']);
    return Promise.all([
      expect(v).rejects.toThrowError(Error),
      expect(v).rejects.toThrowError('Internal Server Error')
    ]);
  });

  it('should reject [fail, 404]', () => {
    const v = getParallel(['/test/dog', '/test/404']);
    return Promise.all([
      expect(v).rejects.toThrowError(Error),
      expect(v).rejects.toThrowError('Failed to fetch')
    ]);
  });

});
