import { useState, useEffect, ReactNode } from 'react';
import { motion, useScroll, useTransform, AnimatePresence } from 'framer-motion';
import { Box, Typography } from '@mui/material';
import { styled } from '@mui/material/styles';
import { useTheme } from '../contexts/ThemeContext';

const EnvelopeContainer = styled(Box)(() => ({
  position: 'relative',
  width: '100%',
  maxWidth: '650px',
  perspective: '1500px',
  marginTop: '2rem',
  marginBottom: '2rem',
}));

const EnvelopeFront = styled(motion.div)(({ theme }) => ({
  position: 'absolute',
  top: 0,
  left: 0,
  width: '100%',
  height: '100%',
  backgroundColor: theme.palette.mode === 'dark' ? '#2a2a2a' : '#f8f8f8',
  backgroundImage: `linear-gradient(135deg, ${theme.palette.primary.main}22 25%, transparent 25%, transparent 50%, ${theme.palette.primary.main}22 50%, ${theme.palette.primary.main}22 75%, transparent 75%, transparent)`,
  backgroundSize: '20px 20px',
  borderRadius: '10px',
  boxShadow: theme.shadows[5],
  transformOrigin: 'center bottom',
  zIndex: 10,
  display: 'flex',
  justifyContent: 'center',
  alignItems: 'center',
  padding: '20px',
  '&::after': {
    content: '""',
    position: 'absolute',
    bottom: '0',
    left: '50%',
    transform: 'translateX(-50%)',
    width: '0',
    height: '0',
    borderLeft: '15px solid transparent',
    borderRight: '15px solid transparent',
    borderBottom: `15px solid ${theme.palette.mode === 'dark' ? '#1a1a1a' : '#e0e0e0'}`,
  },
}));

const EnvelopeBack = styled(motion.div)(({ theme }) => ({
  position: 'relative',
  width: '100%',
  backgroundColor: theme.palette.mode === 'dark' ? '#1a1a1a' : '#e0e0e0',
  borderRadius: '10px',
  boxShadow: 'inset 0 0 10px rgba(0,0,0,0.1)',
  overflow: 'hidden',
  padding: '20px',
}));

const EnvelopeFlap = styled(motion.div)(({ theme }) => ({
  position: 'absolute',
  top: 0,
  left: 0,
  width: '100%',
  height: '50%',
  backgroundColor: theme.palette.mode === 'dark' ? '#2a2a2a' : '#f0f0f0',
  backgroundImage: `linear-gradient(135deg, ${theme.palette.primary.main}22 25%, transparent 25%, transparent 50%, ${theme.palette.primary.main}22 50%, ${theme.palette.primary.main}22 75%, transparent 75%, transparent)`,
  backgroundSize: '20px 20px',
  transformOrigin: 'top center',
  zIndex: 5,
  clipPath: 'polygon(0 0, 100% 0, 50% 100%, 0 0)',
}));

const EnvelopeSeal = styled(motion.div)(({ theme }) => ({
  position: 'absolute',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  width: '40px',
  height: '40px',
  borderRadius: '50%',
  backgroundColor: theme.palette.primary.main,
  display: 'flex',
  justifyContent: 'center',
  alignItems: 'center',
  color: '#fff',
  fontWeight: 'bold',
  fontSize: '16px',
  zIndex: 15,
  boxShadow: '0 0 10px rgba(0,0,0,0.2)',
}));

const Confetti = styled(motion.div)({
  position: 'fixed',
  width: '10px',
  height: '10px',
  borderRadius: '2px',
  pointerEvents: 'none',
  zIndex: 100,
});

interface EnvelopeProps {
  children: ReactNode;
}

