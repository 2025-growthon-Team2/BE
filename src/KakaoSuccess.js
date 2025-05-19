import React, { useEffect, useState } from 'react';

function KakaoSuccess() {
  const [userInfo, setUserInfo] = useState(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    // URL 쿼리스트링에서 user 정보 가져오기
    const params = new URLSearchParams(window.location.search);
    const userParam = params.get('user');

    if (userParam) {
      try {
        const decodedUser = decodeURIComponent(userParam);
        setUserInfo(JSON.parse(decodedUser));
      } catch (e) {
        console.error('사용자 정보 파싱 오류:', e);
        setError('사용자 정보를 불러오는 데 실패했습니다.');
      }
    } else {
      setError('URL에서 사용자 정보를 찾을 수 없습니다.');
    }
  }, []);

  if (error) {
    return (
      <div>
        <h2>카카오 로그인 처리 중 오류 발생</h2>
        <p>{error}</p>
      </div>
    );
  }

  return (
    <div>
      <h2>카카오 로그인 성공!</h2>
      {userInfo ? (
        <div>
          <h3>사용자 정보:</h3>
          <pre>{JSON.stringify(userInfo, null, 2)}</pre>
        </div>
      ) : (
        <p>사용자 정보를 불러오는 중...</p>
      )}
    </div>
  );
}

export default KakaoSuccess; 