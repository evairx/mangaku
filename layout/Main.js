import { useState, useEffect } from "react";
import Head from "next/head";
import GlobalStyle from "@/src/global/style";
import useDark from '@/src/hooks/useDark';

export default function Main({ children,  layout }) {
    const dark = useDark();
    const [theme, setTheme] = useState(dark);

    useEffect(() => {
      setTheme(dark);
    }, [dark]);

    return (
      <>
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
        </Head>
        <GlobalStyle theme={theme}/>
        <main>
          {children}
        </main>
      </>
    );
  }