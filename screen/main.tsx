// import { getVerificationUrl } from '../service/verification';
import React, { useEffect, useState } from 'react';
import { View, Text, Button, PermissionsAndroid, Alert } from 'react-native';
import Verify from './verify';

const Main = ({ navigation }: { navigation: any }) => {
    const handleVerify = async () => {
        try {
            navigation.navigate(Verify as never);
        } catch (error) {
            console.error('Error during verification initialization:', error);
        }
    };

    const [permissionGranted, setPermissionGranted] = useState(false);

    const checkPermission = async () => {
        try {
            const granted = await PermissionsAndroid.check(PermissionsAndroid.PERMISSIONS.CAMERA);
            if (granted) {
                setPermissionGranted(true);
            } else {
                setPermissionGranted(false);
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
                setPermissionGranted(true);
                Alert.alert('Permission Granted', 'You can now access the camera.');
            } else {
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
        </View>
    );
};

export default Main;
