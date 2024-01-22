import { useRouter } from 'next/router';
import Link from 'next/link';
import { useState, useEffect } from 'react';
import useQuery from "@/src/hooks/useQuery"
import { useCookies } from 'react-cookie';
import Like from "@/src/icon/Like";
import Liked from "@/src/icon/Liked";
import Dislike from "@/src/icon/dislike";
import Disliked from "@/src/icon/disliked";
import View from "@/src/icon/view";
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
  position: absolute;
  top: 0;
  left: 0;
  z-index: -10;
  width: 100%;
  height: 100%;
  overflow: hidden;

  img {
    height: 100%;
    width: 100%;
    object-fit: cover;
  }

  &::before {
    content: "";
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background: linear-gradient(var(--details-gradient), var(--details-gradient-1),var(--details-gradient-2), var(--details-gradient-3), var(--details-gradient-4));
    z-index: 0; /* Capa del fondo */
  }
`;

const PictureMobile = styled.figure`
  width: 230px;
  height:auto;
  z-index:1;
  margin-top:2rem;
  overflow:hidden;
  -webkit-box-shadow: 0px 0px 15px -4px #000000; 
  box-shadow: 0px 0px 15px 0px #000000;
  border-radius:2px;
  margin-bottom:20px;
  
   
  img {
    width:100%;
    height:100%;
    object-fit: cover; 
    object-position: center top;
  }
`

const Info = styled.div`
  padding:0 .800rem;
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
  background:var(--genres);
  font-size:.825rem;
  padding:.200rem .600rem;
  border-radius: 0 10px 0 10px;
`
const OverViewMobile = styled.p`
  width:100%;
  font-size: .875rem;
  line-height: 1.25rem;
  font-weight:400;
  color:var(--color);
  display: -webkit-box;
  -webkit-line-clamp: ${props => (props.more ? 'none' : '3')};
  -webkit-box-orient: vertical;
  overflow: hidden;
  ${props => (props.more ? '' : 'white-space: normal;')}
  ${props => (props.more ? '' : 'text-overflow: ellipsis;')}
  margin-top:1rem;
  position:relative;

  ${props => (props.more ? '' : '&::before { content: ""; position: absolute; top: 0; left: 0; width: 100%; height: 100%; background: linear-gradient(transparent, transparent, var(--details-gradient-4)); z-index: 0; }')}
`

const MoreBtn = styled.div`
  position: relative;
  font-weight:400;
  font-size: 0.965rem;
  padding: 0.2rem 0.6rem;
  border-radius: 5px;
  overflow: hidden;
  text-align:center;
  margin-top:6px;
  opacity:.7;
`;

const Infox = styled.div`
  display:flex;
  justify-content:space-between; 
