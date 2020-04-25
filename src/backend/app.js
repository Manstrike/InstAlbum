import express from 'express';
import bodyParser from 'body-parser';
import { AlbumController } from './http/controllers/AlbumController';
import dotenv from 'dotenv';
dotenv.config();


const app = express();
const port = process.env.PORT || 3000;

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(express.static('public'));

app.set('view engine', 'ejs');

const albumController = new AlbumController();

/*app.get('/', function (req, res) {
    res.render('index');
});*/

app.route('/')
    .get(albumController.albumList.bind(albumController));

app.route('/albums')
    .get(albumController.albumList.bind(albumController));

app.route('/albums/:albumId')
    .get(albumController.viewAlbum.bind(albumController))
    .delete(albumController.deleteAlbum.bind(albumController));

app.route('/albums/create')
    .post(albumController.createNewAlbum.bind(albumController));

app.get('/createForm', albumController.getCreateAlbumForm.bind(albumController));

app.route('/image/:imageId')
    .delete(albumController.deleteImage.bind(albumController));

app.listen(port);
