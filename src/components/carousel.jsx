import React , { useState, useEffect }from 'react'
import Helios from "./helios"
import styled from '@emotion/styled';
import useQuery from "@/src/hooks/useQuery"
import HeliosLeft from "@/src/icon/HeliosLeft"
import HeliosRight from "@/src/icon/HeliosRight"
import Link from 'next/link';

const Container = styled.main` 
  position: relative;
  overflow: hidden;
  height: 75vh;
  background: linear-gradient(transparent, var(--helios-gradient-1), var(--helios-gradient-2),var(--helios-gradient-3)),linear-gradient(to left, transparent, var(--helios-gradient-1a), var(--helios-gradient-2a), var(--helios-gradient-3a));

  @media screen and (max-width: 680px) {
    background: linear-gradient(rgba(0, 0, 0, 0), rgba(0, 0, 0, 0.541), #000000a4,#000000dc, #000000);
  }
  
  @media screen and (max-width: 550px) {
    height: 100vw;
  }

  @media screen and (max-width: 485px) {
    background: linear-gradient(rgba(0, 0, 0, 0), #00000075, #000000b7, #000000);
    height: 170vw;
  }
`

const ContainerLoading = styled.main`
  position: relative;
  overflow: hidden;
  height: 75vh;
  animation: skeleton-loadings .8s linear infinite alternate;

  @keyframes skeleton-loadings {
    0% {
      background-color: var(--skeleton-color);
      opacity: 0.2;
    }

    100% {
      background-color: var(--skeleton-color-100);
      opacity: 0.3;
    }
  }

  @media screen and (max-width: 680px) {
    background: linear-gradient(rgba(0, 0, 0, 0), rgba(0, 0, 0, 0.541), #000000a4,#000000dc, #000000);
  }
  
  @media screen and (max-width: 550px) {
    height: 100vw;
  }

  @media screen and (max-width: 485px) {
    background: linear-gradient(rgba(0, 0, 0, 0), #00000075, #000000b7, #000000);
    height: 170vw;
  }
`

const Prev = styled.button`
  position: absolute;
  border:none;
  background:none;
  top: 50%;
  color:var(--color);
  border: none;
  cursor: normal;
  left:20px;
  z-index: 1;
  opacity:0.5;
  transition: all .3s ease-out;
`

const Next = styled.button`
  position: absolute;
  top: 50%;
  color:var(--color);
  border:none;
  background:none;
  border: none;
  cursor: normal;
  right:20px;
  z-index: 1;
  opacity:0.5;
  transition: all .3s ease-out;
`

const Info =  styled.article`
  font-size: 1em;
  padding: 3rem 5rem;
  position:absolute;
  bottom: 10px;

  @media screen and (max-width: 680px) {
    position:absolute;
    bottom: 10px;
    text-align:center;
    left:50%;
    transform: translate(-50%);
  }
`

const Figure = styled.figure`
  height: 100lvh;
  left: 50%;
  opacity: 1;
  position: absolute;
  top: 50%;
  transform: translate(-50%, -50%);
  width: 100%;
  z-index: -1;

  @media screen and (max-width: 1000px) {
    height: 100%;
    top: 50%;
    img {
      width:100%; /* Ajusta la posición de la imagen para centrarla vertical y horizontalmente */
    }
  }

  @media screen and (max-width: 680px) {
    height: 465px;
    width:100%;

    img {
      width: 100%;
    }
  }

  @media screen and (max-width: 550px) {
    height: 428px;
    width:100%;

    img {
      width: 100%;
    }
  }

  @media screen and (max-width: 485px) {
    height: 100%;
    width:100%;
    top:50%;

    img {
      width: 100%;
    }
  }

  img {
    height: 100%;
    width: 100%;
    object-fit: cover; /* Ajusta la imagen para cubrir completamente el contenedor */
    object-position: center top; /* Ajusta la posición de la imagen para centrarla en la parte superior */
  }
`;

const Text = styled.p`
  width:450px;
  font-size: 1.1rem;
  font-weight:400;
  color:var(--color);
  display: -webkit-box;
  -webkit-line-clamp: 4;
  -webkit-box-orient: vertical;
  overflow: hidden;
  white-space: normal;
  text-overflow: ellipsis;

`

