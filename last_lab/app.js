const express = require('express');
const authRoutes = require('./auth');
const app = express();

app.use(express.json());

app.get('/', (req, res) => {
    res.json({ message: "Welcome to the API" });
});

app.use('/auth', authRoutes);

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
