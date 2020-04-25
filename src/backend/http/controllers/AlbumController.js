import { DBConnection } from "../../database/DBConnection";
import { AlbumGateway } from "../../database/AlbumGateway";
import { CreateAlbum } from "../../actions/CreateAlbum";
import { AlbumReader } from "../../helpers/AlbumReader";
import { AlbumCollector } from "../../helpers/AlbumCollector";
import { AlbumEraser } from "../../helpers/AlbumEraser";
import { ImageEraser } from "../../helpers/ImageEraser";

export class AlbumController {
    constructor() {
        this._connection = new DBConnection();
        this._albumGateway = new AlbumGateway({connection: this._connection});
    }

    async createNewAlbum(request, response) {
        if (!request.body){ 
            response.status(422).send({error: {code: 'request_is_empty'}});
            
            return;
        };
        
        const {name, url} = request.body;
        console.log({name, url});
        const createAlbum = new CreateAlbum(this._albumGateway, {name, url});

        let newAlbumId;
        try {
            newAlbumId = await createAlbum.execute();
        } catch(error) {
            response.status(404).send({error: {code: error.message}});

            return;
        }

        response.json({ref: '/albums/' + newAlbumId});
    }

    async viewAlbum(request, response) {
        if (!request.params.albumId) {
            response.status(422).send({error: {code: 'request_is_empty'}});
            
            return;
        };

        const albumId = request.params.albumId;

        const albumReader = new AlbumReader(this._albumGateway);

        let responseData;
        try {
            responseData = await albumReader.execute(albumId);
        } catch (error) {
            response.status(404).send({error: {code: error.message}});

            return;
        }

        response.render('./albumView/index.ejs', responseData);
    }

    async deleteAlbum(request, response) {
        if (!request.params.albumId) {
            response.status(422).send({error: {code: 'request_is_empty'}});
        
            return;
        }

        const albumId = request.params.albumId;
        console.log({albumId});
        const albumEraser = new AlbumEraser(this._albumGateway);

        try {
            await albumEraser.execute(albumId);
        } catch (error) {
            response.status(400).send({error: {code: error.message}});

            return;
        }
        console.log('done');
        response.json({ref: '/albums'});
    }

    async deleteImage(request, response) {
        if (!request.params.imageId) {
            response.status(422).send({error: {code: 'request_is_empty'}});;
            
            return;
        };
        
        const imageId = request.params.imageId;

        const imageEraser = new ImageEraser(this._albumGateway);
        try {
            await imageEraser.deleteImageById(imageId);
        } catch (error) {
            response.status(422).send({error: {code: error.message}});

            return;
        }

        response.sendStatus(200);
    }

    async albumList(request, response) {
        const albumCollector = new AlbumCollector(this._albumGateway);

        let columns;
        try {
            columns = await albumCollector.execute();
        } catch (error) {
            if (error.message === 'no_albums_found') {
                response.render('./createForm/index.ejs');

                return;
            }

            response.status(404).send({error: {code: error.message}});

            return;
        } 

        response.render('./albumList/index.ejs', { columns });
    }

    async getCreateAlbumForm(request, response) {
        response.render('./createForm/index.ejs');
    }
}

