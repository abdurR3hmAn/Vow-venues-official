import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
  TouchableOpacity,
  Switch,
  Alert,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import Icon from 'react-native-vector-icons/Ionicons';
import { Button } from '../components/ui/Button';
import { Input } from '../components/ui/Input';
import { Card } from '../components/ui/Card';
import { useToast } from '../components/ui/ToastProvider';
import { useMobileAuth } from '../contexts/MobileAuthContext';
import { loginUserSchema, type LoginUser } from '../types/schema';
import { type StackNavigationProp } from '@react-navigation/stack';
import { type AuthStackParamList } from '../navigation/types';

type LoginScreenNavigationProp = StackNavigationProp<AuthStackParamList, 'Login'>;

export const LoginScreen: React.FC = () => {
  const navigation = useNavigation<LoginScreenNavigationProp>();
  const { showToast } = useToast();
  const {
    login,
    loginWithBiometric,
    isLoading,
    isBiometricAvailable,
    isBiometricEnabled,
    biometricType,
    rememberMe,
    setRememberMe,
    error,
    clearError,
  } = useMobileAuth();

  const [localRememberMe, setLocalRememberMe] = useState(rememberMe);

  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginUser>({
    resolver: zodResolver(loginUserSchema),
    defaultValues: {
      username: '',
      password: '',
    },
  });

  // Clear error when component mounts
  useEffect(() => {
    clearError();
  }, []);

  const onSubmit = async (data: LoginUser) => {
    try {
      await login(data, localRememberMe);
      showToast({
        message: 'Welcome back!',
        type: 'success',
      });
    } catch (error: any) {
      showToast({
        message: error?.message || 'Login failed. Please check your credentials.',
        type: 'error',
      });
    }
  };

  const handleBiometricLogin = async () => {
    try {
      await loginWithBiometric();
      showToast({
        message: 'Welcome back!',
        type: 'success',
      });
    } catch (error) {
      Alert.alert(
        'Biometric Authentication Failed',
        'Please try again or use your password.',
        [{ text: 'OK' }]
      );
    }
  };

  const getBiometricIcon = () => {
    switch (biometricType) {
      case 'FaceID':
        return 'face-recognition';
      case 'TouchID':
      case 'Fingerprint':
        return 'finger-print';
      default:
        return 'lock-closed';
    }
  };

  const getBiometricText = () => {
    switch (biometricType) {
      case 'FaceID':
        return 'Sign in with Face ID';
      case 'TouchID':
        return 'Sign in with Touch ID';
      case 'Fingerprint':
        return 'Sign in with Fingerprint';
      default:
        return 'Sign in with Biometrics';
    }
  };

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
    >
      <ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.header}>
          <Text style={styles.title}>Welcome Back</Text>
          <Text style={styles.subtitle}>Sign in to your account</Text>
        </View>

        <Card style={styles.formCard}>
          <Controller
            control={control}
            name="username"
            render={({ field: { onChange, onBlur, value } }) => (
              <Input
                label="Username"
                placeholder="Enter your username"
                value={value}
                onChangeText={onChange}
                onBlur={onBlur}
                error={errors.username?.message}
                autoCapitalize="none"
              />
            )}
          />

          <Controller
            control={control}
            name="password"
            render={({ field: { onChange, onBlur, value } }) => (
              <Input
                label="Password"
                placeholder="Enter your password"
                value={value}
                onChangeText={onChange}
                onBlur={onBlur}
                error={errors.password?.message}
                secureTextEntry
              />
            )}
          />

          {/* Remember Me Toggle */}
          <View style={styles.rememberMeContainer}>
            <Text style={styles.rememberMeLabel}>Remember me</Text>
            <Switch
              value={localRememberMe}
              onValueChange={setLocalRememberMe}
              trackColor={{ false: '#E5E7EB', true: '#007AFF' }}
              thumbColor={localRememberMe ? '#FFFFFF' : '#F3F4F6'}
            />
          </View>

          <Button
            title={isLoading ? 'Signing In...' : 'Sign In'}
            onPress={handleSubmit(onSubmit)}
            loading={isLoading}
            style={styles.loginButton}
          />

          {/* Biometric Login */}
          {isBiometricAvailable && isBiometricEnabled && (
            <View style={styles.biometricContainer}>
              <View style={styles.divider}>
                <View style={styles.dividerLine} />
                <Text style={styles.dividerText}>or</Text>
                <View style={styles.dividerLine} />
              </View>

              <TouchableOpacity
                style={styles.biometricButton}
                onPress={handleBiometricLogin}
                disabled={isLoading}
              >
                <Icon
                  name={getBiometricIcon()}
                  size={24}
                  color="#007AFF"
                  style={styles.biometricIcon}
                />
                <Text style={styles.biometricText}>{getBiometricText()}</Text>
              </TouchableOpacity>
            </View>
          )}
        </Card>

        <View style={styles.footer}>
          <Text style={styles.footerText}>Don't have an account?</Text>
          <Button
            title="Create Account"
            onPress={() => navigation.navigate('Register')}
            variant="outline"
            style={styles.registerButton}
          />
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F9FAFB',
  },
  scrollContent: {
    flexGrow: 1,
    justifyContent: 'center',
    padding: 16,
  },
  header: {
    alignItems: 'center',
    marginBottom: 32,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#111827',
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 16,
    color: '#6B7280',
  },
  formCard: {
    marginBottom: 24,
  },
  loginButton: {
    marginTop: 8,
  },
  footer: {
    alignItems: 'center',
  },
  footerText: {
    fontSize: 14,
    color: '#6B7280',
    marginBottom: 16,
  },
  registerButton: {
    paddingHorizontal: 32,
  },
  rememberMeContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  rememberMeLabel: {
    fontSize: 16,
    color: '#374151',
  },
  biometricContainer: {
    marginTop: 16,
  },
  divider: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  dividerLine: {
    flex: 1,
    height: 1,
    backgroundColor: '#E5E7EB',
  },
  dividerText: {
    marginHorizontal: 16,
    fontSize: 14,
    color: '#6B7280',
  },
  biometricButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderWidth: 1,
    borderColor: '#007AFF',
    borderRadius: 8,
    backgroundColor: 'transparent',
  },
  biometricIcon: {
    marginRight: 8,
  },
  biometricText: {
    fontSize: 16,
    color: '#007AFF',
    fontWeight: '500',
  },
});
