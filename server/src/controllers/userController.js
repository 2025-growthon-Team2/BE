//유저 정보 관련 api정의

const User = require('../models/user');
const jwt = require('jsonwebtoken');
const {JWT_SECRET,JWT_SECRET2} = require('../config/token');

exports.myinfo = async (req,res) => {
  const authHeader = req.headers.authorization;

  if (!authHeader) {
    return res.status(401).json({ message: 'Authorization header missing' });
  }

  const [type, accessToken] = authHeader.split(' ');

  if (type !== 'Bearer' || !accessToken) {
    return res.status(401).json({ message: 'Invalid Authorization format' });
  }
  try {
    const decode = jwt.verify(accessToken,JWT_SECRET2);
    const user = await User.findOne({providerId: decode.id});
    if(!user) return res.status(400).json({error: 'INVALID_ACCESS_TOKEN'});
    res.status(200).json({
      nickname: user.nickname,
      profileimage: user.profileimage,
      email: user.email,
      role: user.role,
      subscription: user.subscription != null
    });
  } catch (error) {
    return res.status(400).json({error:'INVALID_ACCESS_TOKEN'});
  }
};