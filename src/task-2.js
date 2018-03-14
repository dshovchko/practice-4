export default function getParallel(urls) {
    // Change me!

    function handleErrors(response) {
        if (!response.ok) {
            throw Error(response.statusText);
        }
        return response;
    }

    return Promise.all(urls.map(window.fetch))
        .then(responses => Promise.all(responses.map(res => handleErrors(res)).map(res => res.json())), () => Promise.reject(new Error("denied")));
}
