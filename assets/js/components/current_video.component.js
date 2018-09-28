import { el, setStyle } from 'redom';

// define Login component
export default class CurrentVideo {

    constructor () {
        this.el = el('.current',
            el('.current-img-wrap',
                this.image = el('.current-img')
            ),
            this.title = el('.current-title'),
            el('.current-btns',
                el('.current-button.plus'),
                el('.current-button.skip'),
            ),
        );
    }

    update(image, text) {
        this.image.style.backgroundImage = `url(${ image })`;
        this.title.textContent = text;
    }

}
