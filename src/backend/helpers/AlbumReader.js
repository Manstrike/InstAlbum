import { ArraySplitter } from "../utilities/ArraySplitter";

export class AlbumReader {
    constructor(albumGateway) {
        this._albumGateway = albumGateway;
    }

    async execute(albumId) {
        const [album] = await this._albumGateway.getAlbum(albumId);

        if (!album) throw new Error('no_album_found');

        const albumItems = await this._albumGateway.readAlbumImages(albumId);

        if (albumItems.length === 0) throw new Error('album_is_empty');

        const albumImages = await this._collectImagesProps(albumItems);
        const columns = ArraySplitter.split(albumImages, 4);

        return {
            albumId,
            albumName: album.name,
            columns: [...columns],
        };
    }

    async _collectImagesProps(albumItems) {
        const albumImages = [];
        for (const {item_id} of albumItems) {
            const [image] = await this._albumGateway.getImage(item_id);

            albumImages.push({
                id: image.id,
                src: image.reference,
            });
        }

        return albumImages;
    }
}