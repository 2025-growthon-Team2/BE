const express = require('express');
const path = require('path');
const swaggerUi = require('swagger-ui-express');
const YAML = require('yamljs');
const cors = require('cors');
const mongoose = require('mongoose');
const swaggerDocument = YAML.load('./src/docs/swagger.yaml');//스웨거파일 위치
const authRoutes = require('./routes/auth');
const notiRoutes = require('./routes/noti');
const userRoutes = require('./routes/user');
const postRoutes = require('./routes/post');
const roleRoutes = require('./routes/role');
const { JAVASCRIPT_KEY, REDIRECT_URI } = require('./config/kakao');
const { VAPID_PUBLIC_KEY,VAPID_PRIVATE_KEY } = require('./config/web-push');
const { newpost,applypost,matchpost,thispost,allposts } = require('./controllers/postController');
const { myinfo,userdata,myposts } = require('./controllers/userController');
const cookieParser = require('cookie-parser');


const app = express();
const PORT = 80;//포트
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static('public'));
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument));//스웨거 세팅
app.use(cors({
  origin: 'http://localhost:5173',
  credentials: true
}));
app.use(cookieParser());
app.get('/api/posts', allposts);
app.get('/api/posts/my', myposts);
async function main() {
  await mongoose.connect("mongodb://localhost:27017");//db연결(도커 사용)
  app.listen(PORT, '0.0.0.0', async () => {
    console.log(`HTTPS server running at https://localhost:${PORT}`);
  });
}
app.use('/api/auth', authRoutes);//라우터 사용
app.use('/api/noti', notiRoutes);
app.use('/api/user', userRoutes);
app.use('/api/post', postRoutes);
app.use('/api/role', roleRoutes);
//app.use(express.static(path.join(__dirname, 'build')));
app.post('/logout', (req, res) => {
  res.clearCookie('refreshtoken', {
    httpOnly: true,
    secure: true,
    sameSite: 'None'
  });
  res.status(200).json({ message: '로그아웃 완료' });
});
app.get('/service-worker.js', (req, res) => {//웹 알림용 js파일 전송
  res.setHeader('Content-Type', 'application/javascript');
  res.send(`
self.addEventListener('push', function(event) {
  console.log('[SW] push 수신됨');
  console.log('[SW] event.data:', event.data);
  console.log('[SW] event.data?.text():', event.data?.text?.());

  let data = {};
  try {
    data = event.data?.json() || {};
  } catch (e) {
    console.error('[SW] JSON 파싱 실패:', e);
  }

  console.log('[SW] 파싱된 데이터:', data);

  const title = data.title || '제목 없음';
  const body = data.body || '내용 없음';

  event.waitUntil(
    self.registration.showNotification(title, {
      body,
      icon: '/icon.png',
      requireInteraction: true
    })
  );
});

  console.log('실행됨');
  `);
});
app.get('/', (req, res) => {//로그인 테스트를 위한 html코드 전송
  res.send(`<script src="https://t1.kakaocdn.net/kakao_js_sdk/2.7.5/kakao.min.js" integrity="sha384-dok87au0gKqJdxs7msEdBPNnKSRT+/mhTVzq+qOhcL464zXwvcrpjeWvyj1kCdq6" crossorigin="anonymous"></script>

<script>
  Kakao.init('${JAVASCRIPT_KEY}');  // 사용하려는 앱의 JavaScript 키 입력
</script>

<a id="kakao-login-btn" href="javascript:loginWithKakao()">
  <img src="https://k.kakaocdn.net/14/dn/btroDszwNrM/I6efHub1SN5KCJqLm1Ovx1/o.jpg" width="222" alt="카카오 로그인 버튼" />
</a>
<a id="kakao-login-btn" href="javascript:subscribeUser()">
allow push
</a>
<p id="token-result"></p>

<script>
  function loginWithKakao() {
    Kakao.Auth.authorize({
      redirectUri: '${REDIRECT_URI}',  // 앱에 등록된 카카오 로그인에서 사용할 Redirect URI 입력
    });
  }

  // 아래는 데모를 위한 UI 코드입니다.
  displayToken()
  function displayToken() {
    var token = getCookie('authorize-access-token');

    if(token) {
      Kakao.Auth.setAccessToken(token);
      Kakao.Auth.getStatusInfo()
        .then(function(res) {
          if (res.status === 'connected') {
            document.getElementById('token-result').innerText
              = 'login success, token: ' + Kakao.Auth.getAccessToken();
          }
        })
        .catch(function(err) {
          Kakao.Auth.setAccessToken(null);
        });
    }
  }

  function getCookie(name) {
    var parts = document.cookie.split(name + '=');
    if (parts.length === 2) { return parts[1].split(';')[0]; }
  }
    async function subscribeUser() {
  const register = await navigator.serviceWorker.register('https://gachitda.corexaen.com/service-worker.js');
  const subscription = await register.pushManager.subscribe({
    userVisibleOnly: true,
    applicationServerKey: '${VAPID_PUBLIC_KEY}'
  });
  const accessToken = getCookie('accesstoken');
  // 서버에 subscription 정보 전송
  await fetch('https://gachitda.corexaen.com/api/noti/subscription', {
    method: 'POST',
    body: JSON.stringify({accessToken,subscription}),
    headers: {
      'Content-Type': 'application/json'
    }
  });
}
</script>`);
});
/*
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'build', 'index.html'));
});
*/
main();