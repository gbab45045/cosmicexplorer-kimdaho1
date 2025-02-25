import React, { useState, useEffect, useRef, useMemo } from 'react';
import {
  Typography,
  Button,
  Box,
  Modal,
  Grow,
  ThemeProvider,
  createTheme,
  IconButton,
  Tooltip,
  Zoom,
} from '@mui/material';
import styled from '@emotion/styled';
import { motion, AnimatePresence } from 'framer-motion';
import Particles from 'react-tsparticles';
import { loadFull } from 'tsparticles';

// 향상된 다크 스페이스 테마 - 더 세련된 색상 팔레트와 반응형 타이포그래피
const darkTheme = createTheme({
  palette: {
    mode: 'dark',
    primary: {
      main: '#00B4FF', // 밝은 청록색
      light: '#60EFFF', // 더 밝은 청록색
      dark: '#0088CC', // 어두운 청록색
    },
    secondary: {
      main: '#FF3E89', // 네온 핑크
      light: '#FF71A3', // 더 밝은 핑크
      dark: '#CC1F64', // 어두운 핑크
    },
    background: {
      default: '#030014',
      paper: '#050028',
    },
    accent: {
      purple: '#6E3AFF', // 보라색 강조
      cyan: '#00E5FF', // 밝은 청록색 강조
      green: '#00FFAA', // 네온 그린
    },
  },
  typography: {
    fontFamily: '"Inter", "Roboto", sans-serif',
    h1: {
      fontWeight: 800,
      fontSize: 'clamp(3rem, 8vw, 6rem)', // 반응형 글꼴 크기
      letterSpacing: '-0.05em',
      lineHeight: 1.1,
    },
    h2: {
      fontWeight: 700,
      fontSize: 'clamp(1.5rem, 4vw, 2.5rem)', // 반응형 글꼴 크기
      letterSpacing: '-0.03em',
      lineHeight: 1.2,
    },
    h3: {
      fontWeight: 600,
      fontSize: 'clamp(1.2rem, 3vw, 1.8rem)',
      letterSpacing: '-0.02em',
    },
    body1: {
      color: '#E2E8F0',
      fontSize: 'clamp(0.9rem, 2vw, 1.1rem)',
      lineHeight: 1.6,
    },
  },
  breakpoints: {
    values: {
      xs: 0,
      sm: 600,
      md: 960,
      lg: 1280,
      xl: 1920,
    },
  },
  components: {
    MuiButton: {
      styleOverrides: {
        root: {
          textTransform: 'none',
        },
      },
    },
  },
});

// 고급화된 인터랙티브 캔버스 요소
const CanvasContainer = styled(Box)`
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  z-index: 0;
  opacity: 0.8;
`;

// 메인 배경 컨테이너 - 향상된 반응형 레이아웃
const StyledBox = styled(Box)`
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  min-height: 100vh;
  width: 100vw;
  background: radial-gradient(
    ellipse at bottom,
    #1B2735 0%,
    #090A0F 100%
  );
  padding: clamp(1rem, 5vw, 3rem);
  overflow: hidden;
  position: relative;
  scroll-behavior: smooth;
`;

// 강화된 행성 효과 - 다중 그라데이션과 애니메이션
const Planet = styled(Box)`
  position: absolute;
  bottom: -10%;
  right: -10%;
  width: min(400px, 50vw);
  height: min(400px, 50vw);
  border-radius: 50%;
  background: radial-gradient(
    circle at 30% 30%,
    rgba(255, 62, 137, 0.6) 0%,
    rgba(0, 180, 255, 0.3) 60%, 
    rgba(0, 0, 0, 0) 100%
  );
  filter: blur(40px);
  z-index: 0;
  opacity: 0.7;
  animation: pulsePlanet 8s ease-in-out infinite alternate;
  
  @keyframes pulsePlanet {
    0% {
      transform: scale(1);
      opacity: 0.7;
    }
    100% {
      transform: scale(1.15);
      opacity: 0.5;
    }
  }
`;

// 두 번째 행성 추가
const SecondPlanet = styled(Box)`
  position: absolute;
  top: -8%;
  left: -5%;
  width: min(300px, 40vw);
  height: min(300px, 40vw);
  border-radius: 50%;
  background: radial-gradient(
    circle at 70% 70%,
    rgba(110, 58, 255, 0.4) 0%,
    rgba(0, 229, 255, 0.2) 60%, 
    rgba(0, 0, 0, 0) 100%
  );
  filter: blur(50px);
  z-index: 0;
  opacity: 0.6;
  animation: pulseSecondPlanet 12s ease-in-out infinite alternate;
  
  @keyframes pulseSecondPlanet {
    0% {
      transform: scale(1);
      opacity: 0.6;
    }
    100% {
      transform: scale(1.2);
      opacity: 0.4;
    }
  }
`;

