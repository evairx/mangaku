import { useEffect, useState } from "react";
import { useCookies } from 'react-cookie';

function MyApp({ Component, pageProps }) {
  const [cookies, setCookie] = useCookies(['token']);
  const [tokenGuardado, setTokenGuardado] = useState(false);
  const [loading, setLoading] = useState(true);

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
          setTokenGuardado(true);
        } else {
          console.error('Error al obtener el token desde el servidor');
          setTokenGuardado(false);
        }
        setLoading(false);
      } catch (error) {
        console.error('Error:', error);
        setTokenGuardado(false);
        setLoading(false);
      }
    };

    if (typeof window !== 'undefined' && !cookies.token && !tokenGuardado) {
      obtenerTokenDesdeServidor();
    } else {
      setLoading(false);
    }
  }, [cookies.token, setCookie, tokenGuardado]);

  if (loading) {
    return null;
  }

  const handleContextMenu = (event) => {
    event.preventDefault();
  };
  
  return <Component {...pageProps} />
}

export default MyApp
