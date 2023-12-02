import { useEffect } from "react";

function MyApp({ Component, pageProps }) {
  
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

  const handleContextMenu = (event) => {
    event.preventDefault();
  };
  
  return <Component {...pageProps} />
}

export default MyApp
