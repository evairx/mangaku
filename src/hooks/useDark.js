import { useState, useEffect } from 'react';

function getInitialTheme() {
  if (typeof window !== 'undefined') {
    return window.matchMedia('(prefers-color-scheme: dark)').matches ? '--dark' : '--light';
  }

  return '--dark';
}

function useTheme() {
  const [dark, setDark] = useState(getInitialTheme());

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const handleChange = (e) => {
        setDark(e.matches ? '--dark' : '--light');
      };

      const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
      mediaQuery.addEventListener('change', handleChange);

      return () => {
        mediaQuery.removeEventListener('change', handleChange);
      };
    }
  }, []);

  return dark;
}

export default useTheme;