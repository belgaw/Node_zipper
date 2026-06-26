const express = require('express');
const cors = require('cors');
const busboy = require('busboy');
const zlib = require('zlib');

const app = express();

app.use(cors());

const MY_LOGIN = 'belgaw'; 

app.get('/login', (req, res) => {
    res.type('text/plain').send(MY_LOGIN);
});

app.post('/zipper', (req, res) => {
    const contentType = req.headers['content-type'] || '';
    let buffer = Buffer.alloc(0);

    if (contentType.includes('multipart/form-data')) {
        const bb = busboy({ headers: req.headers });

        bb.on('file', (name, file) => {
            file.on('data', (chunk) => {
                buffer = Buffer.concat([buffer, chunk]);
            });
        });

        bb.on('field', (name, val) => {
            buffer = Buffer.from(val);
        });

        bb.on('close', () => {
            zlib.gzip(buffer, (err, compressed) => {
                if (err) return res.status(500).send('Compression error');
                res.setHeader('Content-Type', 'application/gzip');
                res.end(compressed);
            });
        });

        req.pipe(bb);
        return;
    }


const PORT = process.env.PORT || 3000;
app.listen(PORT);
