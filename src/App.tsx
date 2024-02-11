import React, { FC, useEffect, useState } from 'react';
import { ThemeProvider } from './context/theme.context';
import Clipboard from './pages/clipboard';

const App: FC = () => {

  return (
    <ThemeProvider>
      <Clipboard />
    </ThemeProvider>
  )
}

export default App;
