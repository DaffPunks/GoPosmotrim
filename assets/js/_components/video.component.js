import { el } from 'redom';

// define Login component
export default class Login {
    constructor() {
        this.el = el('.video',
            el('.video-wrap',
                el('#player')
            ),
            this.title = el('.video-title'),
            el('.video-sub',
                this.channel = el('.video-author'),
                this.views = el('.video-views')
            )
        );
    }

    update(title, channel, views) {
        this.title.textContent = title;
        this.channel.textContent = channel;
        this.views.textContent = views;
    }
}
