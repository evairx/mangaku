import { useRouter } from 'next/router';
import Link from 'next/link';
import { useState, useEffect } from 'react';
import { useCookies } from 'react-cookie';
import Like from "@/src/icon/Like";
import Liked from "@/src/icon/Liked";
import Dislike from "@/src/icon/dislike";
import Disliked from "@/src/icon/disliked";
import jwt from "jsonwebtoken"
import Comments from '@/src/components/comments';
import Layout from '@/layout/Main';
import styled from '@emotion/styled';

const ContainerMobile = styled.div`
  display:flex;
  justify-content:center;
  position:relative;
`

const MainContent = styled.main`
  display:flex;
  justify-content:space-between;
`

const Btns = styled.div`
  display: flex;
  align-items:center;
  gap:.200rem;
  cursor: pointer;
`

const BtnsContent = styled.div`
  display:flex;
  align-items:center;
  gap:.600rem;
`

const BackgroundMobile = styled.figure`
  position:absolute;
  top:0;
  left:0;
  z-index:-10;
  width:100%;
  height:100%;
  overflow:hidden;
  filter:blur(20px);
  img {
     height: 100%;
     width: 100%;
     object-fit: cover; 
     object-position: center top;
   }
`

const PictureMobile = styled.figure`
  width: 230px;
  height:auto;
  z-index:1;
  margin-top:1rem;
  overflow:hidden;
  -webkit-box-shadow: 0px 0px 15px -4px #000000; 
  box-shadow: 0px 0px 15px 0px #000000;
  border-radius:10px;
   
  img {
    width:100%;
    height:100%;
    object-fit: cover; 
    object-position: center top;
  }
`

const Info = styled.div`
  padding:.800rem 1rem;
  width:100%;
`

const TitleMobile = styled.p`
  width: 280px;
  font-size:2.3rem;
  font-weight:600;
  word-wrap: break-word;
  max-height: none;
`

const GenresContent = styled.div`
  display:flex;
  gap:.400rem;
  flex-wrap:wrap;
  width:100%;
  margin-top:.600rem;
`

const Genres = styled.span`
  background:var(--main-);
  font-size:.900rem;
  padding:.200rem .600rem;
  border-radius: 0 10px 0 10px;
`
const OverViewMobile = styled.p`
  width:100%;
  font-size: 1.050rem;
  font-weight:400;
  color:var(--color);
  display: -webkit-box;
  -webkit-line-clamp: 3;
  -webkit-box-orient: vertical;
  overflow: hidden;
  white-space: normal;
  text-overflow: ellipsis;
  margin-top:1rem;
`

const ContentLoad = styled.div`
  display:flex;
  justify-content:center;
  align-items:center;
  height:90vh;
`

const Loader = styled.div`
  display: flex;
  align-items: center;
  gap: 0.4rem;
`;

const Bar = styled.span`
  display: inline-block;
  width: 4px; /* Aumentar el ancho de la barra */
  background-color: var(--loader-bars);
  border-radius: 10px;
  animation: scale-up4 1s linear infinite;

  &:nth-child(1),
  &:nth-child(4) {
    height: 25px; /* La primera y la última más pequeñas */
    animation-delay: 0s;
  }

  &:nth-child(2) {
    height: 40px; /* La del medio más grande */
    margin: 0 5px;
    animation-delay: 0.25s;
  }

  &:nth-child(3) {
    height: 25px; /* La tercera igual que la primera y la última */
    animation-delay: 0.5s;
  }

  @keyframes scale-up4 {
    20% {
      background-color: var(--color); /* Corregir el nombre del color blanco */
      transform: scaleY(1.5);
    }

    40% {
      transform: scaleY(1);
    }
  }
`;

