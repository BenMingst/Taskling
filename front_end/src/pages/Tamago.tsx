import './style.css';
import { useEffect,useState } from 'react';
import { useTamagoFunctions } from './TamagoFunctions';
import tamagoImage from '../../public/assets/tamago1.png';
import tamagoCookie from '../../public/assets/cookie.png';
//import tamagoGreyCookie from '../../public/assets/cookie_no_eat.png';
// Check to see if you're on prod or dev
const isProd = process.env.NODE_ENV === "production";
const API_BASE_URL = isProd ? "http://161.35.186.141:5003/api" : "http://localhost:5003/api";
//const API_BASE_URL = "http://localhost:5003/api";
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
  const [user, setUser] = useState<User | null>(null);
  const [visibleItems, setVisibleItems] = useState<string[]>([]);

  useEffect(() => {
    updateNum();
    fetchOwnedItems();
    fetchUserInfo();
    const storedVisible = localStorage.getItem("visibleItems");
    if (storedVisible) {
      setVisibleItems(JSON.parse(storedVisible));
    }
  }, []);


  const fetchUserInfo = async () => {
    try {
      const userId = localStorage.getItem("userId");
      if (!userId) {
        setUser(null);
        return;
      }

      const response = await fetch(`${API_BASE_URL}/users/${userId}`);
      if (!response.ok) throw new Error("Failed to fetch user info");
      const data = await response.json();
      setUser(data);
    } catch (err) {
      console.error("Error fetching user info:", err);
      setUser(null);
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

  return (
    <>
      <div className="Sidebar">
        <p>My Items</p>
          <div className="ItemsGrid">
            {ownedItems.length === 0 ? (
              <p>No items yet</p>
            ) : (
              ownedItems.map((item) => {
                console.log("Owned item name:", item.name); // 👈 Log item names here
                return (
                  <img
                    key={item._id}
                    src={item.imageUrl}
                    alt={item.name}
                    className="OwnedItem"
                    title={item.name}
                    onClick={() => {
                      const updatedVisible = [...visibleItems, item.name];
                      if (!visibleItems.includes(item.name)) {
                        setVisibleItems(updatedVisible);
                        localStorage.setItem("visibleItems", JSON.stringify(updatedVisible));
                      }
                    }}
                  />
                );
              })
            )}
          </div>
      </div>
      <center>
        <div className="PetEnviroment">
          <img
            src={'../../public/assets/clock.png'}
            alt="Clock"
            className={`clock ${visibleItems.includes("clock") ? "" : "hidden"}`}
          />
          <img
            src={'../../public/assets/window.png'}
            alt="Window"
            className={`window ${visibleItems.includes("Window") ? "" : "hidden"}`}
          />
          <img
            src={'../../public/assets/bowl.png'}
            alt="Bowl"
            className={`bowl ${visibleItems.includes("food bowl") ? "" : "hidden"}`}
          />
          <img
            src={'../../public/assets/bed.png'}
            alt="Bed"
            className={`bed ${visibleItems.includes("bed") ? "" : "hidden"}`}
          />
          <img
            src={'../../public/assets/carpet.png'}
            alt="Carpet"
            className={`carpet ${visibleItems.includes("Carpet") ? "" : "hidden"}`}
          />
          <button onClick={doRockingAnim} className="PetButton">
            <img
              ref={petImageRef}
              id="PetImage"
              src={tamagoImage}
              alt="Pet"
            />
          </button>
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
