const User = require('../models/user');
const Post = require('../models/talent');
const jwt = require('jsonwebtoken');
const {JWT_SECRET,JWT_SECRET2} = require('../config/token');

exports.newpost = async (req,res) => {
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
    const { title,subtitle,category,shortDescription,detailedDescription,address,teachAt } = req.body;
    if (![titlem,subtitle, category, shortDescription, detailedDescription, address, teachAt].every(Boolean)) {
      return res.status(400).json({ error: 'MISSING_REQUIRED_FIELDS' });
    }
    const parsedTeachAt = new Date(teachAt);
    if (isNaN(parsedTeachAt.getTime())) {
      return res.status(400).json({ error: 'INVALID_DATE_FORMAT' });
    }
    const newPost = new Post({
        writer: user._id,
        appliedTalents: [],
        matchedTalents: [],
        category,
        title,
        subtitle,
        shortDescription,
        detailedDescription,
        address,
        status : "",
        createdAt: new Date(),
        teachAt: parsedTeachAt
    });
    await newPost.save();
    return res.status(201).json({postId: newPost._id});
  } catch (error) {
    console.log(error);
    return res.status(401).json({error:'INVALID_ACCESS_TOKEN'});
  }
};
exports.applypost = async (req,res) => {
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
    const postId = req.params.postId;
    const post = await Post.findById(postId);
    if(!post) return res.status(400).json({error: 'INVALID_POSTID'});
    post.appliedTalents.push(user._id);
    await post.save();
    return res.status(200).send();
  } catch (error) {
    return res.status(401).json({error:'INVALID_ACCESS_TOKEN'});
  }
};
exports.matchpost = async (req,res) => {
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
    const postId = req.params.postId;
    const post = await Post.findById(postId);
    if(!post) return res.status(400).json({error: 'INVALID_POSTID'});
    const { userId } = req.body;
    if(post.appliedTalents.some(id => id.equals(userId))) {
      post.matchedTalents.push(userId);
      await post.save();
      return res.status(200).send();
    }
    else {
      return res.status(400).json({error:'INVALID_USERID'});
    }
  } catch (error) {
    return res.status(401).json({error:'INVALID_ACCESS_TOKEN'});
  }
};
exports.thispost = async (req,res) => {
  const postId = req.params.postId;
  const post = await Post.findById(postId);
  if(!post) return res.status(400).json({error:'INVALID_POSTID'});
  const appliedTalents = [];
  const matchedTalents = [];
  post.appliedTalents.forEach(async userId => {
      const user = await User.findById(userId);
      appliedTalents.push({
          userId,
          nickname: user.nickname,
          profileimage: user.profileimage,
          email: user.email
      });
  });
  post.matchedTalents.forEach(async userId => {
      const user = await User.findById(userId);
      matchedTalents.push({
          userId,
          nickname: user.nickname,
          profileimage: user.profileimage,
          email: user.email
      });
  });
  const writer = await User.findById(post.writer);
  res.status(200).json({
    writerName: writer.nickname,
    writerprofileimage: writer.profileimage,
    writerEmail: writer.email,
    appliedTalents,
    matchedTalents,
    category: post.category,
    title: post.title,
    subtitle: post.subtitle,
    detailedDescription: post.detailedDescription,
    address: post.address,
    status: post.status,
    createdAt: post.createdAt,
    teachAt: post.teachAt
  });
};
exports.allposts = async (req,res) => {
  const allpost = await Post.find();
  const posts = [];
  allpost.forEach(async post => {
      posts.push({
          postId: post._id,
          writerId: post.writer,
          category: post.category, 
          title: post.title,
          subtitle: post.subtitle,
          shortDescription: post.shortDescription,
          appliedTalents: post.appliedTalents.length,
          address: post.address,
          status: post.status,
          createdAt: post.createdAt,
          teachAt: post.teachAt
      });
  });
  res.status(200).json({posts});
};