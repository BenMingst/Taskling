import React, { useState, useEffect } from 'react';

interface Item {
    _id: string;
    name: string;
    price: number;
    imageUrl: string;
}

const AdminItems: React.FC = () => {
    const [items, setItems] = useState<Item[]>([]);
    const [newItem, setNewItem] = useState({ name: '', price: 0, imageUrl: '' });
    const [editingItem, setEditingItem] = useState<Item | null>(null);
    const [message, setMessage] = useState<string>('');

    // Fetch all items
    const fetchItems = async () => {
        try {
            const response = await fetch('http://localhost:5001/api/items');
            if (!response.ok) throw new Error('Failed to fetch items');
            const data = await response.json();
            setItems(data);
        } catch (err) {
            console.error('Failed to fetch items:', err);
            setMessage('Failed to load items');
        }
    };

    useEffect(() => {
        fetchItems();
    }, []);

    // Add new item
    const handleAddItem = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            const response = await fetch('http://localhost:5001/api/items', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(newItem)
            });
            if (response.ok) {
                setNewItem({ name: '', price: 0, imageUrl: '' });
                fetchItems();
                setMessage('Item added successfully');
            } else {
                throw new Error('Failed to add item');
            }
        } catch (err) {
            console.error('Failed to add item:', err);
            setMessage('Failed to add item');
        }
    };

    // Update item
    const handleUpdateItem = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!editingItem) return;
        try {
            const response = await fetch(`http://localhost:5001/api/items/${editingItem._id}`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(editingItem)
            });
            if (response.ok) {
                setEditingItem(null);
                fetchItems();
                setMessage('Item updated successfully');
            } else {
                throw new Error('Failed to update item');
            }
        } catch (err) {
            console.error('Failed to update item:', err);
            setMessage('Failed to update item');
        }
    };

    // Delete item
    const handleDeleteItem = async (itemId: string) => {
        if (!window.confirm('Are you sure you want to delete this item?')) return;
        
        try {
            const response = await fetch(`http://localhost:5001/api/items/${itemId}`, {
                method: 'DELETE'
            });
            if (response.ok) {
                fetchItems();
                setMessage('Item deleted successfully');
            } else {
                throw new Error('Failed to delete item');
            }
        } catch (err) {
            console.error('Failed to delete item:', err);
            setMessage('Failed to delete item');
        }
    };

    return (
        <div className="p-4 bg-[#FEFAE0] min-h-screen">
            <h2 className="text-4xl font-bold mb-8 text-[#1F2040]">Manage Shop Items</h2>
            
            {message && (
                <div className={`p-4 mb-4 rounded ${
                    message.includes('successfully') ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'
                }`}>
                    {message}
                </div>
            )}
            
            {/* Add New Item Form */}
            <div className="bg-white p-6 rounded-lg shadow-lg mb-8">
                <h3 className="text-2xl mb-4 text-[#1F2040]">Add New Item</h3>
                <form onSubmit={handleAddItem} className="space-y-4">
                    <div>
                        <label className="block text-sm font-medium text-gray-700">Item Name</label>
                        <input
                            type="text"
                            value={newItem.name}
                            onChange={e => setNewItem({...newItem, name: e.target.value})}
                            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-[#B49CEF] focus:ring-[#B49CEF]"
                            required
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700">Price</label>
                        <input
                            type="number"
                            value={newItem.price}
                            onChange={e => setNewItem({...newItem, price: Number(e.target.value)})}
                            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-[#B49CEF] focus:ring-[#B49CEF]"
                            required
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700">Image URL</label>
                        <input
                            type="text"
                            value={newItem.imageUrl}
                            onChange={e => setNewItem({...newItem, imageUrl: e.target.value})}
                            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-[#B49CEF] focus:ring-[#B49CEF]"
                            required
                        />
                    </div>
                    <button 
                        type="submit" 
                        className="w-full bg-[#B49CEF] text-white p-2 rounded-md hover:bg-[#8d79be] transition-colors"
                    >
                        Add Item
                    </button>
                </form>
            </div>

            {/* Items List */}
            <div className="bg-white p-6 rounded-lg shadow-lg">
                <h3 className="text-2xl mb-4 text-[#1F2040]">Current Items</h3>
                <div className="space-y-4">
                    {items.map(item => (
                        <div key={item._id} className="border border-gray-200 p-4 rounded-lg">
                            {editingItem?._id === item._id ? (
                                // Edit Form
                                <form onSubmit={handleUpdateItem} className="space-y-4">
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700">Item Name</label>
                                        <input
                                            type="text"
                                            value={editingItem.name}
                                            onChange={e => setEditingItem({...editingItem, name: e.target.value})}
                                            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-[#B49CEF] focus:ring-[#B49CEF]"
                                            required
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700">Price</label>
                                        <input
                                            type="number"
                                            value={editingItem.price}
                                            onChange={e => setEditingItem({...editingItem, price: Number(e.target.value)})}
                                            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-[#B49CEF] focus:ring-[#B49CEF]"
                                            required
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700">Image URL</label>
                                        <input
                                            type="text"
                                            value={editingItem.imageUrl}
                                            onChange={e => setEditingItem({...editingItem, imageUrl: e.target.value})}
                                            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-[#B49CEF] focus:ring-[#B49CEF]"
                                            required
                                        />
                                    </div>
                                    <div className="flex space-x-2">
                                        <button 
                                            type="submit" 
                                            className="flex-1 bg-[#B49CEF] text-white p-2 rounded-md hover:bg-[#8d79be] transition-colors"
                                        >
                                            Save
                                        </button>
                                        <button 
                                            type="button" 
                                            onClick={() => setEditingItem(null)}
                                            className="flex-1 bg-gray-500 text-white p-2 rounded-md hover:bg-gray-600 transition-colors"
                                        >
                                            Cancel
                                        </button>
                                    </div>
                                </form>
                            ) : (
                                // Display Item
                                <div className="flex justify-between items-center">
                                    <div>
                                        <h4 className="text-lg font-semibold text-[#1F2040]">{item.name}</h4>
                                        <p className="text-gray-600">Price: {item.price}</p>
                                        <p className="text-gray-600">Image: {item.imageUrl}</p>
                                    </div>
                                    <div className="flex space-x-2">
                                        <button 
                                            onClick={() => setEditingItem(item)}
                                            className="bg-[#DDA15E] text-white p-2 rounded-md hover:bg-[#c18f4d] transition-colors"
                                        >
                                            Edit
                                        </button>
                                        <button 
                                            onClick={() => handleDeleteItem(item._id)}
                                            className="bg-red-500 text-white p-2 rounded-md hover:bg-red-600 transition-colors"
                                        >
                                            Delete
                                        </button>
                                    </div>
                                </div>
                            )}
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default AdminItems; 