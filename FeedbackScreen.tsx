import React, { useState } from 'react';
import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Button } from '../components/ui/Button';
import { Input } from '../components/ui/Input';
import { Card } from '../components/ui/Card';
import { useToast } from '../components/ui/ToastProvider';
import { SafeAreaView } from 'react-native-safe-area-context';

// Local feedback schema since shared might not be available
const feedbackSchema = {
  parse: (data: any) => {
    if (!data.name || !data.email || !data.message) {
      throw new Error('All fields are required');
    }
    return data;
  }
};

type FeedbackFormData = {
  name: string;
  email: string;
  message: string;
  rating?: number;
};

export const FeedbackScreen: React.FC = () => {
  const { showToast } = useToast();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const {
    control,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<FeedbackFormData>({
    defaultValues: {
      name: '',
      email: '',
      message: '',
      rating: undefined,
    },
  });

  const onSubmit = async (data: FeedbackFormData) => {
    if (isSubmitting) return; // Prevent double submission
    
    try {
      // Validate data
      if (!data.name?.trim()) {
        showToast({
          message: 'Please enter your name',
          type: 'error',
        });
        return;
      }
      
      if (!data.email?.trim()) {
        showToast({
          message: 'Please enter your email',
          type: 'error',
        });
        return;
      }
      
      if (!data.message?.trim()) {
        showToast({
          message: 'Please enter your feedback message',
          type: 'error',
        });
        return;
      }

      setIsSubmitting(true);
      
      // Simulate API call for now (replace with actual API call)
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      showToast({
        message: 'Thank you for your feedback!',
        type: 'success',
      });
      reset();
    } catch (error) {
      console.error('Feedback submission error:', error);
      showToast({
        message: 'Failed to send feedback. Please try again.',
        type: 'error',
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <KeyboardAvoidingView 
        style={styles.keyboardAvoid}
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      >
        <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
          <Card style={styles.card}>
            <Text style={styles.title}>Send Feedback</Text>
            <Text style={styles.subtitle}>
              We'd love to hear from you! Share your thoughts and suggestions.
            </Text>

            <Controller
              control={control}
              name="name"
              render={({ field: { onChange, onBlur, value } }) => (
                <Input
                  label="Name"
                  placeholder="Your name"
                  value={value}
                  onChangeText={onChange}
                  onBlur={onBlur}
                  error={errors.name?.message}
                  autoCapitalize="words"
                  editable={!isSubmitting}
                />
              )}
            />

            <Controller
              control={control}
              name="email"
              render={({ field: { onChange, onBlur, value } }) => (
                <Input
                  label="Email"
                  placeholder="your@email.com"
                  value={value}
                  onChangeText={onChange}
                  onBlur={onBlur}
                  error={errors.email?.message}
                  keyboardType="email-address"
                  autoCapitalize="none"
                  editable={!isSubmitting}
                />
              )}
            />

            <Controller
              control={control}
              name="rating"
              render={({ field: { onChange, onBlur, value } }) => (
                <Input
                  label="Rating (1-5)"
                  placeholder="Rate your experience (optional)"
                  value={value?.toString() || ''}
                  onChangeText={(text) => {
                    const num = parseInt(text, 10);
                    if (isNaN(num)) {
                      onChange(undefined);
                    } else if (num >= 1 && num <= 5) {
                      onChange(num);
                    }
                  }}
                  onBlur={onBlur}
                  error={errors.rating?.message}
                  keyboardType="numeric"
                  maxLength={1}
                  editable={!isSubmitting}
                />
              )}
            />

            <Controller
              control={control}
              name="message"
              render={({ field: { onChange, onBlur, value } }) => (
                <Input
                  label="Message"
                  placeholder="Share your feedback..."
                  value={value}
                  onChangeText={onChange}
                  onBlur={onBlur}
                  error={errors.message?.message}
                  multiline
                  numberOfLines={6}
                  style={styles.textArea}
                  editable={!isSubmitting}
                />
              )}
            />

            <Button
              title={isSubmitting ? 'Sending...' : 'Send Feedback'}
              onPress={handleSubmit(onSubmit)}
              loading={isSubmitting}
              disabled={isSubmitting}
              style={styles.submitButton}
            />
          </Card>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#F9FAFB',
  },
  keyboardAvoid: {
    flex: 1,
  },
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
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 16,
    color: '#6B7280',
    marginBottom: 24,
  },
  textArea: {
    height: 120,
    textAlignVertical: 'top',
  },
  submitButton: {
    marginTop: 8,
    backgroundColor: '#FF7A00',
  },
});
