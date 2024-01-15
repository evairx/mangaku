import { useRouter } from 'next/router';
import { useState, useEffect } from 'react';
import { useCookies } from 'react-cookie';
import Comments from '@/src/components/comments';
import Layout from '@/layout/Main';
import styled from '@emotion/styled';

const Space = styled.div`
    height: 3.5rem;
    background-color: var(--background-nav);
`;

const Container = styled.div`

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
                  
                </Container>
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