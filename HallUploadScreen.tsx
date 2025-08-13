import React from 'react';
import { View, Text, StyleSheet, ScrollView, SafeAreaView } from 'react-native';
import HallFileUpload from '../components/HallFileUpload';
import { useMobileAuth } from '../contexts/MobileAuthContext';

const HallUploadScreen: React.FC = () => {
  const { isAuthenticated } = useMobileAuth();

  return (
    <SafeAreaView style={styles.safeArea}>
      <ScrollView contentContainerStyle={styles.scrollContainer}>
        <View style={styles.container}>
          <Text style={styles.header}>Hall Data Upload</Text>
          
          {isAuthenticated ? (
            <>
              <Text style={styles.subheader}>
                Upload your hall.txt file to add venue data to the system
              </Text>
              <HallFileUpload />
            </>
          ) : (
            <View style={styles.authRequiredContainer}>
              <Text style={styles.authRequiredText}>
                Please log in to upload hall data
              </Text>
            </View>
          )}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#f8f9fa',
  },
  scrollContainer: {
    flexGrow: 1,
  },
  container: {
    flex: 1,
    padding: 16,
  },
  header: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 8,
    color: '#333',
  },
  subheader: {
    fontSize: 16,
    color: '#666',
    marginBottom: 24,
  },
  authRequiredContainer: {
    padding: 24,
    backgroundColor: '#fff',
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 32,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  authRequiredText: {
    fontSize: 16,
    color: '#666',
    textAlign: 'center',
  },
});

export default HallUploadScreen;