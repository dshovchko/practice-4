import Subject from "./subject.js";
import { status } from "../task-1.js";

export default class Cart {
    constructor() {
        this.baseUrl = "http://localhost:3001/cart/items/";
        this.subject = new Subject();
        this.items = [];
        this.loading = false;
    }

    _ajax(url, method = "GET", data = null, middleware = () => {}) {
        this.loading = true;

        const params = {
            method,
            mode: "cors",
            headers: { "Content-type": "application/json" }
        };
        if (data) {
            params.body = JSON.stringify(data);
        }

        const finalizer = () => {
            this.loading = false;
            this._notify();
        };

        this._notify();
        return window.fetch(url, params)
            .then(status)
            .then(response => response.status === 200 ? response.json() : null)
            .then(middleware)
            .then(finalizer)
            .catch(finalizer);
    }

    _notify() {
        this.subject.notifyObservers();
    }

    register(...args) {
        this.subject.add(...args);
    }

    isItemInCart(itemId) {
        return this.items.some(item => item.id === itemId);
    }

    getItemIndex(itemId) {
        return this.items.findIndex(item => item.id === itemId);
    }

    getItems() {
        return this.items;
    }

    getTotalQuantity() {
        return this.items.length;
    }

    getTotalPrice() {
        return this.items.reduce((sum, item) => sum + item.price * item.quantity, 0);
    }

    load() {
        return this._ajax(this.baseUrl, "GET", null, items => {
            this.items = items;
        });
    }

    addItem(item) {
        return this._ajax(this.baseUrl, "POST", item, () => {
            this.items.push(item);
        });
    }

    updateItem(itemId, item) {
        return this._ajax(`${this.baseUrl}${itemId}`, "PUT", item, () => {
            if (this.isItemInCart(itemId)) {
                this.items[this.getItemIndex(itemId)] = item;
            }
        });
    }

    removeItem(itemId) {
        return this._ajax(`${this.baseUrl}${itemId}`, "DELETE", () => {
            if (this.isItemInCart(itemId)) {
                this.items.splice(this.getItemIndex(itemId), 1);
            }
        });
    }

    removeAll() {
        return this._ajax(this.baseUrl, "DELETE", () => {
            this.items = [];
        });
    }
}
