import { el } from 'redom';

// define Login component
export default class SearchDOM {
    constructor () {

        // Initialize objects
        this.el = el('.search',
            this.form = el('form.search-form',
                this.input = el('input.search-input', { type: 'text', placeholder: 'Search for a video...' }),
            )
        );

    }

    onSubmit(callback) {
        // Add event listener
        this.form.onsubmit = e => {
            e.preventDefault();

            callback(this.input.value);

            this.input.value = '';
        }
    }
}
