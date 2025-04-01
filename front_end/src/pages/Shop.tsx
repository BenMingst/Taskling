// src/pages/Shop.tsx

import { Link } from "react-router-dom";
import "./style.css";

const shopItems = [
  { id: 1, price: 100 },
  { id: 2, price: 200 },
  { id: 3, price: 300 },
  { id: 4, price: 400 },
  { id: 5, price: 500 },
  { id: 6, price: 600 },
];

const Shop = () => {
  return (
    <div className="flex">
      {/* Sidebar */}
      <aside className="w-20 bg-white text-purple-500 flex flex-col items-center py-4">
        <Link to="/Tasks" className="mb-8">📋</Link> {/* Link to Tasks Page */}
        <Link to="/shop" className="mb-8">🛒</Link> {/* Active Shop Link */}
      </aside>

      {/* Main Content */}
      <main className="flex-1 p-8 bg-[#FEFAE0] min-h-screen">
        <h1 className="text-4xl font-bold mb-8 text-[#1F2040]">Shop</h1>

        {/* Shop Items Grid */}
        <div className="grid grid-cols-3 gap-8">
          {shopItems.map((item) => (
            <div key={item.id} className="bg-[#DDA15E] p-6 rounded-2xl">
              <div className="bg-[#B49CEF] p-4 rounded-lg flex flex-col items-center">
                <img
                  src={`/assets/item-${item.id}.png`}
                  alt={`Item ${item.id}`}
                  className="w-32 h-32 mb-4"
                />
                <button className="bg-black text-white p-2 rounded-md">
                  💰 {item.price}
                </button>
              </div>
            </div>
          ))}
        </div>
      </main>
    </div>
  );
};

export default Shop;

