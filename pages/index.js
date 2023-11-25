import Layout from "@/layout/Main"
import styled from "@emotion/styled"


const Image = styled.img`
  display: grid;
  grid-template-columns: 20rem 1fr;
  height:100vh;
  margin: 0 auto;
`

export default function Home() {
  
  const layout = {
    title: 'xdsss',
    description: '3'
  }

  return (
    <Layout layout={layout}>
      <Image src="https://mangaku-new.vercel.app/cdn/poster/dc1e4df4-0334-4541-ae07-27d2d5463962/1700807746229-h5-f3c1e1876151c8ce31de5d202dc639f56ac8c39f58369b5587f65dc31db9f2ac.png" alt="hola"/>
    </Layout>
  )
}
