const cors = require('cors');
const router = require('./routes');
const express = require('express');
const app = express();
const path = require('path');
const dbClient = require('./database/config')
const cookieParser = require('cookie-parser')
const bodyParser = require('body-parser');
require('dotenv').config()

try {
    dbClient.authenticate();
    console.log('Database connected');
} catch (error) {
    console.log('Database connection failed');
}

app.use(express.json()) //req.body
app.use(cors(
    {
        credentials: true,
        origin: 'http://localhost:3000'
    }
))
app.get('/get-file/:fileName', (req, res) => {
    const fileName = req.params.fileName;
    const filePath = path.join(__dirname, '/uploads/sicknessPermit/', fileName); // Gunakan path untuk mengakses file yang diunggah
    res.sendFile(filePath);
});
app.use(cookieParser())
app.use(bodyParser.json({ limit: '50mb' }));
app.use(bodyParser.urlencoded({ limit: '50mb', extended: true }));
app.use('/', router)

app.get('/', (req, res) => {
    try {
        res.send('Hello World')
    } catch (error) {
        res.status(500).json(error)
    }
})

PORT = process.env.PORT
app.listen(PORT, () => console.log(`Server running at port ${PORT}`))