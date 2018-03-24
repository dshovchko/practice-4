import { getJSON } from "./task-1.js";

/*
export default function getSequential(urls) {
    // Change me!

    return Promise.resolve([]);
}
*/
export default function getSequential(urls) {

    return urls.reduce((promise, url) => promise.then(result => getJSON(url)
        .catch(() => Promise.reject(new Error(`failed to fetch ${url}`)))
        .then(json => result.concat(json))
    ), Promise.resolve([]));
}
