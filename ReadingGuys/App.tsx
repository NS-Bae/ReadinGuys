// App.tsx
import * as React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import messaging from '@react-native-firebase/messaging';

import HomeScreen from './screens/homeScreen';
import LoginScreen from './screens/loginScreen';
import MainScreen from './screens/mainScreen2';

import { StackParamList } from './types';
import { useEffect } from 'react';
import { Alert } from 'react-native';
import axios from 'axios';
import notifee from '@notifee/react-native';

const Stack = createNativeStackNavigator<StackParamList>();

const App: React.FC = () => {
  useEffect(() => {
    // 알림 채널 생성
    const createNotificationChannel = async () => {
      await notifee.createChannel({
        id : 'default',
        name : 'Default Channel',
        importance : notifee.AndroidImportance.HIGH,
      });
    };
    createNotificationChannel();

    //FCM기기토큰 설정
    const fetchDeviceToken = async () => {
      try
      {
        const deviceToken = await messaging().getToken();
        console.log('FCM Token : ', deviceToken);

        await sendTokenToServer(deviceToken);
      }
      catch(error)
      {
        console.log('FCM 토믄 생성 오류', error);
      }
    };
    //FCM푸시알림권한
    const requestPermission = async () => {
      const authStatus = await messaging().requestPermission();
      const enabled =
        authStatus === messaging.AuthorizationStatus.AUTHORIZED ||
        authStatus === messaging.AuthorizationStatus.PROVISIONAL;

      if (enabled) {
        console.log('푸시 알림 권한 획득');
        fetchDeviceToken();
      } else {
        Alert.alert('알림 권한이 필요합니다.');
      }
    };
    requestPermission();

    // Foreground 알림 처리
    const unsubscribe = messaging().onMessage(async (remoteMessage) => {
      console.log('Foreground Notification:', remoteMessage);
      Alert.alert(
        '새 알림aaa',
        remoteMessage.notification?.title || '알림 제목 없음',
      );
    });

    //backbround 알림처리
    const unsubscribeNotificationOpened = messaging().onNotificationOpenedApp((remoteMessage) => {
      console.log('백그라운드 알림');
      Alert.alert(
        '알림 클릭',
        remoteMessage.notification?.title || '제목없음',
      );
    });

    //종료상태 알림 처리
    messaging().getInitialNotification().then((remoteMessage) => {
      if(remoteMessage)
      {
        console.log('종료 알림 클릭', remoteMessage);
        Alert.alert('종료상태 알림 클릭', remoteMessage.notification?.title || '제목없음');
      }
    });

    return () => {
      unsubscribe();
      unsubscribeNotificationOpened();
    };
  }, []);

  //FCM토큰 FCM서버전송 위해 Nest서버 토큰전송
  const sendTokenToServer = async (token: string) => {
    try
    {
      const response = await axios.post('http://10.0.2.2:3000/fb/tk', {
        token : token,
      });
      console.log('Token sent to server:', response.data);
    }
    catch (error)
    {
      console.error('Error sending token to server:', error);
    }
  };

  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName="Home">
        <Stack.Screen name="Home" component={HomeScreen} options={{headerShown: false}} />
        <Stack.Screen name="Login" component={LoginScreen} options={{headerShown: false}} />
        <Stack.Screen name="Main" component={MainScreen} initialParams={{ inputs: { ip1: '', ip2: '' } }} options={{headerShown: false}} />
      </Stack.Navigator>
    </NavigationContainer>
  );
};

export default App;