// 강화된 오로라 효과 - 다중 레이어 및 애니메이션
const AuroraEffect = styled(Box)`
  position: absolute;
  top: -20%;
  left: -20%;
  width: 140%;
  height: 140%;
  background: radial-gradient(
    ellipse at center,
    rgba(0, 180, 255, 0.03) 0%,
    rgba(0, 0, 0, 0) 70%
  );
  z-index: 0;
  animation: rotateAurora 180s linear infinite;
  
  &::after {
    content: '';
    position: absolute;
    top: 10%;
    left: 10%;
    width: 80%;
    height: 80%;
    background: radial-gradient(
      ellipse at center,
      rgba(110, 58, 255, 0.02) 0%,
      rgba(0, 0, 0, 0) 70%
    );
    animation: rotateAuroraInner 120s linear infinite reverse;
  }
  
  @keyframes rotateAurora {
    0% {
      transform: rotate(0deg);
    }
    100% {
      transform: rotate(360deg);
    }
  }
  
  @keyframes rotateAuroraInner {
    0% {
      transform: rotate(0deg);
    }
    100% {
      transform: rotate(360deg);
    }
  }
`;

// 강화된 수직 광선 효과 - 더 많은 변형 및 다양한 애니메이션
const Beam = styled(Box)`
  position: absolute;
  width: 2px;
  background: linear-gradient(
    to bottom,
    rgba(0, 180, 255, 0),
    rgba(0, 180, 255, 0.7),
    rgba(0, 180, 255, 0)
  );
  z-index: 0;
  animation-name: moveBeam;
  animation-timing-function: cubic-bezier(0.4, 0, 0.2, 1);
  animation-iteration-count: infinite;
  
  @keyframes moveBeam {
    0%, 100% {
      opacity: 0;
      height: 10%;
      transform: translateY(0);
    }
    50% {
      opacity: 1;
      height: 30%;
      transform: translateY(20px);
    }
  }
`;

// 두 번째 유형의 광선 추가
const WideBeam = styled(Box)`
  position: absolute;
  width: 4px;
  background: linear-gradient(
    to bottom,
    rgba(110, 58, 255, 0),
    rgba(110, 58, 255, 0.5),
    rgba(110, 58, 255, 0)
  );
  z-index: 0;
  animation-name: moveWideBeam;
  animation-timing-function: cubic-bezier(0.4, 0, 0.2, 1);
  animation-iteration-count: infinite;
  filter: blur(2px);
  
  @keyframes moveWideBeam {
    0%, 100% {
      opacity: 0;
      height: 5%;
      transform: translateY(-10px);
    }
    50% {
      opacity: 0.7;
      height: 20%;
      transform: translateY(10px);
    }
  }
`;

// 향상된 메인 제목 텍스트 - 더 화려한 효과
const MainTitle = styled(motion(Typography))`
  color: #fff;
  text-shadow: 
    0 0 20px rgba(0, 180, 255, 0.7),
    0 0 40px rgba(0, 180, 255, 0.3);
  z-index: 1;
  text-align: center;
  background: linear-gradient(to right, #00B4FF, #FFFFFF, #60EFFF, #6E3AFF);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-size: 300% auto;
  animation: shimmer 8s ease infinite;

  @keyframes shimmer {
    0% { background-position: 0% center; }
    50% { background-position: 100% center; }
    100% { background-position: 0% center; }
  }
`;

// 강화된 부제목 텍스트 - 더 세련된 스타일링
const Subtitle = styled(motion(Typography))`
  margin-top: 1.5rem;
  margin-bottom: 0.5rem;
  color: rgba(255, 255, 255, 0.85);
  text-align: center;
  z-index: 1;
  max-width: 700px;
  font-weight: 300;
  letter-spacing: 0.5px;
  
  span {
    color: #00E5FF;
    font-weight: 500;
  }
`;

// 추가 부제목
const SecondarySubtitle = styled(motion(Typography))`
  color: rgba(255, 255, 255, 0.7);
  text-align: center;
  z-index: 1;
  max-width: 600px;
  font-weight: 300;
  letter-spacing: 0.5px;
  margin-bottom: 2rem;
  font-size: clamp(0.85rem, 1.5vw, 1rem);
`;

// 강화된 메인 버튼 - 더 화려한 효과 및 반응형
const MainButton = styled(Button)`
  margin-top: 2rem;
  border-radius: 50px;
  padding: clamp(0.6rem, 2vw, 0.8rem) clamp(1.5rem, 3vw, 2.5rem);
  font-weight: 600;
  font-size: clamp(0.9rem, 1.5vw, 1.1rem);
  letter-spacing: 0.5px;
  text-transform: none;
  background: linear-gradient(90deg, #00B4FF, #00D1FF, #60EFFF);
  background-size: 200% auto;
  color: white;
  box-shadow: 
    0 0 15px rgba(0, 180, 255, 0.5),
    0 0 30px rgba(0, 180, 255, 0.2);
  transition: all 0.3s ease;
  z-index: 1;
  overflow: hidden;
  position: relative;
  
  &::before {
    content: '';
    position: absolute;
    top: 0;
    left: -100%;
    width: 100%;
    height: 100%;
    background: linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.3), transparent);
    transition: 0.8s;
  }
  
  &:hover {
    transform: translateY(-3px);
    box-shadow: 
      0 0 25px rgba(0, 180, 255, 0.7),
      0 0 50px rgba(0, 180, 255, 0.3);
    background-position: right center;
    
    &::before {
      left: 100%;
    }
  }
  
  &:active {
    transform: translateY(-1px);
    box-shadow: 0 0 15px rgba(0, 180, 255, 0.5);
  }
`;

