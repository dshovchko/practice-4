/*
export default class EnhancedPromise extends Promise {

    static some(promises, count) {
        return this.resolve([]);
    }
}
*/

/* in order of resolving */
export default class EnhancedPromise extends Promise {

    static some(promises, count) {
        const rets = [];

        return promises.map(promise => promise
            .then(result => rets.push(result))
            .catch(() => this.resolve(null))
        ).reduce((acc, promise) => acc
            .then(() => promise.then()), this.resolve()
        ).then(() => {
            if (rets.length < count) {
                return this.reject(new Error("failed to fullfill promise"));
            }
            return this.resolve(rets.slice(0, count));
        });
    }
}

/* in order of array */
/*
export default class EnhancedPromise extends Promise {

    static some(promises, count) {

        return promises.reduce((acc, promise) => acc.then(accResult => promise
            .then(result => accResult.concat(result))
            .catch(() => this.resolve(accResult))
        ), this.resolve([]))
            .then(result => {
                if (result.length < count) {
                    return this.reject(new Error("failed to fullfill promise"));
                }
                return result.slice(0, count);
            });
    }
}
*/
