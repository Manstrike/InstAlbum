export class TextField {
    constructor({domElement, onBlur}) {
        this._domElement = domElement;
        this._onBlur = onBlur;

        this._domElement.addEventListener('blur', this._handleFieldBlur.bind(this));
    }

    _handleFieldBlur(event) {
        const value = event.target.value;

        this._onBlur({value});
    }

    setValue(value) {
        this._domElement.value = value;
    }

    getValue() {
        return this._domElement.value;
    }
}