import { TextField } from "../Abstract/TextField";
import { Button } from "../Abstract/Button";

export class CreateAlbumForm {
    constructor({form, onSubmit}) {
        this._form = form;
        this._onSubmit = onSubmit;

        this._albumNameField = new TextField({
            domElement: this._form.querySelector('#albumName'),
            onBlur: this._handleAlbumNameInserted.bind(this),
        });

        this._sourceUrlField = new TextField({
            domElement: this._form.querySelector('#url'),
            onBlur: this._handleSourceUrlInserted.bind(this),
        });

        this._submitButton = new Button({
            domElement: this._form.querySelector('#createButton'),
            onClick: this._handleSubmitButtonClicked.bind(this),
        });

        this._albumName = null;
        this._albumUrl = null;
    }

    _handleAlbumNameInserted({value}) {
        this._albumName = value;
    }

    _handleSourceUrlInserted({value}){
        this._albumUrl = value;
    }

    _handleSubmitButtonClicked() {
        if (!this._albumUrl || !this._albumName) return;

        this._submitButton.off();

        this._onSubmit({
            name: this._albumName,
            url: this._albumUrl
        });
    }

    toggleSubmitButton() {
        this._submitButton.on();
    }
}