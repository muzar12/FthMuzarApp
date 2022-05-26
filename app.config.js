import 'dotenv/config';

export default{
  expo: {
    name: "FthMuzarApp",
    slug: "FthMuzarApp",
    version: "1.0.0",
    orientation: "portrait",
    icon: "./assets/logo1.png",
    splash: {
      image: './assets/logo.png',
      resizeMode: 'contain',
      backgroundColor: '#ffffff'
    },
    updates: {
      fallbackToCacheTimeout: 0
    },
    assetBundlePatterns: [
      "**/*"
    ],
    ios: {
      supportsTablet: true
    },
    android: {
      adaptiveIcon: {
        foregroundImage: "./assets/logo1.png",
        backgroundColor: "#FFFFFF"
      }
    },
    web: {
      favicon: "./assets/logo.png"
    },
    extra: {
      apiKey: process.env.API_KEY,
      authDomain: process.env.AUTH_DOMAIN,
      projectId: process.env.PROJECT_ID,
      storageBucket: process.env.STORAGE_BUCKET,
      messagingSenderId: process.env.MESSAGING_SENDER_ID,
      appId: process.env.APP_ID
    }
  },
}
