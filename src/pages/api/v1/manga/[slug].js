import Connect from "@/db/connect";
import Manga from "@/models/Collection";
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
  
      const mangas = await Manga.findOne({ titleslug: slug })
      
      if (!mangas || (Array.isArray(mangas) && mangas.length === 0)) {
          res.status(200).json({});
          return;
      }

      mangas.views += 0.5;
      mangas.save();
  
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
              const posterResponse = await fetch(`${serverUrl}/v1/api/poster/${posterId}`, {
                  headers: {
                      'Authorization': 'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdGF0dXMiOiJBQ1RJVkUiLCJjbGllbnRfdGFnIjoiKiIsImlkIjoiNTEwYTUzM2QtYmZhYi00ZDFiLThhMzItY2FmYmYyMTM5ZmIzIiwiaWF0IjoxNzA1NTIxNDY3fQ.Yj42p_D5xQelY-qxxYMh3zH35CavXNbMOEYrRDk7wok'
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
                  manga.poster = `/v1/static/poster/${posterId}/${posterData.contents[0]}`;
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
                manga.background = `/v1/static/background/${posterId}/${backgroundData.contents[0]}`;
            }
        } catch (error) {
            console.error('Error in background fetch:', error);
            manga.background = null;
        }

        const likes = manga.likes;

        const dislikes = manga.dislikes;

        const likee = likes ? likes.length : 0;
        
        const dislikee = dislikes ? dislikes.length : 0;

        function formatLikesCount(likee) {
            if (likee >= 1000 && likee < 1000000) {
              return formatNumberWithK(likee, 1000);
            } else if (likee >= 1000000 && likee < 1000000000) {
              return formatNumberWithK(likee, 1000000);
            } else if (likee >= 1000000000) {
              return formatNumberWithK(likee, 1000000000);
            } else {
              return likee.toString();
            }
          }

        function formatdisLikesCount(dislikee) {
            if (dislikee >= 1000 && dislikee < 1000000) {
              return formatNumberWithK(dislikee, 1000);
            } else if (dislikee >= 1000000 && dislikee < 1000000000) {
              return formatNumberWithK(dislikee, 1000000);
            } else if (dislikee >= 1000000000) {
              return formatNumberWithK(dislikee, 1000000000);
            } else {
              return dislikee.toString();
            }
          }

          const views = Math.floor(manga.views);

          function formatViews(views) {
            if (views >= 1000 && views < 1000000) {
              return formatNumberWithK(views, 1000);
            } else if (views >= 1000000 && views < 1000000000) {
              return formatNumberWithM(views, 1000000);
            } else if (views >= 1000000000) {
              return formatNumberWithM(views, 1000000000);
            } else {
              return views.toString();
            }
          }
          
          function formatNumberWithK(number, divisor) {
            if (number % divisor === 0) {
              return (number / divisor) + ' K';
            } else if ((number % divisor) % 100 === 0) {
              return (number / divisor).toFixed(1) + ' K';
            } else {
              return (number / divisor).toFixed(1).replace(/\.0$/, '') + ' K';
            }
          }

          function formatNumberWithM(number, divisor) {
            if (number % divisor === 0) {
              return (number / divisor) + ' M';
            } else if ((number % divisor) % 100 === 0) {
              return (number / divisor).toFixed(1) + ' M';
            } else {
              return (number / divisor).toFixed(1).replace(/\.0$/, '') + ' M';
            }
          }

        const likeCount = formatLikesCount(likee);
        const disLikeCount = formatdisLikesCount(dislikee);

        const viewsCount = formatViews(views);

        return {
          _id: manga._id,
          title: manga.title,
          titleJp: manga.titleJp,
          author: manga.author,
          poster: manga.poster,
          background: manga.background,
          overview: manga.overview,
          format: manga.format,
          likes: manga.likes,
          likeCount: likeCount,
          disLikeCount: disLikeCount,
          dislikes: manga.dislikes,
          views: viewsCount,
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
  