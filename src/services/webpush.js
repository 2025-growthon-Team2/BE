const webpush = require('web-push');
const { VAPID_PUBLIC_KEY,VAPID_PRIVATE_KEY } = require('../config/web-push');

webpush.setVapidDetails(
  'mailto:gachitda@gmail.com',
  VAPID_PUBLIC_KEY,
  VAPID_PRIVATE_KEY
);

exports.sendpush = async (subscription, payload) => {
  webpush.sendNotification(subscription, payload)
  .then(() => console.log('✅ 푸시 알림 전송 성공!'))
  .catch(err => {
    console.error('❌ 푸시 전송 실패:', err);
  });
};