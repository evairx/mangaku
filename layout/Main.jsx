import { useState, useEffect } from "react";
import Nav from "@/src/components/nav";
import Head from "next/head";
import GlobalStyle from "@/src/styles/style";

export default function Main({ children, layout }) {
    const isBrowser = typeof window !== 'undefined';

    const savedTheme = isBrowser ? localStorage.getItem('theme') : null;

    const initialTheme = savedTheme ? savedTheme : '--dark';

    const [theme, setTheme] = useState(initialTheme);
    
    useEffect(() => {
      if (isBrowser) {
        localStorage.setItem('theme', theme);
      }
    }, [theme]);

    const toggleDarkMode = () => {
      const currentTheme = isBrowser ? localStorage.getItem('theme') : null;

      if (currentTheme === '--dark') {
        setTheme('--light');
      } else {
        setTheme('--dark');
      }
    };

    return (
      <>
        <GlobalStyle theme={theme}/>
        <Head>
            <title>{layout?.title}</title>
            <meta name="description" content={layout?.description} />
            <meta name="subject" content="Mangaku"/>
            <meta name="viewport" content="width=device-width, initial-scale=1" />
            <meta property="og:title" content={layout?.title}/>
            <meta property="og:description" content={layout?.description}/>
            <meta property="og:url" content=""/>
            <link rel="icon" href="/favicon.ico" />
            <link rel="manifest" href="/manifest.json" />
            <link
              rel="preload"
              href="/fonts/Inter-400.woff2"
              as="font"
              type="font/woff2"
              crossOrigin="anonymous"
          />
          <link
              rel="preload"
              href="/fonts/Inter-600.woff2"
              as="font"
              type="font/woff2"
              crossOrigin="anonymous"
          />
        </Head>
        <header>
          <Nav theme={theme} toggleDarkMode={toggleDarkMode}/>
        </header>
        <main>
          {children}
        </main>
      </>
    );
  }