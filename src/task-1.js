export default function getJSON(url) {
    // Change me!
    return window.fetch(url).then(data => {
        debugger;
        return data.json();
    });
}
