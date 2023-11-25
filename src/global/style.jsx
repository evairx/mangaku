import { Global, css } from '@emotion/react'

export default function GlobalStyles({theme}) {
  const global = css`
    @font-face {
      font-family: 'Inter';
      src: url(/fonts/Inter-400.woff2);
      font-weight: 400;
      font-style: normal; /* o puedes omitir esta línea ya que 'normal' es el valor por defecto */
    }
    
    @font-face {
      font-family: 'Inter';
      src: url(/fonts/Inter-600.woff2);
      font-weight: 600;
      font-style: normal;
    }

    :root {
      --dark:#000;
      --light:#eee;
      --border: ${theme === "--dark" ? "#eee": "#000"};
    }

    * {
      margin: 0;
      padding: 0;
      box-sizing: border-box;
      font-family: 'Inter';
    }

    body {
      background-color: var(${theme});
      color:${theme === "--dark" ? "#eee": "#000"};
    }
  `;

  return (
    <Global styles={global} />
  )
}