import { useEffect, useState } from "react";
import { View, ActivityIndicator } from "react-native";
import { SafeAreaView } from 'react-native-safe-area-context';
import { Redirect } from 'expo-router';
let Font: any;
try {
  Font = require('expo-font');
} catch (e) {
  Font = null;
}

let Ionicons: any;
try {
  Ionicons = require('@expo/vector-icons').Ionicons;
} catch (e) {
  Ionicons = null;
}

import { Slot } from 'expo-router';
import FooterNav from '../../components/Footer';
import useAuth from '../../hooks/useAuth';
import { useAppTheme } from '../../theme';

export default function TabsLayout() {
  const [fontsLoaded, setFontsLoaded] = useState(false);
  const { isLoading, isAuthenticated } = useAuth();
  const { colors } = useAppTheme();

  useEffect(() => {
    async function loadFonts() {
      if (Font && Ionicons && Ionicons.font) {
        await Font.loadAsync(Ionicons.font);
      }
      setFontsLoaded(true);
    }
    loadFonts();
  }, []);

  if (!fontsLoaded || isLoading) {
    return (
      <View style={{ flex: 1, justifyContent: "center", alignItems: "center", backgroundColor: colors.background }}>
        <ActivityIndicator size="large" color={colors.primary} />
      </View>
    );
  }

  if (!isAuthenticated) {
    return <Redirect href="/login" />;
  }

  return (
    <View style={{ flex: 1, backgroundColor: colors.background }}>
      <Slot />
      <SafeAreaView edges={["bottom"]} style={{ backgroundColor: 'transparent' }}>
        <FooterNav />
      </SafeAreaView>
    </View>
  );
}
