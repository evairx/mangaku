export default function Genres ({data, manga})  {
  return (
    <div>
      <h1>{data.totalPages}</h1>
      {manga.map((manga , index) => (
        <div key={index}>
          <img src={manga.poster} alt={manga.title} width={140} height={200}/>
          <p>{manga.title}</p>
        </div>
      ))}
    </div>
  );
};

export async function getServerSideProps(context) {
  try {
    const { id} = context.params;
    const { page } = context.query;
    const url = process.env.NODE_ENV === 'development' ? `http://localhost:${process.env.PORT || 3000}` : `https://${req.headers.host}`;
  
    const res = await fetch(`${url}/api/v1/genre/${id}?page=${page}`)
    const data = await res.json()
    const manga = data.content;
  
    return {
      props: {
        data,
        manga: JSON.parse(JSON.stringify(manga)),
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