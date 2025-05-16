const express = require('express');
const cors = require('cors');
const connectDB = require('./config/db');
const Item = require('./models/Item');

const app = express();
const PORT = process.env.PORT || 3001;

// Connect to MongoDB
connectDB();

// Middleware
app.use(cors()); // Enable CORS for all routes
app.use(express.json()); // To parse JSON request bodies

// Routes
app.get('/', (req, res) => {
  res.send('TH3BAPP Backend is running!');
});

// GET all items
app.get('/api/items', async (req, res) => {
  try {
    const items = await Item.find();
    res.json(items);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// POST a new item (or update existing, or batch update)
app.post('/api/items', async (req, res) => {
  try {
    const newItems = req.body;
    if (!Array.isArray(newItems)) {
      return res.status(400).json({ message: 'Invalid data format. Expected an array of items.' });
    }

    // Delete all existing items
    await Item.deleteMany({});

    // Insert new items
    const createdItems = await Item.insertMany(newItems);
    res.status(201).json({ message: 'Items saved successfully', items: createdItems });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Start the server
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
}); 