export default function Detail() {
    const [manga, setManga] = useState({});
    const [user, setUser] = useState({});
    const [page, setPage] = useState(2);
    const [loading, setLoading] = useState(true);
    const [cookies] = useCookies(['token']);
    const router = useRouter();
    const { slug } = router.query;

    useEffect(() => {
        const fetchData = async () => {
            try {
                const token = cookies.token;
                
                await fetch(`/api/v1/manga/${slug}`, {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                }).then(response => {
                    if (!response.ok) {
                      throw new Error(response.statusText);
                    }
                    return response.json();
                  })
                  .then(data => {
                    setManga(data);
                    setLoading(false);
                  })
                  .catch(error => {
                    console.error(error);
                    setLoading(true);
                  });
            } catch (error) {
                console.error(error);
                setLoading(true);
            }
        };

        fetchData();

    }, [slug]);

    useEffect(() => {
      const fetchUser = async () => {
          const token = cookies.token;
    
          try {
            const decoded = jwt.decode(token);
        
            if (decoded.status === "OFFLINE") {
              setLoading(false);
              return;
            }
        
            const fetchUserAccount = async () => {
              try {
                const response = await fetch('/api/v1/user/account', {
                  headers: {
                    'Authorization': `Bearer ${token}`
                  }
                });
        
                if (!response.ok) {
                  throw new Error(response.statusText);
                }
        
                const data = await response.json();
                setUser(data);
              } catch (error) {
                console.error(error);
                removeCookieFromSecond('token');
              } finally {
                setLoading(false);
              }
            };
        
            fetchUserAccount();
          } catch (decodeError) {
            console.error("Error decoding token:", decodeError);
            setLoading(true); 
          }
      }
      fetchUser();
  }, [cookies.token]);

    function handleChapters(){
        setPage(1);
    }

    function handleComents(){
        setPage(2);
    }

    function addLike(mangaId) {
      const updatedManga = { ...manga }; // Crear una copia del objeto manga

      if (updatedManga._id === mangaId) {
        const likeIndex = updatedManga.likes.indexOf(user._id);
        const dislikeIndex = updatedManga.dislikes.indexOf(user._id);
      
        if (dislikeIndex !== -1) {
          updatedManga.dislikes.splice(dislikeIndex, 1);
          updatedManga.likes.push(user._id);
        } else if (likeIndex !== -1) {
          updatedManga.likes.splice(likeIndex, 1);
        } else {
          updatedManga.likes.push(user._id);
        }
      
        updatedManga.likeCount = updatedManga.likes.length;
        updatedManga.disLikeCount = updatedManga.dislikes.length; // Actualizar dislikeCount
      
        // Formatear likeCount con K si es mayor o igual a 1000
        updatedManga.likeCount = formatLikeCount(updatedManga.likeCount);
      }
      
      setManga(updatedManga);

      
      // Función para formatear el likeCount con K si es mayor o igual a 1000
      function formatLikeCount(count) {
        if (count >= 1000) {
          return formatNumberWithK(count, 1000);
        }
        return count.toString();
      }
      
      function formatNumberWithK(number, divisor) {
        if (number % divisor === 0) {
          return `${Math.floor(number / divisor)} K`;
        } else if ((number % divisor) % 100 === 0) {
          return `${(number / divisor).toFixed(1)} K`;
        } else {
          return `${(number / divisor).toFixed(1).replace(/\.0$/, '')} K`;
        }
      }
      
      const responseLike = {
          collectionId: mangaId,
          userId: user._id,
      };

      const token = cookies.token;

      fetch('/api/v1/reviews/detail/votes?action=404e03cf-9576-41b9-9818-8067bc79b94f', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
          },
          body: JSON.stringify(responseLike),
      })
      .then(response => response.json())
      .then(data => {
      })
      .catch(error => {
          console.error('Error al enviar comentario:', error);
      });
    }

    function adddisLike(mangaId) {
      const updatedManga = { ...manga }; // Crear una copia del objeto manga

      if (updatedManga._id === mangaId) {
        const likeIndex = updatedManga.likes.indexOf(user._id);
        const dislikeIndex = updatedManga.dislikes.indexOf(user._id);
    
        if (likeIndex !== -1) {
          updatedManga.likes.splice(likeIndex, 1);
          updatedManga.dislikes.push(user._id);
        } else if (dislikeIndex !== -1) {
          updatedManga.dislikes.splice(dislikeIndex, 1);
        } else {
          updatedManga.dislikes.push(user._id);
        }
    
        updatedManga.disLikeCount = updatedManga.dislikes.length;
        updatedManga.likeCount = updatedManga.likes.length;
    
        // Formatear disLikeCount con K si es mayor o igual a 1000
        updatedManga.disLikeCount = formatLikeCount(updatedManga.disLikeCount);
      }
    
      setManga(updatedManga);
       
      // Función para formatear el likeCount con K si es mayor o igual a 1000
      function formatLikeCount(count) {
        if (count >= 1000) {
          return formatNumberWithK(count, 1000);
        }
        return count.toString();
      }
      
      function formatNumberWithK(number, divisor) {
        if (number % divisor === 0) {
          return `${Math.floor(number / divisor)} K`;
        } else if ((number % divisor) % 100 === 0) {
          return `${(number / divisor).toFixed(1)} K`;
        } else {
          return `${(number / divisor).toFixed(1).replace(/\.0$/, '')} K`;
        }
      }
      
      const responseLike = {
          collectionId: mangaId,
          userId: user._id,
      };

      const token = cookies.token;

      fetch('/api/v1/reviews/detail/votes?action=85a488aa-b5c4-44e8-9d97-e69147e3c142', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
          },
          body: JSON.stringify(responseLike),
      })
      .then(response => response.json())
      .then(data => {
      })
      .catch(error => {
          console.error('Error al enviar comentario:', error);
      });
    }

    const toggleSortOrder = () => {
      setSortBy((prevSortBy) => (prevSortBy === 'likeCount' ? 'created' : 'likeCount'));
      setInitialSort(!initialSort);
  };

    const layout = {
        title: loading ? 'Mangaku' : `${manga.title} en Español | Mangaku`,
        description: '3',
    };

    return (
        <Layout layout={layout}>
            {loading ?
                <ContentLoad>
                    <Loader>
                        <Bar />
                        <Bar />
                        <Bar />
                    </Loader>
                </ContentLoad>
                :
                <>
                <ContainerMobile>
                  <BackgroundMobile>
                    <picture>
                      <img src={manga?.poster} alt={manga?.title}/>
                    </picture>
                  </BackgroundMobile>
                  <PictureMobile>
                    <picture>
                      <img src={manga?.poster} alt={manga?.title}/>
                    </picture>
                  </PictureMobile>
                </ContainerMobile>
                <Info>
                  <TitleMobile>{manga?.title}</TitleMobile>
                  {user._id ? 
                  <BtnsContent>
                      <Btns onClick={() => addLike(manga._id)}>
                        {manga.likes && manga.likes.includes(user._id) ? (
                            <Liked width={24} height={24} />
                              ) : (
                            <Like width={22} height={22} />
                        )}
                        <p>{manga?.likeCount}</p>
                      </Btns>
                      <Btns onClick={() => adddisLike(manga._id)}>
                        {manga.dislikes && manga.dislikes.includes(user._id) ? (
                           <Disliked style={{marginTop: '2px'}} width={23} height={23}/>
                        ) :  (
                           <Dislike style={{marginTop: '3px'}} width={22} height={22}/>
                        )}
                        <p>{manga?.disLikeCount}</p>
                      </Btns>
                    </BtnsContent>
                    :
                    <BtnsContent>
                     <Link href="/login">
                      <Btns>
                        <Like width={22} height={22} />
                        <p>{manga?.likeCount}</p>
                      </Btns>
                    </Link>
                    <Link href="/login">
                      <Btns>
                        <Dislike style={{marginTop: '5px'}} width={22} height={22}/>
                        <p>{manga?.disLikeCount}</p>
                      </Btns>
                    </Link>
                  </BtnsContent>
                  }
                  <GenresContent>
                    {manga && manga.genres && manga.genres.map((genre, index) => (
                      <Genres key={index}>{genre}</Genres>
                    ))}
                  </GenresContent>
                  <OverViewMobile>{manga.overview}</OverViewMobile>
                </Info>
                </>
            }

            {loading ? undefined: <div>
                {page === 1 && 
                    <p>capitulos</p>
                }

                {page === 2 &&
                    <Comments id={manga._id} />
                }
            </div>}
        </Layout>
    );
}