import { Button } from "../Abstract/Button";

export class AlbumListItems {
    constructor({domElements, onSelect}) {
        this._domElements = domElements;
        this._onSelect = onSelect;
    }

    _handleAlbumSelection(event) {
        const albumId = event.target.closest('.album-item').dataset.id;

        this._onSelect({albumId});
    }
}