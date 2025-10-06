import React from 'react';
import { StyleSheet, Text, View, ViewStyle, TextStyle } from 'react-native';

interface FooterProps {
  text?: string;
  style?: ViewStyle;
  textStyle?: TextStyle;
  children?: React.ReactNode;
}

const Footer: React.FC<FooterProps> = ({ text = 'OS Fácil © - Automotivo 2025', style, textStyle, children }) => {
  return (
    <View style={[styles.footer, style]}>
      <Text style={[styles.footerText, textStyle]}>{text}</Text>
      {children}
    </View>
  );
};

export default Footer;

const styles = StyleSheet.create({
  footer: {
    backgroundColor: '#fff',
    paddingVertical: 10,
    paddingHorizontal: 12,
    borderTopWidth: 1,
    borderTopColor: '#ecf0f1',
    alignItems: 'center',
  },
  footerText: {
    color: '#7f8c8d',
    fontSize: 12,
  }
});