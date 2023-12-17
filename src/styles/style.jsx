import { Global, css } from '@emotion/react'

export default function GlobalStyles({theme}) {
  const global = css`
    @font-face {
      font-family: 'Inter';
      src: url(/fonts/inter-latin-400-normal.woff2);
      font-weight: 400;
      font-style: normal;
    }
    
    @font-face {
      font-family: 'Inter';
      src: url(/fonts/inter-latin-600-normal.woff2);
      font-weight: 600;
      font-style: normal;
    }

    :root {
      --dark:#000;
      --light:#fffff;
      --border: ${theme === "--dark" ? "#eeeeee68": "#00000068"};
      --background-nav:${theme === "--dark" ? "#17181c": "#ffff"};
      --loader-bars: ${theme === "--dark" ? "rgba(255, 255, 255, 0.5)": "rgba(8, 7, 7, 0.5)"};
      --main: ${theme === "--dark" ? "#ff3f3f": "#ff0a0a"};
      --main-: ${theme === "--dark" ? "#1a1c20": "#fff"};
      --color: ${theme === "--dark" ? "#fff": "#000"};
      --usernav: ${theme === "--dark" ? "#33333393": "#ffffff58"};
      --color-2: ${theme === "--dark" ? "#000": "#fff"};
      --btn-hover: ${theme === "--dark" ? "#ffffff23": "#00000023"}; 
      --skeleton-color: ${theme === "--dark" ? "hsla(199, 20%, 70%, 0.288)": "hsla(195, 6%, 25%, 0.288)"};
      --skeleton-color-100: ${theme === "--dark" ? "hsla(204, 20%, 95%, 0.685)": "hsla(210, 3%, 25%, 0.685)"};
      --helios-indicator-active: ${theme === "--dark" ? "rgba(255, 255, 255, 0.497)": "rgba(0, 0, 0, 0.497)"};
      --helios-gradient-1:${theme === "--dark" ? "#00000036": "#ffffff36"};
      --helios-gradient-2:${theme === "--dark" ? "#0000005d": "#ffffff5d"};
      --helios-gradient-3:${theme === "--dark" ? "#000000": "#ffffff"};
      --helios-gradient-1a:${theme === "--dark" ? "#0000002d": "#ffffff2d"};
      --helios-gradient-2a:${theme === "--dark" ? "#0000008e": "#ffffff8e"};
      --helios-gradient-3a:${theme === "--dark" ? "#000000c2": "#ffffffc2"};
      
    }

    * {
      margin: 0;
      padding: 0;
      box-sizing: border-box;
      font-family: 'Inter';
      user-select: none;
    }

    body {
      background-color: var(${theme});
      color:${theme === "--dark" ? "#ffff": "#000"};
    }
  `;

  return (
    <Global styles={global} />
  )
}