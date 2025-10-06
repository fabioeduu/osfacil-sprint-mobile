import React, { useState } from 'react';
import { View, Text, TextInput, StyleSheet, TouchableOpacity, TextInputProps } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

interface FormInputProps extends Omit<TextInputProps, 'secureTextEntry'> {
  label: string;
  error?: string;
  required?: boolean;
  mask?: 'cpf' | 'cnpj' | 'phone' | 'cep' | 'date';
  leftIcon?: keyof typeof Ionicons.glyphMap;
  rightIcon?: keyof typeof Ionicons.glyphMap;
  onRightIconPress?: () => void;
  helper?: string;
  secureTextEntry?: boolean;
}



const applyMask = (text: string, mask: string): string => {
  const cleanText = text.replace(/\D/g, '');
  
  switch (mask) {
    case 'cpf':
      return cleanText
        .substring(0, 11)
        .replace(/(\d{3})(\d)/, '$1.$2')
        .replace(/(\d{3})(\d)/, '$1.$2')
        .replace(/(\d{3})(\d{1,2})/, '$1-$2');
    
    case 'cnpj':
      return cleanText
        .substring(0, 14)
        .replace(/(\d{2})(\d)/, '$1.$2')
        .replace(/(\d{3})(\d)/, '$1.$2')
        .replace(/(\d{3})(\d)/, '$1/$2')
        .replace(/(\d{4})(\d{1,2})/, '$1-$2');
    
    case 'phone':
      if (cleanText.length <= 10) {
        return cleanText
          .replace(/(\d{2})(\d)/, '($1) $2')
          .replace(/(\d{4})(\d)/, '$1-$2');
      } else {
        return cleanText
          .substring(0, 11)
          .replace(/(\d{2})(\d)/, '($1) $2')
          .replace(/(\d{5})(\d)/, '$1-$2');
      }
    
    case 'cep':
      return cleanText
        .substring(0, 8)
        .replace(/(\d{5})(\d)/, '$1-$2');
    
    case 'date':
      return cleanText
        .substring(0, 8)
        .replace(/(\d{2})(\d)/, '$1/$2')
        .replace(/(\d{2})(\d)/, '$1/$2');
    
    default:
      return text;
  }
};

export const FormInput: React.FC<FormInputProps> = ({
  label,
  error,
  required = false,
  mask,
  leftIcon,
  rightIcon,
  onRightIconPress,
  helper,
  secureTextEntry,
  style,
  onChangeText,
  onFocus,
  onBlur,
  ...props
}) => {
  const [isFocused, setIsFocused] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const handleChangeText = (text: string) => {
    if (mask) {
      const maskedText = applyMask(text, mask);
      onChangeText?.(maskedText);
    } else {
      onChangeText?.(text);
    }
  };

  const handleFocus = (e: any) => {
    setIsFocused(true);
    onFocus?.(e);
  };

  const handleBlur = (e: any) => {
    setIsFocused(false);
    onBlur?.(e);
  };

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  const inputStyles = [
    styles.input,
    isFocused && styles.inputFocused,
    error && styles.inputError,
    leftIcon && styles.inputWithLeftIcon,
    (rightIcon || secureTextEntry) && styles.inputWithRightIcon,
    style,
  ];

  return (
    <View style={styles.container}>
      
      
      <Text style={[styles.label, error && styles.labelError]}>
        {label}
        {required && <Text style={styles.required}> *</Text>}
      </Text>

 
 
      <View style={styles.inputContainer}>
        {leftIcon && (
          <View style={styles.leftIconContainer}>
            <Ionicons 
              name={leftIcon} 
              size={20} 
              color={isFocused ? '#3498db' : '#95a5a6'} 
            />
          </View>
        )}

      
        <TextInput
          style={inputStyles}
          onChangeText={handleChangeText}
          onFocus={handleFocus}
          onBlur={handleBlur}
          placeholderTextColor="#95a5a6"
          secureTextEntry={secureTextEntry && !showPassword}
          {...props}
        />

       
        {(rightIcon || secureTextEntry) && (
          <TouchableOpacity 
            style={styles.rightIconContainer}
            onPress={secureTextEntry ? togglePasswordVisibility : onRightIconPress}
          >
            <Ionicons 
              name={
                secureTextEntry 
                  ? (showPassword ? 'eye-off' : 'eye')
                  : rightIcon!
              } 
              size={20} 
              color={isFocused ? '#3498db' : '#95a5a6'} 
            />
          </TouchableOpacity>
        )}
      </View>

   
      {(error || helper) && (
        <View style={styles.helperContainer}>
          {error && (
            <View style={styles.errorContainer}>
              <Ionicons name="alert-circle" size={14} color="#e74c3c" />
              <Text style={styles.errorText}>{error}</Text>
            </View>
          )}
          {!error && helper && (
            <Text style={styles.helperText}>{helper}</Text>
          )}
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginBottom: 15,
  },
  label: {
    fontSize: 16,
    fontWeight: '600',
    color: '#2c3e50',
    marginBottom: 8,
  },
  labelError: {
    color: '#e74c3c',
  },
  required: {
    color: '#e74c3c',
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#bdc3c7',
    borderRadius: 8,
    backgroundColor: '#fff',
  },
  input: {
    flex: 1,
    paddingHorizontal: 15,
    paddingVertical: 12,
    fontSize: 16,
  },
  inputFocused: {
    borderColor: '#3498db',
  },
  inputError: {
    borderColor: '#e74c3c',
  },
  inputWithLeftIcon: {
    paddingLeft: 50,
  },
  inputWithRightIcon: {
    paddingRight: 50,
  },
  leftIconContainer: {
    position: 'absolute',
    left: 15,
    zIndex: 1,
  },
  rightIconContainer: {
    position: 'absolute',
    right: 15,
    zIndex: 1,
  },
  helperContainer: {
    marginTop: 5,
  },
  errorContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
  },
  errorText: {
    fontSize: 14,
    color: '#e74c3c',
  },
  helperText: {
    fontSize: 12,
    color: '#7f8c8d',
  },
});