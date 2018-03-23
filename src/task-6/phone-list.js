import Subject from "./subject.js";
import { status } from "../task-1.js";

export default class Cart {
    constructor() {
        this.baseUrl = "http://localhost:3001/phones";
        this.subject = new Subject();
        this.items = [];
    }

    load() {
        const params = {
            method: "GET",
            mode: "cors",
            headers: { "Content-type": "application/json" }
        };

        return window.fetch(this.baseUrl, params)
            .then(status)
            .then(response => response.status === 200 ? response.json() : null)
            .then((items) => {
                this.items = items;
                this._notify();
            })
            .catch(console.log());
    }

    getItems() {
        return this.items;
    }

    getItem(itemId) {
        if (!this.items.some(item => item.id === itemId)) {
            return null;
        }
        const index = this.items.findIndex(item => item.id === itemId);
        return this.items[index];
    }
}
