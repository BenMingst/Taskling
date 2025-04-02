import { useState, useRef } from 'react';

export const useTamagoFunctions = () => {
  const [petAnimPlaying, setPetAnimPlaying] = useState(false);
  const petImageRef = useRef<HTMLImageElement>(null);

  const startRockingAnim = (element: HTMLElement | null) => {
    if (element) {
      element.style.animationPlayState = 'running';
      element.style.animationIterationCount = 'infinite';
    }
  };

  const doRockingAnim = () => {
    if (!petAnimPlaying) {
      setPetAnimPlaying(true);
      const pet = petImageRef.current;

      startRockingAnim(pet);
      setTimeout(() => {
        if (pet) {
          pet.style.animationPlayState = 'paused';
          pet.style.animationIterationCount = '0';
        }
        setPetAnimPlaying(false);
      }, 1750);
    }
  };

  return {
    petImageRef,
    doRockingAnim,
  };
};