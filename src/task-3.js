import { getJSON } from "./task-1.js";


export default function getSeries(url1, url2) {
    // Change me!

    return getJSON(url1)
        .catch(() => { throw new Error("First fetch failed"); })
        .then(json1 =>
            getJSON(url2)
                .then(json2 => [json1, json2])
                .catch(() => { throw new Error("Second fetch failed"); })
        );
}
