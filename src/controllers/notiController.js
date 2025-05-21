//알림 관련 api정의

const User = require('../models/user');
const jwt = require('jsonwebtoken');
const {JWT_SECRET,JWT_SECRET2} = require('../config/token');
const {sendpush} = require('../services/webpush');

exports.subscription = async (req,res) => {
  const {accessToken,subscription} = req.body;
  const decode = jwt.verify(accessToken,JWT_SECRET2);
  const user = await User.findOne({providerId: decode.id});
  if(!user) return res.status(400).json({error: 'INVALID_ACCESS_TOKEN'});
  user.subscription = subscription;
  console.log(subscription);
  await user.save();
  res.status(200).send();
};
exports.sendPush = async (req,res) => {
  const {accessToken,text} = req.body;
  const decode = jwt.verify(accessToken,JWT_SECRET2);
  const user = await User.findOne({providerId: decode.id});
  if(!user) return res.status(400).json({error: 'INVALID_ACCESS_TOKEN'});
  const payload = JSON.stringify({
    title: '알림',
    body: text
  });
  sendpush(user.subscription,payload);
  res.status(200).send();
}