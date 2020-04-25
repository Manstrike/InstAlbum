import fs from "fs";

export class AlbumMaker {
    constructor(albumGateway) {
        this._albumGateway = albumGateway;
    }

    async createAlbumDir(shortId) {
        const dir = `./public/files/${shortId}`;

        await fs.mkdir(dir, (err) => { if (err) console.log(err) });

        return dir;
    }

    async makeAlbum({albumShortId, name, images}) {
        const albumId = await this._albumGateway.createAlbum({name, shortId: albumShortId});
        
        await this._createImagesAndBindWithAlbum(albumId, images);

        return albumId;
    }

    async _createImagesAndBindWithAlbum(albumId, imagesPaths) {
        if (imagesPaths.length === 0) return;

        for (const path of imagesPaths) {
            const cuttedPath = path.split(/.\/public/).pop();
            const insertedImageId = await this._albumGateway.createImage(cuttedPath);

            await this._albumGateway.bindImageToAlbum(albumId, insertedImageId);
        }
    }
}