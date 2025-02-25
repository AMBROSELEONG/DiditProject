import axios from 'axios';
import DeviceInfo from 'react-native-device-info';
import AsyncStorage from '@react-native-async-storage/async-storage';

const clientID = 'XKsmWriP3FeAKgkOfZu3OQ'
const clientSecret = 'bOjqBJMhB8wsqyF2INq26OMs7mteRtr3kzVug2v5xKw'

global.Buffer = require('buffer').Buffer;

interface TokenResponse {
    access_token: string;
}

interface SessionResponse {
    url: string;
    session_id: string;
}

export async function getClientAccessToken(): Promise<string> {

    const encodedCredentials = Buffer.from(`${clientID}:${clientSecret}`).toString('base64');

    try {
        const response = await axios.post<TokenResponse>(
            'https://apx.didit.me/auth/v2/token/',
            'grant_type=client_credentials',
            {
                headers: {
                    'Authorization': `Basic ${encodedCredentials}`,
                    'Content-Type': 'application/x-www-form-urlencoded',
                },
            }
        );

        return response.data.access_token;
    } catch (error) {
        if (axios.isAxiosError(error)) {
            throw new Error(`Failed to obtain client access token: ${error.response?.status} ${JSON.stringify(error.response?.data)}`);
        }
        throw error;
    }
}

interface CreateSessionParams {
    features: string;
    callback: string;
    vendorData: string;
    accessToken: string;
}

export async function createSession({
    features,
    callback,
    vendorData,
    accessToken,
}: CreateSessionParams): Promise<SessionResponse> {
    try {
        const response = await axios.post<SessionResponse>(
            'https://verification.didit.me/v1/session/',
            {
                callback,
                features,
                vendor_data: vendorData,
            },
            {
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${accessToken}`,
                },
            }
        );

        return response.data;
    } catch (error) {
        if (axios.isAxiosError(error)) {
            throw new Error(`Failed to create session: ${error.response?.status} ${JSON.stringify(error.response?.data)}`);
        }
        throw error;
    }
}
export const fetchDeviceId = async () => {
    const deviceId = await DeviceInfo.getUniqueId();
    return deviceId;
};

const saveSessionId = async (sessionId: string) => {
    try {
        await AsyncStorage.setItem('session_id', sessionId);
        console.log('Session ID saved:', sessionId);
    } catch (error) {
        console.error('Failed to save session ID:', error);
    }
};

const getSessionId = async () => {
    try {
        return await AsyncStorage.getItem('session_id');
    } catch (error) {
        console.error('Failed to retrieve session ID:', error);
        return null;
    }
};

const saveClientToken = async (clientToken: string) => {
    try {
        await AsyncStorage.setItem('client_token', clientToken);
        console.log('Client Token saved:', clientToken);
    } catch (error) {
        console.error('Failed to save Client Token:', error);
    }
};

const getClientToken = async () => {
    try {
        return await AsyncStorage.getItem('client_token');
    } catch (error) {
        console.error('Failed to retrieve Client Token:', error);
        return null;
    }
};

export async function initializeVerification() {
    try {
        const [clientAccessToken, deviceId] = await Promise.all([
            getClientAccessToken().catch((err) => {
                console.error('Failed to get client access token:', err);
                return null;
            }),
            fetchDeviceId().catch((err) => {
                console.error('Failed to fetch device ID:', err);
                return null;
            }),
        ]);

        if (!clientAccessToken || !deviceId) {
            throw new Error('Missing required data for verification.');
        }

        await saveClientToken(clientAccessToken);

        const sessionData = await createSession({
            features: 'OCR + FACE',
            callback: 'diditproject://welcome',
            vendorData: deviceId,
            accessToken: clientAccessToken,
        });

        if (sessionData?.session_id) {
            await saveSessionId(sessionData.session_id);
            return sessionData;
        } else {
            throw new Error('Invalid session data received.');
        }
    } catch (error) {
        console.error('Error during verification initialization:', error);
        throw error;
    }
}

export async function getVerificationUrl() {
    const data = await initializeVerification();
    return data.url;
}

export async function getSessionDecision() {
    const sessionId = await getSessionId();
    const token = await getClientToken();

    const url = `https://verification.didit.me/v1/session/${sessionId}/decision/`;

    if (!token) {
        console.error('Error fetching client token');
    } else {
        const headers = {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`,
        };

        try {
            const response = await fetch(url, {
                method: 'GET',
                headers,
            });

            const data = await response.json();

            if (response.ok) {
                console.log(data)
                return data;
            } else {
                console.error('Error fetching session decision:', data.message);
                throw new Error(data.message);
            }
        } catch (err) {
            console.error('Network error:', err);
            throw err;
        }
    }
}