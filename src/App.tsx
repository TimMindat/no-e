import { useState, useEffect } from 'react';
import { IconButton, Container, useMediaQuery } from '@mui/material';
import Brightness4Icon from '@mui/icons-material/Brightness4';
import Brightness7Icon from '@mui/icons-material/Brightness7';
import { ThemeProvider, useTheme } from './contexts/ThemeContext';
import { Note } from './components/Note';
import { Envelope } from './components/Envelope';
import { FestiveBackground } from './components/FestiveBackground';
import { letterContent } from './config/letterContent';
import './App.css';

const AppContent = () => {
  const { isDarkMode, toggleTheme } = useTheme();
  const [isNoteVisible, setIsNoteVisible] = useState(false);
  const isMobile = useMediaQuery('(max-width:600px)');

  useEffect(() => {
    const timer = setTimeout(() => setIsNoteVisible(true), 500);
    return () => clearTimeout(timer);
  }, []);

  // Use the title and message from the letterContent configuration
  const { title, message } = letterContent;

  return (
    <Container
      sx={{
        minHeight: '100vh',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        padding: isMobile ? 2 : 4,
        position: 'relative'
      }}
    >
      <IconButton
        onClick={toggleTheme}
        sx={{
          position: 'absolute',
          top: 20,
          right: 20
        }}
      >
        {isDarkMode ? <Brightness7Icon /> : <Brightness4Icon />}
      </IconButton>
      <Envelope>
        <Note title={title} message={message} isVisible={isNoteVisible} />
      </Envelope>
    </Container>
  );
};

function App() {
  return (
    <ThemeProvider>
      <FestiveBackground />
      <AppContent />
    </ThemeProvider>
  );
}

export default App;
