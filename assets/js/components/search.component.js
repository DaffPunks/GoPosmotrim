import { el } from 'redom';

// define Login component
export default class SearchDOM {
    constructor () {

        // Initialize objects
        this.el = el('form.header-search',
            this.search = el('input.header-input', { type: 'text', placeholder: 'Search for a video...' }),
        );

    }

    onSubmit(callback) {
        // Add event listener
        this.el.onsubmit = e => {
            e.preventDefault();

            callback(this.search.value);

            this.search.value = '';
        }
    }
}
