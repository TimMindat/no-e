import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { Box } from '@mui/material';
import { styled } from '@mui/material/styles';
import { useTheme } from '../contexts/ThemeContext';

const BackgroundContainer = styled(Box)(({ theme }) => ({
  position: 'fixed',
  top: 0,
  left: 0,
  right: 0,
  bottom: 0,
  overflow: 'hidden',
  zIndex: -1,
  backgroundColor: theme.palette.background.default,
  transition: 'background-color 0.5s ease',
}));

const Particle = styled(motion.div)<{ $isDark: boolean }>(({ theme, $isDark }) => ({
  position: 'absolute',
  borderRadius: '50%',
  background: $isDark 
    ? `radial-gradient(circle at 30% 30%, ${theme.palette.primary.light}, ${theme.palette.primary.main})` 
    : `radial-gradient(circle at 30% 30%, ${theme.palette.primary.light}, ${theme.palette.primary.main})`,
  boxShadow: $isDark 
    ? `0 0 10px ${theme.palette.primary.main}80, 0 0 20px ${theme.palette.primary.main}40` 
    : `0 0 10px ${theme.palette.primary.main}60, 0 0 20px ${theme.palette.primary.main}30`,
  opacity: 0.6,
}));

const Star = styled(motion.div)<{ $isDark: boolean }>(({ $isDark }) => ({
  position: 'absolute',
  width: '2px',
  height: '2px',
  backgroundColor: $isDark ? '#ffffff' : '#FFD700',
  borderRadius: '50%',
  boxShadow: $isDark 
    ? '0 0 4px 1px #ffffff80' 
    : '0 0 4px 1px #FFD70080',
}));

interface ParticleProps {
  id: number;
  x: number;
  y: number;
  size: number;
}

export const FestiveBackground = () => {
  const { isDarkMode } = useTheme();
  const [particles, setParticles] = useState<ParticleProps[]>([]);
  const [stars, setStars] = useState<ParticleProps[]>([]);

  useEffect(() => {
    // Generate particles
    const newParticles = [];
    const particleCount = window.innerWidth < 600 ? 15 : 25;
    
    for (let i = 0; i < particleCount; i++) {
      newParticles.push({
        id: i,
        x: Math.random() * window.innerWidth,
        y: Math.random() * window.innerHeight,
        size: Math.random() * 15 + 5,
      });
    }
    setParticles(newParticles);

    // Generate stars
    const newStars = [];
    const starCount = window.innerWidth < 600 ? 30 : 60;
    
    for (let i = 0; i < starCount; i++) {
      newStars.push({
        id: i,
        x: Math.random() * window.innerWidth,
        y: Math.random() * window.innerHeight,
        size: Math.random() * 1 + 0.5,
      });
    }
    setStars(newStars);

    // Handle window resize
    const handleResize = () => {
      setParticles(prev => prev.map(particle => ({
        ...particle,
        x: Math.random() * window.innerWidth,
        y: Math.random() * window.innerHeight,
      })));
      setStars(prev => prev.map(star => ({
        ...star,
        x: Math.random() * window.innerWidth,
        y: Math.random() * window.innerHeight,
      })));
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  return (
    <BackgroundContainer>
      {particles.map((particle) => (
        <Particle
          key={`particle-${particle.id}`}
          $isDark={isDarkMode}
          style={{
            width: particle.size,
            height: particle.size,
            x: particle.x,
            y: particle.y,
          }}
          animate={{
            x: [particle.x, particle.x + (Math.random() - 0.5) * 100],
            y: [particle.y, particle.y + (Math.random() - 0.5) * 100],
            opacity: [0.4, 0.7, 0.4],
            scale: [1, 1.2, 1],
          }}
          transition={{
            repeat: Infinity,
            repeatType: 'reverse',
            duration: Math.random() * 10 + 10,
            ease: 'easeInOut',
          }}
        />
      ))}
      {stars.map((star) => (
        <Star
          key={`star-${star.id}`}
          $isDark={isDarkMode}
          style={{
            width: star.size,
            height: star.size,
            x: star.x,
            y: star.y,
          }}
          animate={{
            opacity: [0.1, 1, 0.1],
            scale: [1, 1.5, 1],
          }}
          transition={{
            repeat: Infinity,
            repeatType: 'reverse',
            duration: Math.random() * 3 + 1,
            ease: 'easeInOut',
          }}
        />
      ))}
    </BackgroundContainer>
  );
};