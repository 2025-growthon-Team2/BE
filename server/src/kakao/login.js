//카카오 로그인 함수

const axios = require('axios');
const { REDIRECT_URI,REST_API_KEY } = require('../config/kakao');
const User = require('../models/user');
const jwt = require('jsonwebtoken');
const {JWT_SECRET} = require('../config/token');
exports.kakaoLogin = async (req, res) => {
    const code = req.query.code;
    const client_id = REST_API_KEY;
    const redirect_uri = REDIRECT_URI;

    try {
        const tokenResponse = await axios.post(
            'https://kauth.kakao.com/oauth/token',
            new URLSearchParams({
                grant_type: 'authorization_code',
                client_id,
                redirect_uri,
                code,
            }).toString(),
            {
                headers: {
                    'Content-Type': 'application/x-www-form-urlencoded',
                },
            }
        );

        const kakao_access_token = tokenResponse.data.access_token;

        // 토큰으로 사용자 정보 요청
        const userResponse = await axios.get('https://kapi.kakao.com/v2/user/me', {
            headers: {
                Authorization: `Bearer ${kakao_access_token}`,
            },
        });

        // 유저 정보
        const kakao_account = userResponse.data.kakao_account;
        console.log(userResponse);
        const node = {
            providerId: userResponse.data.id,
            profileimage: kakao_account.profile.profile_image_url,
            nickname: kakao_account.profile.nickname
        };
        const user = await User.findOne({ providerId: node.providerId });
        if (!user) {
            // 신규 유저
            const newUser = new User({
                providerId: node.providerId,
                profileimage: node.profileimage,
                nickname: node.nickname,
                email: null,
                emailVerified: false,
                code: null,
                expiresAt: null,
                subscription: false,
                role: null
            });
            await newUser.save();
        }
        // JWT 토큰 생성
        const refresh_token = jwt.sign({ id: node.providerId }, JWT_SECRET, {
            expiresIn: '30d',
        });
        // 쿠키에 refresh_token 저장
        res.cookie('refreshtoken', refresh_token, {
            maxAge: 1000 * 60 * 60 * 24 * 30, // 30일
            httpOnly: true,
            secure: false // HTTPS 환경에서는 true로 설정
        });
        // 로그인 성공 후 리다이렉트
        res.redirect(`/redirect`);

    } catch (err) {
        console.error(err);
        res.status(500).send('카카오 로그인 실패');
    }
};
