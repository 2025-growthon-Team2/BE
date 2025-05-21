//알림 전송 함수 & 알림 관련 내용 정리

const webpush = require('web-push');
const { VAPID_PUBLIC_KEY,VAPID_PRIVATE_KEY } = require('../config/web-push');

webpush.setVapidDetails(
  'mailto:gachitda@gmail.com',
  VAPID_PUBLIC_KEY,
  VAPID_PRIVATE_KEY
);

exports.sendpush = async (subscription, payload) => {
  console.log(subscription);
  webpush.sendNotification(subscription, payload)
  .then((response) => console.log('✅ 푸시 알림 전송 성공! : ', response))
  .catch(err => {
    console.error('❌ 푸시 전송 실패:', err);
  });
};