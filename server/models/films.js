import mongoose from 'mongoose';

const Schema = mongoose.Schema;

const FilmSchema = new Schema({
    id: { type: String },
    title: { type: String },
    year: { type: Number },
    format: { type: String },
    stars: { type: Array },
    createdAt: { type: Date }
});

const Film = mongoose.model('Film', FilmSchema);

