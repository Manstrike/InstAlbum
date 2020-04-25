import { AlbumItems } from "./AlbumItems";
import { Button } from "../Abstract/Button";

export class Album {
    constructor({domElement, onImageDelete, onAlbumDelete}) {
        this._album = domElement;
        this._onImageDelete = onImageDelete;
        this._onAlbumDelete = onAlbumDelete;

        this._albumItems = new AlbumItems({
            domElements: this._album.querySelectorAll('.grid__item'),
            onDelete: this._handleAlbumItemDelete.bind(this),
        });

        this._deleteAlbumButton = new Button({
            domElement: this._album.querySelector('#deleteAlbumButton'),
            onClick: this._handleAlbumDelete.bind(this),
        })
    }

    _handleAlbumItemDelete(item) {
        item.remove();
        
        const imageId = item.dataset.id;

        const imagesLeft = this._album.querySelectorAll('.grid__item').length;
        console.log({imagesLeft});
        this._onImageDelete(imageId, imagesLeft);
    }

    _handleAlbumDelete(event) {
        const albumId = event.target.dataset.id;

        this._onAlbumDelete(albumId);
    }
}