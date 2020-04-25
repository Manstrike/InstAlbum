import request from 'request-promise-native';
import cheerio from 'cheerio';
import probe from 'probe-image-size';
import url from "url";
import {Readable} from 'stream';

export class Scraper {
    constructor({url}) {
        this._url = url;

        this._width = 250;
        this._height = 240;
        this._mimeAllowed = /png|jpg|jpeg/;
        this._base64Pattern = /;base64,/;

        this._parsedImages = [];
    }

    async load() {
        const html = await this._loadPage(this._url);

        const images = await this._exctractImages(html);    
        return images.map(image => this._validateImage(image));
    }

    async _loadPage(url) {
        return await request(url);
    }

    async _exctractImages(body) {
        console.time('cheerio loaded');
        const $ = cheerio.load(body);
        const images = $('img');
        console.timeEnd('cheerio loaded');

        const imgKeys = Object.keys(images);

        const promises = [];
        for (const key of imgKeys) {
            const src = $(images[key]).attr('src') || $(images[key]).attr('data-src');

            if (!src) continue;

            promises.push(this._exctractImageByUrl(src));
        }
        console.time('image parsed');
        const parsedImages = Promise.all(promises);
        console.timeEnd('image parsed');
        

        return parsedImages;
    }   

    async _exctractImageByUrl(src) {
        const isSrcBase54 = this._base64Pattern.test(src);

        let imageUrl = src;
        if (isSrcBase54) {
            imageUrl = await this._exctractBase64(src);
        } else {
            imageUrl = url.resolve(this._url, src);
        }

        return await probe(imageUrl).catch(err => {console.log(err)});
    }

    async _exctractBase64(src) {
        const base64String = src.split(this._base64Pattern).pop();

        const bitmap = new Buffer(base64String, 'base64');

        const readable = new Readable();
        readable.push(bitmap);
        readable.push(null);

        return readable;
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