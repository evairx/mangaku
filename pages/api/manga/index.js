import Connect from "@/db/connect";
import Manga from "@/src/models/Manga";
import Genres from '@/src/models/Genres';
import Format from '@/src/models/Format';
import Status from '@/src/models/Status';

export default async function handler(req, res) {
    const { method } = req;

    if (method === "GET") {
        await Connect();

        const mangas = await Manga.find();
        
        if (mangas.length === 0) {
            res.status(200).json([]); 
            return;
        }

        const mappedMangas = mangas.map(async (manga) => {
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

            try {
                const posterResponse = await fetch(`${serverUrl}/cdn/api/poster/${posterId}`, {
                    headers: {
                        'Authorization': `Bearer ${process.env.TOKEN_APP}`
                    }
                });

                if (!posterResponse.ok) {
                    if (posterResponse.status === 401) {
                        manga.poster = 'no token';
                    } else if (posterResponse.status === 500) {
                        manga.poster = null;
                    } else {
                        console.error(`Error en la solicitud fetch. Código de estado: ${posterResponse.status}`);
                        manga.poster = null;
                    }
                } else {
                    const posterData = await posterResponse.json();
                    manga.poster = `${serverUrl}/cdn/poster/${posterId}/${posterData.contents[0]}`;
                }
            } catch (error) {
                console.error('Error en la solicitud fetch:', error);
                manga.poster = null;
            }

            return {
                _id: manga._id,
                title: manga.title,
                poster: manga.poster,
                overview: manga.overview,
                format: manga.format,
                genres: manga.genres,
                status: manga.status,
                date: manga.date
            };
        });

        const response = await Promise.all(mappedMangas);

        res.status(200).json(response);
    } else {
        res.status(400).json({ error: {} });
    }
}