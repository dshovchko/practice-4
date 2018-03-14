import getJSON from "./task-1.js";

export default function getSequent(url1, url2) {
    // Change me!

    return getJSON(url1)
        .then(json1 => {
            const ret = [json1];
            return getJSON(url2)
                .then(json2 => {
                    ret.push(json2);
                    return ret;
                },
                () => Promise.reject(new Error("comments fetch failed")));
        },
        () => Promise.reject(new Error("article fetch failed")));
}
