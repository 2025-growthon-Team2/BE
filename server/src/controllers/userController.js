//유저 정보 관련 api정의

const User = require('../models/user');
const Post = require('../models/talent');
const jwt = require('jsonwebtoken');
const {JWT_SECRET,JWT_SECRET2} = require('../config/token');

exports.myinfo = async (req,res) => {
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
    let role = user.role;
    if(!role) {
      role = "";
    }
    res.status(200).json({
      nickname: user.nickname,
      profileimage: user.profileimage,
      kakaomail: user.kakaomail,
      email: user.email,
      role,
      subscription: user.subscription != null
    });
  } catch (error) {
    return res.status(401).json({error:'INVALID_ACCESS_TOKEN'});
  }
};
exports.userdata = async (req,res) => {
  const userId = req.params.userId;
  try {
    const user = await User.findById(userId);
    if(!user) return res.status(400).json({error: 'INVALID_USERID'});
    res.status(200).json({
      nickname: user.nickname,
      profileimage: user.profileimage,
      kakaomail: user.kakaomail,
      email: user.email
    });
  } catch (error) {
    return res.status(400).json({error:'INVALID_USERID'});
  }
};
exports.myposts = async (req,res) => {
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
    const writtenPosts = [];
    const appliedPosts = [];
    for (const postId of user.writtenPosts) {
      const post = await Post.findById(postId);
      writtenPosts.push({
          postId,
          category: post.category,
          title: post.title,
          subtitle: post.subtitle,
          appliedTalents: post.appliedTalents.length,
          address: post.address,
          status: post.status,
          createdAt: post.createdAt,
          teachAt: post.teachAt
      });
    }
    for (const postId of user.appliedPosts) {
        const post = await Post.findById(postId);
        appliedPosts.push({
            postId,
            category: post.category,
            title: post.title,
            subtitle: post.subtitle,
            address: post.address,
            status: post.status,
            createdAt: post.createdAt,
            teachAt: post.teachAt
        });
    }
    res.status(200).json({writtenPosts,appliedPosts});
  } catch (error) {
    return res.status(401).json({error:'INVALID_ACCESS_TOKEN'});
  }
};