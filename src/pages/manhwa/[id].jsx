import styled from "@emotion/styled"
import Layout from "@/layout/View"

const Container = styled.div`
    margin: 0 auto;
    text-align: center;
`

const Figure = styled.figure`
    img {
      object-fit: cover; 

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

    return (
        <Layout>
            <Container>
                {[...Array(13).keys()].map((index) => (
                    <div key={`image-${index + 1}`} style={{ margin: '-4px 0' }}>
                      <Figure>
                        <picture>
                          <img id={`image-${index + 1}`} src={`/${index + 1}.webp`} loading="lazy" />
                        </picture>
                      </Figure>
                    </div>
                ))}
            </Container>
        </Layout>
    )
}