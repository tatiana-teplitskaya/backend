import mongoose from 'mongoose';
import '../models/films';

import config from '../../etc/config.json';

const Film = mongoose.model('Film');

export function setUpConnection() {
    mongoose.connect(`mongodb://${config.db.host}:${config.db.port}/${config.db.name}`, { useNewUrlParser: true, useUnifiedTopology: true });
}

export async function listFilms(page, limit) {
    return {totalCount: await Film.find().countDocuments(),
            films: await Film.find().limit(limit * 1).skip((page - 1) * limit)}
}

export function filmById(id) {
    return Film.findById(id);
} 

export function createFilm(data){
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

export async function searchFilms({title, star, page = 1, limit = 10 }){
    const titleSearch = new RegExp(`.*${title}.*`);
    const starSearch = new RegExp(`.*${star}.*`)
    let data = await Film.find({title: titleSearch, stars: starSearch}).limit(limit * 1).skip((page - 1) * limit);
        // data = data.filter(film => {
        //         return film.title.includes(title) && !!film.stars.find(item => item.includes(star));
        // });
        return {films: data,
                totalCount: await Film.find({title: titleSearch, stars: starSearch}).countDocuments()}
        
    }
    

export async function isNew(newFilm) {
    const films = await Film.find();
    let isFilmNew = true;

    const isSame = (arr1, arr2) => {

        return !(arr1.sort() > arr2.sort() || arr1.sort() < arr2.sort());
        
    }

    films.forEach(film => {
        if(film.title === newFilm.title &&
            film.year == newFilm.year &&
            film.format === newFilm.format &&
            isSame(film.stars, newFilm.stars)) {
                isFilmNew = false;
            }
    })
    return isFilmNew;
}