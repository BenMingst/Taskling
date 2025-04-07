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
    updateNum();
    fetchOwnedItems();
    fetchUserInfo();
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
          return { left: '30px', bottom: '60px', width: '120px',zIndex: 1, };
        case 'food bowl':
          return { right: '30px', bottom: '60px', width: '120px',zIndex: 2, };
          case 'window':
            return { top: '20px', left: '30px', width: '200px', height: '200px' };
        case 'clock':
          return { right: '40px', top: '30px', width: '50px', zIndex: 1, };
        case 'carpet':
          return { left: '40%', bottom: '20px', transform: 'translateX(-50%)', width: '350px', zIndex: 1, };
        default:
          // fallback layout if item type is unknown
          return { left: `${40 + index * 60}px`, bottom: '10px', width: '50px' };
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
