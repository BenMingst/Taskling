import { useState, useRef } from 'react';
import tamagoCookie from '../../public/assets/cookie.png';

export const useTamagoFunctions = () => {
  const [petAnimPlaying, setPetAnimPlaying] = useState(false);
  const petImageRef = useRef<HTMLImageElement>(null);
  const cookieImageRef = useRef<HTMLImageElement>(null);
  const [ownedItems, setOwnedItems] = useState<ownedItems[]>([]);
  const [user, setUser] = useState<User | null>(null);
  const numCookiesRef = useRef<number>(1); // set default number of cookies to 1

  


  // Check to see if you're on prod or dev
  const isProd = process.env.NODE_ENV === "production";
  const API_BASE_URL = isProd ? "http://161.35.186.141:5003/api" : "http://localhost:5003/api";

  interface ownedItems {
    _id: string;
    name: string;
    imageUrl: string;
  }
  interface User {
    _id: string;
    username: string;
    firstName: string;
    lastName: string;
    email: string;
    coins: number;
    ownedItems: ownedItems[];
  }

  const fetchUserInfo = async () => {
    try {
      const userId = localStorage.getItem("userId");
      if (!userId) {
        setUser(null);
        //setLoading(false);
        return;
      }

      const response = await fetch(`${API_BASE_URL}/users/${userId}`);
      if (!response.ok) throw new Error("Failed to fetch user info");
      const data = await response.json();
      setUser(data);
    } catch (err) {
      console.error("Error fetching user info:", err);
      setUser(null);
    } finally {
      //setLoading(false);
    }
  };

  const fetchOwnedItems = async () => {
    try {
      const res = await fetch(`${API_BASE_URL}/items/user/${localStorage.getItem("userId")}`);
      const data = await res.json();
      setOwnedItems(data);
      return data.ownedItems || [];
    } catch (err) {
      console.error('Error fetching owned items:', err);
      return [];
    }
  }

  const updateNum = () => {
    const cookieCountElement = document.getElementById('CookieCount');
    if (cookieCountElement) {
      const cookieItem = ownedItems.find((item: ownedItems) => item.name === "Cookie");
      if (cookieItem){
        cookieCountElement.textContent = numCookiesRef.current.toString();
      }
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