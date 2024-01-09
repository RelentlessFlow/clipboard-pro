import React from 'react';
import useTheme from './hooks/useTheme';

const Title: React.FC = () => {
	const theme = useTheme()
	return <div> { theme } {/* light */} </div>
}

export default Title;