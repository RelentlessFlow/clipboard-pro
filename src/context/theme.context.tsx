import React, { createContext, FC, ReactNode } from 'react';

type ThemeContextType = 'light' | 'dark';

const ThemeContext = createContext<ThemeContextType>('dark');

interface ThemeProviderProps {
	children: ReactNode | ReactNode[];
}

const ThemeProvider: FC<ThemeProviderProps> = ({ children}) => {
	const initialTheme: ThemeContextType = 'light'; // 初始主题

	return (
		<ThemeContext.Provider value={initialTheme}>
			{ children }
		</ThemeContext.Provider>
	);
}

export {
	ThemeContext,
	ThemeProvider
}

export type {
	ThemeContextType,
	ThemeProviderProps,
}