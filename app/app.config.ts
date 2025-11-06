const fallbackFunctionsUrl = 'https://jerkvxvxdrgxjcrfvhpn.supabase.co/functions/v1';
const fallbackStorageBucket = 'study-uploads';

export default () => ({
  expo: {
    name: 'AetherLearn',
    slug: 'aetherlearn',
    version: '1.0.0',
    orientation: 'portrait',
    icon: './assets/icon.png',
    userInterfaceStyle: 'automatic',
    splash: {
      image: './assets/splash.png',
      resizeMode: 'contain',
      backgroundColor: '#0B0D21'
    },
    updates: {
      fallbackToCacheTimeout: 0
    },
    assetBundlePatterns: ['**/*'],
    android: {
      package: 'com.aetherlearn.app',
      permissions: ['READ_EXTERNAL_STORAGE', 'WRITE_EXTERNAL_STORAGE', 'CAMERA'],
      adaptiveIcon: {
        foregroundImage: './assets/adaptive-icon.png',
        backgroundColor: '#0B0D21'
      }
    },
    web: {
      bundler: 'metro',
      favicon: './assets/favicon.png'
    },
    extra: {
      API_URL: process.env.EXPO_PUBLIC_FUNCTIONS_URL ?? fallbackFunctionsUrl,
      SUPABASE_URL: process.env.EXPO_PUBLIC_SUPABASE_URL,
      SUPABASE_ANON_KEY: process.env.EXPO_PUBLIC_SUPABASE_ANON_KEY,
      STORAGE_BUCKET: process.env.EXPO_PUBLIC_SUPABASE_STORAGE_BUCKET ?? fallbackStorageBucket
    }
  }
});
