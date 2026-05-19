import React, { useEffect } from 'react';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { StatusBar } from 'expo-status-bar';
import RootNavigator from './src/navigation/RootNavigator';
import { useAppStore } from './src/store/appStore';
import { loadPersistedState } from './src/store/persist';

export default function App() {
  const setHydrated = useAppStore((s) => s.setHydrated);

  useEffect(() => {
    const init = async () => {
      await loadPersistedState();
      setHydrated(true);
    };
    init();
  }, []);

  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <SafeAreaProvider>
        <StatusBar style="auto" />
        <RootNavigator />
      </SafeAreaProvider>
    </GestureHandlerRootView>
  );
}
