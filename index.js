const express = require('express');
const multer = require('multer');
const zlib = require('zlib');

const app = express();
const upload = multer({ storage: multer.memoryStorage() });

app.use((req, res, next) => {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Accept, X-Requested-With');

    if (req.method === 'OPTIONS') {
        return res.sendStatus(200);
    }
    next();
});

const MY_LOGIN = 'belgaw'; 

app.get('/login', (req, res) => {
    res.send(MY_LOGIN);
});

app.post('/zipper', upload.any(), (req, res) => {
    const file = req.files && req.files[0];

    const bufferToCompress = file ? file.buffer : Buffer.from('');

    res.setHeader('Content-Type', 'application/gzip');
    res.setHeader('Content-Disposition', 'attachment; filename="result.gz"');

    zlib.gzip(bufferToCompress, (err, compressedData) => {
        if (err) {
            return res.status(500).send('Internal Server Error');
        }
        res.send(compressedData);
    });
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, '0.0.0.0', () => {
    console.log(`Сервер готов`);
});
