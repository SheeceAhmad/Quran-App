import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { NavigationContainer } from '@react-navigation/native';

const Stack = createNativeStackNavigator();

import HomeScreen from "./screens/HomeScreen"
import ReadQuran from "./screens/ReadQuran";
import Search from "./screens/Search";
import Bookmark from "./screens/Bookmark";
import Settings from "./screens/Settings";
import Surah from "./screens/Surah";


export default function App() {
  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName="Home">
        <Stack.Screen name="Home" component={HomeScreen} options={{ headerShown: false }} />
        <Stack.Screen name="ReadQuran" component={ReadQuran} />
        <Stack.Screen name="Search" component={Search} />
        <Stack.Screen name="Bookmark" component={Bookmark} />
        <Stack.Screen name="Settings" component={Settings} />
        <Stack.Screen name="Surah" component={Surah} />
      </Stack.Navigator>
    </NavigationContainer>
  );
};
