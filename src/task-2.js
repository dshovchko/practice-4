import { getJSON } from "./task-1.js";

export default function getParallel(urls) {
    // Change me!

    return Promise.all(urls.map(getJSON))
        .then(responses => Promise.all(responses))
        .catch(() => Promise.reject(new Error("denied")));
}
