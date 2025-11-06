import { AppRegistry, Platform } from 'react-native';

interface WebAppRegistry extends typeof AppRegistry {
  registerWebModule?: (id: string, loader: () => unknown) => unknown;
}

const appRegistry = AppRegistry as WebAppRegistry;

if (Platform.OS === 'web') {
  if (typeof appRegistry.registerWebModule !== 'function') {
    appRegistry.registerWebModule = (_id, loader) => loader();
  }
}
