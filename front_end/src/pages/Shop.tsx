import { Link } from "react-router-dom";
import { useState, useEffect } from "react";
import "./style.css";
import dotenv from "dotenv";

dotenv.config();

interface ShopItem {
  _id: string;
  price: number;
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
  ownedItems: ShopItem[];
}


// check to see if youre on prod or dev
const isProd = process.env.NODE_ENV === "production";
console.log("isProd", isProd);

const API_BASE_URL = isProd
  ? "http://taskling.site/api"
  : "http://localhost:5003/api";

console.log("API_BASE_URL", API_BASE_URL);

const Shop = () => {
  const [shopItems, setShopItems] = useState<ShopItem[]>([]);
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  

  useEffect(() => {
    fetchAllItems();
    fetchUserInfo();
  }, []);

  const fetchUserInfo = async () => {
    try {
      const userId = localStorage.getItem("userId");
      if (!userId) {
        setUser(null);
        setLoading(false);
        return;
      }
      console.log("userId", userId);
      const response = await fetch(`${API_BASE_URL}/users/${userId}`);
      if (!response.ok) throw new Error("Failed to fetch user info");
      const data = await response.json();
      setUser(data);
    } catch (err) {
      console.error("Error fetching user info:", err);
      setUser(null);
    } finally {
      setLoading(false);
    }
  };

  const fetchAllItems = async () => {
    try {
      const response = await fetch(`${API_BASE_URL}/items`);
      if (!response.ok) throw new Error("Failed to fetch items");
      const data = await response.json();
      setShopItems(data);
    } catch (err) {
      setError("Failed to load shop items");
      console.error(err);
    }
  };

  const handlePurchase = async (itemId: string) => {
    try {
      const response = await fetch(`${API_BASE_URL}/purchase`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          userId: localStorage.getItem("userId"),
          itemId: itemId,
        }),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || "Purchase failed");
      }

      fetchUserInfo();
      alert("Purchase successful!");
    } catch (err) {
      alert(err instanceof Error ? err.message : "Failed to purchase item");
    }
  };

  if (loading) return <div className="flex justify-center items-center min-h-screen">Loading...</div>;
  if (error) return <div className="flex justify-center items-center min-h-screen text-red-500">{error}</div>;

  return (
    <div className="flex">
      <aside className="w-20 bg-white text-purple-500 flex flex-col items-center py-4">
        <Link to="/Tasks" className="mb-8">📋</Link>
        <Link to="/shop" className="mb-8">🛒</Link>
      </aside>

      <main className="flex-1 p-8 bg-[#FEFAE0] min-h-screen">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-4xl font-bold text-[#1F2040]">Shop</h1>
          {user && (
            <div className="text-right">
              <h2 className="text-2xl font-semibold text-[#1F2040]">Welcome, {user.username}!</h2>
              <p className="text-lg text-[#1F2040]">Coins: 💰 {user.coins}</p>
            </div>
          )}
        </div>

        <div className="grid grid-cols-3 gap-8">
          {shopItems.map((item) => (
            <div key={item._id} className="bg-[#DDA15E] p-6 rounded-2xl">
              <div className="bg-[#B49CEF] p-4 rounded-lg flex flex-col items-center">
                <img src={item.imageUrl} alt={item.name} className="w-32 h-32 mb-4" />
                <h3 className="text-lg font-semibold mb-2">{item.name}</h3>
                {user?.ownedItems.some((ownedItem) => ownedItem._id === item._id) ? (
                  <div className="bg-green-500 text-white p-2 rounded-md">✓ Owned</div>
                ) : (
                  <button 
                    onClick={() => handlePurchase(item._id)}
                    className="bg-black text-white p-2 rounded-md hover:bg-gray-800 transition-colors"
                  >
                    💰 {item.price}
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>
      </main>
    </div>
  );
};

export default Shop;
