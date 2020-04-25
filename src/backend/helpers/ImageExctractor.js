import { Scraper } from "../utilities/Scraper";

export class ImageExctractor {
    constructor() {
        this._width = 250;
        this._height = 250;
        this._mimeAllowed = /png|jpg|jpeg/;
        this._scraper = new Scraper();
    }

    async execute(html, url) {
        this._scraper.setUrl(url);

        const imagesFound = await this._scraper.execute(html);
        
        return await this._validateImages(imagesFound);
    }

    async _validateImages(images) {
        return images.map(image => this._validateImage(image)).filter(e => e);
    }

    _validateImage(result) {
        if (!result) return;

        const {width, height, type, url} = result;

        if (this._imageNotAllowed(type)) return;
        if (this._imageTooSmall(width, height)) return;

        return {
            type,
            url,
        };
    }

    _imageNotAllowed(type) {
        return !this._mimeAllowed.test(type);
    }

    _imageTooSmall(width, height) {
        return (width < this._width) || (height < this._height);
    }
}