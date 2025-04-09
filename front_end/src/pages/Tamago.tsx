import './style.css';
import { useEffect,useState,useRef } from 'react';
import { useTamagoFunctions } from './TamagoFunctions';
import tamagoImage from '../../public/assets/tamago1.png';
import tamagoCookie from '../../public/assets/cookie.png';
import { faUserEdit } from '@fortawesome/free-solid-svg-icons';
//import tamagoGreyCookie from '../../public/assets/cookie_no_eat.png';

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

const Tamago = () => {
  const { petImageRef, cookieImageRef, numCookiesRef, updateNum, doRockingAnim, doFeedingAnim } = useTamagoFunctions();
  const [ownedItems, setOwnedItems] = useState<ownedItems[]>([]);
  const [placedItems, setPlacedItems] = useState<ownedItems[]>([]);
  const [user, setUser] = useState<User | null>(null);
  //const [loading, setLoading] = useState(true);
  //const [error, setError] = useState<string | null>(null);

   useEffect(() => {
    const initializeData = async () => {
      const userId = localStorage.getItem("userId");
      if (!userId) return;
  
      try {
        const [userRes, itemsRes] = await Promise.all([
          fetch(`${API_BASE_URL}/users/${userId}`),
          fetch(`${API_BASE_URL}/items/user/${userId}`)
        ]);
  
        if (!userRes.ok || !itemsRes.ok) throw new Error("Failed to fetch user or items");
  
        const userData = await userRes.json();
        const itemsData = await itemsRes.json();
  
        setUser(userData);
        setOwnedItems(itemsData);
  
        const hasCookie = itemsData.some((item: ownedItems) => item.name.toLowerCase() === 'cookie');
        numCookiesRef.current = (hasCookie ? 1 : 0);
        updateNum();
  
      } catch (err) {
        console.error("Initialization error:", err);
      }
    };
  
    initializeData();
  }, []);
  
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

  const cookieBonus = ownedItems.some(item => item.name.toLowerCase() === 'cookie') ? 1 : 0;
  numCookiesRef.current = 0 + cookieBonus;
  updateNum();
  
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
    const handlePlaceItem = (item: ownedItems) => {
      if (!placedItems.some(p => p._id === item._id)) {
        setPlacedItems([...placedItems, item]);
      }
    };
    const getItemStyle = (name: string, index: number) => {
      switch (name.toLowerCase()) {
        case 'bed':
          return { left: '30px', top: '350px', width: '200px', zIndex: 1, height: 'auto' };
        case 'food bowl':
          return { right: '50px', top: '430px', width: '80px', zIndex: 1, height: 'auto' };
          case 'window':
            return { top: '80px', left: '40px', width: '230px', height: 'auto' };
        case 'clock':
          return { right: '30px', top: '100px', width: '130px', zIndex: 1, height: 'auto' };
        case 'carpet':
          return { left: '60px', top: '410px', width: '370px', height: 'auto' };
        default:
          // fallback layout if item type is unknown
          const hash = Array.from(name).reduce((acc, char) => acc + char.charCodeAt(0), 0);
          return { left: `${(hash % 200) + 50}px`, bottom: '10px', width: '50px' };
      }
    };
    
    //if (loading) return <div className="flex justify-center items-center min-h-screen">Loading...</div>;
    //if (error) return <div className="flex justify-center items-center min-h-screen text-red-500">{error}</div>;
  
  return (
    <>
      <div className="Sidebar">
        <p>My Items</p>
          <div className="ItemsGrid">
            {ownedItems.length === 0 ? (
              <p>No items yet</p>
            ) : (
              ownedItems.map((item) => (
                <img
                  key={item._id} 
                  src={item.imageUrl}
                  alt={item.name}
                  className="OwnedItem"
                  title={item.name}
                  onClick={() => handlePlaceItem(item)}
                />
              ))
            )}
          </div>
      </div>
      <center>
        <div className="PetEnviroment">
          <button onClick={doRockingAnim} className="PetButton">
            <img
              ref={petImageRef}
              id="PetImage"
              src={tamagoImage}
              alt="Pet"
            />
          </button>
          {placedItems.map((item, index) => {
            if (item.name === 'Cookie') return null;
            return (
            <img
              key={item._id}
              src={item.imageUrl}
              alt={item.name}
              className={`PlacedItem item-${item.name.toLowerCase()}`}
              style={{
                position: 'absolute',
                ...(getItemStyle(item.name, index)) // Custom position per item
              }}
            />
            );
    })}
          
        </div>
      
        <div className="CookieBox" id="Cookie">
          <label id="CookieCount">0</label>
          <button onClick={doFeedingAnim} className="CookieButton">
            <img
              ref={cookieImageRef}
              id="CookieImage"
              src={tamagoCookie}
              alt="Cookie"
            />
          </button>
        </div>
      </center>
    </>
  );
};

export default Tamago;
