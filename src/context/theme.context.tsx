import React, { createContext, Dispatch, FC, ReactNode, SetStateAction, useEffect, useState } from 'react';

type ThemeType = "light" | "dark" | 'system';
type ThemeContextType = {
  theme: ThemeType,
  themeChange: Dispatch<SetStateAction<ThemeType>>
}
interface ThemeProviderProps {
  children: ReactNode | ReactNode[];
}

const ThemeMapper: Record<ThemeType, string> = {
  light: '浅色',
  dark: '深色',
  system: '跟随系统'
}

const initialTheme: ThemeType = "light"; // 初始主题
const ThemeContext = createContext<ThemeContextType>({} as never);

const switchDark = () => {
  document.body.setAttribute('arco-theme', 'dark')
};

const switchLight = () => {
  document.body.removeAttribute('arco-theme')
};

const ThemeProvider: FC<ThemeProviderProps> = ({ children }) => {
  const [theme, themeChange] = useState<ThemeType>(initialTheme);
  // 当设置主题为跟随系统时
  useEffect(() => {
    if (theme === 'light') switchLight();
    if (theme === 'dark') switchDark();
    if (theme === 'system') {
      const darkThemeMq = window.matchMedia("(prefers-color-scheme: dark)");
      darkThemeMq.matches ? switchDark() : switchLight();
      darkThemeMq.addEventListener('change', e => {
        e.matches ? switchDark() : switchLight();
      });
    }
  }, [theme]);
  return (
    <ThemeContext.Provider value={{ theme, themeChange }}>
      {children}
    </ThemeContext.Provider>
  );
};

export { ThemeContext, ThemeProvider, ThemeMapper };
export type { ThemeContextType, ThemeProviderProps };
