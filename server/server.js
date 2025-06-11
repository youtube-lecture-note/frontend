const express = require('express');
const cors = require('cors');
const { YoutubeTranscript } = require('youtube-transcript');
const { HttpsProxyAgent } = require('https-proxy-agent');

const app = express();
const port = 4000;

app.use(cors({
  origin: 'http://localhost:3000'  // React 개발 서버
}));
const proxyAgent = new HttpsProxyAgent(process.env.PROXY_URL);

app.get('/api/transcript/:videoId', async (req, res) => {
  try {
    const { videoId } = req.params;
    const transcript = await YoutubeTranscript.fetchTranscript(`https://www.youtube.com/watch?v=${videoId}`,
      {fetchOptions: {
        agent: proxyAgent
      }}
    );
    res.json(transcript);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.listen(port, () => {
  console.log(`서버가 포트 ${port}에서 실행 중입니다`);
});