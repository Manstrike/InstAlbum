import { Button } from "../Abstract/Button";

export class AlbumItems {
    constructor({domElements, onDelete}) {

        this._domElements = domElements;
        this._onDelete = onDelete;

        this._deleteButtons = [];

        for (const item of this._domElements) {
            const deleteButton = new Button({
                domElement: item.querySelector('.delete-button'),
                onClick: this._handleItemDelete.bind(this),
            });
            this._deleteButtons.push(deleteButton);
        }
    }

    _handleItemDelete(event) {
        const item = event.target.closest('.grid__item');

        this._onDelete(item);
    }
}   