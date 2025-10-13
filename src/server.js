const dotenv = require('dotenv');
dotenv.config();

const express = require('express');
const app = express();
const PORT = 3000;

app.use(express.json());

const authRoutes = require('./routes/auth');
app.use('/api', authRoutes);

const movieRoutes = require('./routes/movie');
app.use('/api/movies', movieRoutes);

app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});