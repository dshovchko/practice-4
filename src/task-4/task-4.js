
export default function showDialog(dialogId) {

    const dialog = document.getElementById(dialogId);

    return new Promise((resolve, reject) => {

        dialog.addEventListener("click", e => {
            if (e.target.tagName === "BUTTON") {
                if (e.target.textContent === "Yes") {
                    resolve('Yes');
                }
                else {
                    reject('No');
                }
            }
        });

        $(`#${dialogId}`).modal('show');
    });
}