// 두 번째 버튼 추가 - 다른 색상
const SecondaryButton = styled(Button)`
  margin-top: 1rem;
  margin-left: 1rem;
  border-radius: 50px;
  padding: clamp(0.6rem, 2vw, 0.8rem) clamp(1.5rem, 3vw, 2.5rem);
  font-weight: 500;
  font-size: clamp(0.9rem, 1.5vw, 1.1rem);
  letter-spacing: 0.5px;
  text-transform: none;
  background: transparent;
  border: 2px solid rgba(110, 58, 255, 0.7);
  color: white;
  box-shadow: 0 0 15px rgba(110, 58, 255, 0.3);
  transition: all 0.3s ease;
  z-index: 1;
  overflow: hidden;
  position: relative;
  
  &:hover {
    transform: translateY(-3px);
    background: rgba(110, 58, 255, 0.2);
    box-shadow: 0 0 25px rgba(110, 58, 255, 0.5);
  }
  
  &:active {
    transform: translateY(-1px);
    box-shadow: 0 0 15px rgba(110, 58, 255, 0.3);
  }
`;

// 강화된 이스터에그 버튼 - 더 화려한 디자인
const EasterEggButton = styled(IconButton)`
  position: absolute;
  bottom: 2rem;
  right: 2rem;
  width: 60px;
  height: 60px;
  border-radius: 50%;
  padding: 0;
  display: flex;
  justify-content: center;
  align-items: center;
  background: rgba(0, 180, 255, 0.15);
  backdrop-filter: blur(10px);
  -webkit-backdrop-filter: blur(10px);
  border: 1px solid rgba(0, 180, 255, 0.4);
  color: rgba(255, 255, 255, 0.8);
  box-shadow: 
    0 0 15px rgba(0, 180, 255, 0.3),
    inset 0 0 10px rgba(0, 180, 255, 0.1);
  transition: all 0.3s ease-in-out;
  z-index: 2;
  
  &:hover {
    transform: scale(1.1) rotate(15deg);
    box-shadow: 
      0 0 25px rgba(0, 180, 255, 0.5),
      inset 0 0 15px rgba(0, 180, 255, 0.2);
    background: rgba(0, 180, 255, 0.25);
    color: rgba(255, 255, 255, 1);
  }

  &::after {
    content: '?';
    font-size: 1.8rem;
    font-weight: 700;
  }
  
  @media (max-width: 600px) {
    width: 50px;
    height: 50px;
    bottom: 1.5rem;
    right: 1.5rem;
    
    &::after {
      font-size: 1.5rem;
    }
  }
`;

// 추가 이스터에그 버튼 - 왼쪽 하단에 위치
const SecondEasterEggButton = styled(IconButton)`
  position: absolute;
  bottom: 2rem;
  left: 2rem;
  width: 50px;
  height: 50px;
  border-radius: 50%;
  padding: 0;
  display: flex;
  justify-content: center;
  align-items: center;
  background: rgba(255, 62, 137, 0.15);
  backdrop-filter: blur(10px);
  -webkit-backdrop-filter: blur(10px);
  border: 1px solid rgba(255, 62, 137, 0.4);
  color: rgba(255, 255, 255, 0.8);
  box-shadow: 
    0 0 15px rgba(255, 62, 137, 0.3),
    inset 0 0 10px rgba(255, 62, 137, 0.1);
  transition: all 0.3s ease-in-out;
  z-index: 2;
  
  &:hover {
    transform: scale(1.1) rotate(-15deg);
    box-shadow: 
      0 0 25px rgba(255, 62, 137, 0.5),
      inset 0 0 15px rgba(255, 62, 137, 0.2);
    background: rgba(255, 62, 137, 0.25);
    color: rgba(255, 255, 255, 1);
  }

  &::after {
    content: '!';
    font-size: 1.6rem;
    font-weight: 700;
  }
  
  @media (max-width: 600px) {
    width: 40px;
    height: 40px;
    bottom: 1.5rem;
    left: 1.5rem;
    
    &::after {
      font-size: 1.3rem;
    }
  }
`;

// 강화된 모달 컨텐츠 - 더 화려한 디자인
const ModalContent = styled(Box)`
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  background: rgba(5, 0, 40, 0.85);
  backdrop-filter: blur(20px);
  -webkit-backdrop-filter: blur(20px);
  border-radius: 24px;
  border: 1px solid rgba(0, 180, 255, 0.3);
  box-shadow: 
    0 0 40px rgba(0, 180, 255, 0.4),
    inset 0 0 20px rgba(0, 180, 255, 0.1);
  padding: clamp(2rem, 5vw, 3.5rem);
  text-align: center;
  outline: none;
  color: white;
  max-width: 500px;
  width: 90%;
  z-index: 10;
  overflow: hidden;
  position: relative;
  
  &::before {
    content: '';
    position: absolute;
    top: -50%;
    left: -50%;
    width: 200%;
    height: 200%;
    background: radial-gradient(
      circle at center,
      rgba(0, 180, 255, 0.03) 0%,
      rgba(0, 0, 0, 0) 70%
    );
    animation: rotateModalGlow 60s linear infinite;
  }
  
  @keyframes rotateModalGlow {
    0% {
      transform: rotate(0deg);
    }
    100% {
      transform: rotate(360deg);
    }
  }
`;

