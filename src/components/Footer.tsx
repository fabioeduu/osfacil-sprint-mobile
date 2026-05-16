import { Ionicons } from '@expo/vector-icons';
import { router, usePathname } from 'expo-router';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { useAppTheme } from '../theme';
import useAuth from '../hooks/useAuth';

export default function FooterNav() {
  const pathname = usePathname() ?? '';
  const { colors } = useAppTheme();
  const auth = useAuth();
  
  const isFuncionario = auth.role && ['funcionario', 'admin'].includes(auth.role.toLowerCase());
  
  const allTabs = [
    { name: 'Início', icon: 'home-outline', route: '/(tabs)/home', requireFuncionario: false },
    { name: 'Buscar', icon: 'search-outline', route: '/(tabs)/busca', requireFuncionario: false },
    { name: 'Ordens', icon: 'file-tray-full-outline', route: '/(tabs)/ordem', requireFuncionario: true },
    { name: 'Clientes', icon: 'people-outline', route: '/(tabs)/clientes', requireFuncionario: true },
    { name: 'Veículos', icon: 'car-outline', route: '/(tabs)/veiculos', requireFuncionario: true },
    { name: 'Perfil', icon: 'person-outline', route: '/(tabs)/perfil', requireFuncionario: false },
  ];
  
  const tabs = isFuncionario 
    ? allTabs 
    : allTabs.filter(tab => !tab.requireFuncionario);

  return (
    <View style={styles.outer}>
      <View style={[styles.container, { backgroundColor: colors.surface, borderColor: colors.border, shadowColor: colors.text }]}>
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
    </View>
  );
}

const styles = StyleSheet.create({
  outer: {
    paddingHorizontal: 12,
    paddingBottom: 8,
  },
  container: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
    borderTopWidth: 1,
    paddingVertical: 8,
    paddingHorizontal: 8,
    borderRadius: 18,
    borderWidth: 1,
    maxWidth: 980,
    width: '100%',
    alignSelf: 'center',
    shadowOpacity: 0.08,
    shadowRadius: 12,
    shadowOffset: { width: 0, height: 4 },
    elevation: 4,
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
        
