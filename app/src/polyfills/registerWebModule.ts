import { Platform } from 'react-native';

type RegisterWebModule = (id: string, loader: () => unknown) => unknown;

interface ExpoModulesCore {
  registerWebModule?: RegisterWebModule;
}

if (Platform.OS === 'web') {
  // eslint-disable-next-line @typescript-eslint/no-var-requires
  const expoModulesCore = require('expo-modules-core') as ExpoModulesCore;

  if (typeof expoModulesCore.registerWebModule !== 'function') {
    expoModulesCore.registerWebModule = (_id, loader) => loader();
  }
}
