import React from 'react';
import { StyleSheet, Text, View, ViewStyle, TextStyle, Image, ImageSourcePropType } from 'react-native';

interface HeaderProps {
  title?: string;
  subtitle?: string;
  rightElement?: React.ReactNode;
  logo?: ImageSourcePropType;
  style?: ViewStyle;
  titleStyle?: TextStyle;
  variant?: 'large' | 'default' | 'compact';
}

const Header: React.FC<HeaderProps> = 
({ title, subtitle, rightElement, logo, style, titleStyle, variant = 'default' }) => {
  const variantStyles = {
    large: {
      header: styles.headerLarge,
      title: styles.headerTitleLarge,
      subtitle: styles.headerSubtitleLarge
    },
    default: {
      header: styles.header,
      title: styles.headerTitle,
      subtitle: styles.headerSubtitle
    },
    compact: {
      header: styles.headerCompact,
      title: styles.headerTitleCompact,
      subtitle: styles.headerSubtitleCompact
    }
  }[variant];

  return (
    <View style={[variantStyles.header, style]}>
        <View style={styles.headerLeftRow}>
          {logo ? <Image source={logo} style={styles.logo} resizeMode="contain" /> : null}
          <View style={styles.headerLeft}>
            {title ? <Text style={[variantStyles.title, titleStyle]}>{title}</Text> : null}
            {subtitle ? <Text style={variantStyles.subtitle}>{subtitle}</Text> : null}
          </View>
        </View>
      <View style={styles.headerRight}>{rightElement}</View>
    </View>
  );
};

export default Header;

const styles = StyleSheet.create({
  header: {
    backgroundColor: '#2c3e50',
    padding: 18,
    paddingTop: 42,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderBottomLeftRadius: 12,
    borderBottomRightRadius: 12,
  },
  headerLarge: {
    backgroundColor: '#2c3e50',
    padding: 22,
    paddingTop: 56,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderBottomLeftRadius: 12,
    borderBottomRightRadius: 12,
  },
  headerCompact: {
    backgroundColor: '#2c3e50',
    padding: 12,
    paddingTop: 28,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderBottomLeftRadius: 8,
    borderBottomRightRadius: 8,
  },
  headerLeft: {
    flex: 1,
  },
  headerLeftRow: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  logo: {
    width: 150,
    height: 100,
    marginRight: 12,
    borderRadius: 8,
    backgroundColor: 'transparent'
  },
  headerTitle: {
    fontSize: 24,
    color: '#fff',
    fontWeight: '700',
  },
  headerTitleLarge: {
    fontSize: 15,
    color: '#fff',
    fontWeight: '800',
  },
  headerTitleCompact: {
    fontSize: 18,
    color: '#fff',
    fontWeight: '700',
  },
  headerSubtitle: {
    fontSize: 12,
    color: '#bdc3c7',
    marginTop: 4,
  },
  headerSubtitleLarge: {
    fontSize: 14,
    color: '#bdc3c7',
    marginTop: 6,
  },
  headerSubtitleCompact: {
    fontSize: 10,
    color: '#bdc3c7',
    marginTop: 2,
  },
  headerRight: {
    marginLeft: 12,
  }
});