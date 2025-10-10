import React from 'react';
import { TouchableOpacity, Text, StyleSheet } from 'react-native';
import { PrioridadeOS } from '../types';

interface PriorityButtonProps {
  priority: PrioridadeOS;
  selected: boolean;
  onPress: () => void;
}

const getPriorityColor = (p: PrioridadeOS) => {
  switch (p) {
    case 'baixa': return '#27ae60';
    case 'normal': return '#3498db';
    case 'alta': return '#f39c12';
    case 'urgente': return '#e74c3c';
  }
};

const getPriorityLabel = (p: PrioridadeOS) => {
  switch (p) {
    case 'baixa': return 'Baixa';
    case 'normal': return 'Normal';
    case 'alta': return 'Alta';
    case 'urgente': return 'Urgente';
  }
};

const PriorityButton: React.FC<PriorityButtonProps> = ({ priority, selected, onPress }) => (
  <TouchableOpacity
    style={[styles.button, { borderColor: getPriorityColor(priority) }, selected && { backgroundColor: getPriorityColor(priority) }]}
    activeOpacity={0.8}
    onPress={onPress}
  >
    <Text style={[styles.text, { color: selected ? '#fff' : getPriorityColor(priority) }]}>{getPriorityLabel(priority)}</Text>
  </TouchableOpacity>
);

const styles = StyleSheet.create({
  button: {
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 2,
    borderRadius: 20,
    paddingVertical: 10,
    paddingHorizontal: 18,
    marginHorizontal: 4,
    minWidth: 90,
    marginBottom: 8,
  },
  text: {
    fontSize: 15,
    fontWeight: 'bold',
    letterSpacing: 0.5,
  },
});

export default PriorityButton;
