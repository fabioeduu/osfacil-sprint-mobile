import { Ionicons } from '@expo/vector-icons';
import { router, usePathname } from 'expo-router';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { useAppTheme } from '../theme';

export default function FooterNav() {
  const pathname = usePathname() ?? '';
  const { colors } = useAppTheme();

  const tabs = [
    { name: 'Início', icon: 'home-outline', route: '/(tabs)/home' },
    { name: 'Buscar', icon: 'search-outline', route: '/(tabs)/busca' },
    { name: 'Ordens', icon: 'file-tray-full-outline', route: '/(tabs)/ordem' },
    { name: 'Clientes', icon: 'people-outline', route: '/(tabs)/clientes' },
    { name: 'Perfil', icon: 'person-outline', route: '/(tabs)/perfil' },
  ];

  return (
    <View style={[styles.container, { backgroundColor: colors.surface, borderColor: colors.border }]}> 
      {tabs.map((tab) => {
        const routeName = tab.route.split('/').pop() || '';
        const isActive = pathname.includes(routeName);

        return (
          <TouchableOpacity
            key={tab.name}
            accessibilityRole="button"
            onPress={() => router.push(tab.route)}
            style={styles.tab}
          >
            <Ionicons
              name={tab.icon as any}
              size={20}
              color={isActive ? colors.primary : colors.textMuted}
            />
            <Text style={[styles.text, { color: colors.textMuted }, isActive && { color: colors.primary, fontWeight: '700' }]}>
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
    paddingVertical: 6,
  },
  tab: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 12,
  },
  text: {
    fontSize: 11,
    marginTop: 3,
  },
});
        
