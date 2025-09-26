const express = require('express');
const app = express();

app.use(express.json());

app.get('/', (req, res) => {
    res.json({ message: "Welcome to the API" });
});

app.post('/auth/register', (req, res) => {
    console.log("Route hit!");
    console.log("Body:", req.body);
    res.json({ message: "ok" });
});

const PORT = 3000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
