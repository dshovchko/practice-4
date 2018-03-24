
export default class EnhancedPromise extends Promise {
    static some(promises, count) {
        const result = [];
        const maxRejects = promises.length - count;
        let rejects = 0;

        if (maxRejects < 0) {
            return Promise.reject(new Error());
        }

        return new EnhancedPromise((resolve, reject) => {
            promises.forEach(p => {
                p.then(data => {
                    result.push(data);
                    if (result.length >= count) {
                        resolve(result);
                    }
                    return data;
                }).catch(e => {
                    rejects++;
                    if (rejects >= maxRejects) {
                        reject(new Error());
                    }
                    return e;
                });
            });
        });
    }
}
