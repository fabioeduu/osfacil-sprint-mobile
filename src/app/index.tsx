import { Redirect } from 'expo-router';
import { ActivityIndicator, View } from 'react-native';
import useAuth from '../hooks/useAuth';
import { useAppTheme } from '../theme';

export default function Index() {
  const { isLoading, isAuthenticated } = useAuth();
  const { colors } = useAppTheme();

  if (isLoading) {
    return (
      <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center', backgroundColor: colors.background }}>
        <ActivityIndicator size="large" color={colors.primary} />
      </View>
    );
  }

  return <Redirect href={isAuthenticated ? '/(tabs)/home' : '/login'} />;
}
