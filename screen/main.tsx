import { getVerificationUrl, initializeVerification } from '../service/verification';
import React, { useEffect, useState } from 'react';
import { View, Text, Button, PermissionsAndroid, Alert } from 'react-native';
import DeviceInfo from 'react-native-device-info';

const Main = ({ navigation }: { navigation: any }) => {
    const handleVerify = async () => {
        try {
            const sessionUrl = await getVerificationUrl();

            navigation.navigate('Verify', { sessionUrl });
        } catch (error) {
            console.error('Error during verification initialization:', error);
        }
    };

    const fetchDeviceId = async () => {
        const deviceId = await DeviceInfo.getUniqueId(); 
        console.log("Device ID:", deviceId);  
    };
    
    const [permissionGranted, setPermissionGranted] = useState(false);

    const checkPermission = async () => {
        try {
            const granted = await PermissionsAndroid.check(PermissionsAndroid.PERMISSIONS.CAMERA);
            if (granted) {
                setPermissionGranted(true);
                console.log('Camera permission is granted');
            } else {
                setPermissionGranted(false);
                console.log('Camera permission is denied');
            }
        } catch (error) {
            console.warn(error);
        }
    };

    const requestPermission = async () => {
        try {
            const granted = await PermissionsAndroid.request(
                PermissionsAndroid.PERMISSIONS.CAMERA,
                {
                    title: 'Camera Permission',
                    message: 'This app needs access to your camera to take photos.',
                    buttonNeutral: 'Ask Me Later',
                    buttonNegative: 'Cancel',
                    buttonPositive: 'OK',
                }
            );

            if (granted === PermissionsAndroid.RESULTS.GRANTED) {
                console.log('Camera permission granted');
                setPermissionGranted(true);
                Alert.alert('Permission Granted', 'You can now access the camera.');
            } else {
                console.log('Camera permission denied');
                setPermissionGranted(false);
                Alert.alert('Permission Denied', 'Camera access is required to use this feature.');
            }
        } catch (err) {
            console.warn(err);
        }
    };

    useEffect(() => {
        checkPermission();
    }, []);

    return (
        <View>
            <Text>Welcome to the Home Screen</Text>
            <Button title="Start Verification" onPress={handleVerify} />

            <Text>Camera Permission Example</Text>
            <Text>
                {permissionGranted ? 'Camera permission is granted' : 'Camera permission is denied'}
            </Text>
            <Button title="Check Camera Permission" onPress={checkPermission} />
            <Button title="Request Camera Permission" onPress={requestPermission} />
            <Button title="Get Device ID" onPress={fetchDeviceId} />
        </View>
    );
};

export default Main;
