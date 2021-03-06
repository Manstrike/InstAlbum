import "core-js/stable";
import "regenerator-runtime/runtime";
import { CreateAlbumForm } from "./Components/CreateScreen/CreateAlbumForm"

window.onload = () => {
    new CreateForm();
}

class CreateForm {
    constructor() {
        this._form = document.getElementById('createAlbumForm');
        this._createAlbumForm = new CreateAlbumForm({
            form: this._form,
            onSubmit: this._handleSubmit.bind(this),
        });

        this._loadSpinner = document.getElementById('loadSpinner');
    }

    async _handleSubmit(data) {
        this._form.style.opacity = '0.5';
        this._loadSpinner.style.display = 'block';

        const response = await fetch('/albums/create', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json;charset=utf-8',
            },
            body: JSON.stringify(data),
        });
        
        const result = await response.json();

        if (result.error) {
            this._form.style.opacity = '1';
            this._loadSpinner.style.display = 'none';

            alert('No images found or bad url!');

            this._createAlbumForm.toggleSubmitButton();

            return;
        }

        location.pathname = result.ref;
    }
}