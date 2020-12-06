import express from 'express';
import multer from 'multer';
import bodyParser from 'body-parser';

import { serverPort } from '../etc/config.json';

import * as db from './utils/DataBaseUtils';
import { getArrFromFile } from './utils/filmsFormatter';

db.setUpConnection();

const app = express();

app.use( bodyParser.json() );
app.use(express.static('uploads'));
app.use(multer({dest:"uploads"}).single("filedata"));



app.options('*', (req, res) => {
    res.set('Access-Control-Allow-Origin', '*');
    res.set('Access-Control-Allow-Methods', 'GET, POST, DELETE, OPTIONS');
    res.set("Access-Control-Allow-Headers", "Content-Type");
    res.send('ok');
  });

app.get('/films/', async (req, res) => {
    const {page = 1, limit = 10} = req.query;
    db.listFilms(page, limit).then(data => {
        res.set('Access-Control-Allow-Origin', '*');
        res.set('Access-Control-Allow-Methods', 'GET, OPTIONS')
        res.set('Access-Control-Allow-Headers', 'Content-Type')
        res.send(data);
    })
});

app.get('/about/:id', (req, res) => {
    db.filmById(req.params.id).then(data => {
        res.set('Access-Control-Allow-Origin', '*');
        res.set('Access-Control-Allow-Methods', 'GET, OPTIONS')
        res.set('Access-Control-Allow-Headers', 'Content-Type')
        res.send(data);
    })
});

app.get('/films/search', (req, res) => {
    const {page = 1, limit = 10, title, star} = req.query;
    db.searchFilms(req.query).then(data => {
        res.set('Access-Control-Allow-Origin', '*');
        res.set('Access-Control-Allow-Methods', 'GET, OPTIONS')
        res.set('Access-Control-Allow-Headers', 'Content-Type')
        res.send(data);
    })
});


app.post('/films', async (req, res) => {
    let isFilmNew = await db.isNew(req.body);
    if (!isFilmNew){
        res.set('Access-Control-Allow-Origin', '*')
        res.set('Access-Control-Allow-Methods', 'POST, OPTIONS')
        res.set('Access-Control-Allow-Headers', 'Content-Type')
        res.statusMessage = "This movie already exists!";
        res.status(400).end();
    } else {
        db.createFilm(req.body).then(data => {
            res.set('Access-Control-Allow-Origin', '*')
            res.set('Access-Control-Allow-Methods', 'POST, OPTIONS')
            res.set('Access-Control-Allow-Headers', 'Content-Type')
            return res.status(201).json(data);
        });
    }
    
});

app.post('/file', async (req, res) => {
    let filedata = req.file;
    if(!filedata){
        res.set('Access-Control-Allow-Origin', '*')
        res.set('Access-Control-Allow-Methods', 'POST, OPTIONS')
        res.set('Access-Control-Allow-Headers', 'Content-Type')
        res.statusMessage = "Bad file!";
        res.status(400).end();
    } else {
        let films = getArrFromFile(filedata);
        films.forEach(async film => {
            let isFilmNew = await db.isNew(film);
            if (isFilmNew){
                db.createFilm(film);
        }})
        res.set('Access-Control-Allow-Origin', '*')
        res.set('Access-Control-Allow-Methods', 'POST, OPTIONS')
        res.set('Access-Control-Allow-Headers', 'Content-Type')
        console.log(films);
        return res.status(201).send(films);
    }
    
    
});


app.delete('/films/:id', (req, res) => {
    db.deleteFilm(req.params.id).then(data => {
        res.set('Access-Control-Allow-Origin', '*');
        res.set('Access-Control-Allow-Methods', 'DELETE');
        res.set('Access-Control-Allow-Headers', 'Content-Type');
        res.send(data);
    });
});

const server = app.listen(serverPort, () => {
    console.log(`Server is up on port ${serverPort}`);
});

