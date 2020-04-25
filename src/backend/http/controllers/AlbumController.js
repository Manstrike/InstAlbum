import { Scraper } from "../../utilities/Scraper";
import { DBConnection } from "../../database/DBConnection";
import { AlbumGateway } from "../../database/AlbumGateway";
import  request  from "request";
import fs from "fs";
import shortid from 'shortid';

export class AlbumController {
    constructor() {
        this._connection = new DBConnection();
        this._albumGateway = new AlbumGateway({connection: this._connection});
    }

    async createNewAlbum(request, response) {
 
        if (!request.body){ 
            response.sendStatus(400);
            
            return;
        };
        console.time('MAIN');
        
        const {name, url} = request.body;
        const albumShortId = shortid.generate();
        
        console.time('scraper');
        const imagesFound = await this._findImagesOnPage(url);
        console.timeEnd('scraper');

        if (imagesFound.length === 0) return;

        const pathToAlbum = await this._createAlbumDir(albumShortId);

        console.time('save images');
        const savedImagesPaths = await this._saveFoundImages(imagesFound, pathToAlbum);
        console.timeEnd('save images');

        const createdAlbumId = await this._createAlbum(name, albumShortId);
        await this._createImagesAndBindWithAlbum(createdAlbumId, savedImagesPaths);

        /*const responseData = await this._collectAlbumData(createdAlbumId);
        
        response.render("albumView/albumView.ejs", responseData);*/

        console.timeEnd('MAIN');
        response.json({ref: '/albums/' + createdAlbumId});
    }

    async _findImagesOnPage(url) {
        const scraper = new Scraper({url});

        return await scraper.load();
    }

    async _saveFoundImages(scrapedImages, pathToAlbum) {
        const promises = [];
        const imagePaths = [];
        for (const image of scrapedImages) {
            if (!image) continue;

            const pathToImage = this._generatePathToImage(pathToAlbum, image.type);
            imagePaths.push(pathToImage);
            promises.push(this._downloadImage(image, pathToImage));
        }
        console.time('image download');
        await Promise.all(promises);
        console.timeEnd('image download');

        return imagePaths;
    }

    async _createAlbum(name, albumShortId) {
        return await this._albumGateway.createAlbum({name, shortId: albumShortId});
    }

    async _createImagesAndBindWithAlbum(albumId, imagesPaths) {
        if (imagesPaths.length === 0) return;

        for (const path of imagesPaths) {
            const cuttedPath = path.split(/.\/public/).pop();
            const insertedImageId = await this._albumGateway.createImage(cuttedPath);

            await this._albumGateway.bindImageToAlbum(albumId, insertedImageId);
        }
    }

    async _createAlbumDir(shortId) {
        const dir = `./public/files/${shortId}`;

        await fs.mkdir(dir, (err) => { if (err) console.log(err) });

        return dir;
    }

    _generatePathToImage(pathToAlbum, type) {
        const imageShortId = shortid.generate();

        return pathToAlbum + '/' + imageShortId + '.' + type;
    }

    async _downloadImage(url, pathToImage) {
        let image = fs.createWriteStream(pathToImage);

        try {
            await new Promise((resolve, reject) => {
                request(url)
                    .pipe(image)
                    .on('finish', () => resolve())
                    .on('error', (error) => reject(error));
            });
        } catch (error) {
            console.log(error)
        }
    }

    async viewAlbum(request, response) {
        if (!request.params.albumId) {
            response.sendStatus(400)
            
            return;
        };

        const albumId = request.params.albumId;

        const responseData = await this._collectAlbumData(albumId);

        response.render('./albumView/index.ejs', responseData);
    }

    async _collectAlbumData(albumId) {
        const [album] = await this._albumGateway.getAlbum(albumId);
        const albumItems = await this._albumGateway.readAlbumImages(albumId);

        const albumImages = [];
        for (const {item_id} of albumItems) {
            const [image] = await this._albumGateway.getImage(item_id);

            albumImages.push({
                id: image.id,
                src: image.reference,
            });
        }

        const size = Math.ceil(albumImages.length / 4); 
        const arrayOfArrays = [];
        for (let i = 0; i < albumImages.length; i += size) {
            arrayOfArrays.push(albumImages.slice(i, i + size));
        }

        return {
            albumName: album.name,
            columns: [...arrayOfArrays],
        };
    }

    async deleteAlbum(request, response) {
        if (!request.params.albumId) {
            response.sendStatus(400);
        
            return;
        }

        const albumId = request.params.albumId;
        const [album] = await this._albumGateway.getAlbum(albumId);

        await this._deleteAlbumImages(albumId);
        await this._albumGateway.deleteAlbum(albumId);
        await this._deleteAlbumDirectory(album.shortId);

        response.sendStatus(200);
    }

    async deleteImage(request, response) {
        if (!request.params.imageId) {
            response.sendStatus(400);
            
            return;
        };
        
        const imageId = request.params.imageId;

        await this._deleteImageById(imageId);

        response.sendStatus(200);
    }

    async _deleteAlbumDirectory(shortId) {
        const pathToAlbum = './public/files/' + shortId;

        await fs.rmdir(pathToAlbum, (err) =>{ if (err) console.log(err) });
    }

    async _deleteAlbumImages(albumId) {
        const albumItems = await this._albumGateway.readAlbumImages(albumId);

        for (const {item_id} of albumItems) {
            await this._deleteImageById(item_id);
        }
    }

    async _deleteImageById(imageId) {
        const [image] = await this._albumGateway.getImage(imageId);

        await fs.unlink(image.reference, (err) => { if (err) console.log(err) });
        await this._albumGateway.deleteImage(imageId);
    }

    async albumList(request, response) {
        const albumList = await this._albumGateway.getAlbumList();

        if (albumList.length === 0) {
            response.render('./createForm/index.ejs');
            return;
        }

        const result = [];
        for (const album of albumList) {
            const item = await this._createAlbumItem(album);

            if (!item) continue;

            result.push(item);
        }

        const size = Math.ceil(result.length / 4); 
        const arrayOfArrays = [];
        for (let i = 0; i < result.length; i += size) {
            arrayOfArrays.push(result.slice(i,i+size));
        }

        response.render('./albumList/index.ejs', { columns: arrayOfArrays });
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

    async getCreateAlbumForm(request, response) {
        response.render('./createForm/index.ejs');
    }
}

