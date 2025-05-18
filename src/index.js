const express = require('express');
const app = express();
const PORT = 80;

app.get('/', (req, res) => {
  res.send('🚀 서버 실행 성공!');
});

app.listen(PORT, () => {
  console.log(`✅ 서버 실행 중: http://localhost:${PORT}`);
});