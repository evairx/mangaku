import { useRouter } from 'next/router';
import { css } from '@emotion/css';
import Link from 'next/link';
import { useState, useEffect, useRef } from 'react';
import useQuery from "@/src/hooks/useQuery"
import { useCookies } from 'react-cookie';
import Star from "@/src/icon/star";
import StarSemi from "@/src/icon/starSemi";
import StarHalf from "@/src/icon/starHalf"
import StarD from "@/src/icon/starD";
import StarEmpty from "@/src/icon/starEmpty"
import Down from "@/src/icon/down"
import jwt from "jsonwebtoken"
import Comments from '@/src/components/comments';
import Layout from '@/layout/Main';
import styled from '@emotion/styled';
import useClick from "@/src/hooks/useClick";


const ContainerMobile = styled.div`
  display:flex;
  justify-content:center;
  position:relative;
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
    background: linear-gradient(var(--details-gradient-mobile), var(--details-gradient-1-mobile),var(--details-gradient-2-mobile), var(--details-gradient-3-mobile), var(--details-gradient-4-mobile));
    z-index: 0; /* Capa del fondo */
  }
`;

const PictureMobile = styled.figure`
  width: 230px;
  height:auto;
  z-index:1;
  margin-top:2rem;
  overflow:hidden;
  border-radius:2px;
  margin-bottom:20px;
  
   
  img {
    width:100%;
    height:100%;
    object-fit: cover; 
    object-position: center top;
  }
`

const PictureLoading = styled.div`
  opacity: 0.7;
  margin-top:2rem;
  animation: skeleton-loading .5s linear infinite alternate;
  width: 230px;
  height:311px;
  background-color: var(--skeleton-color);
  margin-bottom:20px;

  @keyframes skeleton-loading {
    0% {
      background-color: var(--skeleton-color);
    }

    100% {
      background-color: var(--skeleton-color-100);
    }
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

const TitleLoading = styled.div`
  opacity: 0.7;
  animation: skeleton-loading .5s linear infinite alternate;
  width: 120px;
  height:35px;
  background-color: var(--skeleton-color);
  margin-bottom:1rem;
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
  font-size:1.150rem;
  padding:.200rem .600rem;
  border-radius: 0 10px 0 10px;

  @media screen and (max-width: 995px) {
    font-size:.925rem;
  }
  
  @media screen and (max-width: 850px) {
    font-size:.825rem;
  }
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

const ValidationBox = styled.section`
    position: fixed;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    background-color: var(--background-nav);
    height:360px;
    padding: 1rem;

    z-index: 999;
    width: 400px;
    text-align: center;
    z-index: 1001;

    @media screen and (max-width: 653px) {
      min-height:240px;
    }

    @media screen and (max-width: 420px) {
      width:95%;
    }


`

export const OverLayy = styled.section`
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    z-index: 500;
    pointer-events: auto;
    overflow-y: hidden;
    background: #0000004d;
    opacity: ${props => (props.openVali ? 1 : 0)};
    visibility: ${props => (props.openVali ? 'visible' : 'hidden')}; 
    transition: opacity 0.3s ease-out;
    z-index: 1000;
`;

const StarsContents = styled.div`
    display:flex;
    
    @media screen and (max-width: 850px) {
      gap:.400rem;
    }
`

const Stars = styled.div`
    cursor:pointer;
`

const TextVali = styled.p`
  color:var(--main);
  font-weight:600;
  font-size:1.050rem
`;

const TextV = styled.p`
  font-weight:500;
  margin-top:.700rem;
  margin-bottom:.700rem;
`;

const BarPuntation = styled.div`
  width: 200px;
  height: 4px;
  border-radius: 8px;
  background-color: #00000064;
  position: relative;

  &::before {
    content: "";
    position: absolute;
    top: 0;
    left: 0;
    border-radius: 8px;
    height: 4px;
    height: 100%; /* Usa el 100% de la altura del contenedor */
    width: ${props => props.percentage}%;
    background-color: ${props => (props.isClicked === props.numberS ? 'var(--main)' : 'var(--color)')};
  }
`;

