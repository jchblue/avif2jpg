const express = require('express');
const axios = require('axios');
const sharp = require('sharp');

const app = express();

app.get('/', async (req, res) => {
  const imageUrl = req.query.url;

  if (!imageUrl) {
    return res.status(400).send('Missing url parameter');
  }

  try {
    const response = await axios.get(imageUrl, { responseType: 'arraybuffer' });
    const avifBuffer = Buffer.from(response.data);

    const jpgBuffer = await sharp(avifBuffer)
      .jpeg()
      .toBuffer();

    res.set('Content-Type', 'image/jpeg');
    res.send(jpgBuffer);
  } catch (error) {
    console.error(error);
    res.status(500).send('Conversion failed');
  }
});

app.listen(3000, () => {
  console.log('Server running at http://localhost:3000');
});