// 두 번째 모달 스타일 추가
const SecondModalContent = styled(Box)`
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  background: rgba(40, 0, 30, 0.85);
  backdrop-filter: blur(20px);
  -webkit-backdrop-filter: blur(20px);
  border-radius: 24px;
  border: 1px solid rgba(255, 62, 137, 0.3);
  box-shadow: 
    0 0 40px rgba(255, 62, 137, 0.4),
    inset 0 0 20px rgba(255, 62, 137, 0.1);
  padding: clamp(2rem, 5vw, 3.5rem);
  text-align: center;
  outline: none;
  color: white;
  max-width: 500px;
  width: 90%;
  z-index: 10;
  overflow: hidden;
  position: relative;
  
  &::before {
    content: '';
    position: absolute;
    top: -50%;
    left: -50%;
    width: 200%;
    height: 200%;
    background: radial-gradient(
      circle at center,
      rgba(255, 62, 137, 0.03) 0%,
      rgba(0, 0, 0, 0) 70%
    );
    animation: rotateModalGlow 60s linear infinite;
  }
`;

// 강화된 모달 제목 - 더 화려한 효과
const AchievementText = styled(Typography)`
  font-size: clamp(1.5rem, 4vw, 2.5rem);
  font-weight: 700;
  margin-bottom: 1.5rem;
  background: linear-gradient(to right, #00B4FF, #60EFFF, #0088CC);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  text-shadow: 0 0 10px rgba(0, 180, 255, 0.3);
  position: relative;
  
  &::after {
    content: '';
    position: absolute;
    bottom: -10px;
    left: 50%;
    transform: translateX(-50%);
    width: 100px;
    height: 2px;
    background: linear-gradient(to right, transparent, #00B4FF, transparent);
  }
`;

// 두 번째 모달 제목 스타일
const SecondAchievementText = styled(Typography)`
  font-size: clamp(1.5rem, 4vw, 2.5rem);
  font-weight: 700;
  margin-bottom: 1.5rem;
  background: linear-gradient(to right, #FF3E89, #FF71A3, #CC1F64);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  text-shadow: 0 0 10px rgba(255, 62, 137, 0.3);
  position: relative;
  
  &::after {
    content: '';
    position: absolute;
    bottom: -10px;
    left: 50%;
    transform: translateX(-50%);
    width: 100px;
    height: 2px;
    background: linear-gradient(to right, transparent, #FF3E89, transparent);
  }
`;

// 강화된 모달 내 버튼 - 더 화려한 효과
const ModalButton = styled(Button)`
  margin-top: 2rem;
  border-radius: 50px;
  padding: 0.8rem 2.5rem;
  font-weight: 500;
  background: linear-gradient(90deg, #00B4FF, #60EFFF);
  background-size: 200% auto;
  color: white;
  box-shadow: 0 0 15px rgba(0, 180, 255, 0.3);
  transition: all 0.3s ease;
  position: relative;
  overflow: hidden;
  
  &:hover {
    background-position: right center;
    box-shadow: 0 0 25px rgba(0, 180, 255, 0.5);
    transform: translateY(-2px);
  }
  
  &::before {
    content: '';
    position: absolute;
    top: 0;
    left: -100%;
    width: 100%;
    height: 100%;
    background: linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.2), transparent);
    transition: 0.5s;
  }
  
  &:hover::before {
    left: 100%;
  }
`;

// 두 번째 모달 버튼 스타일
const SecondModalButton = styled(Button)`
  margin-top: 2rem;
  border-radius: 50px;
  padding: 0.8rem 2.5rem;
  font-weight: 500;
  background: linear-gradient(90deg, #FF3E89, #FF71A3);
  background-size: 200% auto;
  color: white;
  box-shadow: 0 0 15px rgba(255, 62, 137, 0.3);
  transition: all 0.3s ease;
  position: relative;
  overflow: hidden;
  
  &:hover {
    background-position: right center;
    box-shadow: 0 0 25px rgba(255, 62, 137, 0.5);
    transform: translateY(-2px);
  }
  
  &::before {
    content: '';
    position: absolute;
    top: 0;
    left: -100%;
    width: 100%;
    height: 100%;
    background: linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.2), transparent);
    transition: 0.5s;
  }
  
  &:hover::before {
    left: 100%;
  }
`;

// 로고 추가
const LogoContainer = styled(motion.div)`
  position: absolute;
  top: 2rem;
  left: 50%;
  transform: translateX(-50%);
  display: flex;
  align-items: center;
  z-index: 2;
`;

const LogoText = styled(Typography)`
  font-size: 1.2rem;
  font-weight: 700;
  letter-spacing: 1px;
  background: linear-gradient(to right, #00B4FF, #FFFFFF);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
`;

// 고급 텍스트 애니메이션 variants
const titleVariants = {
  hidden: { opacity: 0, y: 50 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 1.2,
      ease: [0.25, 0.1, 0.25, 1],
    },
  },
};

const logoVariants = {
  hidden: { opacity: 0, y: -20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.8,
      ease: [0.25, 0.1, 0.25, 1],
    },
  },
};

const subtitleVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      duration: 1,
      delay: 0.7,
    },
  },
};

const secondarySubtitleVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      duration: 0.8,
      delay: 1,
    },
  },
};

const buttonVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.8,
      delay: 1.2,
    },
  },
};

const secondButtonVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.8,
      delay: 1.4,
    },
  },
};

const easterEggButtonVariants = {
  hidden: { opacity: 0, scale: 0.8 },
  visible: {
    opacity: 1,
    scale: 1,
    transition: {
      duration: 0.6,
      delay: 2,
      type: "spring",
      stiffness: 200,
    },
  },
};

// 강화된 별 효과 스타일
const Starfield = styled(Box)`
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  z-index: 0;
`;

const Star = styled(Box)`
  position: absolute;
  border-radius: 50%;
  animation: twinkle ease infinite;
  
  @keyframes twinkle {
    0%, 100% {
      opacity: 1;
      transform: scale(1);
    }
    50% {
      opacity: 0.3;
      transform: scale(0.8);
    }
  }
`;

// 큰 별 효과 추가
const BigStar = styled(Box)`
  position: absolute;
  border-radius: 50%;
  background: #FFFFFF;
  box-shadow: 
    0 0 10px #FFFFFF,
    0 0 20px rgba(0, 180, 255, 0.5);
  animation: pulsateBigStar ease infinite;
  
  @keyframes pulsateBigStar {
    0%, 100% {
      opacity: 1;
      transform: scale(1);
      box-shadow: 
        0 0 10px #FFFFFF,
        0 0 20px rgba(0, 180, 255, 0.5);
    }
    50% {
      opacity: 0.8;
      transform: scale(1.2);
      box-shadow: 
        0 0 20px #FFFFFF,
        0 0 40px rgba(0, 180, 255, 0.7);
    }
  }
`;

// 슈팅 스타 효과 추가
const ShootingStar = styled(Box)`
  position: absolute;
  width: 120px;
  height: 1px;
  transform-origin: right;
  animation: shooting-star 3s linear infinite;
  background: linear-gradient(to right, rgba(255, 255, 255, 0), rgba(255, 255, 255, 1) 50%, rgba(0, 180, 255, 1));
  opacity: 0;

  @keyframes shooting-star {
    0% {
      opacity: 0;
      transform: translateX(0) rotate(0deg);
    }
    5% {
      opacity: 1;
    }
    20% {
      transform: translateX(-200px) rotate(0deg);
      opacity: 0;
    }
    100% {
      opacity: 0;
      transform: translateX(-200px) rotate(0deg);
    }
  }
`;

// 새로운 우주 먼지 효과
const SpaceDust = styled(Box)`
  position: absolute;
  width: 1px;
  height: 1px;
  background-color: rgba(255, 255, 255, 0.5);
  box-shadow: 0 0 3px rgba(255, 255, 255, 0.3);
  border-radius: 50%;
  animation: float linear infinite;
  
  @keyframes float {
    0% {
      transform: translateY(0);
    }
    100% {
      transform: translateY(100vh);
    }
  }
`;

// 상호작용 가능한 행성 효과
const InteractivePlanet = styled(motion.div)`
  position: absolute;
  border-radius: 50%;
  background: radial-gradient(
    circle at 30% 30%,
    rgba(0, 229, 255, 0.7) 0%,
    rgba(0, 0, 40, 0.9) 60%, 
    rgba(0, 0, 0, 0.8) 100%
  );
  box-shadow: 
    inset 0 0 20px rgba(0, 229, 255, 0.6),
    0 0 30px rgba(0, 180, 255, 0.5);
  cursor: pointer;
  z-index: 1;
`;

// 새로운 행성의 표면 특징을 위한 스타일
const PlanetSurface = styled(Box)`
  position: absolute;
  width: 100%;
  height: 100%;
  border-radius: 50%;
  overflow: hidden;
  opacity: 0.3;
  animation: rotateSurface 120s linear infinite;
  
  @keyframes rotateSurface {
    0% {
      transform: rotate(0deg);
    }
    100% {
      transform: rotate(360deg);
    }
  }
`;

// 행성 빛 반사 효과
const PlanetHighlight = styled(Box)`
  position: absolute;
  width: 30%;
  height: 30%;
  border-radius: 50%;
  background: rgba(255, 255, 255, 0.2);
  top: 20%;
  left: 20%;
  filter: blur(10px);
`;

// 행성 궤도 효과
const Orbit = styled(Box)`
  position: absolute;
  border-radius: 50%;
  border: 1px solid rgba(0, 180, 255, 0.2);
  box-shadow: 0 0 10px rgba(0, 180, 255, 0.1);
  animation: pulseOrbit 8s ease-in-out infinite alternate;
  
  @keyframes pulseOrbit {
    0% {
      opacity: 0.2;
    }
    100% {
      opacity: 0.5;
    }
  }
`;

// 화려한 중앙 버튼 컨테이너
const ButtonContainer = styled(motion.div)`
  display: flex;
  flex-direction: row;
  justify-content: center;
  align-items: center;
  flex-wrap: wrap;
  gap: 1rem;
  z-index: 1;
  margin-top: 2rem;
`;

// 우주 탐험 내비게이션 메뉴
const SpaceNavigation = styled(motion.div)`
  position: absolute;
  top: 2rem;
  right: 2rem;
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
  z-index: 2;
`;

