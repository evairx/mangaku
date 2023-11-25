import Connect from "@/db/connect";
import Manga from "@/src/models/Manga";
import Genres from '@/src/models/Genres';
import Format from '@/src/models/Format';
import Status from '@/src/models/Status';

export default async function handler(req, res) {
    const { method } = req;

    if (method === "GET") {
        await Connect();

        const manga = await Manga.findOne();
        
        if (!manga) {
            res.status(400).json('El manga no existe');
            return;
        }

        const formatId = manga.format;
        const format = await Format.findById(formatId);
        manga.format = format ? format.name : null;

        const statusId = manga.status;
        const status = await Status.findById(statusId);
        manga.status = status ? status.name : null;

        const genresIds = manga.genres;
        const genres = await Genres.find({ _id: { $in: genresIds } });
        manga.genres = genres.map(genre => genre.name);

        const serverUrl = process.env.NODE_ENV === 'development'
            ? `http://localhost:${process.env.PORT || 3000}`
            :
        `${req.connection.encrypted ? 'https' : 'http'}://${req.headers.host}`;

        const posterId = manga._id; 
        const posterResponse = await fetch(`${serverUrl}/cdn/poster/${posterId}`);
        const posterData = await posterResponse.json();

        manga.poster = posterData.contents[0];

        const response = {
            _id: manga._id,
            title: manga.title,
            poster: manga.poster,
            overview: manga.overview,
            format: manga.format,
            genres: manga.genres,
            status: manga.status,
            date: manga.date
        };

        res.status(200).json([response]);
    } else {
        res.status(400).json({error: {}});
    }
}