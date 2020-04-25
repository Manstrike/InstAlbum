import { AlbumItems } from "./AlbumItems";

export class Album {
    constructor({domElement, onImageDelete}) {
        this._album = domElement;
        this._onImageDelete = onImageDelete;

        this._albumItems = new AlbumItems({
            domElements: this._album.querySelectorAll('.grid__item'),
            onDelete: this._handleAlbumItemDelete.bind(this),
        });

    }

    _handleAlbumItemDelete(item) {
        item.remove();
        
        const imageId = item.dataset.id;

        const imagesLeft = this._albumItems._itemsLeft();

        this._onImageDelete(imageId, imagesLeft);
    }
}