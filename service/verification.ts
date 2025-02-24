import axios from "axios";
import DeviceInfo from 'react-native-device-info';

global.Buffer = require('buffer').Buffer;

interface TokenResponse {
    access_token: string;
}

interface SessionResponse {
    url: string;
}

export async function getClientAccessToken(): Promise<string> {
    const clientId = "XKsmWriP3FeAKgkOfZu3OQ";
    const clientSecret = "bOjqBJMhB8wsqyF2INq26OMs7mteRtr3kzVug2v5xKw";

    const encodedCredentials = Buffer.from(`${clientId}:${clientSecret}`).toString('base64');

    try {
        const response = await axios.post<TokenResponse>(
            'https://apx.didit.me/auth/v2/token',
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

export async function fetchDeviceId() {
    return await DeviceInfo.getUniqueId();
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
  
export async function initializeVerification() {
    try {
        const [clientAccessToken, deviceId] = await Promise.all([
            getClientAccessToken(),
            fetchDeviceId()
        ]);

        const sessionData = await createSession({
        features: 'OCR + FACE',
        callback: 'diditproject://welcome',
        vendorData: deviceId,
        accessToken: clientAccessToken,
        });

        return sessionData;
    } catch (error) {
        console.error('Error during verification initialization:', error);
        throw error;
    }
}

export async function getVerificationUrl() {
    const data = await initializeVerification();
    return data.url; 
}
