import mongoose from 'mongoose';
import '../models/films';

import config from '../../etc/config.json';

const Film = mongoose.model('Film');

export function setUpConnection() {
    mongoose.connect(`mongodb://${config.db.host}:${config.db.port}/${config.db.name}`, { useNewUrlParser: true, useUnifiedTopology: true });
}

export function listFilms() {
    return Film.find();
}

export function filmById(id) {
    return Film.findById(id);
} 

export function createFilm(data){
    console.log('in createfilm: ' + data.stars)
    const film = new Film({
        id: data.id,
        title: data.title,
        year: data.year,
        format: data.format,
        stars: data.stars,
        createdAt: new Date(),
    });

    return film.save();
}

export function deleteFilm(id) {
    return Film.findById(id).remove();
}