// This is the main file for the backend server. It will be responsible for connecting to the MongoDB database and defining the routes for the API.
require('dotenv').config(); 
const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const MongoClient = require('mongodb').MongoClient;

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
    const usersCollection = db.collection('Users'); // Replace with your collection name

    // Test route
    app.get('/api/test', (req, res) => {
      res.json({ message: 'Backend is working!' });
    });

    // Signup route
    app.post('/api/signup', (req, res) => {
      const user = req.body;
      usersCollection.insertOne(user)
        .then(result => {
          res.status(201).json({ message: 'User created successfully' });
        })
        .catch(err => {
          res.status(500).json({ error: 'Failed to create user' });
        });
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

app.listen(port, () => {
    console.log(`Server is running on http://localhost:${port}`);
  });