const Button = styled.button`
  font-size: 1.20rem;
  padding: .900rem 3rem;
  background-color: #ff3f3f;
  width:280px;
  border: none;
  color: #fff;
  border-radius: 8px;
  margin-top: 1rem;
  cursor: pointer;
  transition: all 0.3s ease-out;

  @media screen and (max-width: 680px) {
    font-size: 1.050rem;
    padding: .900rem 2rem;
  }

  @media screen and (max-width: 485px) {
    width:200px;
  }

  @media screen and (max-width: 320px) {
    width:170px;
    padding: .900rem 0rem;
  }
`

const ImageLoading = styled.div`
  opacity: 0.7;
  animation: skeleton-loading .5s linear infinite alternate;
  width: 282px;
  height: 150px;
  background-color: var(--skeleton-color);
  margin-top:1rem;
`

const TextLoading = styled.div`
  opacity: 0.7;
  width: 430px;
  margin-top: 10px;

  .css-bdVaJa {
    height: 17px;
    width: 100%;
    margin-bottom: 5px;
    background-color: var(--skeleton-color);
    animation: skeleton-loading .5s linear infinite alternate;

    &:last-child {
      width: 50%;
    }
  }

`

const ButtonLoading = styled.div`
  opacity: 0.7;
  animation: skeleton-loading .5s linear infinite alternate;
  width: 232px;
  height: 53px;
  background-color: var(--skeleton-color);
  margin-top:1rem;

  @keyframes skeleton-loading {
    0% {
      background-color: var(--skeleton-color);
    }

    100% {
      background-color: var(--skeleton-color-100);
    }
  }
`

const Logo = styled.figure`
  width: 281px;
  height: 149px;
  img {
    width: 100%;
  }

  @media screen and (max-width: 680px) {
    width: 200px;
    height: 100px;
    margin:0 auto;
    text-align:center;
  }
`;

function Carousel() {
  const isWidth = useQuery('(min-width: 1001px)');
  const isMobile = useQuery('(min-width: 485px)');
  const [loading, setLoading] = useState(true);
  const [mangas, setMangas] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch("/api/v1/popular");

        if (!response.ok) {
          throw new Error('Network response was not ok');
        }

        const data = await response.json();
        setMangas(data);
        setLoading(false);
      } catch (error) {
        console.error('Error fetching data:', error);
        setLoading(true);
      }
    };

    fetchData();
  }, []);

  return (
        <>
        {loading ?
        <ContainerLoading>
          <Info>
            <ImageLoading/>
            {isWidth &&
            <TextLoading>
              <div className='css-bdVaJa'/>
              <div className='css-bdVaJa'/>
              <div className='css-bdVaJa'/>
              <div className='css-bdVaJa'/>
            </TextLoading>}
            <div>
              <ButtonLoading/>
            </div>
          </Info>
          {isMobile && (
            <>
              <Prev type="button" aria-label="Anterior Articulo">
                <HeliosLeft />
              </Prev>
              <Next type="button" aria-label="Siguiente Articulo">
                <HeliosRight />
              </Next>
            </>
          )}
        </ContainerLoading>:
        <Helios>
        {mangas.map((manga, index) => (
          <Container key={index}>
            <Info>
              <Link href={`/view/${manga.slug}`}><Logo style={!manga.logo ? { width: "170px", height: "240px", marginBottom: '20px', boxShadow: '0px 0px 15px 5px rgba(0,0,0,0.43)' } : {}}>
                <picture>
                  <img loading="lazy" src={manga.logo ? manga.logo : manga.poster} alt={manga.title}/>
                </picture>
              </Logo></Link>
                {isWidth && <Text>{manga.overview}</Text>}
              <div>
              <Button>Empezar a leer</Button>
              </div>
            </Info>
            <Figure>
              <picture>
                <img
                    src={!manga.background ? (
                      manga.poster
                    ):(
                      isMobile ? manga.background : manga.poster
                    )}
                    loading="lazy" 
                    alt={manga.title}
                  />
              </picture>
            </Figure>
          </Container>
        ))}
       </Helios>}
       </>
  );
}

export default Carousel;
