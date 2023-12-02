import Connect from "@/db/connect";
import Genres from "@/models/Genres";
import Manga from "@/models/Manga";
import jwt from "jsonwebtoken"

export default async function handler(req, res) {
    const { method, query: { id, page = 1 } } = req;
    const itemsPerPage = 10;

    if (method === "GET") {
        await Connect();

        const genres = await Genres.findById(id);

        if (!genres) {
            return res.status(401).json({ error: "no exist genre" });
        }

        try {
            const totalMangas = await Manga.countDocuments({ genres: { $in: id } });
            const totalPages = Math.ceil(totalMangas / itemsPerPage);

            const skipItems = (page - 1) * itemsPerPage;
            const mangas = await Manga.find({ genres: { $in: id } })
                .skip(skipItems)
                .limit(itemsPerPage);

            if (mangas.length === 0) {
                return res.status(200).json({
                    page: parseInt(page),
                    totalPages,
                    genre: genres.name,
                    content: [],
                });
            }

            const mappedMangas = await Promise.all(mangas.map(async (manga) => {
                const serverUrl = process.env.NODE_ENV === 'development' ? `http://localhost:${process.env.PORT || 3000}` : `http://${req.headers.host}`;
                const posterId = manga._id;

                try {
                    const posterResponse = await fetch(`${serverUrl}/v1/api/poster/${posterId}`, {
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
                        manga.poster = `${serverUrl}/v1/static/poster/${posterId}/${posterData.contents[0]}`;
                    }
                } catch (error) {
                    console.error('Error en la solicitud fetch:', error);
                    manga.poster = null;
                }

                return {
                    _id: manga._id,
                    title: manga.title,
                    poster: manga.poster,
                };
            }));

            return res.status(200).json({
                page: parseInt(page),
                totalPages,
                genre: genres.name,
                content: mappedMangas,
            });
        } catch (error) {
            console.error('Error al procesar la solicitud:', error);
            return res.status(500).json({ error: 'Internal Server Error' });
        }
    } else {
        return res.status(400).json({ error: {} });
    }
}