import { Platform } from 'react-native';

type RegisterWebModule = (id: string, loader: () => unknown) => unknown;

type ExpoModulesCoreModule = {
  default?: ExpoModulesCoreModule;
  registerWebModule?: RegisterWebModule;
};

const ensureRegisterWebModule = (moduleExports: ExpoModulesCoreModule) => {
  const target = moduleExports.default ?? moduleExports;

  if (typeof target.registerWebModule !== 'function') {
    const polyfill: RegisterWebModule = (_id, loader) => loader();
    target.registerWebModule = polyfill;
  }

  if (!moduleExports.registerWebModule) {
    moduleExports.registerWebModule = target.registerWebModule;
  }

  if (moduleExports.default && !moduleExports.default.registerWebModule) {
    moduleExports.default.registerWebModule = target.registerWebModule;
  }
};

if (Platform.OS === 'web') {
  // eslint-disable-next-line @typescript-eslint/no-var-requires
  const expoModulesCore = require('expo-modules-core') as ExpoModulesCoreModule;
  ensureRegisterWebModule(expoModulesCore);
}
