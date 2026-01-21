const express = require('express');
const path = require('path');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const Message = require('./models/Message');
console.log("Connecting to:", process.env.MONGODB_URI);

const app = express();
const PORT = 8080;

// Connect to MongoDB
mongoose.connect(process.env.MONGODB_URI, { useNewUrlParser: true, useUnifiedTopology: true }) .then(() => console.log("MongoDB connected")) .catch(err => console.error(err));

mongoose.connection.on('error', err => {
  console.error('MongoDB connection error:', err);
});


// Middleware
app.use(express.static(path.join(__dirname, 'public')));

// Root route 
app.get('/', (req, res) => { res.sendFile(path.join(__dirname, 'index.html')); });
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json()); // 👈 handle JSON if needed

// Contact form route
app.post('/contact', async (req, res) => {
  try {
    console.log("Incoming:", req.body);
    const { name, email, message } = req.body;

    if (!name || !email || !message) {
      return res.status(400).send("All fields are required");
    }

    const newMessage = new Message({ name, email, message });
    await newMessage.save();
    console.log("Saved to DB:", newMessage);
    res.json({ success: true, message: "Message stored successfully!" });
  } catch (err) {
    console.error("Save error:", err);
    res.status(500).send("Error saving message");
  }
});

// Show all messages in browser
app.get('/messages', async (req, res) => {
  try {
    const allMessages = await Message.find();
    res.json(allMessages);
  } catch (err) {
    console.error(err);
    res.status(500).send("Error fetching messages");
  }
});

app.listen(PORT, () => console.log(`Portfolio running at http://localhost:${PORT}`));





