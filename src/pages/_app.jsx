import { useEffect } from "react";
import { useCookies } from 'react-cookie';

function MyApp({ Component, pageProps }) {
  const [cookies, setCookie] = useCookies(['token']);

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const savedTheme = localStorage.getItem('theme');

      if (!savedTheme) {
        localStorage.setItem('theme', 'system');
      }
    }
  }, []);

  useEffect(() => {
    document.addEventListener("contextmenu", handleContextMenu);
    return () => {
      document.removeEventListener("contextmenu", handleContextMenu);
    };
  }, []);

 useEffect(() => {
    const obtenerTokenDesdeServidor = async () => {
      try {
        const respuesta = await fetch('/api/v1/user/anony', {
          method: 'POST',
        });

        if (respuesta.ok) {
          const data = await respuesta.json();
          const nuevoToken = data.token;

          setCookie('token', nuevoToken, { path: '/', expires: new Date(Date.now() + 12 * 60 * 60 * 1000) });
        } else {
          console.error('Error al obtener el token desde el servidor');
        }
      } catch (error) {
        console.error('Error:', error);
      }
    };

    if (!cookies.token) {
      obtenerTokenDesdeServidor();
    }
  }, [cookies.token, setCookie]);

  const handleContextMenu = (event) => {
    event.preventDefault();
  };
  
  return <Component {...pageProps} />
}

export default MyApp
