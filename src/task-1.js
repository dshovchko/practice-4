export default function getJSON(url) {
    // Change me!

    function handleErrors(response) {
        if (!response.ok) {
            throw Error(response.statusText);
        }
        return response;
    }

    return window.fetch(url)
        .then(handleErrors)
        .then(response => response.json());
}
