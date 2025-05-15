const express = require('express');
const cors = require('cors');
const fs = require('fs');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 3001;
const DATA_FILE = path.join(__dirname, 'data.json');

// Middleware
app.use(cors()); // Enable CORS for all routes
app.use(express.json()); // To parse JSON request bodies

// Helper function to read data from JSON file
const readData = () => {
  try {
    if (fs.existsSync(DATA_FILE)) {
      const jsonData = fs.readFileSync(DATA_FILE);
      return JSON.parse(jsonData);
    }
  } catch (error) {
    console.error('Error reading data file:', error);
  }
  return []; // Return empty array if file doesn't exist or error occurs
};

// Helper function to write data to JSON file
const writeData = (data) => {
  try {
    fs.writeFileSync(DATA_FILE, JSON.stringify(data, null, 2));
  } catch (error) {
    console.error('Error writing data file:', error);
  }
};

// Routes
app.get('/', (req, res) => {
  res.send('TH3BAPP Backend is running!');
});

// GET all items
app.get('/api/items', (req, res) => {
  const items = readData();
  res.json(items);
});

// POST a new item (or update existing, or batch update)
app.post('/api/items', (req, res) => {
  const newItems = req.body; // Expecting an array of items from the frontend
  // For now, this will overwrite all items. 
  // You might want more sophisticated logic for adding/updating individual items.
  if (!Array.isArray(newItems)) {
    return res.status(400).json({ message: 'Invalid data format. Expected an array of items.'});
  }
  writeData(newItems);
  res.status(201).json({ message: 'Items saved successfully', items: newItems });
});

// Start the server
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
  // Initialize data file if it doesn't exist
  if (!fs.existsSync(DATA_FILE)) {
    writeData([]);
    console.log(`Initialized empty data file at ${DATA_FILE}`);
  }
}); 