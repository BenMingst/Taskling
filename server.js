// This is the main file for the backend server. It will be responsible for connecting to the MongoDB database and defining the routes for the API.
import path from 'path';
import { fileURLToPath } from 'url';
import dotenv from 'dotenv';
import express from 'express';
import bodyParser from 'body-parser';
import cors from 'cors';
import { MongoClient, ObjectId } from 'mongodb';
import sgMail from '@sendgrid/mail';
import { v4 as uuidv4 } from 'uuid';
import jwt from "jsonwebtoken";

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const port = process.env.PORT || 5003;

const mongoUri = process.env.MONGO_URI || 'mongodb+srv://Chami:Home%40342406@cluster0.nyeq7.mongodb.net/Taskling?retryWrites=true&w=majority';
const SENDGRID_API_KEY = process.env.SENDGRID_API_KEY;
const JWT_SECRET = "f9a8e02d8b9c47d9b7e7b2ef4b8b927a1c19d7c8b5cdeae457f74eb9d3f2a4cb";
const BASE_URL_API = "http://161.35.186.141:5003/api";
sgMail.setApiKey(SENDGRID_API_KEY);

app.use(cors());
app.use(bodyParser.json());

app.use((req, res, next) => {
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

// API Routes should be defined first
MongoClient.connect(mongoUri)
  .then(client => {
    console.log('Connected to MongoDB');
    const db = client.db('Taskling');
    const usersCollection = db.collection('Users');
    const itemsCollection = db.collection('Items');
    const tasksCollection = db.collection('Tasks');

    // Test route
    app.get('/api/test', (req, res) => {
      res.json({ message: 'Backend is working!' });
    });

    // Signup route
    app.post('/api/signup', async (req, res) => {
      try {
        const { username, email, password, firstName, lastName } = req.body;

        /* Check for duplicate username
        const existingUsername = await usersCollection.findOne({ username });
        if (existingUsername) {
          return res.status(400).json({ error: 'Username already exists' });
        }*/

        /* Check for duplicate email
        const existingEmail = await usersCollection.findOne({ email });
        if (existingEmail) {
          return res.status(400).json({ error: 'Email already exists' });
        }*/

        // Generate verification token
        const verificationToken = uuidv4();

        // Create new user with total_coins initialized
        const newUser = {
          username,
          email,
          password,
          coins: 100, // Initial coins
          total_coins: 100, // Initialize total_coins to match initial coins
          ownedItems: [],
          firstName,
          lastName,
          isVerified: false,
          verificationToken,
        };

        console.log("USER SIGN UP:", newUser);
        const result = await usersCollection.insertOne(newUser);

        // Send verification email
        const verificationLink = `${BASE_URL_API}/verify/${verificationToken}`;
        const msg = {
          to: email,
          from: 'ch564584@ucf.edu',
          templateId: "d-0ad3de42af26448a883d0d160d2e0eae",
          dynamic_template_data: {
            firstName: firstName,
            verification_link: verificationLink,
          },
        };

        await sgMail.send(msg);

        if (result.acknowledged) {
          res.status(201).json({ message: 'User created successfully' });
        } else {
          res.status(500).json({ error: 'Failed to create user' });
        }
      } catch (err) {
        console.error('Signup error:', err);
        res.status(500).json({ error: 'An error occurred during signup', details: err.message });
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

    // Reward system (example route to increment coins and total_coins)
    app.post('/api/reward', async (req, res) => {
      const { userId, rewardAmount } = req.body;

      try {
        // Increment both coins and total_coins
        const result = await usersCollection.updateOne(
          { _id: new ObjectId(String(userId)) },
          {
            $inc: { coins: rewardAmount, total_coins: rewardAmount },
          }
        );

        if (result.modifiedCount === 0) {
          return res.status(404).json({ error: 'User not found' });
        }

        res.status(200).json({ message: 'Reward added successfully!' });
      } catch (err) {
        console.error('Reward error:', err);
        res.status(500).json({ error: 'Error adding reward' });
      }
    });

    // Update a task
app.put('/api/tasks/:taskId', async (req, res) => {
  try {
    const { taskId } = req.params;
    const { name, details, completed } = req.body;

    // Update the task
    const result = await tasksCollection.updateOne(
      { _id: new ObjectId(taskId) },
      { $set: { name, details, completed } }
    );

    if (result.matchedCount === 0) {
      return res.status(404).json({ error: 'Task not found' });
    }

    // Get the user ID from the updated task
    const updatedTask = await tasksCollection.findOne({ _id: new ObjectId(taskId) });

    if (updatedTask && updatedTask.userId) {
      // Increment the user's coins by 15
      await usersCollection.updateOne(
        { _id: new ObjectId(updatedTask.userId) },
        { $inc: { coins: 15 } }, 
      );
    }

    res.status(200).json({ message: 'Task updated successfully and user coins incremented by 15' });
  } catch (err) {
    console.error('Error updating task:', err);
    res.status(500).json({ error: 'Failed to update task' });
  }
});

    // Get user info (include total_coins in the response)
    app.get('/api/users/:userId', async (req, res) => {
      try {
        const userId = req.params.userId;
        const user = await usersCollection.findOne({ _id: new ObjectId(userId) });

        if (!user) {
          return res.status(404).json({ error: 'User not found' });
        }

        // Get all items that the user owns
        const userItems = await itemsCollection.find({
          _id: { $in: user.ownedItems },
        }).toArray();

        // Return user info with owned items and total_coins
        res.status(200).json({
          _id: user._id,
          username: user.username,
          email: user.email,
          coins: user.coins,
          total_coins: user.total_coins, // Include total_coins
          ownedItems: userItems,
        });
      } catch (err) {
        console.error('Error fetching user info:', err);
        res.status(500).json({ error: 'Failed to fetch user info' });
      }
    });

    // Other routes remain unchanged...

    // Start the server
    app.listen(port, '0.0.0.0', () => {
      console.log(`Server is running on http://161.35.186.141:${port}`);
    });
  })
  .catch(err => {
    console.error('Failed to connect to MongoDB:', err);
  });
