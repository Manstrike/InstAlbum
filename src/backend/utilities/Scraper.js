import cheerio from 'cheerio';
import probe from 'probe-image-size';
import url from "url";
import {Readable} from 'stream';

export class Scraper {
    constructor() {
        this._base64Pattern = /;base64,/;
        this._parsedImages = [];
        this._$ = null;
    }

    setUrl(url) {
        this._url = url;
    }

    async execute(html) {
        const $ = cheerio.load(html);
        const images = $('img');
        const imgKeys = Object.keys(images);

        const promises = [];
        for (const key of imgKeys) {
            const src = $(images[key]).attr('src') || $(images[key]).attr('data-src');

            if (!src) continue;

            promises.push(this._exctractImageByUrl(src));
        }
        
        return Promise.all(promises);
    }   

    async _findImages() {
        return this._$('img');
    }

    async _exctractImageByUrl(src) {
        const isSrcBase54 = this._base64Pattern.test(src);

        let imageSource = src;
        if (isSrcBase54) {
            imageSource = await this._base64ToReadable(src);
        } else {
            imageSource = url.resolve(this._url, src);
        }

        return await probe(imageSource).catch(err => {console.log(err)});
    }

    async _base64ToReadable(src) {
        const base64String = this._cleanBase64String(src);

        const bitmap = new Buffer(base64String, 'base64');

        const readable = new Readable();
        readable.push(bitmap);
        readable.push(null);

        return readable;
    }

    _cleanBase64String(string) {
        return string.split(this._base64Pattern).pop();
    }
}