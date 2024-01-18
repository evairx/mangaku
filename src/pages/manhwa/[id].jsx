import styled from "@emotion/styled"
import Layout from "@/layout/View"
import { useRouter } from 'next/router';
import { useEffect, useState } from "react";

const Container = styled.div`
    margin: 0 auto;
    text-align: center;
`

const Figure = styled.figure`
    padding: 0;

    img {
      object-fit: cover; 
      object-position: center top;

      @media screen and (max-width: 938px) {
        width: 70%;
        height: 100%;
      }

      @media screen and (max-width: 553px) {
        width: 100%;
        height: 100%;
      }
    }
`

export default function Manga() {
    const [detectedImages, setDetectedImages] = useState([]);
    const router = useRouter();
    const { page } = router.query;

    useEffect(() => {
        const imageElement = document.getElementById(`image-${page}`);
        if (imageElement) {
            imageElement.scrollIntoView({ behavior: 'smooth' });
        }
    }, [page]);

    useEffect(() => {
        const handleScroll = () => {
            const imageElements = document.querySelectorAll('[id^="image-"]');

            imageElements.forEach((imageElement) => {
                const imageId = imageElement.id.replace('image-', '');
                const isImageDetected = detectedImages.includes(imageId);
                const scrollPosition = window.scrollY;
                const imagePosition = imageElement.offsetTop;

                if (scrollPosition >= imagePosition && scrollPosition < imagePosition + imageElement.offsetHeight && !isImageDetected) {
                    console.log(`You are currently viewing Image ${imageId}!`);
                    setDetectedImages((prevDetectedImages) => [...prevDetectedImages, imageId]);
                }
            });
        };

        window.addEventListener('scroll', handleScroll);

        return () => {
            window.removeEventListener('scroll', handleScroll);
        };
    }, [detectedImages]);

    return (
        <Layout>
            <Container>
                {[...Array(13).keys()].map((index) => (
                    <div key={`image-${index + 1}`} id={`image-${index + 1}`}>
                      <Figure>
                        <picture>
                          <img src={`/${index + 1}.webp`} loading="lazy" />
                        </picture>
                      </Figure>
                    </div>
                ))}
            </Container>
        </Layout>
    )
}