`

const Border = styled.div`
    border: 1px solid var(--border);
    margin-top:10px;
    margin-bottom:10px;
    border-radius:8px;
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
  const isMobile = useQuery('(min-width: 850px)');
  const [manga, setManga] = useState({});
  const [user, setUser] = useState({});
  const [rating, setRating] = useState({});
  const [page, setPage] = useState(2);
  const [loading, setLoading] = useState(true);
  const [more, setMore] = useState(false);
  const [cookies] = useCookies(['token']);
  const router = useRouter();
  const { slug } = router.query;

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

  useEffect(() => {
    const fetchData = async () => {
        try {
            const token = cookies.token;

            if (slug === undefined) {
              console.log('error')
            }
            
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

    const fetchRating = async () => {
      try {
          const token = cookies.token;

          await fetch(`/api/v1/reviews/detail/rating/${slug}`, {
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
              setRating(data);
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
  if (slug) {
    fetchRating()
    fetchData();
  }

  }, [slug]);

  function handleChapters(){
      setPage(1);
  }

  function handleComents(){
      setPage(2);
  }

  function addLike(mangaId) {
    const updatedRating = { ...rating };

    if (updatedRating.rating === "") {
      updatedRating.up.total += 1;
      updatedRating.up.displayed = formatLikesCount(updatedRating.up.total);
      updatedRating.rating = "up";
    } else if (updatedRating.rating === "up") {
      updatedRating.up.total -= 1;
      updatedRating.up.displayed = formatLikesCount(updatedRating.up.total);
      updatedRating.rating = "";
    } else if (updatedRating.rating === "down") {
      updatedRating.down.total -= 1;
      updatedRating.down.displayed = formatLikesCount(updatedRating.down.total);
      updatedRating.up.total += 1;
      updatedRating.up.displayed = formatLikesCount(updatedRating.up.total);
      updatedRating.rating = "up";
    }
    
    setRating(updatedRating);
    
    function formatLikesCount(likes) {
      if (likes >= 1000 && likes < 1000000) {
        return formatNumberWithK(likes, 1000);
      } else if (likes >= 1000000 && likes < 1000000000) {
        return formatNumberWithK(likes, 1000000);
      } else if (likes >= 1000000000) {
        return formatNumberWithK(likes, 1000000000);
      } else {
        return likes.toString();
      }
    }
    
    function formatNumberWithK(value, divisor) {
      const result = Math.floor(value / divisor);
      const remainder = value % divisor;
      const decimal = Math.floor(remainder / (divisor / 10));
    
      if (decimal >= 5) {
        return (result + 1).toString() + '.' + (decimal - 5).toString() + ' K';
      } else {
        return result.toString() + '.' + decimal.toString() + ' K';
      }
    }

    const responseLike = {
        collectionId: mangaId,
        userId: user._id,
        type: "up"
    };

    const token = cookies.token;

    fetch(`/api/v1/reviews/detail/rating/${slug}`, {
        method: 'PUT',
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
    const updatedRating = { ...rating };

    if (updatedRating.rating === "") {
      updatedRating.down.total += 1;
      updatedRating.down.displayed = formatLikesCount(updatedRating.down.total);
      updatedRating.rating = "down";
    } else if (updatedRating.rating === "down") {
      updatedRating.down.total -= 1;
      updatedRating.down.displayed = formatLikesCount(updatedRating.down.total);
      updatedRating.rating = "";
    } else if (updatedRating.rating === "up") {
      updatedRating.up.total -= 1;
      updatedRating.up.displayed = formatLikesCount(updatedRating.up.total);
      updatedRating.down.total += 1;
      updatedRating.down.displayed = formatLikesCount(updatedRating.down.total);
      updatedRating.rating = "down";
    }
    
    setRating(updatedRating);
    
    function formatLikesCount(likes) {
      if (likes >= 1000 && likes < 1000000) {
        return formatNumberWithK(likes, 1000);
      } else if (likes >= 1000000 && likes < 1000000000) {
        return formatNumberWithK(likes, 1000000);
      } else if (likes >= 1000000000) {
        return formatNumberWithK(likes, 1000000000);
      } else {
        return likes.toString();
      }
    }
    
    function formatNumberWithK(value, divisor) {
      const result = Math.floor(value / divisor);
      const remainder = value % divisor;
      const decimal = Math.floor(remainder / (divisor / 10));
    
      if (decimal >= 5) {
        return (result + 1).toString() + '.' + (decimal - 5).toString() + ' K';
      } else {
        return result.toString() + '.' + decimal.toString() + ' K';
      }
    }

    const responseLike = {
        collectionId: mangaId,
        userId: user._id,
        type: "down"
    };

    const token = cookies.token;

    fetch(`/api/v1/reviews/detail/rating/${slug}`, {
        method: 'PUT',
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

  const toggleMore = () => {
    setMore(!more)
  };

  const layout = {
    title: loading ? 'Mangaku' : `${manga.title} en Español | Mangaku`,
    description: '3',
  };

  return(
    <Layout layout={layout}>
      {isMobile ?
        undefined
        :
        <DetailMobile
          loading={loading} 
          manga={manga} 
          user={user} 
          more={more} 
          toggleMore={toggleMore} 
          page={page}
          addLike={addLike}
          adddisLike={adddisLike}
          rating={rating}
        />}
    </Layout>
  )
}

function DetailMobile({loading, manga, user, more, toggleMore, page, addLike, adddisLike, rating}) {
    return (
        <>
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
                        {rating.up && rating.rating === "up" ? (
                            <Liked width={19} height={19} />
                              ) : (
                            <Like width={18} height={18} />
                        )}
                         <p>{rating.up && rating?.up.displayed}</p>
                      </Btns>
                      <Btns onClick={() => adddisLike(manga._id)}>
                        {rating.down && rating.rating === "down" ? (
                           <Disliked style={{marginTop: '1px'}} width={19} height={19}/>
                        ) :  (
                           <Dislike style={{marginTop: '2px'}} width={18} height={18}/>
                        )}
                        <p>{rating.down && rating?.down.displayed}</p>
                      </Btns>
                      <Btns>
                        <View width={18} height={18}/>
                        <p>{manga?.views}</p>
                      </Btns>
                    </BtnsContent>
                    :
                    <BtnsContent>
                     <Link href="/login">
                      <Btns>
                        <Like width={18} height={18} />
                        <p>{rating.up && rating?.up.displayed}</p>
                      </Btns>
                    </Link>
                    <Link href="/login">
                      <Btns>
                        <Dislike style={{marginTop: '2px'}} width={18} height={18}/>
                        <p>{rating.down && rating?.down.displayed}</p>
                      </Btns>
                    </Link>
                    <Btns>
                      <View width={18} height={18}/>
                      <p>{manga?.views}</p>
                    </Btns>
                  </BtnsContent>
                  }
                  <GenresContent>
                    {manga && manga.genres && manga.genres.map((genre, index) => (
                      <Genres key={index}>{genre}</Genres>
                    ))}
                  </GenresContent>
                  <OverViewMobile more={more}>{manga.overview}</OverViewMobile>
                  {more && <Border/>}
                  {more &&
                  <>
                  <Infox>
                    <p>Autor</p>
                    <p>{manga?.author}</p>
                  </Infox>
                  <Border/>
                  <Infox>
                    <p>Artista</p>
                    <p>{manga?.artist}</p>
                  </Infox>
                  <Border/>
                  <Infox>
                    <p>Titulo Alternativo</p>
                    <p>{manga?.titleAlt}</p>
                  </Infox>
                  <Border/>
                  <Infox>
                    <p>Publicación</p>
                    <p>{manga?.publication}</p>
                  </Infox>
                  </>
                  }
                  {more ? <MoreBtn onClick={toggleMore}>MENOS DETALLES</MoreBtn>:<MoreBtn onClick={toggleMore}>MÁS DETALLES</MoreBtn>}
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
        </>
    );
}