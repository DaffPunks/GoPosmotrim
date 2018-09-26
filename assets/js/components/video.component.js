import { el } from 'redom';

// define Login component
export class Login {
    constructor () {
        this.el = el('form#login',
            this.email = el('input.email', { type: 'text' }),
            this.pass = el('input.pass', { type: 'text' }),
            this.submit = el('button', { type: 'submit' },
                'Sign in'
            )
        );
        this.el.onsubmit = e => {
            e.preventDefault();

            console.log({
                email: this.email.value,
                pass: this.pass.value
            });
        }
    }
}
