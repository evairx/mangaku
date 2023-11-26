import Connect from "@/db/connect";
import Manga from "@/models/Manga";
import Genres from '@/models/Genres';
import Format from '@/models/Format';
import Status from '@/models/Status';
import jwt from "jsonwebtoken"

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

            const serverUrl = process.env.NODE_ENV === 'development' ? `http://localhost:${process.env.PORT || 3000}` : `https://${req.headers.host}`;

            const expireDate = Math.floor(Date.now() / 1000) + 20;

            const tokenImg = jwt.sign({ exp: expireDate }, process.env.SECRET);

            const posterId = manga._id;

            try {
                const posterResponse = await fetch(`${serverUrl}/static/api/poster/${posterId}`, {
                    headers: {
                        'Authorization': 'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjVhMmFmNmU4LTIzYzItNDI1NS1hZWU2LTQyZjJmOGFkNjVkNiIsImlhdCI6MTcwMDc5NTczOSwiZXhwIjoxNzAzNDIzNzM5fQ.XxlDFjKvsKp3Pcp8uabPTivr9oN3-4JveXiFjCOLmGc'
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
                    manga.poster = `${serverUrl}/static/bucket/poster/${posterId}/${posterData.contents[0]}?a=${tokenImg}`;
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