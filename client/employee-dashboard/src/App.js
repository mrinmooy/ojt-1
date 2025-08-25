import React, { useState } from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import { CssBaseline } from '@mui/material';
import MainPage from './components/jsx/MainPage';
import FormPage from './components/jsx/FormPage';

function App() {
  const [mode, setMode] = useState('light');

  const theme = createTheme({
    palette: { mode },
  });

  const toggleMode = () => {
    setMode((prev) => (prev === 'light' ? 'dark' : 'light'));
  };

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<MainPage toggleMode={toggleMode} mode={mode} />} />
          <Route path="/add" element={<FormPage />} />
        </Routes>
      </BrowserRouter>
    </ThemeProvider>
  );
}

export default App;
