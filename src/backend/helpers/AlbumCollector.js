import { ArraySplitter } from "../utilities/ArraySplitter";

export class AlbumCollector {
    constructor(albumGateway) {
        this._albumGateway = albumGateway;
    }

    async execute() {
        const albumList = await this._albumGateway.getAlbumList();

        if (albumList.length === 0) throw new Error('no_albums_found');

        const albumsFound = [];
        for (const album of albumList) {
            const item = await this._createAlbumItem(album);

            if (!item) continue;

            albumsFound.push(item);
        }
        
        return ArraySplitter.split(albumsFound, 4);
    }

    async _createAlbumItem({id, name}) {
        const lastImageInAlbum = await this._albumGateway.getLastImageInAlbum(id);

        if (!lastImageInAlbum) return;

        return {
            id,
            name,
            src: lastImageInAlbum.reference,
        };
    }
}