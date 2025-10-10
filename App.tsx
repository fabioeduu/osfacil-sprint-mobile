import { StatusBar } from 'expo-status-bar';
import React from 'react';
import { StyleSheet, View } from 'react-native';
import { AppProvider } from './context/AppContext';
import { NotificationProvider } from './context/NotificationContext';
import AppNavigator from './navigation/AppNavigator';
import Footer from './components/Footer';

export default function App() {
  return (
    <AppProvider>
      <View style={styles.container}>
        <NotificationProvider>
          <View style={styles.contentWrapper}>
            <AppNavigator />
          </View>
        </NotificationProvider>
        <Footer />
        <StatusBar style="auto" />
      </View>
    </AppProvider>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8f9fa',
  },
  header: {
    backgroundColor: '#2c3e50',
    padding: 30,
    paddingTop: 60,
    alignItems: 'center',
  },
  headerText: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#fff',
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 16,
    color: '#bdc3c7',
  },
  content: {
    flex: 1,
    padding: 30,
    alignItems: 'center',
    justifyContent: 'center',
  },
  contentWrapper: {
    flex: 1,
  },
  iconContainer: {
    marginBottom: 30,
  },
  button: {
    backgroundColor: '#3498db',
    paddingHorizontal: 40,
    paddingVertical: 15,
    borderRadius: 25,
    marginBottom: 40,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 5,
  },
  buttonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: '600',
  },
  features: {
    alignItems: 'flex-start',
  },
  featuresTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#2c3e50',
    marginBottom: 15,
  },
  feature: {
    fontSize: 16,
    color: '#7f8c8d',
    marginBottom: 8,
  },
});
