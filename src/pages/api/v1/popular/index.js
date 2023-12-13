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

        const currentDate = new Date();
        const startOfWeek = new Date(currentDate.getFullYear(), currentDate.getMonth(), currentDate.getDate() - currentDate.getDay());
        const endOfWeek = new Date(startOfWeek);
        endOfWeek.setDate(startOfWeek.getDate() + 6);

        const mangas = await Manga.find({
            date: {
                $gte: startOfWeek,
                $lte: endOfWeek
            }
        }).sort({ views: -1 }).limit(5);

        if (mangas.length === 0) {
            res.status(200).json([]);
            return;
        }

        const token = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjVhMmFmNmU4LTIzYzItNDI1NS1hZWU2LTQyZjJmOGFkNjVkNiIsImlhdCI6MTcwMDc5NTczOSwiZXhwIjoxNzAzNDIzNzM5fQ.XxlDFjKvsKp3Pcp8uabPTivr9oN3-4JveXiFjCOLmGc";

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

            const serverUrl = process.env.NODE_ENV === 'development' ? `http://localhost:${process.env.PORT || 3000}` : `http://${req.headers.host}`;
            const posterId = manga._id;

            try {
                const posterResponse = await fetch(`${serverUrl}/v1/api/poster/${posterId}`, {
                    headers: {
                        'Authorization': `Bearer ${token}`
                    }
                });
            
                if (!posterResponse.ok) {
                    manga.poster = null;
                } else {
                    const posterData = await posterResponse.json();
                    manga.poster = `${serverUrl}/v1/static/poster/${posterId}/${posterData.contents[0]}`;
                }
            } catch (error) {
                console.error('Error in poster fetch:', error);
                manga.poster = null;
            }
            
            try {
                const backgroundResponse = await fetch(`${serverUrl}/v1/api/background/${posterId}`, {
                    headers: {
                        'Authorization': `Bearer ${token}`
                    }
                });
            
                if (!backgroundResponse.ok) {
                    manga.background = null;
                } else {
                    const backgroundData = await backgroundResponse.json();
                    manga.background = `${serverUrl}/v1/static/background/${posterId}/${backgroundData.contents[0]}`;
                }
            } catch (error) {
                console.error('Error in background fetch:', error);
                manga.background = null;
            }
            
            try {
                const logoResponse = await fetch(`${serverUrl}/v1/api/logo/${posterId}`, {
                    headers: {
                        'Authorization': `Bearer ${token}`
                    }
                });
            
                if (!logoResponse.ok) {
                    manga.logo = null;
                } else {
                    const logoData = await logoResponse.json();
                    manga.logo = `${serverUrl}/v1/static/logo/${posterId}/${logoData.contents[0]}`;
                }
            } catch (error) {
                console.error('Error in logo fetch:', error);
                manga.logo = null;
            }
            
            function handleErrorResponse(status, type) {
                if (status === 401) {
                    console.warn(`No token for ${type}`);
                } else if (status === 500 || status === 404) {
                    console.warn(`Invalid data for ${type}`);
                } else {
                    console.error(`Error in ${type} fetch. Status code: ${status}`);
                }
            }

            return {
                _id: manga._id,
                title: manga.title,
                slug: manga.titleslug,
                poster: manga.poster,
                logo: manga.logo,
                background: manga.background,
                overview: manga.overview,
                format: manga.format,
                genres: manga.genres,
                status: manga.status,
                date: manga.date,
                views: manga.views
            };
        });

        const response = await Promise.all(mappedMangas);

        res.status(200).json(response);
    } else {
        res.status(400).json({ error: {} });
    }
}