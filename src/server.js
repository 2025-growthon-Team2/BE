require('dotenv').config(); // .env 파일 사용 설정
const express = require('express');
const path = require('path');
const axios = require('axios'); // axios 추가
const cors = require('cors'); // cors 추가

const app = express();
app.use(cors()); // CORS 미들웨어 사용

const port = process.env.PORT || 5001; // PORT 환경 변수 또는 5001 사용

// 카카오 로그인 라우트 시작
app.get('/auth/kakao', (req, res) => {
  const kakaoAuthURL = `https://kauth.kakao.com/oauth/authorize?response_type=code&client_id=${process.env.KAKAO_CLIENT_ID}&redirect_uri=${process.env.KAKAO_REDIRECT_URI}`;
  res.redirect(kakaoAuthURL);
});

app.get('/auth/kakao/callback', async (req, res) => {
  const { code } = req.query;

  try {
    const tokenRes = await axios.post(
      'https://kauth.kakao.com/oauth/token',
      null,
      {
        params: {
          grant_type: 'authorization_code',
          client_id: process.env.KAKAO_CLIENT_ID,
          redirect_uri: process.env.KAKAO_REDIRECT_URI,
          code,
        },
        headers: {
          'Content-type': 'application/x-www-form-urlencoded;charset=utf-8',
        },
      }
    );

    const { access_token } = tokenRes.data;

    const userRes = await axios.get('https://kapi.kakao.com/v2/user/me', {
      headers: {
        Authorization: `Bearer ${access_token}`,
      },
    });

    const userInfo = userRes.data;
    // 프론트엔드 주소는 환경에 맞게 변경 (기본 Create React App 포트인 3000)
    res.redirect(`http://localhost:3000/kakao-success?user=${encodeURIComponent(JSON.stringify(userInfo))}`);
  } catch (err) {
    console.error('카카오 로그인 처리 중 에러:', err.response ? err.response.data : err.message);
    // 프로덕션 환경에서는 사용자에게 친화적인 에러 페이지를 보여주는 것이 좋습니다.
    res.status(500).send('카카오 로그인에 실패했습니다. 문제가 지속되면 관리자에게 문의하세요.');
  }
});
// 카카오 로그인 라우트 끝

// React 앱의 정적 파일 제공 (빌드 후)
// 이 미들웨어는 API 라우트들 *다음에* 위치해야 합니다.
app.use(express.static(path.join(__dirname, '..', 'build')));

app.get('/', (req, res) => {
  // 이 경로는 React 앱에 의해 처리될 것이므로, 명시적인 응답을 보낼 필요는 없습니다.
  // API 서버의 상태를 확인하는 용도로 남겨둘 수 있습니다.
  // 또는, React 앱의 index.html로 바로 리다이렉트할 수도 있습니다.
  // res.send('Backend server is running for Kakao Login Demo.');
  // React 앱으로 fallback 되도록 이 라우트는 주석 처리하거나 삭제하는 것이 좋습니다.
  // 여기서는 index.html로 fallback 되도록 아래 '*' 라우트에 의존합니다.
});

// 다른 모든 GET 요청에 대해 React 앱의 index.html을 제공 (SPA 라우팅 지원)
// 이 라우트는 항상 가장 마지막에 위치해야 합니다.
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, '..', 'build', 'index.html'));
});

app.listen(port, () => {
  console.log(`Backend server listening at http://localhost:${port}`);
  console.log('Ensure KAKAO_CLIENT_ID and KAKAO_REDIRECT_URI are set in your .env file.');
  console.log(`KAKAO_REDIRECT_URI should be: http://localhost:${port}/auth/kakao/callback`);
});