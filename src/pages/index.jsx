import Layout from "@/layout/Main"
import Carousel from "../components/carousel"

export default function Home() {
  const layout = {
    title: 'Mangaku',
    description: '3'
  }

  return (
    <Layout layout={layout}>
      <Carousel/>
    </Layout>
  )
}