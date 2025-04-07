import { useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import "./style.css";

// Check to see if you're on prod or dev
const isProd = process.env.NODE_ENV === "production";
const API_BASE_URL = isProd ? "http://161.35.186.141:5003/api" : "http://localhost:5003/api";

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

const Shop = () => {
  const [shopItems, setShopItems] = useState<ShopItem[]>([]);
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();

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
const handleLogout = () => {
    // Clear user session
    localStorage.removeItem("userId"); // Or whatever you named it
    localStorage.removeItem("user"); // Optional

    // Navigate to login
    navigate("/signin"); // Or your login route
  };
  if (loading) return <div className="flex justify-center items-center min-h-screen">Loading...</div>;
  if (error) return <div className="flex justify-center items-center min-h-screen text-red-500">{error}</div>;

  return (
    <>
    <div className="flex">
      <main className="flex-1 p-8 bg-[#FEFAE0] min-h-screen">
        <div className="flex justify-between items-center mb-8 min-h-[160px]">
          <h1 className="text-[120px] font-bold text-[#1F2040]">Shop</h1>
          <div className="text-right min-w-[250px]"> {/* Reserve space */}
          {user && (
            <>
              <p className=" font-semibold text-[#1F2040]">Welcome, {user.firstName}!</p>
              <p className="text-lg text-[#1F2040]">Coins: 💰 {user.coins}</p>
            </>
          )}
          </div>
        </div>
        {/* Error message */}
        <div className="shop-grid">
          {shopItems.map((item) => {
            const hasEnoughCoins = user && user.coins >= item.price; // Explicitly check if user is not null

            return (
              <div key={item._id} className="shop-item">
                {/* Image container */}
                <div className="image-container">
                  <img src={item.imageUrl} alt={item.name} className="shop-item-image" />
                </div>

                {/* Product name */}
                <h4 className="shop-item-name">{item.name}</h4>

                {/* Price */}
                <div className="price-container">
                  <span className="price">💵 {item.price}</span>
                </div>

                {/* Price / Purchase Button */}
                <div className="button-container">
                  {user?.ownedItems.some((ownedItem) => ownedItem._id === item._id) ? (
                    <div className="owned-label">✓ Owned</div>
                  ) : (
                    <button
                      onClick={() => handlePurchase(item._id)}
                      className={`purchase-button ${hasEnoughCoins ? 'buy-now' : 'insufficient-coins'}`}
                      disabled={!hasEnoughCoins}
                    >
                      Buy Now
                    </button>

                  )}
                </div>
              </div>
            );
          })}
        </div>
        <button onClick={handleLogout} className="logout-btn">Logout</button>
      </main>
    </div>
    </>
  );
};
export default Shop;
