import { useEffect } from 'react';
import { Linking } from 'react-native';

// 处理 Deep Linking 事件
const handleDeepLink = (event:any) => {
    const { url } = event;
    console.log("Received deep link:", url);
};

useEffect(() => {
    const subscription = Linking.addEventListener('url', handleDeepLink);

    return () => {
        subscription.remove();
    };
}, []);
