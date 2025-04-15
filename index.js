const express = require('express');
const axios = require('axios');
const sharp = require('sharp');

const app = express();

app.get('/', async (req, res) => {
  const encodedUrl = req.query.url;

  // ✅ url 파라미터 없으면 상태 확인 메시지
  if (!encodedUrl) {
    return res.status(200).send('동작중입니다.');
  }

  try {
    const imageUrl = decodeURIComponent(encodedUrl);

    const response = await axios.get(imageUrl, {
      responseType: 'arraybuffer',
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/135.0.0.0 Safari/537.36 Edg/135.0.0.0',
        'Accept': 'image/avif,image/webp,image/apng,image/*,*/*;q=0.8',
        'Accept-Encoding': 'gzip, deflate, br, zstd',
        'Accept-Language': 'ko,en;q=0.9,en-US;q=0.8',
        'Referer': imageUrl,
        'Cache-Control': 'max-age=0',
        'Upgrade-Insecure-Requests': '1',
        'Sec-Fetch-Site': 'none',
        'Sec-Fetch-Mode': 'navigate',
        'Sec-Fetch-User': '?1',
        'Sec-Fetch-Dest': 'document',
      }
    });

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

// 포트 설정 (Render는 자동 할당, 로컬은 3000)
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
