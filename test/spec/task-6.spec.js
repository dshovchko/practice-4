import EP from '../../src/task-6.js';

function createStubPromise() {
    let settle;
    const p = new Promise((resolve, reject) => {
        settle = (flag, value) => {
            if (flag) {
                resolve(value);
            } else {
                reject(value);
            }
        };
    });
    p.settle = settle;
    return p;
}

describe('Task 6: some()', () => {

  it('should return EnhancedPromise', () => {
    return expect(EP.some([Promise.resolve(1), Promise.resolve(2)], 1)).toBeInstanceOf(EP);
  });

  it('should reject for negative count', () => {
    return expect(EP.some([Promise.resolve(1)], -1)).rejects.toThrowError(Error);
  });

  it('should reject for empty promises array', () => {
    return expect(EP.some([], 2)).rejects.toThrowError(Error);
  });

  it('should reject for zero count', () => {
    return expect(EP.some([Promise.resolve(1)], 0)).rejects.toThrowError(Error);
  });

  it('boring case', () => {
    return expect(EP.some([Promise.resolve(1), Promise.resolve(2)], 2)).resolves.toEqual([1, 2]);
  });

  it('should return values in order they were resolved', () => {

    const [p1, p2, p3, p4] = [0, 0, 0, 0].map(createStubPromise);

    const p = EP.some([p1, p2, p3, p4], 2);

    setTimeout(() => {
      p3.settle(true, 3);
      setTimeout(() => {
        p4.settle(false, 4);
        setTimeout(() => {
          p2.settle(true, 2);
          // don't resolve p1,
          // to check if promise will be fulfilled
          // without waiting all promises to be settled.
        }, 0);
      }, 0);
    }, 0);

    return expect(p).resolves.toEqual([3, 2]);
  });

  it('should reject when number of fulfilled promises in lesser that needed', () => {
    const [p1, p2, p3, p4] = [0, 0, 0, 0].map(createStubPromise);

    const p = EP.some([p1, p2, p3, p4], 3);

    setTimeout(() => {
      p3.settle(true, 3);
      setTimeout(() => {
        p4.settle(false, 4);
        setTimeout(() => {
          p2.settle(false, 2);
          // don't resolve p1,
          // to check if promise will be rejected
          // without waiting all promises to be settled.
        }, 0);
      }, 0);
    }, 0);

    return expect(p).rejects.toThrowError(Error);
  });

  it('should reject when count is larger than length of array', () => {
      const p1 = createStubPromise();

      const p = EP.some([p1], 2);

      p1.settle(true, 1);
      return expect(p).rejects.toThrowError(Error);
  });
});
