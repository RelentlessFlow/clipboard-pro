import React, { FC, useEffect } from 'react';
import { ThemeProvider } from './context/theme.context';
import Clipboard from './pages/clipboard';
import { useClipboardStore } from '@/store/clipboard';

const App: FC = () => {
  const { initialList } = useClipboardStore();
  useEffect(() => { initialList() }, []);
  return (
    <ThemeProvider>
      <Clipboard />
    </ThemeProvider>
  )
}

export default App;
