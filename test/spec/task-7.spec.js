import { fetchMock } from '../fetch.mock.js';
import { json1, json2, json3 } from '../data.js';
import getSequential from '../../src/task-7.js';

describe('Task 7: getSequential', () => {
  beforeEach(() => {
    global.fetch = jest.fn(fetchMock);
  });

  it('should return Promise', () => {
    return expect(getSequential(['/test/200'])).toBeInstanceOf(Promise);
  });

  it('should resolve', () => {
    return expect(getSequential(['/test/200/1', '/test/200/2', '/test/200/3'])).resolves.toEqual([json1, json2, json3]);
  });

  it('should reject with failed to fetch urls[0]', () => {
    const v = getSequential(['/test/500', '/test/200/4']);
    return Promise.all([
      expect(v).rejects.toThrowError(Error),
      expect(v).rejects.toThrowError('failed to fetch /test/500')
    ]);
  });

  it('should reject with failed to fetch /test/404', () => {
    const v = getSequential(['/test/200/5', '/test/200/6', '/test/200/7', '/test/404', '/test/200/8']);
    return Promise.all([
      expect(v).rejects.toThrowError(Error),
      expect(v).rejects.toThrowError('failed to fetch /test/404')
    ]);
  });
});