export default function Detail() {
  const isMobile = useQuery('(min-width: 850px)');
  const [manga, setManga] = useState({});
  const [user, setUser] = useState({});
  const [rating, setRating] = useState({});
  const [page, setPage] = useState(2);
  const [loading, setLoading] = useState(true);
  const [starRef, hoveredStar, setHoveredStar] = useClick(null);
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

  function addLike(mangaId, i) {
    
    const number = i;

    setRating((prevRating) => {
      const updatedRating = { ...prevRating };
  
      if (updatedRating.rating === "") {
        updatedRating.rating = `${number}`;
      } else {
        updatedRating.rating = `${number}`;
      }
  
      return updatedRating;
    });
  
    const responseLike = {
        collectionId: mangaId,
        userId: user._id,
        type: `${number}`,
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

  const stars = [];

  const handleStarHover = (index) => {
    setHoveredStar(index);
  };

  const handleStarClick = (i) => {
    if (user && user._id) {
      addLike(manga._id, i);
    }
  };

  const renderStars = (ratingValue, color) => {
    for (let i = 1; i <= 5; i++) {
      const isHovered = i <= hoveredStar;
      const isFull =  i <= Math.floor(parseFloat(ratingValue));
      const decimalPart = parseFloat(ratingValue) % 1;
      const isD = i === Math.ceil(parseFloat(ratingValue)) && decimalPart >= 0.1 && decimalPart <= 0.3;
      const isHalf = i === Math.ceil(parseFloat(ratingValue)) && decimalPart > 0.3 && decimalPart <= 0.5;
      const isSemi = i === Math.ceil(parseFloat(ratingValue)) && decimalPart > 0.5 && decimalPart <= 0.8;
      const isMoreThanHalf = i === Math.ceil(parseFloat(ratingValue)) && decimalPart > 0.8;
  
      stars.push(
        <div
          key={i}
          onMouseEnter={() => handleStarHover(i)}
          onMouseLeave={() => setHoveredStar(null)}
        >
          <Stars onClick={() => handleStarClick(i)}>
            {isFull || isMoreThanHalf ? (
              <Star
                width={28}
                height={28}
                style={{ color: isHovered ? 'var(--main)' : color }}
              />
            ) : isSemi ? (
              isHovered ?
              <Star
                width={28}
                height={28}
                style={{ color: isHovered ? 'var(--main)' : color }}
              />
              :
              <StarSemi
                width={28}
                height={28}
                style={{ color: isHovered ? 'var(--main)' : color }}
              />
            ) : isHalf ? (
              isHovered ?
              <Star
                width={28}
                height={28}
                style={{ color: isHovered ? 'var(--main)' : color }}
              />
              :
              <StarHalf
                width={28}
                height={28}
                style={{ color: isHovered ? 'var(--main)' : color }}
              />
            ) : isD ? (
              isHovered ?
              <Star
                width={28}
                height={28}
                style={{ color: isHovered ? 'var(--main)' : color }}
                />
              :
              <StarD
                width={28}
                height={28}
                style={{ color: isHovered ? 'var(--main)' : color }}
              />
            ) : (
              isHovered ?
              <Star
                width={28}
                height={28}
                className="xd"
                style={{ color: isHovered ? 'var(--main)' : color }}
              />
              :
              <StarEmpty
                width={28}
                height={28}
                style={{ color: isHovered ? 'var(--main)' : color }}
              />
            )}
          </Stars>
        </div>
      );
    }
  };

  if (hoveredStar !== null) {
    renderStars(parseFloat(hoveredStar), 'var(--main)');
  } else if (!rating.rating || rating.rating === " ") {
    renderStars(parseFloat(rating.average), 'currentColor');
  } else if (["1", "2", "3", "4", "5"].includes(rating.rating)) {
    renderStars(parseFloat(rating.rating), 'var(--main)');
  }

  const layout = {
    title: loading ? 'Mangaku' : `${manga?.title} | Mangaku`,
    description: '3',
  };

  return (
    <Layout layout={layout}>
      {isMobile ?
        <DetailDesktop
          loading={loading} 
          manga={manga} 
          user={user} 
          more={more} 
          toggleMore={toggleMore} 
          page={page}
          addLike={addLike}
          rating={rating}
          stars={stars}
        />
        :
        <DetailMobile
          loading={loading} 
          manga={manga} 
          user={user} 
          more={more} 
          toggleMore={toggleMore} 
          page={page}
          addLike={addLike}
          rating={rating}
          stars={stars}
        />}
    </Layout>
  )
}

const Container = styled.section`
  display:flex;
  justify-content:space-between;
  padding:5rem 3.8rem;
  position:relative;
  transition: all .3 ease-out;
  min-height:60vh;
  
  @media screen and (max-width: 1400px) {
    padding:5rem 4rem;
  }

  @media screen and (max-width: 1180px) {
    padding:5rem 2rem;
  }
`

const Background = styled.figure`
  position: absolute;
  top: -30px;
  left: 0;
  z-index: -10;
  width: 100%;
  height: 100%;
  overflow: hidden;
  filter:blur(9px);

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


const Picture = styled.figure`
  width: 240px;
  height:330px;
  z-index:1;
  overflow:hidden;
  border-radius:2px;
  margin-bottom:20px;

  
  @media screen and (max-width: 882px) {
    width: 200px;
    height:280px;
  }
   
  img {
    width:100%;
    height:100%;
    object-fit: cover; 
    object-position: center top;
  }
`

const Title = styled.p`
  font-size:3rem;
  font-weight:600;
`

const ContentValues = styled.main`

  display:flex;
  align-items:center;
  gap:.600rem;
  font-size:1.2rem;
`

const OverView = styled.div`
  overflow:${props => (props.more ? 'auto' : 'hidden')};
  width:700px;
  ${props => (props.more ? 'height: 160px;' : '')};
  font-size: 1.05rem;
  line-height: 1.55rem;
  font-weight:400;
  color:var(--color);
  display: -webkit-box;
  -webkit-line-clamp: ${props => (props.more ? 'none' : '5')};
  -webkit-box-orient: vertical;
  ${props => (props.more ? '' : 'white-space: normal;')}
  ${props => (props.more ? '' : 'text-overflow: ellipsis;')}
  margin-top:1rem;
  position:relative;

  @media screen and (max-width: 1350px) {
    width:600px;
  }

  @media screen and (max-width: 995px) {
    width:550px;
    font-size:.925rem;
    line-height: 1.25rem;
  }

  ${props => (props.more ? '' : '&::before { content: ""; position: absolute; top: 0; left: 0; width: 100%; height: 100%; background: linear-gradient(transparent, transparent, var(--details-gradient-4)); z-index: 0; }')}
`

function DetailDesktop({loading, manga, user, more, toggleMore, page, stars, rating}) {
  const [valiRef, openVali, setOpenVali] = useClick(null);

  const containerRef = useRef(null);

  useEffect(() => {
    if (!more && containerRef.current) {
      containerRef.current.scrollTop = 0;
    }
  }, [more]);

  function handleVali() {
    setOpenVali(!openVali)
  }
  
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
            <Container>
              <div>
                {manga.background &&
                <Background>
`                  <picture>
                    <img src={manga?.background} alt={manga?.title}/>
                  </picture>
                </Background>
                }
                <Info>
                {manga.title ?
                  <Title>{manga?.title}</Title>
                  :
                  <TitleLoading/>
                }
                <ContentValues>
                  <StarsContents>
                    {stars}
                  </StarsContents>
                  <div onClick={handleVali} className={css`padding:.400rem;margin-bottom: 4px;display:flex; align-items:center; gap:.100rem; cursor:pointer; &:hover {  background:var(--btn-filter-command);}`}>
                      <p>{rating.average}</p>
                      <Down width={22} height={22}/>
                  </div>
                </ContentValues>
                <GenresContent>
                    {manga && manga.genres && manga.genres.map((genre, index) => (
                      <Genres key={index}>{genre}</Genres>
                    ))}
                </GenresContent>
                <OverView more={more} ref={containerRef}>
                  <p>{manga.overview}</p>

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
                </OverView>
                {more ? <MoreBtn onClick={toggleMore}>MENOS DETALLES</MoreBtn>:<MoreBtn onClick={toggleMore}>MÁS DETALLES</MoreBtn>}
              </Info>
              </div>
              <Picture>
                <picture>
                  <img src={manga?.poster} alt={manga?.title}/>
                </picture>
              </Picture>
            </Container>

            {loading ? undefined: <div>
                {page === 1 && 
                    <p>capitulos</p>
                }

                {page === 2 &&
                    <Comments id={manga._id} />
                }
            </div>}

            {openVali && <ValidationBox ref={valiRef}>
              <h2>Calificaciones</h2>
              {rating.rating  && <TextVali>Le diste una calificación de {rating.rating} estrellas</TextVali>}
              <Border/>
              {[5, 4, 3, 2, 1].map((value) => (
                <div key={value} className={css`
                  display: flex;
                  width:100%;
                  justify-content: space-between;
                  align-items: center;
                  gap: .400rem;
                  margin-top: 1rem;
                  margin-bottom: 1rem;
                `}>
                  <div className={css`display: flex; align-items: center; gap: .400rem;`}>
                    <Star width={22} height={22} className={rating.rating === value.toString() ? css`color:var(--main); ` : ''} />
                    <p className={rating.rating === value.toString() ? css`color:var(--main); ` : ''}>{value}</p>
                  </div>

                  <div className={css`position:relative;height: 0.3rem;margin: 0.625rem;background-color: var(--bars-); flex: 1 1 auto;`}> 
                    <div className={css`position:absolute;top:0;left:0;background-color: var(--bars-2); ;height: 0.3rem;width:${rating[value].percentage}%;`}/>
                  </div>    
                  <p className={rating.rating === value.toString() ? css`color:var(--main); ` : css`width:35px;`}>{rating && rating[value.toString()] && rating[value.toString()].percentage}%</p>
                </div>
              ))}
              <Border/>
              <TextV>puntacion media: {rating.average} de 5</TextV>
              <TextV>{rating.total.toString()} calificaciónes</TextV>
            </ValidationBox>}

            <OverLayy openVali={openVali}/>
          </>
      }
    </>
  )
}

