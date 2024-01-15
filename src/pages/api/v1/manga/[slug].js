import Connect from "@/db/connect";
import Manga from "@/models/Manga";
import Genres from '@/models/Genres';
import Format from '@/models/Format';
import Status from '@/models/Status';
import UserModel from "@/models/User";
import jwt from "jsonwebtoken"

export default async function handler(req, res) {
    const slug = req.query.slug;

    const { method } = req;
  
    if (method === "GET") {

      if(req.headers.authorization === undefined) {
        res.status(400).json({ not_auth_token: {} });
        return;
      }

      await Connect();

      const token = req.headers.authorization.split(" ")[1];

      const decodedToken = jwt.verify(token, process.env.SECRET);

      if (!(decodedToken.status === "OFFLINE" || decodedToken.status === "ACTIVE")) {
          res.status(400).json({ not_allowed: {} });
      }
  
      const mangas = await Manga.findOne({ titleslug: slug });
      
      if (!mangas || (Array.isArray(mangas) && mangas.length === 0)) {
          res.status(200).json({});
          return;
      }
  
      const processManga = async (manga) => {
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
              const posterResponse = await fetch(`/v1/api/poster/${posterId}`, {
                  headers: {
                      'Authorization': 'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdGF0dXMiOiJBQ1RJVkUiLCJjbGllbnRfdGFnIjoiKiIsImlkIjoiNTEwYTUzM2QtYmZhYi00ZDFiLThhMzItY2FmYmYyMTM5ZmIzIiwiaWF0IjoxNzA1Mjc4NjE2fQ.mYprTIZNuNIxfhcgQ0CFgiEejWqdflwhG7suEHYm3jk'
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
  
          return {
              _id: manga._id,
              title: manga.title,
              titleJp: manga.titleJp,
              author: manga.author,
              poster: manga.poster,
              background: manga.background,
              overview: manga.overview,
              format: manga.format,
              genres: manga.genres,
              status: manga.status,
              date: manga.date
          };
      };
  
      const response = Array.isArray(mangas) ? await Promise.all(mangas.map(processManga)) : await processManga(mangas);
  
      res.status(200).json(response);
    } else {
      res.status(400).json({ error: {} });
    }
  }
  