import Layout from "@/layout/Error"
import Image from "next/image"
import styled from "@emotion/styled";

const Container = styled.section`
    display: flex;
    justify-content: center;
    align-items: center;
    height: 80vh;
`

const Content = styled.main`
    text-align: center;
    padding: 2rem;
`

export default function Custom404() {
    const layout = {
        title: '404 No Found | Mangaku',
        description: '3'
      }

    return (
        <Layout layout={layout}>
            <Container>
                <Content>
                <figure>
                    <picture>
                        <Image src="/f33237e6cc7a6691497f8acd3073698c.webp" width={420} height={420} alt="pagina no encontrada" priority/>
                        </picture>
                    </figure>
                    <h1>Oh no! rompiste la pagina T.T</h1>
                </Content>
            </Container>
        </Layout>
    )
  }