import shortid from "shortid";
import { PageLoader } from "../helpers/PageLoader";
import { ImageExctractor } from "../helpers/ImageExctractor";
import { ImageLoader } from "../helpers/ImageLoader";
import { AlbumMaker } from '../helpers/AlbumMaker';

export class CreateAlbum {
    constructor(albumGateway, {name, url}) {
        this._name = name;
        this._url = url;

        this._pageLoader = new PageLoader();
        this._imageExctractor = new ImageExctractor();
        this._imageLoader = new ImageLoader();
        this._albumMaker = new AlbumMaker(albumGateway);
    }

    async execute() {
        const html = await this._pageLoader.execute(this._url);
        
        const scrapedImages = await this._imageExctractor.execute(html, this._url);

        if (scrapedImages.length === 0) throw new Error('no_images_found');
        
        const albumShortId = shortid.generate();
        const pathToAlbum = await this._albumMaker.createAlbumDir(albumShortId);

        const images = await this._imageLoader.execute({
            imagesProps: scrapedImages,
            path: pathToAlbum,
        });

        if (images.length === 0) throw new Error('something_went_wrong');

        const albumId = await this._albumMaker.makeAlbum({name: this._name,albumShortId, images});        

        return albumId;
    }
}