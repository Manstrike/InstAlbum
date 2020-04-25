export class Button {
    constructor({domElement, onClick}) {
        this._domElement = domElement;
        this._onClick = onClick;

        this._domElement.addEventListener('click', this._handleButtonClick.bind(this));
    }

    _handleButtonClick(event) {
       // event.preventDefault();

        this._onClick(event);
    }
}