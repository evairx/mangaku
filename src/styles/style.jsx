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
      --background-nav:${theme === "--dark" ? "#17181c": "#d5d5d5"};
      --loader-bars: ${theme === "--dark" ? "rgba(255, 255, 255, 0.5)": "rgba(8, 7, 7, 0.5)"};
      --main: ${theme === "--dark" ? "#ff3f3f": "#ff0a0a"};
      --main-: ${theme === "--dark" ? "#1a1c20": "#fff"};
      --color: ${theme === "--dark" ? "#fff": "#000"};
      --btn-filter-command: ${theme === "--dark" ? "#23252ba0": "#8890a897"};
      --usernav: ${theme === "--dark" ? "#33333393": "#ffffff58"};
      --color-2: ${theme === "--dark" ? "#000": "#fff"};
      --btn-hover: ${theme === "--dark" ? "#ffffff23": "#00000023"}; 
      --skeleton-color: ${theme === "--dark" ? "hsla(199, 20%, 70%, 0.288)": "hsla(195, 6%, 25%, 0.288)"};
      --skeleton-color-100: ${theme === "--dark" ? "hsla(204, 20%, 95%, 0.685)": "hsla(210, 3%, 25%, 0.685)"};
      --genres:${theme === "--dark" ? "#1a1c20": "#b7b7b7"};
      --helios-indicator-active: ${theme === "--dark" ? "rgba(255, 255, 255, 0.497)": "rgba(0, 0, 0, 0.497)"};
      --helios-gradient-1:${theme === "--dark" ? "#00000036": "#ffffff36"};
      --helios-gradient-2:${theme === "--dark" ? "#0000005d": "#ffffff5d"};
      --helios-gradient-3:${theme === "--dark" ? "#000000": "#ffffff"};
      --helios-gradient-1a:${theme === "--dark" ? "#0000002d": "#ffffff2d"};
      --helios-gradient-2a:${theme === "--dark" ? "#0000008e": "#ffffff8e"};
      --helios-gradient-3a:${theme === "--dark" ? "#000000c2": "#ffffffc2"};
      --details-gradient:${theme === "--dark" ? "#0000008d": "#ffffff8d"};
      --details-gradient-1:${theme === "--dark" ? "#000000ae": "#ffffffae"};
      --details-gradient-2:${theme === "--dark" ? "#000000e8": "#ffffffd6"};
      --details-gradient-3:${theme === "--dark" ? "#000000": "#ffffffe8"};
      --details-gradient-4:${theme === "--dark" ? "#000000": "#ffffff"};
      --details-gradient-mobile:${theme === "--dark" ? "#0000008d": "#ffffff8d"};
      --details-gradient-1-mobile:${theme === "--dark" ? "#000000ae": "#ffffffae"};
      --details-gradient-2-mobile:${theme === "--dark" ? "#000000d6": "#ffffffd6"};
      --details-gradient-3-mobile:${theme === "--dark" ? "#000000e8": "#ffffffe8"};
      --details-gradient-4-mobile:${theme === "--dark" ? "#000000": "#ffffff"};
      --bars-: ${theme === "--dark" ? "#0009": "#0005"};
      --bars-2: ${theme === "--dark" ? "#fff": "#000"};
    }

    * {
      margin: 0;
      padding: 0;
      box-sizing: border-box;
      font-family: 'Inter';

    }

    body {
      background-color: var(${theme});
      color:${theme === "--dark" ? "#ffff": "#000"};
    }

    ::-webkit-scrollbar {
      width: 6px;
      height: 8px;
      border-radius: 4px !important;
    }
    ::-webkit-scrollbar-button {
      width: 0px;
      height: 0px;
    }
    ::-webkit-scrollbar-thumb {
      background: #afafaf;
      border: 0px none #ffffff;
    }
    ::-webkit-scrollbar-thumb:hover {
      background: #ffffff;
    }
    ::-webkit-scrollbar-thumb:active {
      background: #ffffff;
    }
    ::-webkit-scrollbar-track {
      background: none;
      border: 0px none #ffffff;
    }
    ::-webkit-scrollbar-track:hover {
        background: none;
    }
    ::-webkit-scrollbar-track:active {
      background: none;
    }
    ::-webkit-scrollbar-corner {
      background: transparent;
    }
  `;

  return (
    <Global styles={global} />
  )
}