import { Ionicons } from '@expo/vector-icons';
import { router, usePathname } from 'expo-router';
import * as React from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';

export default function FooterNav() {
  const pathname = usePathname() ?? '';

  const tabs = [
    { name: 'Início', icon: 'home-outline', route: 'home' },
    { name: 'Buscar', icon: 'search-outline', route: 'busca' },
    { name: 'Ordens', icon: 'file-tray-full-outline', route: 'ordem' },
    { name: 'Clientes', icon: 'people-outline', route: 'clientes' },
    { name: 'Perfil', icon: 'person-outline', route: 'perfil' },
  ];

  return (
    <View style={styles.container}>
      {tabs.map((tab) => {
        const routePath = `/${tab.route}`;
        const isActive = pathname.startsWith(routePath);

        return (
          <TouchableOpacity
            key={tab.name}
            accessibilityRole="button"
            onPress={() => router.push(routePath)}
            style={styles.tab}
          >
            <Ionicons
              name={tab.icon as any}
              size={24}
              color={isActive ? '#6bc0a9' : '#fff'}
            />
            <Text style={[styles.text, isActive && styles.activeText]}>
              {tab.name}
            </Text>
          </TouchableOpacity>
        );
      })}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
    borderTopWidth: 1,
    borderColor: '#ddd',
    paddingVertical: 6,
    backgroundColor: '#0d1b5cff',
  },
  tab: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderRadius: 16,
  },
  text: {
    fontSize: 12,
    color: '#fff',
    marginTop: 3,
  },
  activeText: {
    color: '#6bc0a9',
    fontWeight: 'bold',
  },
});
        
