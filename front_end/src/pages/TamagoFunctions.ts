import { useState, useRef } from 'react';
import tamagoCookie from '../../public/assets/cookie.png';

export const useTamagoFunctions = () => {
  const [petAnimPlaying, setPetAnimPlaying] = useState(false);
  const petImageRef = useRef<HTMLImageElement>(null);
  const cookieImageRef = useRef<HTMLImageElement>(null);
  // TODO: REPLACE THIS WITH API CALL TO GET USER'S NUMBER OF COOKIES
  const numCookiesRef = useRef<number>(0); // set default number of cookies to 500

  const updateNum = () => {
    const cookieCountElement = document.getElementById('CookieCount');
    if (cookieCountElement) {
      cookieCountElement.textContent = (numCookiesRef.current || 0).toString();
    }
  };

  const startAnim = (element: HTMLElement | null) => {
    if (element) {
      element.style.animationPlayState = 'running';
    }
  };

  const doRockingAnim = () => {
    if (!petAnimPlaying) {
      setPetAnimPlaying(true);
      const pet = petImageRef.current;

      if (pet){
        pet.style.animationIterationCount = 'infinite';
        startAnim(pet);
      }
      setTimeout(() => {
        if (pet) {
          pet.style.animationPlayState = 'paused';
          pet.style.animationIterationCount = '0';
        }
        setPetAnimPlaying(false);
      }, 1750);
    }
  };

  const doFeedingAnim = () => {
    if (numCookiesRef.current > 0) {
      numCookiesRef.current -= 1;

      const cookieCountElement = document.getElementById('CookieCount');
      if (cookieCountElement) {
        console.log("Cookie Count Checked\n");
        cookieCountElement.textContent = numCookiesRef.current.toString();
      }

      const newCookie = document.createElement('img');
      newCookie.setAttribute('src', tamagoCookie);
      newCookie.setAttribute('id', 'CookieClone');
      cookieImageRef.current = newCookie; // Assign the new cookie image to the ref

      const cookieContainer = document.getElementById('Cookie');
      if (cookieContainer) {
        console.log("Appending Child\n");
        cookieContainer.appendChild(newCookie);
        console.log("Animation Starting");
        startAnim(newCookie as HTMLElement);
      }

      console.log("Starting timeout\n");
      setTimeout(() => {
        if (cookieImageRef.current === newCookie) {
          cookieImageRef.current = null; // Clear the ref once the image is removed
        }
        newCookie.remove();
        console.log("Timeout Completed\n");
      }, 1700);
    }
  };

  return {
    petImageRef,
    cookieImageRef,
    numCookiesRef,
    updateNum,
    doRockingAnim,
    doFeedingAnim,
  };
};
