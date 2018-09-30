import { el } from 'redom';

// define Login component
export default class User {
    constructor () {
        this.el = el('li');
    }
    update (data) {
        this.el.textContent = data.username;
    }
}
