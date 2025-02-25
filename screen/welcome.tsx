import { View, Text } from 'react-native';
import { useEffect, useState } from 'react';
import { getSessionDecision } from '../service/verification';

const Welcome = () => {
    const handleSessionData = async () => {
        try {
            const data = await getSessionDecision();
            console.log(data);
        } catch (error) {
            console.error('Error during verification initialization:', error);
        }
    }

    useEffect(() => {
        handleSessionData(); 
    }, []);
    
    return (
        <>
            <View>
                <Text>Welcome</Text>
            </View>
        </>
    )
}

export default Welcome;