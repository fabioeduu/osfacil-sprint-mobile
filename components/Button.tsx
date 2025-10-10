import React from 'react';
import { TouchableOpacity, Text, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

interface ActionButtonProps {
  icon: string;
  text: string;
  onPress: () => void;
}

const ActionButton: React.FC<ActionButtonProps> = ({ icon, text, onPress }) => (
  <TouchableOpacity style={styles.actionButton} onPress={onPress}>
    <Ionicons name={icon as any} size={28} color="#2c3e50" />
    <Text style={styles.actionText}>{text}</Text>
  </TouchableOpacity>
);

const styles = StyleSheet.create({
  actionButton: { width: '48%', backgroundColor: '#fff', borderRadius: 12, padding: 20, alignItems: 'center', marginBottom: 12, elevation: 3 },
  actionText: { marginTop: 8, fontWeight: '500', color: '#2c3e50' },
});

export default ActionButton;
