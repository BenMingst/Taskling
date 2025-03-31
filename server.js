// This is the main file for the backend server. It will be responsible for connecting to the MongoDB database and defining the routes for the API.
import path from 'path';
import { fileURLToPath } from 'url';
import dotenv from 'dotenv';
import express from 'express';
import bodyParser from 'body-parser';
import cors from 'cors';
import { MongoClient, ObjectId } from 'mongodb';

dotenv.config(); 

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const port = process.env.PORT || 5001;
const mongoUri = process.env.MONGO_URI || 'mongodb+srv://Chami:Home%40342406@cluster0.nyeq7.mongodb.net/Taskling?retryWrites=true&w=majority';

app.use(cors());
app.use(bodyParser.json());

app.use((req, res, next) =>
{
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader(
        'Access-Control-Allow-Headers',
        'Origin, X-Requested-With, Content-Type, Accept, Authorization'
    );
    res.setHeader(
        'Access-Control-Allow-Methods',
        'GET, POST, PATCH, DELETE, OPTIONS'
    );
    next();
});

// Add this before your API routes
app.use(express.static(path.join(__dirname, 'frontend/dist')));

MongoClient.connect(mongoUri)
  .then(client => {
    console.log('Connected to MongoDB');
    const db = client.db('Taskling'); // Replace with your database name
    const usersCollection = db.collection('Users');
    const itemsCollection = db.collection('Items'); // Replace with your collection name

    // Test route
    app.get('/api/test', (req, res) => {
      res.json({ message: 'Backend is working!' });
    });

    // Signup route
    app.post('/api/signup', async (req, res) => {
      try {
        const {username, email, password, firstName, lastName} = req.body;

        // Check for duplicate username
        const existingUsername = await usersCollection.findOne({ username });
        if (existingUsername) {
          return res.status(400).json({ error: 'Username already exists' });
        }

        // Check for duplicate email
        const existingEmail = await usersCollection.findOne({ email });
        if (existingEmail) {
          return res.status(400).json({ error: 'Email already exists' });
        }

        // Create new user if no duplicates found
        const newUser = {username, email, password, coins: 100, ownedItems: [], firstName, lastName};
        const result = await usersCollection.insertOne(newUser);
        
        if (result.acknowledged) {
          res.status(201).json({ message: 'User created successfully' });
        } else {
          res.status(500).json({ error: 'Failed to create user' });
        }
      } catch (err) {
        console.error('Signup error:', err);
        res.status(500).json({ error: 'An error occurred during signup' });
      }
    });

    // Purchase item route
    app.post('/api/purchase', async (req, res) => {
      const { userId, itemId } = req.body;

      try {
        // Find user and item
        const user = await usersCollection.findOne({ 
          _id: new ObjectId(String(userId))
        });
        const item = await itemsCollection.findOne({ 
          _id: new ObjectId(String(itemId))
        });

        if (!user || !item) {
          return res.status(404).json({ error: 'User or item not found' });
        }

        // Check if user has enough coins
        if (user.coins < item.price) {
          return res.status(400).json({ error: 'Not enough coins' });
        }

        // Update user's coins and ownedItems
        await usersCollection.updateOne(
          { _id: user._id },
          {
            $inc: { coins: -item.price },
            $push: { ownedItems: item._id }
          }
        );

        res.status(200).json({ message: 'Item purchased successfully!' });
      } catch (err) {
        console.error('Purchase error:', err);
        res.status(500).json({ error: 'Error during purchase' });
      }
    });


    // Login route
    app.post('/api/login', async (req, res) => {
      const { email, password } = req.body;
    
      try {
        // Find the user in the database
        const user = await usersCollection.findOne({ email, password });
    
        if (user) {
          // Login successful - return user ID
          res.status(200).json({ 
            message: 'Login successful',
            userId: user._id.toString() // Convert ObjectId to string
          });
        } else {
          // Login failed
          res.status(401).json({ error: 'Invalid email or password' });
        }
    } catch (err) {
      console.error('Error during login:', err);
      res.status(500).json({ error: 'An error occurred. Please try again.' });
    }
  });

  // Get all items for a specific user
  app.get('/api/items/user/:userId', async (req, res) => {
    try {
      const userId = req.params.userId;
      const user = await usersCollection.findOne({ _id: new ObjectId(userId) });
      
      if (!user) {
        return res.status(404).json({ error: 'User not found' });
      }

      // Get all items that the user owns
      const userItems = await itemsCollection.find({
        _id: { $in: user.ownedItems }
      }).toArray();

      res.status(200).json(userItems);
    } catch (err) {
      console.error('Error fetching user items:', err);
      res.status(500).json({ error: 'Failed to fetch user items' });
    }
  });

  // Get all items )for the shop page)
  app.get('/api/items', async (req, res) => {
    try {
        const items = await itemsCollection.find({}).toArray();
        res.status(200).json(items);
    } catch (err) {
        res.status(500).json({ error: 'Failed to fetch items' });
    }
  });

  // Add a new item ( thi is for the admin page only)
  app.post('/api/items', async (req, res) => {
    try {
        const { name, price, imageUrl } = req.body;
        const newItem = { name, price, imageUrl };
        const result = await itemsCollection.insertOne(newItem);
        res.status(201).json({ id: result.insertedId, ...newItem });
    } catch (err) {
        res.status(500).json({ error: 'Failed to add item' });
    }
  });

  // Update an existing item ( this is for the admin page only)
  app.put('/api/items/:itemId', async (req, res) => {
    try {
        const { itemId } = req.params;
        const { name, price, imageUrl } = req.body;
        const result = await itemsCollection.updateOne(
            { _id: new ObjectId(itemId) },
            { $set: { name, price, imageUrl } }
        );
        if (result.matchedCount === 0) {
            return res.status(404).json({ error: 'Item not found' });
        }
        res.status(200).json({ message: 'Item updated successfully' });
    } catch (err) {
        res.status(500).json({ error: 'Failed to update item' });
    }
  });

  // Delete an item ( this is for the admin page only)
  app.delete('/api/items/:itemId', async (req, res) => {
    try {
        const { itemId } = req.params;
        const result = await itemsCollection.deleteOne({
            _id: new ObjectId(itemId)
        });
        if (result.deletedCount === 0) {
            return res.status(404).json({ error: 'Item not found' });
        }
        res.status(200).json({ message: 'Item deleted successfully' });
    } catch (err) {
        res.status(500).json({ error: 'Failed to delete item' });
    }
  });

  // Get all the user info to make everything easier, and parse it later ( for admin page and all other pages)
  app.get('/api/users/:userId', async (req, res) => {
    try {
      const userId = req.params.userId;
      const user = await usersCollection.findOne({ _id: new ObjectId(userId) });
      
      if (!user) {
        return res.status(404).json({ error: 'User not found' });
      }

      // Get all items that the user owns
      const userItems = await itemsCollection.find({
        _id: { $in: user.ownedItems }
      }).toArray();

      // Return user info with owned items
      res.status(200).json({
        _id: user._id,
        username: user.username,
        email: user.email,
        coins: user.coins,
        ownedItems: userItems
      });
    } catch (err) {
      console.error('Error fetching user info:', err);
      res.status(500).json({ error: 'Failed to fetch user info' });
    }
  });

  // Get all users (for admin)
  app.get('/api/users', async (req, res) => {
    try {
      const users = await usersCollection.find({}).toArray();
      
      // Get all items that users own
      const userItems = await itemsCollection.find({}).toArray();
      
      // Map users with their owned items
      const usersWithItems = users.map(user => ({
        _id: user._id,
        username: user.username,
        firstName: user.firstName,
        lastName: user.lastName,
        email: user.email,
        coins: user.coins,
        ownedItems: userItems.filter(item => 
          (user.ownedItems || []).some(ownedId => ownedId.toString() === item._id.toString())
        )
      }));

      res.status(200).json(usersWithItems);
    } catch (err) {
      console.error('Error fetching users:', err);
      res.status(500).json({ error: 'Failed to fetch users' });
    }
  });

  // Update user (for admin)
  app.put('/api/users/:userId', async (req, res) => {
    try {
      const { userId } = req.params;
      const { username, firstName, lastName, email, coins } = req.body;
      const result = await usersCollection.updateOne(
        { _id: new ObjectId(userId) },
        { $set: { username, firstName, lastName, email, coins } }
      );
      if (result.matchedCount === 0) {
        return res.status(404).json({ error: 'User not found' });
      }
      res.status(200).json({ message: 'User updated successfully' });
    } catch (err) {
      res.status(500).json({ error: 'Failed to update user' });
    }
  });

  // Delete user (for admin)
  app.delete('/api/users/:userId', async (req, res) => {
    try {
      const { userId } = req.params;
      const result = await usersCollection.deleteOne({
        _id: new ObjectId(userId)
      });
      if (result.deletedCount === 0) {
        return res.status(404).json({ error: 'User not found' });
      }
      res.status(200).json({ message: 'User deleted successfully' });
    } catch (err) {
      res.status(500).json({ error: 'Failed to delete user' });
    }
  });

app.listen(port, '0.0.0.0', () => {
    console.log(`Server is running on http://161.35.186.141:${port}`);
  });

// Add this after your API routes
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'frontend/dist', 'index.html'));
});
})
.catch(err => {
  console.error('Failed to connect to MongoDB:', err);
});