export const Envelope = ({ children }: EnvelopeProps) => {
  const { isDarkMode } = useTheme();
  
  const [isOpen, setIsOpen] = useState(false);
  const [showConfetti, setShowConfetti] = useState(false);
  const [confetti, setConfetti] = useState<Array<{ id: number; x: number; y: number; color: string; size: number }>>([]);
  
  const { scrollY } = useScroll();
  // Increase the scroll range from [0, 200] to [0, 500] for smoother animation
  const openProgress = useTransform(scrollY, [0, 500], [0, 1]);
  const frontRotation = useTransform(openProgress, [0, 1], [0, -110]);
  const flapRotation = useTransform(openProgress, [0, 0.6], [0, -180]);
  const sealScale = useTransform(openProgress, [0, 0.3], [1, 0]);
  const contentOpacity = useTransform(openProgress, [0.3, 0.6], [0, 1]);
  const contentScale = useTransform(openProgress, [0.3, 0.7], [0.8, 1]);

  // Monitor scroll position to trigger envelope opening
  useEffect(() => {
    const unsubscribe = openProgress.onChange((latest) => {
      if (latest > 0.6 && !isOpen) {
        setIsOpen(true);
        if (latest > 0.9) {
          setShowConfetti(true);
        }
      } else if (latest < 0.3 && isOpen) {
        setIsOpen(false);
        setShowConfetti(false);
      }
    });

    return () => unsubscribe();
  }, [openProgress, isOpen]);

  // Generate confetti when envelope is fully opened
  useEffect(() => {
    if (showConfetti) {
      const colors = ['#FFC700', '#FF0040', '#00FFFF', '#00FF00', '#FFD700', '#FF6B6B'];
      const newConfetti = [];
      
      for (let i = 0; i < 50; i++) {
        newConfetti.push({
          id: i,
          x: Math.random() * window.innerWidth,
          y: Math.random() * window.innerHeight * 0.5,
          color: colors[Math.floor(Math.random() * colors.length)],
          size: Math.random() * 10 + 5,
        });
      }
      
      setConfetti(newConfetti);
      
      // Remove confetti after animation
      const timer = setTimeout(() => {
        setConfetti([]);
      }, 5000);
      
      return () => clearTimeout(timer);
    }
  }, [showConfetti]);

  return (
    <EnvelopeContainer>
      {/* Confetti effect when envelope opens */}
      <AnimatePresence>
        {confetti.map((item) => (
          <Confetti
            key={item.id}
            style={{ 
              backgroundColor: item.color,
              width: `${item.size}px`,
              height: `${item.size}px`,
              x: item.x,
              y: item.y,
            }}
            initial={{ y: -50, opacity: 0 }}
            animate={{
              y: [item.y, item.y + window.innerHeight],
              x: [item.x, item.x + (Math.random() - 0.5) * 200],
              rotate: [0, Math.random() * 360],
              opacity: [1, 0],
            }}
            exit={{ opacity: 0 }}
            transition={{ 
              duration: Math.random() * 3 + 2,
              ease: "easeOut"
            }}
          />
        ))}
      </AnimatePresence>

      {/* Envelope back (contains the actual content) */}
      <EnvelopeBack>
        <motion.div
          style={{ 
            opacity: contentOpacity,
            scale: contentScale,
            transformOrigin: 'center center',
          }}
        >
          {children}
        </motion.div>
      </EnvelopeBack>

      {/* Envelope flap (top part that opens) */}
      <EnvelopeFlap
        style={{ 
          rotateX: flapRotation,
          opacity: useTransform(openProgress, [0.6, 1], [1, 0])
        }}
      />

      {/* Envelope front (bottom part that opens) */}
      <EnvelopeFront
        style={{ 
          rotateX: frontRotation,
          opacity: useTransform(openProgress, [0.8, 1], [1, 0])
        }}
      >
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ delay: 0.5, type: 'spring', stiffness: 200 }}
        >
          <Typography 
            variant="h5" 
            sx={{ 
              fontFamily: '"Noto Naskh Arabic", serif',
              color: isDarkMode ? '#fff' : '#000',
              textAlign: 'center',
              textShadow: '0 2px 4px rgba(0,0,0,0.1)'
            }}
          >
            ❤️
          </Typography>
        </motion.div>
      </EnvelopeFront>

      {/* Envelope seal */}
      <EnvelopeSeal
        style={{ scale: sealScale }}
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.9 }}
      >
        <span>❤️</span>
      </EnvelopeSeal>
    </EnvelopeContainer>
  );
};