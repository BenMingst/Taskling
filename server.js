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
    app.post('/api/signup', (req, res) => {
      const {username, email, password} = req.body;
      const newUser = {username, email, password, coins : 100, ownedItems : []};
      usersCollection.insertOne(newUser)
        .then(result => {
          res.status(201).json({ message: 'User created successfully' });
        })
        .catch(err => {
          res.status(500).json({ error: 'Failed to create user' });
        });
    });

    // Purchase item route
    app.post('/api/purchase', async (req, res) => {
      const { userId, itemId } = req.body;

      try {
      // Find user and item
        const user = await usersCollection.findOne({ _id: new require('mongodb').ObjectId(userId) });
        const item = await itemsCollection.findOne({ _id: new require('mongodb').ObjectId(itemId) });

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
          // Login successful
          res.status(200).json({ message: 'Login successful' });
        } else {
          // Login failed
          res.status(401).json({ error: 'Invalid email or password' });
        }
    } catch (err) {
      console.error('Error during login:', err);
      res.status(500).json({ error: 'An error occurred. Please try again.' });
    }
  });


})
.catch(err => {
  console.error('Failed to connect to MongoDB:', err);
});

app.listen(port, '0.0.0.0', () => {
    console.log(`Server is running on http://161.35.186.141:${port}`);
  });
