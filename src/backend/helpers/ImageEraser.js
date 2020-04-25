import fs from 'fs';

export class ImageEraser {
    constructor(albumGateway) {
        this._albumGateway = albumGateway;
    }

    async execute(items) {
        for (const {item_id} of items) {
            await this.deleteImageById(item_id);
        }
    }

    async deleteImageById(imageId) {
        const [image] = await this._albumGateway.getImage(imageId);
        
        await fs.unlink(image.reference, (err) => { if (err) console.log(err) });

        try {
            await this._albumGateway.deleteImage(imageId);
        } catch (error) {
            throw new Error('image_cannot_be_deleted');
        }
    }
}