function DetailMobile({loading, manga, user, more, toggleMore, page, stars, rating}) {
     const [valiRef, openVali, setOpenVali] = useClick(null);

    function handleVali() {
      setOpenVali(!openVali)
    }

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
                    {manga.poster && <BackgroundMobile>
                      <picture>
                        <img src={manga?.poster} alt={manga?.title}/>
                      </picture>
                    </BackgroundMobile>}
                    {manga.poster ?
                    <PictureMobile>
                      <picture>
                        <img src={manga?.poster} alt={manga?.title}/>
                      </picture>
                    </PictureMobile>
                    :
                    <PictureLoading/>}
                </ContainerMobile>
                <Info>
                  {manga.title ?
                  <TitleMobile>{manga?.title}</TitleMobile>
                  :
                  <TitleLoading/>}

                  <BtnsContent>
                      <StarsContents>
                        {stars}
                      </StarsContents>
                      <div onClick={handleVali} className={css`display:flex; align-items:center; gap:.100rem;`}>
                        <p>{rating.average}</p>
                        <Down width={18} height={18}/>
                      </div>
                  </BtnsContent>
          
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
            
            {openVali && <ValidationBox ref={valiRef}>
              <h2>Calificaciones</h2>
              {rating.rating  && <TextVali>Le diste una calificación de {rating.rating} estrellas</TextVali>}
              <Border/>
              {[5, 4, 3, 2, 1].map((value) => (
                <div key={value} className={css`
                  display: flex;
                  width:100%;
                  justify-content: space-between;
                  align-items: center;
                  gap: .400rem;
                  margin-top: 1rem;
                  margin-bottom: 1rem;
                `}>
                  <div className={css`display: flex; align-items: center; gap: .400rem;`}>
                    <Star width={22} height={22} className={rating.rating === value.toString() ? css`color:var(--main); ` : ''} />
                    <p className={rating.rating === value.toString() ? css`color:var(--main); ` : ''}>{value}</p>
                  </div>

                  <div className={css`position:relative;height: 0.3rem;margin: 0.625rem;background-color: var(--bars-); flex: 1 1 auto;`}> 
                    <div className={css`position:absolute;top:0;left:0;background-color: var(--bars-2); ;height: 0.3rem;width:${rating[value].percentage}%;`}/>
                  </div>    
                  <p className={rating.rating === value.toString() ? css`color:var(--main); ` : css`width:35px;`}>{rating && rating[value.toString()] && rating[value.toString()].percentage}%</p>
                </div>
              ))}
              <Border/>
              <TextV>puntacion media: {rating.average} de 5</TextV>
              <TextV>{rating.total.toString()} calificaciónes</TextV>
            </ValidationBox>}

            <OverLayy openVali={openVali}/>
        </>
    );
}