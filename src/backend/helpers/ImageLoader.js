import shortid from "shortid";
import request from "request";
import fs from 'fs';

export class ImageLoader {
    async execute({imagesProps, path}) {
        const promises = [];
        const imagesPaths = [];
        for (const {url, type} of imagesProps) {
            if (!url) continue;
            
            const pathToImage = this._generatePathToImage(path, type);
            imagesPaths.push(pathToImage);
            promises.push(this._downloadImage(url, pathToImage));
        }

        await Promise.all(promises);

        return imagesPaths;
    }

    _generatePathToImage(path, type) {
        const imageShortId = shortid.generate();

        return path + '/' + imageShortId + '.' + type;
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
            console.log(error);
        }
    }
}