const NavItem = styled(Button)`
  background: rgba(0, 0, 0, 0.3);
  backdrop-filter: blur(10px);
  border-radius: 30px;
  padding: 0.5rem 1rem;
  color: rgba(255, 255, 255, 0.8);
  border: 1px solid rgba(0, 180, 255, 0.3);
  font-size: 0.8rem;
  transition: all 0.3s ease;
  text-transform: none;
  
  &:hover {
    background: rgba(0, 180, 255, 0.2);
    color: white;
    transform: translateX(-5px);
  }
`;

// 새로운 공간 탐색 메인 구성 요소
const App = () => {
  const [modalOpen, setModalOpen] = useState(false);
  const [secondModalOpen, setSecondModalOpen] = useState(false);
  const [stars, setStars] = useState([]);
  const [beams, setBeams] = useState([]);
  const [wideBeams, setWideBeams] = useState([]);
  const [spaceDust, setSpaceDust] = useState([]);
  const [shootingStars, setShootingStars] = useState([]);
  const [animationCompleted, setAnimationCompleted] = useState(false);
  
  const particlesRef = useRef(null);
  
  // 입자 초기화
  const initializeParticles = async (engine) => {
    await loadFull(engine);
  };

  // 별 생성
  useEffect(() => {
    const starsArray = [];
    const beamsArray = [];
    const wideBeamsArray = [];
    const dustArray = [];
    const shootingStarsArray = [];
    
    // 작은 별 생성
    for (let i = 0; i < 150; i++) {
      const size = Math.random() * 3;
      starsArray.push({
        id: `star-${i}`,
        size,
        top: `${Math.random() * 100}%`,
        left: `${Math.random() * 100}%`,
        animationDuration: `${3 + Math.random() * 7}s`,
        animationDelay: `${Math.random() * 5}s`,
        opacity: 0.5 + Math.random() * 0.5
      });
    }
    
    // 큰 별 생성
    for (let i = 0; i < 15; i++) {
      const size = 3 + Math.random() * 4;
      starsArray.push({
        id: `big-star-${i}`,
        size,
        top: `${Math.random() * 100}%`,
        left: `${Math.random() * 100}%`,
        animationDuration: `${3 + Math.random() * 5}s`,
        animationDelay: `${Math.random() * 3}s`,
        opacity: 0.7 + Math.random() * 0.3,
        isBig: true
      });
    }
    
    // 광선 생성
    for (let i = 0; i < 8; i++) {
      beamsArray.push({
        id: `beam-${i}`,
        left: `${Math.random() * 100}%`,
        animationDuration: `${10 + Math.random() * 20}s`,
        animationDelay: `${Math.random() * 10}s`
      });
    }
    
    // 넓은 광선 생성
    for (let i = 0; i < 5; i++) {
      wideBeamsArray.push({
        id: `wide-beam-${i}`,
        left: `${Math.random() * 100}%`,
        animationDuration: `${15 + Math.random() * 20}s`,
        animationDelay: `${Math.random() * 15}s`
      });
    }
    
    // 우주 먼지 생성
    for (let i = 0; i < 60; i++) {
      dustArray.push({
        id: `dust-${i}`,
        top: `${Math.random() * 100}%`,
        left: `${Math.random() * 100}%`,
        size: 0.5 + Math.random() * 1.5,
        duration: 10 + Math.random() * 20,
        delay: Math.random() * 10
      });
    }
    
    // 슈팅 스타 생성
    for (let i = 0; i < 5; i++) {
      shootingStarsArray.push({
        id: `shooting-star-${i}`,
        top: `${Math.random() * 50}%`,
        left: `${Math.random() * 100}%`,
        rotation: `${-20 - Math.random() * 30}deg`,
        delay: i * 7 + Math.random() * 10
      });
    }
    
    setStars(starsArray);
    setBeams(beamsArray);
    setWideBeams(wideBeamsArray);
    setSpaceDust(dustArray);
    setShootingStars(shootingStarsArray);
    
    // 애니메이션 완료 상태 설정
    const timer = setTimeout(() => {
      setAnimationCompleted(true);
    }, 2000);
    
    return () => clearTimeout(timer);
  }, []);
  
  // 입자 설정
  const particlesOptions = useMemo(() => ({
    particles: {
      number: {
        value: 50,
        density: {
          enable: true,
          value_area: 800
        }
      },
      color: {
        value: "#ffffff"
      },
      opacity: {
        value: 0.3,
        random: true,
        anim: {
          enable: true,
          speed: 0.5,
          opacity_min: 0.1,
          sync: false
        }
      },
      size: {
        value: 2,
        random: true,
        anim: {
          enable: true,
          speed: 1,
          size_min: 0.1,
          sync: false
        }
      },
      line_linked: {
        enable: true,
        distance: 150,
        color: "#00B4FF",
        opacity: 0.2,
        width: 1
      },
      move: {
        enable: true,
        speed: 0.5,
        direction: "none",
        random: true,
        straight: false,
        out_mode: "out",
        bounce: false,
        attract: {
          enable: false,
          rotateX: 600,
          rotateY: 1200
        }
      }
    },
    interactivity: {
      detect_on: "canvas",
      events: {
        onhover: {
          enable: true,
          mode: "grab"
        },
        onclick: {
          enable: true,
          mode: "push"
        },
        resize: true
      },
      modes: {
        grab: {
          distance: 140,
          line_linked: {
            opacity: 0.8
          }
        },
        push: {
          particles_nb: 4
        }
      }
    },
    retina_detect: true
  }), []);

  // 행성 상호작용 효과
  const planetControls = {
    hover: {
      scale: 1.1,
      boxShadow: "0 0 50px rgba(0, 180, 255, 0.7)",
      transition: {
        type: "spring",
        stiffness: 300,
        damping: 20
      }
    },
    tap: {
      scale: 0.95,
      boxShadow: "0 0 30px rgba(0, 180, 255, 0.9)",
      transition: {
        duration: 0.2
      }
    }
  };
  
  // 행성 클릭 이벤트
  const handlePlanetClick = () => {
    setModalOpen(true);
  };
  
  // 두 번째 행성 클릭 이벤트
  const handleSecondPlanetClick = () => {
    setSecondModalOpen(true);
  };

  // 이스터에그 열기
  const handleEasterEgg = () => {
    setModalOpen(true);
  };

  // 두 번째 이스터에그 열기
  const handleSecondEasterEgg = () => {
    setSecondModalOpen(true);
  };

  // 모달 닫기
  const handleCloseModal = () => {
    setModalOpen(false);
  };

  // 두 번째 모달 닫기
  const handleCloseSecondModal = () => {
    setSecondModalOpen(false);
  };

  return (
    <ThemeProvider theme={darkTheme}>
      <StyledBox>
        {/* 백그라운드 효과 */}
        <AuroraEffect />
        <Planet whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.98 }} transition={{ type: "spring", stiffness: 400, damping: 10 }} onClick={handlePlanetClick} />
        <SecondPlanet whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.98 }} transition={{ type: "spring", stiffness: 400, damping: 10 }} onClick={handleSecondPlanetClick} />
        
        {/* 궤도 효과 */}
        <Orbit style={{ width: '70vw', height: '70vw', bottom: '-20vw', right: '-20vw' }} />
        <Orbit style={{ width: '50vw', height: '50vw', bottom: '-15vw', right: '-10vw' }} />
        <Orbit style={{ width: '60vw', height: '60vw', top: '-30vw', left: '-30vw' }} />
        
        {/* 상호작용 가능한 행성 */}
        <InteractivePlanet 
          style={{ bottom: '10%', right: '15%', width: '80px', height: '80px' }}
          whileHover="hover"
          whileTap="tap"
          variants={planetControls}
          onClick={handlePlanetClick}
        >
          <PlanetSurface style={{ 
            background: `radial-gradient(circle at center, transparent 50%, rgba(0, 180, 255, 0.2) 100%), 
                        repeating-conic-gradient(rgba(0, 180, 255, 0.1) 0deg 10deg, transparent 10deg 20deg)`
          }} />
          <PlanetHighlight />
        </InteractivePlanet>
        
        {/* 별, 광선, 우주 먼지 효과 */}
        <Starfield>
          {stars.map((star) => star.isBig ? (
            <BigStar
              key={star.id}
              style={{
                width: `${star.size}px`,
                height: `${star.size}px`,
                top: star.top,
                left: star.left,
                animationDuration: star.animationDuration,
                animationDelay: star.animationDelay,
                opacity: star.opacity
              }}
            />
          ) : (
            <Star
              key={star.id}
              style={{
                width: `${star.size}px`,
                height: `${star.size}px`,
                top: star.top,
                left: star.left,
                background: `rgba(255, 255, 255, ${star.opacity})`,
                animationDuration: star.animationDuration,
                animationDelay: star.animationDelay
              }}
            />
          ))}
          
          {beams.map((beam) => (
            <Beam
              key={beam.id}
              style={{
                left: beam.left,
                top: '0',
                height: '30vh',
                animationDuration: beam.animationDuration,
                animationDelay: beam.animationDelay
              }}
            />
          ))}
          
          {wideBeams.map((beam) => (
            <WideBeam
              key={beam.id}
              style={{
                left: beam.left,
                top: '0',
                height: '40vh',
                animationDuration: beam.animationDuration,
                animationDelay: beam.animationDelay
              }}
            />
          ))}
          
          {spaceDust.map((dust) => (
            <SpaceDust
              key={dust.id}
              style={{
                top: dust.top,
                left: dust.left,
                width: `${dust.size}px`,
                height: `${dust.size}px`,
                animationDuration: `${dust.duration}s`,
                animationDelay: `${dust.delay}s`
              }}
            />
          ))}
          
          {shootingStars.map((star) => (
            <ShootingStar
              key={star.id}
              style={{
                top: star.top,
                left: star.left,
                transform: `rotate(${star.rotation})`,
                animationDelay: `${star.delay}s`
              }}
            />
          ))}
        </Starfield>
        
        {/* 고급 입자 시스템 */}
        <CanvasContainer>
          <Particles
            id="tsparticles"
            ref={particlesRef}
            options={particlesOptions}
            init={initializeParticles}
          />
        </CanvasContainer>
        
        {/* 로고 */}
        <LogoContainer
          initial="hidden"
          animate="visible"
          variants={logoVariants}
        >
          <LogoText variant="h6">COSMIC EXPLORER</LogoText>
        </LogoContainer>
        
        {/* 네비게이션 */}
        <SpaceNavigation
          initial={{ opacity: 0, x: 30 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 1.6, duration: 0.8 }}
        >
          <NavItem>HOME</NavItem>
          <NavItem>EXPLORE</NavItem>
          <NavItem>GALAXIES</NavItem>
          <NavItem>CONTACT</NavItem>
        </SpaceNavigation>
        
        {/* 메인 콘텐츠 */}
        <MainTitle
          variant="h1"
          initial="hidden"
          animate="visible"
          variants={titleVariants}
        >
          정자 탐험을 시작하세요
        </MainTitle>
        
        <Subtitle
          variant="h3"
          initial="hidden"
          animate="visible"
          variants={subtitleVariants}
        >
          정자들 사이의 <span>무한한 가능성</span>을 발견하세요
        </Subtitle>
        
        <SecondarySubtitle
          variant="body1"
          initial="hidden"
          animate="visible"
          variants={secondarySubtitleVariants}
        >
          미지의 세계를 탐험하고 질의 경이로움을 경험하세요
        </SecondarySubtitle>
        
        <ButtonContainer
          initial="hidden"
          animate="visible"
        >
          <MainButton
            variant="contained"
            variants={buttonVariants}
            component={motion.button}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            지금 시작하기
          </MainButton>
          
          <SecondaryButton
            variant="outlined"
            variants={secondButtonVariants}
            component={motion.button}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            자세히 알아보기
          </SecondaryButton>
        </ButtonContainer>
        
        {/* 이스터에그 버튼 */}
        <Tooltip 
          title="비밀 발견하기" 
          TransitionComponent={Zoom} 
          arrow
          placement="left"
        >
          <EasterEggButton
            component={motion.button}
            initial="hidden"
            animate="visible"
            variants={easterEggButtonVariants}
            whileHover={{ scale: 1.2, rotate: 15 }}
            whileTap={{ scale: 0.9 }}
            onClick={handleEasterEgg}
          />
        </Tooltip>
        
        <Tooltip 
          title="또 다른 비밀" 
          TransitionComponent={Zoom} 
          arrow
          placement="right"
        >
          <SecondEasterEggButton
            component={motion.button}
            initial="hidden"
            animate="visible"
            variants={easterEggButtonVariants}
            whileHover={{ scale: 1.2, rotate: -15 }}
            whileTap={{ scale: 0.9 }}
            onClick={handleSecondEasterEgg}
          />
        </Tooltip>
        
        {/* 첫 번째 모달 */}
        <Modal
          open={modalOpen}
          onClose={handleCloseModal}
          closeAfterTransition
        >
          <Grow in={modalOpen} timeout={700}>
            <ModalContent>
              <AnimatePresence>
                {modalOpen && (
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.5 }}
                  >
                    <AchievementText variant="h4">
                      정자 탐험가 업적 달성!
                    </AchievementText>
                    <Typography variant="body1" style={{ marginBottom: 10 }}>
                      축하합니다! 당신은 정자의 비밀을 발견했습니다.
                    </Typography>
                    <Typography variant="body2" style={{ opacity: 0.8, marginBottom: 10 }}>
                      이제 질의 모든 정자들을 탐험할 수 있습니다.
                    </Typography>
                    <Typography variant="body2" sx={{ 
                      background: 'rgba(0, 180, 255, 0.1)',
                      padding: 2,
                      borderRadius: 2,
                      marginTop: 2
                    }}>
                      "무한한 질에서 당신의 여정은 이제 막 시작되었습니다."
                    </Typography>
                    <ModalButton 
                      variant="contained"
                      onClick={handleCloseModal}
                      component={motion.button}
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                    >
                      ㅅㅂ 좆같네
                    </ModalButton>
                  </motion.div>
                )}
              </AnimatePresence>
            </ModalContent>
          </Grow>
        </Modal>
        
        {/* 두 번째 모달 */}
        <Modal
          open={secondModalOpen}
          onClose={handleCloseSecondModal}
          closeAfterTransition
        >
          <Grow in={secondModalOpen} timeout={700}>
            <SecondModalContent>
              <AnimatePresence>
                {secondModalOpen && (
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.5 }}
                  >
                    <SecondAchievementText variant="h4">
                      별빛 수집가 업적 달성!
                    </SecondAchievementText>
                    <Typography variant="body1" style={{ marginBottom: 10 }}>
                      놀라운 발견입니다! 희귀한 우주 현상을 관측했습니다.
                    </Typography>
                    <Typography variant="body2" style={{ opacity: 0.8, marginBottom: 10 }}>
                      이제 당신은 별들의 언어를 이해할 수 있습니다.
                    </Typography>
                    <Typography variant="body2" sx={{ 
                      background: 'rgba(255, 62, 137, 0.1)',
                      padding: 2,
                      borderRadius: 2,
                      marginTop: 2
                    }}>
                      "별들은 당신에게 속삭입니다. 자세히 들어보세요."
                    </Typography>
                    <SecondModalButton 
                      variant="contained"
                      onClick={handleCloseSecondModal}
                      component={motion.button}
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                    >
                      오 이건 좋군!
                    </SecondModalButton>
                  </motion.div>
                )}
              </AnimatePresence>
            </SecondModalContent>
          </Grow>
        </Modal>
      </StyledBox>
    </ThemeProvider>
  );
};

export default App;