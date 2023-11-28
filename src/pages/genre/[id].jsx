import Link from "next/link";
import Layout from "@/layout/Main"

export default function Genres ({data , id})  {
  const { totalPages, genre, content } = data;

  const renderPaginationLinks = () => {
    const links = [];

    for (let i = 1; i <= totalPages; i++) {
      links.push(
        <li key={i}>
          <Link href={`/genre/${id}?page=${i}`}>
            {i}
          </Link>
        </li>
      );
    }

    return links;
  };

  const layout = {
    title: `${genre} | Mangaku`,
    description: '3'
  }

  return (
    <Layout layout={layout}>
      <div>
        {content.map(item => (
          <div key={item._id}>
            <h2>{item.title}</h2>
            <img src={item.poster} alt={item.title} width={150} height={200}/>
          </div>
        ))}
        <ul>
          {renderPaginationLinks()}
        </ul>
      </div>
    </Layout>
  );
};

export async function getServerSideProps(context) {
  try {
    const { id } = context.params;
    const { page } = context.query;
    const url = process.env.NODE_ENV === 'development' ? `http://localhost:${process.env.PORT || 3000}` : `https://${req.headers.host}`;
  
    const res = await fetch(`${url}/api/v1/genre/${id}?page=${page}`)
    const data = await res.json()
  
    return {
      props: {
        data,
        id
      },
    };
  } catch (err) {
    console.log(err)
    return {
      redirect: {
        permanent: false,
        destination: '/',
      },
      props: {},
    }
  }
}