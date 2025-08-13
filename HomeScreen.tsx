import React from 'react';
import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  Dimensions,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';
import { Card } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import { useMobileAuth } from '../contexts/MobileAuthContext';
import { NearbyVenues } from '../components/NearbyVenues';
import { ResponsiveUtils } from '../utils/responsive';
import { type HomeScreenNavigationProp } from '../navigation/types';

const { width } = Dimensions.get('window');

interface FeatureCardProps {
  icon: string;
  title: string;
  description: string;
  onPress: () => void;
}

const FeatureCard: React.FC<FeatureCardProps> = ({
  icon,
  title,
  description,
  onPress,
}) => (
  <Card style={styles.featureCard} onPress={onPress}>
    <Text style={styles.featureIcon}>{icon}</Text>
    <Text style={styles.featureTitle}>{title}</Text>
    <Text style={styles.featureDescription}>{description}</Text>
  </Card>
);

export const HomeScreen: React.FC = () => {
  const navigation = useNavigation<HomeScreenNavigationProp>();
  const { user } = useMobileAuth();

  const handleExploreVenues = () => {
    navigation.navigate('Venues');
  };

  const handleSignIn = () => {
    // TODO: Navigate to auth flow when auth navigation is properly set up
    console.log('Navigate to auth');
  };

  const handleLearnMore = () => {
    navigation.navigate('About');
  };

  const features = [
    {
      icon: '🔍',
      title: 'Easy Search',
      description: 'Find your perfect wedding venue with our advanced search and filtering system',
      onPress: () => navigation.navigate('Venues'),
    },
    {
      icon: '📅',
      title: 'Availability Check',
      description: 'Check real-time availability and book your preferred date instantly',
      onPress: () => navigation.navigate('Venues'),
    },
    {
      icon: '💖',
      title: 'Curated Venues',
      description: 'Handpicked selection of the most beautiful and reliable wedding venues',
      onPress: () => navigation.navigate('Venues'),
    },
    {
      icon: '📍',
      title: 'Location Services',
      description: 'Get directions and explore venues in your preferred location',
      onPress: () => navigation.navigate('Venues'),
    },
  ];

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
        {/* Hero Section */}
        <View style={styles.hero}>
          <View style={styles.heroImageContainer}>
            <View style={styles.heroImagePlaceholder}>
              <Text style={styles.heroImageText}>🏛️</Text>
            </View>
          </View>
          <View style={styles.heroOverlay}>
            <View style={styles.heroContent}>
              <Text style={styles.heroTitle}>
                Your Perfect Wedding Venue Awaits
              </Text>
              <Text style={styles.heroSubtitle}>
                Discover and book the most beautiful wedding venues for your special day.
              </Text>
              <View style={styles.heroButtons}>
                {user ? (
                  <Button
                    title="Explore Venues"
                    onPress={handleExploreVenues}
                    variant="primary"
                    size="large"
                    style={styles.primaryButton}
                  />
                ) : (
                  <Button
                    title="Sign In to Explore"
                    onPress={handleSignIn}
                    variant="primary"
                    size="large"
                    style={styles.primaryButton}
                  />
                )}
                <Button
                  title="Learn More"
                  onPress={handleLearnMore}
                  variant="secondary"
                  size="large"
                  style={styles.secondaryButton}
                />
              </View>
            </View>
          </View>
        </View>

      {/* Welcome Message */}
      {user && (
        <Card style={styles.welcomeCard}>
          <Text style={styles.welcomeTitle}>Welcome back, {user.name}!</Text>
          <Text style={styles.welcomeText}>
            Ready to find your dream venue? Start exploring our curated collection.
          </Text>
        </Card>
      )}

      {/* Features Section */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Why Choose Vow Venues?</Text>
        <View style={styles.featuresGrid}>
          {features.map((feature, index) => (
            <FeatureCard
              key={index}
              icon={feature.icon}
              title={feature.title}
              description={feature.description}
              onPress={feature.onPress}
            />
          ))}
        </View>
      </View>

      {/* Nearby Venues Section */}
      {user && (
        <View style={styles.nearbySection}>
          <NearbyVenues
            maxDistance={25}
            limit={5}
            showHeader={true}
          />
        </View>
      )}

        {/* CTA Section */}
        <View style={styles.ctaSection}>
          <Text style={styles.ctaTitle}>Ready to Find Your Dream Venue?</Text>
          <Text style={styles.ctaSubtitle}>
            Join thousands of couples who have found their perfect wedding venue through our platform.
          </Text>
          {user ? (
            <Button
              title="Start Your Search"
              onPress={handleExploreVenues}
              variant="primary"
              size="large"
              style={styles.ctaButton}
            />
          ) : (
            <Button
              title="Sign In to Start"
              onPress={handleSignIn}
              variant="primary"
              size="large"
              style={styles.ctaButton}
            />
          )}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  scrollView: {
    flex: 1,
  },

  // Hero Section
  hero: {
    height: ResponsiveUtils.getHeightPercentage(60),
    position: 'relative',
  },
  heroImageContainer: {
    width: '100%',
    height: '100%',
    position: 'absolute',
  },
  heroImagePlaceholder: {
    width: '100%',
    height: '100%',
    backgroundColor: '#007AFF',
    justifyContent: 'center',
    alignItems: 'center',
  },
  heroImageText: {
    fontSize: ResponsiveUtils.getFontSize(80),
    opacity: 0.3,
  },
  heroOverlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  heroContent: {
    paddingHorizontal: ResponsiveUtils.getContainerPadding(),
    alignItems: 'center',
    maxWidth: width - 40,
  },
  heroTitle: {
    fontSize: ResponsiveUtils.getFontSize(28),
    fontWeight: 'bold',
    color: '#FFFFFF',
    textAlign: 'center',
    marginBottom: ResponsiveUtils.getSpacing(16),
    lineHeight: ResponsiveUtils.getFontSize(34),
  },
  heroSubtitle: {
    fontSize: ResponsiveUtils.getFontSize(16),
    color: 'rgba(255, 255, 255, 0.9)',
    textAlign: 'center',
    marginBottom: ResponsiveUtils.getSpacing(24),
    lineHeight: ResponsiveUtils.getFontSize(22),
  },
  heroButtons: {
    width: '100%',
    gap: ResponsiveUtils.getSpacing(12),
  },
  primaryButton: {
    marginBottom: ResponsiveUtils.getSpacing(8),
  },
  secondaryButton: {
    backgroundColor: '#6B7280',
  },
  welcomeCard: {
    margin: ResponsiveUtils.getSpacing(16),
    backgroundColor: '#E7F3FF',
    borderColor: '#007AFF',
    borderWidth: 1,
  },
  welcomeTitle: {
    fontSize: ResponsiveUtils.getFontSize(18),
    fontWeight: 'bold',
    color: '#007AFF',
    marginBottom: ResponsiveUtils.getSpacing(8),
  },
  welcomeText: {
    fontSize: ResponsiveUtils.getFontSize(14),
    color: '#374151',
    lineHeight: ResponsiveUtils.getFontSize(20),
  },

  // Nearby Venues Section
  nearbySection: {
    backgroundColor: '#FFFFFF',
    marginVertical: ResponsiveUtils.getSpacing(16),
  },

  // Features Section
  section: {
    paddingVertical: ResponsiveUtils.getSpacing(32),
    paddingHorizontal: ResponsiveUtils.getContainerPadding(),
    backgroundColor: '#F9FAFB',
  },
  sectionTitle: {
    fontSize: ResponsiveUtils.getFontSize(24),
    fontWeight: 'bold',
    color: '#111827',
    textAlign: 'center',
    marginBottom: ResponsiveUtils.getSpacing(24),
  },
  featuresGrid: {
    gap: ResponsiveUtils.getSpacing(16),
  },
  featureCard: {
    alignItems: 'center',
    padding: ResponsiveUtils.getSpacing(24),
    backgroundColor: '#FFFFFF',
  },
  featureIcon: {
    fontSize: ResponsiveUtils.getFontSize(32),
    marginBottom: ResponsiveUtils.getSpacing(12),
  },
  featureTitle: {
    fontSize: ResponsiveUtils.getFontSize(18),
    fontWeight: '600',
    color: '#111827',
    marginBottom: ResponsiveUtils.getSpacing(8),
    textAlign: 'center',
  },
  featureDescription: {
    fontSize: ResponsiveUtils.getFontSize(14),
    color: '#6B7280',
    textAlign: 'center',
    lineHeight: ResponsiveUtils.getFontSize(20),
  },

  // CTA Section
  ctaSection: {
    paddingVertical: ResponsiveUtils.getSpacing(40),
    paddingHorizontal: ResponsiveUtils.getContainerPadding(),
    backgroundColor: '#111827',
    alignItems: 'center',
  },
  ctaTitle: {
    fontSize: ResponsiveUtils.getFontSize(24),
    fontWeight: 'bold',
    color: '#FFFFFF',
    textAlign: 'center',
    marginBottom: ResponsiveUtils.getSpacing(16),
    lineHeight: ResponsiveUtils.getFontSize(30),
  },
  ctaSubtitle: {
    fontSize: ResponsiveUtils.getFontSize(16),
    color: 'rgba(255, 255, 255, 0.8)',
    textAlign: 'center',
    marginBottom: ResponsiveUtils.getSpacing(24),
    lineHeight: ResponsiveUtils.getFontSize(22),
  },
  ctaButton: {
    backgroundColor: '#FFFFFF',
    borderColor: '#FFFFFF',
  },
});
