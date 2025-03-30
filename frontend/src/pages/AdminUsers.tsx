import React, { useState, useEffect } from 'react';

interface User {
    _id: string;
    username: string;
    firstName: string;
    lastName: string;
    email: string;
    coins: number;
    ownedItems: any[];
}

const AdminUsers: React.FC = () => {
    const [users, setUsers] = useState<User[]>([]);
    const [editingUser, setEditingUser] = useState<User | null>(null);
    const [message, setMessage] = useState<string>('');
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    // Fetch all users
    const fetchUsers = async () => {
        try {
            console.log('Fetching users...');
            const response = await fetch('http://localhost:5001/api/users');
            console.log('Response status:', response.status);
            
            if (!response.ok) {
                const errorData = await response.json();
                console.error('Error response:', errorData);
                throw new Error(errorData.error || 'Failed to fetch users');
            }
            
            const data = await response.json();
            console.log('Received users data:', data);
            setUsers(data);
        } catch (err) {
            console.error('Failed to fetch users:', err);
            setError(err instanceof Error ? err.message : 'Failed to load users');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchUsers();
    }, []);

    if (loading) return <div className="flex justify-center items-center min-h-screen">Loading...</div>;
    if (error) return <div className="flex justify-center items-center min-h-screen text-red-500">{error}</div>;

    // Update user
    const handleUpdateUser = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!editingUser) return;
        try {
            const response = await fetch(`http://localhost:5001/api/users/${editingUser._id}`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    username: editingUser.username,
                    firstName: editingUser.firstName,
                    lastName: editingUser.lastName,
                    email: editingUser.email,
                    coins: editingUser.coins
                })
            });
            if (response.ok) {
                setEditingUser(null);
                fetchUsers();
                setMessage('User updated successfully');
            } else {
                throw new Error('Failed to update user');
            }
        } catch (err) {
            console.error('Failed to update user:', err);
            setMessage('Failed to update user');
        }
    };

    // Delete user
    const handleDeleteUser = async (userId: string) => {
        if (!window.confirm('Are you sure you want to delete this user?')) return;
        
        try {
            const response = await fetch(`http://localhost:5001/api/users/${userId}`, {
                method: 'DELETE'
            });
            if (response.ok) {
                fetchUsers();
                setMessage('User deleted successfully');
            } else {
                throw new Error('Failed to delete user');
            }
        } catch (err) {
            console.error('Failed to delete user:', err);
            setMessage('Failed to delete user');
        }
    };

    return (
        <div className="p-4 bg-[#FEFAE0] min-h-screen">
            <h2 className="text-4xl font-bold mb-8 text-[#1F2040]">Manage Users</h2>
            
            {message && (
                <div className={`p-4 mb-4 rounded ${
                    message.includes('successfully') ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'
                }`}>
                    {message}
                </div>
            )}

            {/* Users List */}
            <div className="bg-white p-6 rounded-lg shadow-lg">
                <h3 className="text-2xl mb-4 text-[#1F2040]">Current Users</h3>
                <div className="space-y-4">
                    {users.map(user => (
                        <div key={user._id} className="border border-gray-200 p-4 rounded-lg">
                            {editingUser?._id === user._id ? (
                                // Edit Form
                                <form onSubmit={handleUpdateUser} className="space-y-4">
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700">Username</label>
                                        <input
                                            type="text"
                                            value={editingUser.username}
                                            onChange={e => setEditingUser({...editingUser, username: e.target.value})}
                                            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-[#B49CEF] focus:ring-[#B49CEF]"
                                            required
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700">First Name</label>
                                        <input
                                            type="text"
                                            value={editingUser.firstName}
                                            onChange={e => setEditingUser({...editingUser, firstName: e.target.value})}
                                            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-[#B49CEF] focus:ring-[#B49CEF]"
                                            required
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700">Last Name</label>
                                        <input
                                            type="text"
                                            value={editingUser.lastName}
                                            onChange={e => setEditingUser({...editingUser, lastName: e.target.value})}
                                            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-[#B49CEF] focus:ring-[#B49CEF]"
                                            required
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700">Email</label>
                                        <input
                                            type="email"
                                            value={editingUser.email}
                                            onChange={e => setEditingUser({...editingUser, email: e.target.value})}
                                            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-[#B49CEF] focus:ring-[#B49CEF]"
                                            required
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700">Coins</label>
                                        <input
                                            type="number"
                                            value={editingUser.coins}
                                            onChange={e => setEditingUser({...editingUser, coins: Number(e.target.value)})}
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
                                            onClick={() => setEditingUser(null)}
                                            className="flex-1 bg-gray-500 text-white p-2 rounded-md hover:bg-gray-600 transition-colors"
                                        >
                                            Cancel
                                        </button>
                                    </div>
                                </form>
                            ) : (
                                // Display User
                                <div className="flex justify-between items-center">
                                    <div>
                                        <h4 className="text-lg font-semibold text-[#1F2040]">{user.username}</h4>
                                        <p className="text-gray-600">Name: {user.firstName} {user.lastName}</p>
                                        <p className="text-gray-600">Email: {user.email}</p>
                                        <p className="text-gray-600">Coins: {user.coins}</p>
                                        <p className="text-gray-600">Items Owned: {user.ownedItems.length}</p>
                                    </div>
                                    <div className="flex space-x-2">
                                        <button 
                                            onClick={() => setEditingUser(user)}
                                            className="bg-[#DDA15E] text-white p-2 rounded-md hover:bg-[#c18f4d] transition-colors"
                                        >
                                            Edit
                                        </button>
                                        <button 
                                            onClick={() => handleDeleteUser(user._id)}
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

export default AdminUsers; 