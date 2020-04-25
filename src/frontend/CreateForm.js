import "core-js/stable";
import "regenerator-runtime/runtime";
import { CreateAlbumForm } from "./Components/CreateScreen/CreateAlbumForm"

window.onload = () => {
    new CreateForm();
}

class CreateForm {
    constructor() {
        this._createAlbumForm = new CreateAlbumForm({
            form: document.getElementById('createAlbumForm'),
            onSubmit: this._handleSubmit.bind(this),
        });
    }

    async _handleSubmit(data) {
        let response = await fetch('/albums/create', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json;charset=utf-8',
            },
            body: JSON.stringify(data),
        });

        let result = await response.json();
        console.log(result);

        location.pathname = result.ref;
    }
}