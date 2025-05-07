import messaging from '@react-native-firebase/messaging';
import { Alert } from 'react-native';

// 1. Solicitar permisos
export const requestNotificationPermission = async () => {
  await messaging().requestPermission();
  const token = await messaging().getToken();
  console.log('Token FCM:', token); // Envía este token a tu backend
  return token;
};

// 2. Escuchar notificaciones en primer plano
messaging().onMessage(async remoteMessage => {
  Alert.alert(
    remoteMessage.notification.title,
    remoteMessage.notification.body,
  );
});

// 3. Manejar notificaciones en segundo plano (opcional)
messaging().setBackgroundMessageHandler(async remoteMessage => {
  console.log('Notificación en segundo plano:', remoteMessage);
});