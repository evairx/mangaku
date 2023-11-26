import Connect from "@/db/connect";
import Genres from "@/models/Genres";
import Manga from "@/models/Manga";
import Format from '@/models/Format';
import Status from '@/models/Status';
import jwt from "jsonwebtoken"

export default async function handler(req, res) {
    const { method, query: { id, page = 1 } } = req;
    const itemsPerPage = 1; // Define el número de elementos por página

    if (method === "GET") {
        await Connect();

        const genres = await Genres.findById(id);

        if (!genres) {
            return res.status(401).json({ error: "no exist genre" });
        }

        try {
            const totalMangas = await Manga.countDocuments({ genres: { $in: id } });
            const totalPages = Math.ceil(totalMangas / itemsPerPage);

            if (page < 1 || page > totalPages) {
                return res.redirect(`/api/genre/${id}?page=${totalPages}`);
            }

            const skipItems = (page - 1) * itemsPerPage;
            const mangas = await Manga.find({ genres: { $in: id } })
                .skip(skipItems)
                .limit(itemsPerPage);

            if (mangas.length === 0) {
                return res.status(200).json({
                    page: parseInt(page),
                    totalPages,
                    paginasDisponibles: [],
                });
            }

            const mappedMangas = await Promise.all(mangas.map(async (manga) => {
                const serverUrl = process.env.NODE_ENV === 'development' ? `http://localhost:${process.env.PORT || 3000}` : `https://${req.headers.host}`;
                const expireDate = Math.floor(Date.now() / 1000) + 20;
                const tokenImg = jwt.sign({ exp: expireDate }, process.env.SECRET);
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
                        manga.poster = `${serverUrl}/v1/static/poster/${posterId}/${posterData.contents[0]}?a=${tokenImg}`;
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