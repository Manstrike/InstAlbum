import "core-js/stable";
import "regenerator-runtime/runtime";
import { Album } from "./Components/Album/Album";

window.onload = () => {
    new AlbumView();
};
 
class AlbumView {
    constructor() {
        this._albumEntity = new Album({
            domElement: document.getElementById('albumPreview'),
            onImageDelete: this._onImageDeleted.bind(this),
            onAlbumDelete: this._onAlbumDelete.bind(this),
        });
    }

    async _onImageDeleted(imageId, imagesLeft) {
        const confirmed = confirm('Are you sure want to delete entire album?');

        if (!confirmed) return;
    
        await fetch('/image/' + imageId, {
            method: 'DELETE',
        });

        if (imagesLeft === 0) {
            location.pathname = '/';
        }
    }

    async _onAlbumDelete(albumId) {
        const confirmation = confirm('Are you sure want to delete this album?');

        if (!confirmation) return;

        const response = await fetch('/albums/' + albumId, {
            method: 'DELETE',
        });

        const result = await response.json();
        console.log({result})
        location.pathname = result.ref;
    }
}