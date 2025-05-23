//유저 정보 관련 api정의

const User = require('../models/user');
const Post = require('../models/talent');
const jwt = require('jsonwebtoken');
const {JWT_SECRET,JWT_SECRET2} = require('../config/token');

exports.myrole = async (req,res) => {
  const authHeader = req.headers.authorization;
  if (!authHeader) {
    return res.status(401).json({ error: 'MISSING_AUTHORIZATION_HEADER' });
  }
  const [type, accessToken] = authHeader.split(' ');
  if (type !== 'Bearer' || !accessToken) {
    return res.status(401).json({ error: 'INVALID_AUTHORIZATION_FORMAT' });
  }
  try {
    const decode = jwt.verify(accessToken,JWT_SECRET2);
    const user = await User.findOne({providerId: decode.id});
    if(!user) return res.status(401).json({error: 'INVALID_ACCESS_TOKEN'});
    const { role } = req.body;
    if(!role) return res.status(400).json({error: 'INVALID_ROLE'});
    user.role = role;
    await user.save();
    res.status(200).send();
  } catch (error) {
    return res.status(401).json({error:'INVALID_ACCESS_TOKEN'});
  }
};