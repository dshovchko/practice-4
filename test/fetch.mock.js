import { getResponse, jsonResult } from './utils.js';
import { json1, json2, json3 } from './data.js';

export const fetchMock = (url) => {
  switch (url) {
    case '/test/200':
      return Promise.resolve(jsonResult(json1));
    case '/test/200/1':
      return Promise.resolve(jsonResult(json1));
    case '/test/200/2':
      return Promise.resolve(jsonResult(json2));
    case '/test/200/3':
      return Promise.resolve(jsonResult(json3));
    case '/test/200/4':
      return Promise.resolve(jsonResult(json1));
    case '/test/200/5':
      return Promise.resolve(jsonResult(json2));
    case '/test/200/6':
      return Promise.resolve(jsonResult(json3));
    case '/test/200/7':
      return Promise.resolve(jsonResult(json1));
    case '/test/200/8':
      return Promise.resolve(jsonResult(json2));
    case '/test/200/22':
      return Promise.resolve(jsonResult(json2));
    case '/test/404':
      return Promise.resolve(getResponse(404));
    case '/test/500':
      return Promise.resolve(getResponse(500));
    default:
      return Promise.reject(new TypeError('Failed to fetch'));
  }
};

export default fetchMock;
