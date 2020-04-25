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
        });
    }

    async _onImageDeleted(imageId, imagesLeft) {
        let response = await fetch('/image/' + imageId, {
            method: 'DELETE',
        });

        if (imagesLeft === 0) {
            location.pathname = '/';
        }
    }
}