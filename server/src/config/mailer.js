//메일 관련 정보 관리

const nodemailer = require('nodemailer');

const email = 'gachitda@gmail.com';
const transporter = nodemailer.createTransport({
  service: 'Gmail',
  auth: {
    user: email,
    pass: 'biouuzeiokuealxd',
  },
});

module.exports = { transporter, email };
