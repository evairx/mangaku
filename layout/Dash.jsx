import { useState, useEffect } from "react";
import Head from "next/head";
import GlobalStyle from "@/src/styles/style";
import Nav from "@/src/components/navDash";
import useDark from '@/src/hooks/useDark';
import styled from "@emotion/styled";

const Container = styled.section`
    display:flex;
    gap:1rem;
    padding:1rem;
`

export default function Main({ children,  layout }) {
    const dark = useDark();
    const [theme, setTheme] = useState(dark);

    useEffect(() => {
      setTheme(dark);
    }, [dark]);

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
        <Container>
            <header>
                <Nav/>
            </header>
            <main>
            {children}
            </main>
        </Container>
      </>
    );
  }