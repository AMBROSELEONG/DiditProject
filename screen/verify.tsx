import { View, StyleSheet, ActivityIndicator } from 'react-native';
import { WebView } from 'react-native-webview';
import { getVerificationUrl } from '../service/verification';
import React, { useEffect, useState } from 'react';

const Verify = () => {
    const [session, setSession] = useState<string | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchSession = async () => {
            try {
                const url = await getVerificationUrl();
                setSession(url);
            } catch (error) {
                console.error('Failed to fetch verification URL:', error);
            } finally {
                setLoading(false);
            }
        };
        fetchSession();
    }, []);

    if (loading) {
        return (
            <View style={styles.loaderContainer}>
                <ActivityIndicator size="large" color="#0000ff" />
            </View>
        );
    }

    return (
        <View style={styles.container}>
            {session ? (
                <WebView
                    source={{ uri: session }}
                    userAgent="Mozilla/5.0 (Linux; Android 10; Mobile) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Mobile Safari/537.36"
                    mediaPlaybackRequiresUserAction={false}
                    allowsInlineMediaPlayback={true}
                    domStorageEnabled={true}
                    androidHardwareAccelerationDisabled={false}
                    androidLayerType="hardware"
                />
            ) : (
                <View style={styles.loaderContainer}>
                    <ActivityIndicator size="large" color="#0000ff" />
                </View>
            )}
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    loaderContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
});

export default Verify;
