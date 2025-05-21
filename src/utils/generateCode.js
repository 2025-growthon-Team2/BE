//인증 코드 제작 함수수

module.exports = function generateCode(length = 4) {
  const chars = '123456789'; //이 문자열에 있는 문자중 랜덤으로 골라짐
  let code = '';
  for (let i = 0; i < length; i++) {
    code += chars[Math.floor(Math.random() * chars.length)];
  }
  return code;
};