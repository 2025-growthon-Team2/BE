import React from 'react';

function App() {
  const handleKakaoLogin = () => {
    // 백엔드 서버 포트가 5001 등으로 바뀌었으면 여기도 수정하세요.
    window.location.href = 'http://localhost:5001/auth/kakao';
  };

  return (
    <div style={{ textAlign: 'center', marginTop: '100px' }}>
      <h1>카카오 로그인 데모</h1>
      <button onClick={handleKakaoLogin}>카카오로 로그인</button>
    </div>
  );
}

export default App;