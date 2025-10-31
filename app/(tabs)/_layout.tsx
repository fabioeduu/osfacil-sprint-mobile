import React, { useEffect, useState } from "react";
import { View, ActivityIndicator } from "react-native";
import { SafeAreaView } from 'react-native-safe-area-context';
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
import Container from '../../components/Container';

export default function TabsLayout() {
  const [fontsLoaded, setFontsLoaded] = useState(false);

  useEffect(() => {
    async function loadFonts() {
      if (Font && Ionicons && Ionicons.font) {
        await Font.loadAsync(Ionicons.font);
      }
      setFontsLoaded(true);
    }
    loadFonts();
  }, []);

  if (!fontsLoaded) {
    return (
      <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
        <ActivityIndicator size="large" color="#2596be" />
      </View>
    );
  }

  return (
    <View style={{ flex: 1, backgroundColor: '#F5F5F5' }}>
      <Container>
        <Slot />
      </Container>
      <SafeAreaView edges={["bottom"]} style={{ backgroundColor: 'transparent' }}>
        <FooterNav />
      </SafeAreaView>
    </View>
  );
}
