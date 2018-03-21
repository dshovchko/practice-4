import { getJSON } from "./task-1.js";


export default function getSeries(url1, url2) {
    // Change me!

    return getJSON(url1)
        .catch(() => Promise.reject(new Error("first fetch failed")))
        .then(json1 => getJSON(url2)
            .then(json2 => [json1, json2])
            .catch(() => Promise.reject(new Error("second fetch failed")))
        );
}
