import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';

interface CustomButtonProps {
  title: string;
  onPress: () => void;
  variant?: 'primary' | 'secondary' | 'danger' | 'success';
  size?: 'small' | 'medium' | 'large';
  disabled?: boolean;
  fullWidth?: boolean;
}

export const CustomButton: React.FC<CustomButtonProps> = ({
  title,
  onPress,
  variant = 'primary',
  size = 'medium',
  disabled = false,
  fullWidth = false,
}) => {
  const getBackgroundColor = () => {
    if (disabled) return '#bdc3c7';
    
    switch (variant) {
      case 'primary': return '#3498db';
      case 'secondary': return '#95a5a6';
      case 'danger': return '#e74c3c';
      case 'success': return '#27ae60';
      default: return '#3498db';
    }
  };

  const getPadding = () => {
    switch (size) {
      case 'small': return { paddingHorizontal: 15, paddingVertical: 8 };
      case 'medium': return { paddingHorizontal: 20, paddingVertical: 12 };
      case 'large': return { paddingHorizontal: 30, paddingVertical: 15 };
      default: return { paddingHorizontal: 20, paddingVertical: 12 };
    }
  };

  const getFontSize = () => {
    switch (size) {
      case 'small': return 14;
      case 'medium': return 16;
      case 'large': return 18;
      default: return 16;
    }
  };

  return (
    <TouchableOpacity
      style={[
        styles.button,
        {
          backgroundColor: getBackgroundColor(),
          ...getPadding(),
          width: fullWidth ? '100%' : 'auto',
          opacity: disabled ? 0.6 : 1,
        },
      ]}
      onPress={onPress}
      disabled={disabled}
    >
      <Text style={[styles.buttonText, { fontSize: getFontSize() }]}>
        {title}
      </Text>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  button: {
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 2,
  },
  buttonText: {
    color: '#fff',
    fontWeight: '600',
  },
});