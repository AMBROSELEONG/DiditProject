import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import Main from './screen/main';
import Verify from './screen/verify';
import React, { useEffect } from 'react';
import { Linking } from 'react-native';
import Welcome from "./screen/welcome";

const Stack = createNativeStackNavigator();

const linking = {
  prefixes: ["diditproject://"],
  config: {
    screens: {
      Welcome: "welcome",
    },
  },
};

function App(): React.JSX.Element {
  useEffect(() => {
    const handleDeepLink = (event: { url: string }) => {
    };

    const subscription = Linking.addEventListener('url', handleDeepLink);

    return () => {
      subscription.remove();
    };

  }, []);

  return (
    <NavigationContainer linking={linking}>
      <Stack.Navigator initialRouteName="Main" screenOptions={{ headerShown: false, navigationBarColor: "white" }}>
        <Stack.Screen name="Main" component={Main} />
        <Stack.Screen name="Verify" component={Verify} />
        <Stack.Screen name="Welcome" component={Welcome} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}

export default App;
