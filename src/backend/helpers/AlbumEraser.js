import fs from 'fs';
import { ImageEraser } from "./ImageEraser";

export class AlbumEraser {
    constructor(albumGateway) {
        this._albumGateway = albumGateway;
        this._imageEraser = new ImageEraser(albumGateway);
    }

    async execute(albumId) {
        const [album] = await this._albumGateway.getAlbum(albumId);
        console.log({albumId});
        if (!album) throw new Error('no_album_found');

        await this._deleteAlbumImages(albumId);
        await this._albumGateway.deleteAlbum(albumId);
        await this._deleteAlbumDirectory(album.shortId);
    }

    async _deleteAlbumImages(albumId) {
        const imagesIds = await this._albumGateway.readAlbumImages(albumId);

        await this._imageEraser.execute(imagesIds);
    }

    async _deleteAlbumDirectory(shortId) {
        const pathToAlbum = './public/files/' + shortId;

        await fs.rmdir(pathToAlbum, (err) =>{ if (err) console.log(err) });
    }

}