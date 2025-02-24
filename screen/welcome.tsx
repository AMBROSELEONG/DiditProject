import { View, Text } from 'react-native';
import { useEffect, useState } from 'react';
import { initializeVerification } from '../service/verification';

const Welcome = () => {

    const [sessionDecision, setSessionDecision] = useState(null);
    const [loading, setLoading] = useState(true);
    
    useEffect(() => {
       

        const fetchSessionID = async () => {
            try {
                const data = await initializeVerification(); 
                console.log("Session ID:", (data as any).session_id);
            } catch (error) {
                console.error("Error fetching session ID:", error);
            }
        }
        fetchSessionID();
        
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