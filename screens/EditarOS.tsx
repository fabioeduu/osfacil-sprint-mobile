import React from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { useNavigation, useRoute, RouteProp } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { RootStackParamList } from '../navigation/types';
import { Ionicons } from '@expo/vector-icons';

type EditarOSScreenNavigationProp = StackNavigationProp<RootStackParamList, 'EditarOS'>;
type EditarOSScreenRouteProp = RouteProp<RootStackParamList, 'EditarOS'>;

export default function EditarOSScreen() {
  const navigation = useNavigation<EditarOSScreenNavigationProp>();
  const route = useRoute<EditarOSScreenRouteProp>();
  const { osId } = route.params;

  return (
    <ScrollView style={styles.container}>
      <View style={styles.content}>
        <View style={styles.iconContainer}>
          <Ionicons name="create" size={64} color="#f39c12" />
        </View>
        <Text style={styles.title}>Editar OS</Text>
        <Text style={styles.subtitle}>OS ID: {osId}</Text>
        <Text style={styles.subtitle}>Em desenvolvimento..</Text>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8f9fa',
  },
  content: {
    padding: 20,
    alignItems: 'center',
    justifyContent: 'center',
    minHeight: 400,
  },
  iconContainer: {
    marginBottom: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#2c3e50',
    marginBottom: 10,
    textAlign: 'center',
  },
  subtitle: {
    fontSize: 16,
    color: '#7f8c8d',
    marginBottom: 20,
    textAlign: 'center',
  },
});