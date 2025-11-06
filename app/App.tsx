import React from 'react';
import { NavigationContainer, DefaultTheme, DarkTheme } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { useColorScheme } from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { Ionicons } from '@expo/vector-icons';
import HomeScreen from './src/screens/HomeScreen';
import PracticeScreen from './src/screens/PracticeScreen';
import CreateScreen from './src/screens/CreateScreen';
import CollaborateScreen from './src/screens/CollaborateScreen';
import ProfileScreen from './src/screens/ProfileScreen';
import SignInScreen from './src/screens/SignInScreen';
import SignUpScreen from './src/screens/SignUpScreen';
import MissionScreen from './src/screens/MissionScreen';
import { ThemeProvider } from './src/theme/ThemeProvider';
import { QueryClient, QueryClientProvider } from 'react-query';
import { useAuthStore } from './src/store/useAuthStore';
import { AuthStackParamList } from './src/navigation/types';

const Tab = createBottomTabNavigator();
const Stack = createNativeStackNavigator<AuthStackParamList>();
const queryClient = new QueryClient();

const tabIcons: Record<string, keyof typeof Ionicons.glyphMap> = {
  Home: 'planet-outline',
  Practice: 'flash-outline',
  Create: 'add-circle-outline',
  Collaborate: 'people-circle-outline',
  Profile: 'person-circle-outline'
};

const MainTabs = () => (
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
);

export default function App() {
  const colorScheme = useColorScheme();
  const status = useAuthStore((state) => state.status);

  return (
    <QueryClientProvider client={queryClient}>
      <ThemeProvider>
        <NavigationContainer theme={colorScheme === 'dark' ? DarkTheme : DefaultTheme}>
          <StatusBar style={colorScheme === 'dark' ? 'light' : 'dark'} />
          {status === 'signedIn' ? (
            <MainTabs />
          ) : (
            <Stack.Navigator screenOptions={{ headerShown: false }}>
              <Stack.Screen name="SignIn" component={SignInScreen} />
              <Stack.Screen name="SignUp" component={SignUpScreen} />
              <Stack.Screen name="Mission" component={MissionScreen} />
            </Stack.Navigator>
          )}
        </NavigationContainer>
      </ThemeProvider>
    </QueryClientProvider>
  );
}
