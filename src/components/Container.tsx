import { ReactNode } from 'react';
import { View, StyleSheet } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useAppTheme } from '../theme';

interface Props {
  children: ReactNode;
}

export default function Container({ children }: Props) {
  const { colors } = useAppTheme();

  return (
    <SafeAreaView style={[styles.safe, { backgroundColor: colors.background }]}>
      <View style={[styles.shell, { backgroundColor: colors.background }]}> 
        <View style={[styles.container, { backgroundColor: colors.background, borderColor: colors.border }]}>{children}</View>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1 },
  shell: { flex: 1, paddingHorizontal: 12, paddingTop: 10 },
  container: {
    flex: 1,
    width: '100%',
    maxWidth: 980,
    alignSelf: 'center',
    padding: 16,
    alignItems: 'stretch',
    justifyContent: 'flex-start',
  }
});
