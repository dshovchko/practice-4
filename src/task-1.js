
// Change us!

function status(response) {

    if (!response.ok) {
        throw Error(response.statusText);
    }
    return response;
}

function json(response) {
    return response.json();
}

function getJSON(url) {

    return window.fetch(url)
        .then(status)
        .then(json);
}


export { status, json, getJSON };
