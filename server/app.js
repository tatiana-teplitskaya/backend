import express from 'express';
import bodyParser from 'body-parser';

import { serverPort } from '../etc/config.json';

import * as db from './utils/DataBaseUtils';

db.setUpConnection();

const app = express();

app.use( bodyParser.json() );

app.options('*', (req, res) => {
    res.set('Access-Control-Allow-Origin', '*');
    res.set('Access-Control-Allow-Methods', 'GET, POST, DELETE, OPTIONS');
    res.set("Access-Control-Allow-Headers", "Content-Type");
    res.send('ok');
  });

app.get('/films/', (req, res) => {
    db.listFilms().then(data => {
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
    const title = req.query.title;
    const star = req.query.star;
    db.listFilms().then(data => {
        data = data.filter(film => {
            return film.title.includes(title) && !!film.stars.find(item => item.includes(star));
        });
        res.set('Access-Control-Allow-Origin', '*');
        res.set('Access-Control-Allow-Methods', 'GET, OPTIONS')
        res.set('Access-Control-Allow-Headers', 'Content-Type')
        res.send(data);
    })
});


app.post('/films', (req, res) => {
    db.createFilm(req.body).then(data => {
        res.set('Access-Control-Allow-Origin', '*')
        res.set('Access-Control-Allow-Methods', 'POST, OPTIONS')
        res.set('Access-Control-Allow-Headers', 'Content-Type')
        return res.status(201).json(data);
    });
});

app.delete('/films/:id', (req, res) => {
    db.deleteFilm(req.params.id).then(data => {
        res.set('Access-Control-Allow-Origin', '*');
        res.set('Access-Control-Allow-Methods', 'DELETE');
        res.set('Access-Control-Allow-Headers', 'Content-Type');
        res.send(data);
    });
});

const server = app.listen(serverPort, ()=> {
    console.log(`Server is up on port ${serverPort}`);
});