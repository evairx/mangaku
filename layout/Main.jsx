import { useState, useEffect } from "react";
import Nav from "@/src/components/nav";
import Head from "next/head";
import useDark from '@/src/hooks/useDark';
import GlobalStyle from "@/src/styles/style";

export default function Main({ children, layout }) {
  const dark = useDark();
  const [theme, setTheme] = useState(dark);

  useEffect(() => {
      let initialTheme = localStorage.getItem('theme');
      if (initialTheme === 'system') {
          setTheme(dark);
      } else if (initialTheme === 'dark'){
          setTheme('--dark');
      } else if (initialTheme === 'light'){
          setTheme('--light');
      }
  }, [dark]);

  function handleDark() {
    if (typeof window !== 'undefined') {
        localStorage.setItem('theme', 'dark');
        setTheme('--dark');
    }
  }

  function handleLight() {
    if (typeof window !== 'undefined') {
        localStorage.setItem('theme', 'light');
        setTheme('--light');
    }
  }

  function handleSystem() {
    if (typeof window !== 'undefined') {
        localStorage.setItem('theme', 'system');
        setTheme(dark);
    }
  }

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
              href="/fonts/inter-latin-400-normal.woff2"
              as="font"
              type="font/woff2"
              crossOrigin="anonymous"
          />
          <link
              rel="preload"
              href="/fonts/inter-latin-600-normal.woff2"
              as="font"
              type="font/woff2"
              crossOrigin="anonymous"
          />
        </Head>
        <header>
          <Nav theme={theme} handleDark={handleDark} handleLight={handleLight} handleSystem={handleSystem}/>
        </header>
        <main>
          {children}
        </main>
      </>
    );
  }