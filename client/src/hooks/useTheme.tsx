import { useState, useEffect } from 'react';

type Theme = 'light' | 'dark' | string;

const useTheme = () => {
  const [theme, setTheme] = useState<Theme>(() => {
    return (
      localStorage.getItem('theme') ||
      document.documentElement.getAttribute('data-theme') ||
      'light'
    );
  });

  const updateTheme = (newTheme: Theme) => {
    setTheme(newTheme);
    document.documentElement.setAttribute('data-theme', newTheme);
    localStorage.setItem('theme', newTheme);
  };

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme);
  }, [theme]);

  return { theme, setTheme: updateTheme };
};

export default useTheme;
