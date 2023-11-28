import React , { useState, useEffect }from 'react'
import Helios from "./helios"
import styled from '@emotion/styled';
import useQuery from "@/src/hooks/useQuery"

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
  height: 100vh;
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
  background-color: hsla(199, 20%, 70%, 0.288);
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
    background-color: hsla(199, 20%, 70%, 0.288);
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
  background-color: hsla(199, 20%, 70%, 0.288);
  margin-top:1rem;

  @keyframes skeleton-loading {
    0% {
      background-color: hsla(199, 20%, 70%, 0.288);
    }

    100% {
      background-color: hsla(204, 20%, 95%, 0.685);
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
  const [fontsLoaded, setFontsLoaded] = useState(false);

  useEffect(() => {
    const fakeFontLoadingTime = 1000;
    
    const timer = setTimeout(() => {
      setFontsLoaded(true);
    }, fakeFontLoadingTime);

    return () => clearTimeout(timer);
  }, []);

  const mangas = [
    {
      title: "Solo Leveling",
      poster: "e90bdc47-c8b9-4df7-b2c0-17641b645ee1.jpg.512.webp",
      synopsis: "En un mundo en el que seres despiertos llamados 'Cazadores' deben luchar contra monstruos mortales para proteger a la humanidad, Sung Jinwoo, apodado 'el cazador más débil de toda la humanidad', se encuentra en una lucha constante por la supervivencia. Un día, tras un brutal encuentro en una mazmorra sobrepotenciada que aniquila a su grupo y amenaza con acabar con su vida, un misterioso Sistema le elige como único jugador: A Jinwoo se le ha concedido la rara oportunidad de subir de nivel sus habilidades, posiblemente más allá de cualquier límite conocido. Sigue el viaje de Jinwoo mientras se enfrenta a enemigos cada vez más fuertes, tanto humanos como monstruos, para descubrir los secretos de las profundidades de las mazmorras y el alcance definitivo de sus poderes.",
      logo: "Solo_Leveling.webp",
      background: "b6e07b80-e5a7-48c6-8919-0aa7c3e70abb.webp"
    },
    {
      title: "Jujutsu Kaisen",
      poster: "a1eecd65-0cd9-4a6f-86a8-f1bb44c6310b.jpg.512.webp",
      synopsis: "Aunque Yuji Itadori parece un adolescente normal y corriente, ¡su inmensa fuerza física es algo digno de contemplar! Todos los clubes deportivos quieren que se una a ellos, pero Itadori prefiere pasar el rato con los marginados del Club de Investigación Oculta. Un día, el club consigue hacerse con un objeto maldito sellado. No se imaginan el terror que desatarán cuando rompan el sello...",
      logo: "jujutsu.webp",
      background: "b4e07b80-e5a7-48c6-8919-0aa7c3e70abb.webp"
    },
    {
      title: "Rent-a-Girlfriend",
      poster: "090867df-a911-453e-817d-37bd322f84ae.jpg.512.webp",
      synopsis: "Kinoshita Kazuya es un estudiante universitario fracasado de 20 años. Consiguió besar a su novia una vez, pero le dejaron al cabo de un mes. 'Ugh... Maldita sea. No quiero volver a pasar por eso'.Completamente rencoroso, Kazuya utiliza cierto método para salir con una chica. Va a su lugar de encuentro y de repente oye: 'Eres Kazuya-kun, ¿verdad?'. Una hermosa chica que peinaba su largo pelo negro detrás de la oreja estaba allí, sonriéndole. Se llamaba Mizuhara Chizuru. ¡Algo real nace después de un simple alquiler! ¡Una temeraria comedia romántica llena de amor y emoción está a punto de comenzar!",
      logo: "rent-a-girlfriend.webp",
      background: "b89e07b80-e5a7-48c6-8919-0aa7c3e70abb.webp"
    },
    {
      title: "Sometimes Even Reality Is a Lie!",
      poster: "9e1fdcf5-6c82-409c-a04b-0b3169cdea54.jpg.512.jpg",
      synopsis: "Kinoshita Kazuya es un estudiante universitario fracasado de 20 años. Consiguió besar a su novia una vez, pero le dejaron al cabo de un mes. 'Ugh... Maldita sea. No quiero volver a pasar por eso'.Completamente rencoroso, Kazuya utiliza cierto método para salir con una chica. Va a su lugar de encuentro y de repente oye: 'Eres Kazuya-kun, ¿verdad?'. Una hermosa chica que peinaba su largo pelo negro detrás de la oreja estaba allí, sonriéndole. Se llamaba Mizuhara Chizuru. ¡Algo real nace después de un simple alquiler! ¡Una temeraria comedia romántica llena de amor y emoción está a punto de comenzar!",
      logo: "",
      background: "aa7d7njb2rm4xhdhqwx33wivf4.webp"
    }
  ]

  return (
      <Helios>
        {mangas.map((manga, index) => (
          <Container key={index}>
            <Info>
              {fontsLoaded ? <Logo style={!manga.logo ? { width: "170px", height: "240px", marginBottom: '20px', boxShadow: '0px 0px 15px 5px rgba(0,0,0,0.43)' } : {}}>
                <picture>
                  <img loading="lazy" src={manga.logo ? manga.logo : manga.poster} alt={manga.title}/>
                </picture>
              </Logo>: <ImageLoading/>}
              {fontsLoaded ? (
                isWidth && <Text>{manga.synopsis}</Text>
                ):(
                isWidth &&
                  <TextLoading>
                    <div className='css-bdVaJa'/>
                    <div className='css-bdVaJa'/>
                    <div className='css-bdVaJa'/>
                    <div className='css-bdVaJa'/>
                  </TextLoading>
                )
              }
              <div>
              {fontsLoaded ? <Button>Empezar a leer</Button>:<ButtonLoading/>}
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
      </Helios>
  );
}

export default Carousel;
