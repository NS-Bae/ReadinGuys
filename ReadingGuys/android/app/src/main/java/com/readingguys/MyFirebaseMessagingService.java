package com.readingguys;

import android.util.Log;
import com.google.firebase.messaging.FirebaseMessagingService;
import com.google.firebase.messaging.RemoteMessage;

public class MyFirebaseMessagingService extends FirebaseMessagingService {

    private static final String TAG = "MyFirebaseMsgService";

    // 토큰 생성 시 호출 (기기 식별용)
    @Override
    public void onNewToken(String token) {
        super.onNewToken(token);
        Log.d(TAG, "New Token: " + token);
        // 서버로 토큰 전송 가능
    }

    // 수신한 메시지를 처리
    @Override
    public void onMessageReceived(RemoteMessage remoteMessage) {
        super.onMessageReceived(remoteMessage);

        // 메시지 처리 로직
        Log.d(TAG, "From: " + remoteMessage.getFrom());
        
        if (remoteMessage.getNotification() != null) {
            Log.d(TAG, "Message Notification Body: " + remoteMessage.getNotification().getBody());
        }

        if (remoteMessage.getData().size() > 0) {
            Log.d(TAG, "Message Data Payload: " + remoteMessage.getData());
        }
    }
}
