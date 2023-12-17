import { useRouter } from 'next/router';
import { useState, useEffect } from 'react';
import Layout from '@/layout/Main';
import styled from '@emotion/styled';

const Space = styled.div`
    height: 3.5rem;
    background-color: var(--background-nav);
`;

const Container = styled.section`
    position:relative;
    height: 50vh;
    width: 100%;
    overflow: hidden;
    padding: 1rem 5rem;
    background: linear-gradient(transparent, var(--helios-gradient-1), var(--helios-gradient-2),var(--helios-gradient-3)),linear-gradient(to left, transparent, var(--helios-gradient-1a), var(--helios-gradient-2a), var(--helios-gradient-3a));
`;

const Background = styled.figure`
    position: absolute;
    top: 0px;
    left: 0;
    width: 100%;
    height:auto;
    z-index: -1;
    filter: blur(9px);
    overflow: hidden;

    img {
        width: 100%;
        object-fit: cover;
    }
`

const Main = styled.main`
    position: absolute;
    bottom: 20px;
`

const Poster =  styled.figure`
    width:200px;
    height:284px;
    overflow: hidden;
    -webkit-box-shadow: 0px 0px 15px -2px #000000; 
    box-shadow: 0px 0px 15px -2px #000000;
    border-radius:8px;

    img {
        width: 100%;
        object-fit: cover;
    }
`
const Info = styled.article`
    display:flex;
    gap: 1rem;
`

const InfoContent = styled.div`
    position: absolute;
    left:14rem;
    bottom: 0px;
`

const Title = styled.h1`
    font-size: 2rem;
    width: 1000px;
    font-weight: 600;
    margin-bottom:.400rem
`

const Overview = styled.p`
    margin-bottom:.400rem;
    margin-top:.400rem;
`

const TitleAlternative = styled.p`
    margin-bottom:.400rem;
    color: #cfcfcf;
`

const ButtonContainer = styled.div`
    display:flex;
    gap:.400rem
`

const GenresContainer = styled.div`
  display:flex;
  gap:.400rem;
  margin-bottom:.800rem
`
const Genres = styled.span`
    background-color: var(--background-nav);
    padding: .200rem .700rem;
    border-radius: 8px;
`

const Button = styled.button`
    font-size: 1.050rem;
    padding: .200rem 0;
    width:130px;
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

export default function Detail({token}) {
    const [manga, setManga] = useState({});
    const [page, setPage] = useState(1);
    const [loading, setLoading] = useState(true);
    const router = useRouter();
    const { slug } = router.query;

    useEffect(() => {
        const fetchData = async () => {

            try {
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

    function handleChapters(){
        setPage(1);
    }

    function handleComents(){
        setPage(2);
    }

    const layout = {
        title: loading ? 'Mangaku' : `${manga.title} en Español | Mangaku`,
        description: '3',
    };

    return (
        <Layout layout={layout}>
            <Space />
            {loading ?
                <ContentLoad>
                    <Loader>
                        <Bar />
                        <Bar />
                        <Bar />
                    </Loader>
                </ContentLoad>
                :
                <Container>
                    <Background>
                        <picture>
                            <img src={manga.background}/>
                        </picture>
                    </Background>
                    <Main>
                        <Info>
                            {manga.poster &&
                            <Poster>
                                <picture>
                                    <img src={manga.poster}/>
                                </picture>
                            </Poster>}
                            <InfoContent>
                                {manga.title && <Title>{manga.title}</Title>}
                                {manga.titleJp && <TitleAlternative>{manga.titleJp}</TitleAlternative >}
                                {manga.overview && <Overview>{manga.overview}</Overview>}
                                {manga.author && <TitleAlternative>{manga.author}</TitleAlternative >}
                                <GenresContainer>
                                    {manga.genres && manga.genres.map((genre, index) => (
                                        <Genres key={index}>{genre}</Genres>
                                    ))}
                                </GenresContainer>
                                <ButtonContainer>
                                    <Button onClick={handleChapters}>Capitulos</Button>
                                    <Button onClick={handleComents}>Comentarios</Button>
                                </ButtonContainer>
                            </InfoContent>
                        </Info>
                    </Main>
                </Container>
            }

            {loading ? undefined: <div>
                {page === 1 && 
                    <p>capitulos</p>
                }

                {page === 2 &&
                    <p>comentarios</p>
                }
            </div>}
        </Layout>
    );
}

export async function getServerSideProps() {
    const token = process.env.TOKEN;

    return {
        props: {
            token,
        },
    };
}