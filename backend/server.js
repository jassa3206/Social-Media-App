const dotenv = require('dotenv');
const express = require('express');
const methodOverride = require('method-override');
const cors = require('cors');
const connectDB = require('./config/db'); // Import the connectDB function

dotenv.config();

const app = express();
app.use(express.json());
app.use(methodOverride('_method'));

app.use(cors({
  origin: 'http://localhost:3000',
  methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
  allowedHeaders: 'Authorization,Content-Type',
}));

const PORT = process.env.PORT || 5000;

// Connect to MongoDB
connectDB();

app.use('/api/users', require('./routes/userRoutes'));
app.use('/api/posts', require('./routes/postRoutes'));

app.get('/', (req, res) => {
  res.send('Yeah its working!');
});

app.listen(PORT, () => console.log(`Server running on port ${PORT}`));