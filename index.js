const express = require('express');
const multer = require('multer');
const zlib = require('zlib');

const app = express();

const upload = multer({ storage: multer.memoryStorage() });

const MY_LOGIN = 'belgaw'; 

app.get('/login', (req, res) => {
    res.send(MY_LOGIN);
});

app.post('/zipper', upload.any(), (req, res) => {
    const file = req.files && req.files[0];

    if (!file) {
        return res.status(400).send('Файл не был загружен.');
    }

    res.setHeader('Content-Disposition', 'attachment; filename="result.gz"');
    res.setHeader('Content-Type', 'application/gzip');

    zlib.gzip(file.buffer, (err, compressedData) => {
        if (err) {
            console.error(err);
            return res.status(500).send('Ошибка при сжатии файла');
        }
        res.send(compressedData);
    });
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Сервер запущен на порту ${PORT}`);
});
