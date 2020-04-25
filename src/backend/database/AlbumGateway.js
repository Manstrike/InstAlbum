export class AlbumGateway {
    constructor({connection}) {
        this._connection = connection;
    }

    async createAlbum({name, shortId}) {
        const createAlbumQuery = `INSERT INTO albums (name, shortId) VALUES ('${name}', '${shortId}')`;
        
        try {
            const [album, ] = await this._connection.execute(createAlbumQuery);

            return album.insertId;
        } catch(e) {
            throw new Error('An error occured while creating album: ' + e);
        }
    }

    async deleteAlbum(albumId) {
        const query = `DELETE FROM albums WHERE id = ${albumId}`;

        try {
            const [deletedAlbum, ] = await this._connection.execute(query);

            return deletedAlbum;
        } catch (e) {
            throw new Error(`An error occured while deleting album(${albumId}): ${e}`);
        }
    }

    async getAlbum(albumId) {
        const query = `SELECT * FROM albums WHERE id = ${albumId}`;

        try {
            const [album, ] = await this._connection.execute(query);

            return album;
        } catch (e) {
            throw new Error(`An error occured while reading album(${albumId}): ${e}`);
        }
    }

    async readAlbumImages(albumId) {
        const query = `SELECT item_id FROM items_to_albums WHERE album_id = ${albumId}`;

        try {
            const [images, ] = await this._connection.execute(query);

            return images;
        } catch (e) {
            throw new Error(`An error occured while reading album(${albumId}) images: ${e}`);

        }
    }

    async bindImageToAlbum(albumId, imageId) {
        const query = `INSERT INTO items_to_albums (album_id, item_id) VALUES (${albumId}, ${imageId})`;

        try {
            await this._connection.execute(query);
        } catch (e) {
            throw new Error('An error occured while binding image to album: ' + e);
        }
    }

    async createImage(pathToImage) {
        const query = `INSERT INTO items (reference) VALUES ('${pathToImage}')`;

        try {
            const [image, ] = await this._connection.execute(query);

            return image.insertId;
        } catch (e) {
            throw new Error('An error occured while creating image: ' + e);
        }
    }

    async deleteImage(imageId) {
        const query = `DELETE FROM items WHERE id = ${imageId}`;

        try {
            const [deletedImage, ] = await this._connection.execute(query);

            return deletedImage;
        } catch (e) {
            throw new Error(`An error occured while deleting image(${imageId}): ${e}`);
        }
    }

    async getImage(imageId) {
        const query = `SELECT * from items WHERE id = ${imageId}`;

        try {
            const [image, ]= await this._connection.execute(query);

            return image;
        } catch (e) {
            throw new Error(`An error occured while getting image(${imageId}): ${e}`);
        }
    }

    async getAlbumList() {
        const query = `SELECT * from albums`;

        try {
            const [albums, ] = await this._connection.execute(query);

            return albums;
        } catch (e) {
            throw new Error('An error occured while getting album list: ' + e);
        }
    }

    async getLastImageInAlbum(albumId) {
        const query = `SELECT * FROM items_to_albums WHERE album_id = ${albumId} ORDER BY id DESC LIMIT 1`;

        try {
            const [item, ] = await this._connection.execute(query);

            if (!item[0]) {
                await this.deleteAlbum(albumId);
                return;
            }

            const image = await this.getImage(item[0].item_id);

            return image[0];
        } catch (e) {
            throw new Error(`An error occured while getting last image from album(${albumId}): ${e}`);
        }
    }
}