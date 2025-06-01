import { useEffect } from 'react';
import { StyleSheet, ActivityIndicator, View } from 'react-native';
import { Redirect } from 'expo-router';
import { useFonts, Inter_400Regular, Inter_500Medium, Inter_600SemiBold, Inter_700Bold } from '@expo-google-fonts/inter';
import { LinearGradient } from 'expo-linear-gradient';
import { Image } from 'react-native';

export default function Index() {
  const [fontsLoaded] = useFonts({
    'Inter-Regular': Inter_400Regular,
    'Inter-Medium': Inter_500Medium,
    'Inter-SemiBold': Inter_600SemiBold,
    'Inter-Bold': Inter_700Bold,
  });

  // Check if fonts are loaded
  useEffect(() => {
    if (fontsLoaded) {
      // Fonts are loaded, you can do any additional initialization here
    }
  }, [fontsLoaded]);

  if (!fontsLoaded) {
    return (
      <LinearGradient
        colors={['#121212', '#1E1E1E']}
        style={styles.container}
      >
        <ActivityIndicator size="large" color="#FFEB3B" />
      </LinearGradient>
    );
  }

  // Redirect to the onboarding screen on first launch or to the tabs if already logged in
  return <Redirect href="/onboarding" />;
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
});