/**
 * @format
 */

import {AppRegistry} from 'react-native';
import App from './App';
import {name as appName} from './app.json';
import messaging from '@react-native-firebase/messaging';
import notifee from '@notifee/react-native';

messaging().setBackgroundMessageHandler(async (remoteMessage) => {
  console.log('백그라운드 메시지 수신:', remoteMessage);

  await notifee.displayNotification({
    title: remoteMessage.notification?.title || '새로운 알림',
    body: remoteMessage.notification?.body || '내용 없음',
    android: {
      channelId: 'default', // 알림 채널 ID
      importance: notifee.AndroidImportance.HIGH, // 높은 중요도로 설정
    },
  });
});

AppRegistry.registerComponent(appName, () => App);
