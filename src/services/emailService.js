const { transporter, email } = require('../config/mailer');

exports.sendVerificationEmail = (targetEmail, code) => {
  const mailOptions = {
    from: email,
    to: targetEmail,
    subject: '이메일 인증 코드',
    html: `
    <div style="font-family: Arial, sans-serif; padding: 20px;">
      <h2 style="color: #4A90E2;">📧 이메일 인증 요청</h2>
      <p>안녕하세요, 같이잇다를 이용해 주셔서 감사합니다.</p>
      <p>아래 인증 코드를 입력해주세요. <strong>5분 내로 만료됩니다.</strong></p>
      <div style="font-size: 24px; font-weight: bold; margin: 20px 0; color: #000;">
        ${code}
      </div>
      <hr />
      <p style="font-size: 12px; color: #888;">
        이 메일은 인증을 위한 자동 발송 메일입니다. 문의: gachitda@gmail.com
      </p>
    </div>
  `
  };

  return transporter.sendMail(mailOptions);
};
