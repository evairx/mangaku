import styled from "@emotion/styled"
import Layout from "@/layout/View"
import { useRouter } from 'next/router';
import { useEffect, useState } from "react";

const Container = styled.div`
    margin:0 auto;
    text-align:center;
`
const Image = styled.img`
    @media screen and (max-width: 938px) {
        width: 70%;
        height:100%;
    }

    @media screen and (max-width: 553px) {
        width: 100%;
        height:100%;
    }
`

export default function Manga() {
    const [detectedImages, setDetectedImages] = useState([]);
    const router = useRouter();
    const { id, p } = router.query;

    console.log(id)

    useEffect(() => {
        const imageElement = document.getElementById(`image-${p}`);
        if (imageElement) {
          imageElement.scrollIntoView({ behavior: 'smooth' });
        }
      }, [p]);

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
    
        // Agregar el evento de scroll
        window.addEventListener('scroll', handleScroll);
    
        // Limpiar el evento al desmontar el componente
        return () => {
          window.removeEventListener('scroll', handleScroll);
        };
      }, [detectedImages]);

    return (
        <Layout>
            <Container>
                <div id="image-1">
                    <Image src="/1.webp"/>
                </div>
                <div id="image-2">
                    <Image src="/2.webp"/>
                </div>
                <div id="image-3">
                    <Image src="/3.webp"/>
                </div>
            </Container>
        </Layout>
    )
}