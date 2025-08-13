import React from 'react';
import {
  View,
  Text,
  ScrollView,
  StyleSheet,
} from 'react-native';
import { Card } from '../components/ui/Card';

export const AboutScreen: React.FC = () => {
  return (
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
      <Card style={styles.card}>
        <Text style={styles.title}>About Vow Venues</Text>
        <Text style={styles.content}>
          Vow Venues is your premier destination for finding the perfect wedding venue. 
          We specialize in connecting couples with beautiful, reliable venues for their special day.
        </Text>
        <Text style={styles.content}>
          Our curated collection features venues across Pakistan, each carefully selected 
          for quality, service, and unforgettable experiences.
        </Text>
      </Card>
      
      <Card style={styles.card}>
        <Text style={styles.sectionTitle}>Our Mission</Text>
        <Text style={styles.content}>
          To make wedding venue booking simple, transparent, and stress-free for couples 
          planning their dream wedding.
        </Text>
      </Card>
      
      <Card style={styles.card}>
        <Text style={styles.sectionTitle}>Contact Us</Text>
        <Text style={styles.content}>
          Email: info@vowvenues.com{'\n'}
          Phone: +92 300 1234567{'\n'}
          Address: Peshawar, Pakistan
        </Text>
      </Card>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F9FAFB',
    padding: 16,
  },
  card: {
    marginBottom: 16,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#111827',
    marginBottom: 16,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#111827',
    marginBottom: 12,
  },
  content: {
    fontSize: 16,
    color: '#374151',
    lineHeight: 24,
    marginBottom: 12,
  },
});
