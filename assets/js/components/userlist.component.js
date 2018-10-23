import { el, listPool, setChildren } from 'redom';

export class User {
    constructor (user) {
        this.el = el('li.users-item',
            this.name = el('.users-name'),
            this.time = el('.users-time', ' ')
        );
    }
    update (user) {
        this.name.textContent = user.username;
    }
}

export class UserList {
    constructor () {
        this.el = el('.users',
            el('.users-online.fullwidth', 'Users Online'),
            this.list = el('ul.users-list.fullwidth')
        );
        this.others = listPool(User)
    }
    update (items) {
        this.others.update(items);
        setChildren(this.list, this.others.views);
    }
}
