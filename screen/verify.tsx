import React from 'react';
import { View, StyleSheet } from 'react-native';
import { WebView } from 'react-native-webview';

const Verify = ({ route }: { route: any }) => {
    const { sessionUrl } = route.params;
    return (
        <View style={styles.container}>
            <WebView
                source={{ uri: sessionUrl }}
                userAgent="Mozilla/5.0 (Linux; Android 10; Mobile) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Mobile Safari/537.36"
                mediaPlaybackRequiresUserAction={false}
                allowsInlineMediaPlayback={true}
                domStorageEnabled={true}
                androidHardwareAccelerationDisabled={false}
                androidLayerType="hardware"
            />
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
});

export default Verify;
