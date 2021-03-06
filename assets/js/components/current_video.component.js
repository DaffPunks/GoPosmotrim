import { el, setStyle } from 'redom';

// define Login component
export default class CurrentVideo {

    constructor () {
        this.el = el('.current',
            el('.current-video-wrap',
                this.image = el('.current-video')
            ),
            this.title = el('.current-video-title'),
            el('.current-btns',
                // el('.current-button.plus'),
                // el('.current-button.skip'),
            ),
        );
    }

    update(image, text) {
        this.image.style.backgroundImage = `url(${ image })`;
        this.title.textContent = text;
    }

}
