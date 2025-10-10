import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

interface SelectItemProps {
  label: string;
  value?: string;
  onPress: () => void;
  placeholder: string;
  icon: keyof typeof Ionicons.glyphMap;
}

const SelectItem: React.FC<SelectItemProps> = ({ label, value, onPress, placeholder, icon }) => (
  <View style={styles.container}>
    {label ? <Text style={styles.label}>{label}</Text> : null}
    <TouchableOpacity style={styles.button} activeOpacity={0.7} onPress={onPress}>
      <Ionicons name={icon} size={20} color="#1976d2" style={{ marginRight: 6 }} />
      <Text style={[styles.text, !value && styles.placeholder]}>{value || placeholder}</Text>
      <Ionicons name="chevron-forward" size={20} color="#b0b7c3" />
    </TouchableOpacity>
  </View>
);

const styles = StyleSheet.create({
  container: {
    marginBottom: 16,
  },
  label: {
    fontSize: 15,
    fontWeight: 'bold',
    color: '#222e50',
    marginBottom: 6,
  },
  button: {
    flexDirection: 'row',
    alignItems: 'center',
    borderRadius: 10,
    borderWidth: 1,
    borderColor: '#d1d5db',
    backgroundColor: '#f8fafc',
    padding: 10,
  },
  text: {
    flex: 1,
    fontSize: 15,
    color: '#222e50',
  },
  placeholder: {
    color: '#b0b7c3',
    fontStyle: 'italic',
  },
});

export default SelectItem;
