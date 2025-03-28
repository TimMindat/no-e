import { motion } from 'framer-motion';
import { useTheme } from '../contexts/ThemeContext';
import { Box, Typography, Paper } from '@mui/material';
import { styled } from '@mui/material/styles';

const StyledPaper = styled(Paper)(({ theme }) => ({
  position: 'relative',
  padding: theme.spacing(4),
  margin: theme.spacing(2),
  maxWidth: '600px',
  width: '90%',
  borderRadius: theme.spacing(2),
  transformOrigin: 'center center',
  boxShadow: theme.shadows[3],
  background: theme.palette.background.paper,
  transition: 'all 0.3s ease',
  overflow: 'hidden',
  '&::before': {
    content: '""',
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    background: `linear-gradient(45deg, ${theme.palette.primary.main}22, transparent)`,
    borderRadius: 'inherit',
    pointerEvents: 'none',
  },
  '&::after': {
    content: '""',
    position: 'absolute',
    top: -50,
    left: -50,
    right: -50,
    bottom: -50,
    background: `linear-gradient(45deg, transparent, ${theme.palette.primary.main}30, transparent)`,
    transform: 'rotate(25deg)',
    opacity: 0.7,
    animation: 'shimmer 3s infinite linear',
    pointerEvents: 'none',
  },
  '@keyframes shimmer': {
    '0%': {
      transform: 'translateX(-100%) rotate(25deg)'
    },
    '100%': {
      transform: 'translateX(100%) rotate(25deg)'
    }
  }
}));

const noteVariants = {
  hidden: {
    scale: 0.8,
    opacity: 0,
    y: 50,
    rotateX: -15
  },
  visible: {
    scale: 1,
    opacity: 1,
    y: 0,
    rotateX: 0,
    transition: {
      type: 'spring',
      damping: 20,
      stiffness: 100,
      duration: 0.8
    }
  },
  hover: {
    scale: 1.02,
    boxShadow: '0px 10px 20px rgba(0,0,0,0.2)',
    transition: {
      type: 'spring',
      stiffness: 400,
      damping: 10
    }
  },
  tap: {
    scale: 0.98,
    boxShadow: '0px 5px 10px rgba(0,0,0,0.1)',
    transition: {
      type: 'spring',
      stiffness: 500,
      damping: 20
    }
  }
};

interface NoteProps {
  message: string;
  isVisible: boolean;
  title?: string;
}

export const Note = ({ message, isVisible, title = "عيد مبارك يا نون" }: NoteProps) => {
  const { isDarkMode } = useTheme();

  return (
    <Box
      component={motion.div}
      initial="hidden"
      animate={isVisible ? 'visible' : 'hidden'}
      whileHover="hover"
      whileTap="tap"
      variants={noteVariants}
      style={{
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        perspective: '1000px'
      }}
    >
      <StyledPaper elevation={3}>
        <Typography
          variant="h5"
          component={motion.h2}
          animate={{ 
            scale: [1, 1.05, 1],
            color: isDarkMode ? 
              ['#fff', '#ffeb3b', '#fff'] : 
              ['#000', '#ff9800', '#000']
          }}
          transition={{
            repeat: Infinity,
            repeatType: 'reverse',
            duration: 3,
            ease: 'easeInOut'
          }}
          sx={{
            fontFamily: '"Noto Naskh Arabic", serif',
            marginBottom: 2,
            color: isDarkMode ? '#fff' : '#000',
            textAlign: 'center',
            textShadow: isDarkMode ? 
              '0 0 5px rgba(255,255,255,0.3)' : 
              '0 0 5px rgba(0,0,0,0.1)'
          }}
        >
          {title}
        </Typography>
        <Typography
          variant="body1"
          component={motion.p}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5, duration: 0.8 }}
          sx={{
            lineHeight: 1.8,
            whiteSpace: 'pre-line',
            color: isDarkMode ? '#eee' : '#333'
          }}
        >
          {message}
        </Typography>
      </StyledPaper>
    </Box>
  );
};