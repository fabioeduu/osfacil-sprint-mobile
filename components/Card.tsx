import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

interface StatCardProps {
  label: string;
  value: number;
  color: string;
}

const StatCard: React.FC<StatCardProps> = ({ label, value, color }) => (
  <View style={[styles.statCard, { backgroundColor: color }]}> 
    <Text style={styles.statValue}>{value}</Text>
    <Text style={styles.statLabel}>{label}</Text>
  </View>
);

const styles = StyleSheet.create({
  statCard: { width: '48%', padding: 16, borderRadius: 12, marginBottom: 12 },
  statValue: { fontSize: 22, fontWeight: 'bold', color: '#fff' },
  statLabel: { fontSize: 14, color: '#fff' },
});

export default StatCard;
