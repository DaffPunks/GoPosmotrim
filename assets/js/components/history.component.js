import { el, listPool, setChildren } from 'redom';

export class HistoryVideo {
    constructor () {
        this.el = el('li.history-item',
            this.image = el('.history-item-img'),
            this.title = el('.history-item-title'),
        );
    }
    update (item) {
        this.image.style.backgroundImage = `url(${ item.image })`;
        this.title.textContent = item.title;
        this.id = item.id;
    }
}

export class HistoryList {
    constructor () {
        this.el = el('ul.history-list');
        this.others = listPool(HistoryVideo);
    }

    update (items) {
        this.others.update(items);
        setChildren(this.el, this.others.views);
    }

    onClick (callback) {

        this.others.views.map(item => {
            item.el.onclick = () => {
                callback(item.id);
            };
        });

    }
}
