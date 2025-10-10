import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

interface SectionProps {
  title: string;
  icon: keyof typeof Ionicons.glyphMap;
  children: React.ReactNode;
  required?: boolean;
}

const Section: React.FC<SectionProps> = ({ title, icon, children, required }) => (
  <View style={styles.section}>
    <View style={styles.header}>
      <Ionicons name={icon} size={20} color="#1976d2" style={{ marginRight: 6 }} />
      <Text style={styles.title}>{title}</Text>
      {required && <Text style={styles.required}>*</Text>}
    </View>
    <View style={styles.content}>{children}</View>
  </View>
);

const styles = StyleSheet.create({
  section: {
    backgroundColor: '#fff',
    borderRadius: 10,
    marginBottom: 16,
    padding: 12,
    elevation: 1,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  title: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#222e50',
  },
  required: {
    color: '#e74c3c',
    marginLeft: 4,
    fontSize: 16,
  },
  content: {
    paddingTop: 4,
  },
});

export default Section;
