//인증 관련 api정리

const generateCode = require('../utils/generateCode');
const { sendVerificationEmail } = require('../services/emailService');
const User = require('../models/user');
const jwt = require('jsonwebtoken');
const {JWT_SECRET,JWT_SECRET2} = require('../config/token');

exports.sendEmail = async (req, res) => {
  const { email } = req.body;
  const authHeader = req.headers.authorization;

  if (!authHeader) {
    return res.status(401).json({ error: 'MISSING_AUTHORIZATION_HEADER' });
  }

  const [type, accessToken] = authHeader.split(' ');

  if (type !== 'Bearer' || !accessToken) {
    return res.status(401).json({ error: 'INVALID_AUTHORIZATION_FORMAT' });
  }
  if (!accessToken || !email) return res.status(400).json({error: 'INVALID_REQUEST'});
  const schoolEmailRegex = /^[^\s@]+@[^\s@]+\.(ac\.kr|edu)$/
  if (!schoolEmailRegex.test(email)) {
    return res.status(400).json({error: 'INVALID_EMAIL'});
  }
  const code = generateCode();
  try {
    const decode = jwt.verify(accessToken,JWT_SECRET2);
    const user = await User.findOne({providerId: decode.id});
    if(!user) return res.status(400).json({error: 'INVALID_ACCESS_TOKEN'});
    const expiresAt = new Date(Date.now() + 5 * 60 * 1000);
    await User.updateOne(
      {providerId: decode.id},
      {$set:{email:email,code: code,expiresAt: expiresAt}}
    )
  } catch (err) {
    return res.status(400).json({error:'INVALID_ACCESS_TOKEN'});
  }
  try {
    await sendVerificationEmail(email, code);
    console.log(`📨 ${email}에게 인증코드 전송 완료: ${code}`);
    res.status(200).send();
  } catch (err) {
    console.error('이메일 전송 실패:', err);
    res.status(500).send();
  }
};
exports.verifyEmail = async (req, res) => {
  const { code } = req.body;
  const authHeader = req.headers.authorization;

  if (!authHeader) {
    return res.status(401).json({ error: 'MISSING_AUTHORIZATION_HEADER' });
  }

  const [type, accessToken] = authHeader.split(' ');

  if (type !== 'Bearer' || !accessToken) {
    return res.status(401).json({ error: 'INVALID_AUTHORIZATION_FORMAT' });
  }
  if (!accessToken || !code) return res.status(400).json({error: 'INVALID_REQUEST'});
  const decode = jwt.verify(accessToken,JWT_SECRET2);
  const user = await User.findOne({providerId: decode.id});
  if(!user || !user.code || !user.expiresAt) {
     return res.status(422).json({ error: 'NO_VERIFICATION_PENDING' });
  }
  const now = new Date();
  if(now > user.expiresAt) {
    return res.status(422).json({ error: 'CODE_EXPIRED' });
  }
  if (user.code !== code) {
    return res.status(400).json({ error: 'INVALID_CODE' });
  }
  user.emailVerified = true;
  user.code = null;
  user.expiresAt = null;
  await user.save();
  res.status(200).send();
};
exports.accesstoken = async (req,res) => {
  console.log(req.headers);
  console.log(req.cookies);
  const refreshtoken = req.cookies.refreshtoken;
  if(!refreshtoken) {
    return res.status(401).json({error:"NO_REFRESH_TOKEN"});
  }
  try {
    const decode = jwt.verify(refreshtoken,JWT_SECRET);
    const user = await User.findOne({providerId: decode.id});
    const accessToken = jwt.sign({id: user.providerId}, JWT_SECRET2, {
      expiresIn: '1h'
    });
    return res.json({token: accessToken});
  } catch (err) {
    return res.status(401).json({error:'INVALID_REFRESH_TOKEN'});
  }
};
