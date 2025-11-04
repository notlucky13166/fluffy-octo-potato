import React from 'react';
import { NavigationContainer, DefaultTheme, DarkTheme } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { useColorScheme } from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { Ionicons } from '@expo/vector-icons';
import HomeScreen from './src/screens/HomeScreen';
import PracticeScreen from './src/screens/PracticeScreen';
import CreateScreen from './src/screens/CreateScreen';
import CollaborateScreen from './src/screens/CollaborateScreen';
import ProfileScreen from './src/screens/ProfileScreen';
import { ThemeProvider } from './src/theme/ThemeProvider';
import { QueryClient, QueryClientProvider } from 'react-query';

const Tab = createBottomTabNavigator();
const queryClient = new QueryClient();

const tabIcons: Record<string, keyof typeof Ionicons.glyphMap> = {
  Home: 'planet-outline',
  Practice: 'flash-outline',
  Create: 'add-circle-outline',
  Collaborate: 'people-circle-outline',
  Profile: 'person-circle-outline'
};

export default function App() {
  const colorScheme = useColorScheme();

  return (
    <QueryClientProvider client={queryClient}>
      <ThemeProvider>
        <NavigationContainer theme={colorScheme === 'dark' ? DarkTheme : DefaultTheme}>
          <StatusBar style={colorScheme === 'dark' ? 'light' : 'dark'} />
          <Tab.Navigator
            screenOptions={({ route }) => ({
              headerShown: false,
              tabBarIcon: ({ color, size }) => {
                const iconName = tabIcons[route.name];
                return <Ionicons name={iconName} size={size} color={color} />;
              }
            })}
          >
            <Tab.Screen name="Home" component={HomeScreen} />
            <Tab.Screen name="Practice" component={PracticeScreen} />
            <Tab.Screen
              name="Create"
              component={CreateScreen}
              options={{
                tabBarLabel: 'Create',
                tabBarIconStyle: { marginTop: 4 }
              }}
            />
            <Tab.Screen name="Collaborate" component={CollaborateScreen} />
            <Tab.Screen name="Profile" component={ProfileScreen} />
          </Tab.Navigator>
        </NavigationContainer>
      </ThemeProvider>
    </QueryClientProvider>
  );
}
