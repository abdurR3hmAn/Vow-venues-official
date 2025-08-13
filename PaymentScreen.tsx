import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Alert,
  Linking,
} from 'react-native';
import { useRoute, useNavigation } from '@react-navigation/native';
import Icon from 'react-native-vector-icons/Ionicons';
import { Button } from '../components/ui/Button';
import { Card } from '../components/ui/Card';
import { Input } from '../components/ui/Input';
import { LoadingSpinner } from '../components/ui/LoadingSpinner';
import { useToast } from '../components/ui/ToastProvider';
import { useMobileVenue } from '../hooks/useMobileApi';
import { formatPrice } from '../utils/venueUtils';
import { SharingService } from '../services/SharingService';
import { type PaymentScreenProps } from '../navigation/types';

interface PaymentMethod {
  id: string;
  name: string;
  icon: string;
  description: string;
  available: boolean;
}

export const PaymentScreen: React.FC = () => {
  const route = useRoute<PaymentScreenProps['route']>();
  const navigation = useNavigation<PaymentScreenProps['navigation']>();
  const { showToast } = useToast();
  const { venueId, bookingData } = route.params;

  const { data: venue, isLoading, error } = useMobileVenue(venueId);
  const [selectedPaymentMethod, setSelectedPaymentMethod] = useState<string>('');
  const [isProcessing, setIsProcessing] = useState(false);
  const [cardDetails, setCardDetails] = useState({
    number: '',
    expiry: '',
    cvv: '',
    name: '',
  });

  const paymentMethods: PaymentMethod[] = [
    {
      id: 'card',
      name: 'Credit/Debit Card',
      icon: 'card',
      description: 'Visa, Mastercard, American Express',
      available: true,
    },
    {
      id: 'easypaisa',
      name: 'EasyPaisa',
      icon: 'phone-portrait',
      description: 'Mobile wallet payment',
      available: true,
    },
    {
      id: 'jazzcash',
      name: 'JazzCash',
      icon: 'phone-portrait',
      description: 'Mobile wallet payment',
      available: true,
    },
    {
      id: 'bank',
      name: 'Bank Transfer',
      icon: 'business',
      description: 'Direct bank transfer',
      available: true,
    },
    {
      id: 'cash',
      name: 'Cash Payment',
      icon: 'cash',
      description: 'Pay at venue',
      available: true,
    },
  ];

  if (isLoading) {
    return <LoadingSpinner text="Loading payment details..." />;
  }

  const handlePaymentMethodSelect = (methodId: string) => {
    setSelectedPaymentMethod(methodId);
  };

  const handlePayment = async () => {
    if (!selectedPaymentMethod) {
      Alert.alert('Payment Method Required', 'Please select a payment method to continue.');
      return;
    }

    setIsProcessing(true);

    try {
      switch (selectedPaymentMethod) {
        case 'card':
          await processCardPayment();
          break;
        case 'easypaisa':
        case 'jazzcash':
          await processMobileWalletPayment(selectedPaymentMethod);
          break;
        case 'bank':
          await processBankTransfer();
          break;
        case 'cash':
          await processCashPayment();
          break;
        default:
          throw new Error('Invalid payment method');
      }
    } catch (error) {
      showToast({
        message: 'Payment failed. Please try again.',
        type: 'error',
      });
    } finally {
      setIsProcessing(false);
    }
  };

  const processCardPayment = async () => {
    // Simulate card payment processing
    await new Promise(resolve => setTimeout(resolve, 2000));

    Alert.alert(
      'Payment Successful',
      'Your booking has been confirmed! You will receive a confirmation email shortly.',
      [
        {
          text: 'OK',
          onPress: () => navigation.navigate('Main'),
        },
      ]
    );
  };

  const processMobileWalletPayment = async (method: string) => {
    const phoneNumber = method === 'easypaisa' ? '03001234567' : '03009876543';

    Alert.alert(
      `${method === 'easypaisa' ? 'EasyPaisa' : 'JazzCash'} Payment`,
      `You will be redirected to ${method === 'easypaisa' ? 'EasyPaisa' : 'JazzCash'} to complete the payment.`,
      [
        {
          text: 'Cancel',
          style: 'cancel',
        },
        {
          text: 'Continue',
          onPress: async () => {
            // In a real app, you would integrate with the actual payment gateway
            showToast({
              message: 'Redirecting to payment gateway...',
              type: 'info',
            });

            // Simulate payment completion
            setTimeout(() => {
              Alert.alert(
                'Payment Successful',
                'Your booking has been confirmed!',
                [{ text: 'OK', onPress: () => navigation.navigate('Main') }]
              );
            }, 3000);
          },
        },
      ]
    );
  };

  const processBankTransfer = async () => {
    const bankDetails = `
Bank: HBL
Account Title: Vow Venues
Account Number: 1234567890
IBAN: PK36HABB0000001234567890
    `;

    Alert.alert(
      'Bank Transfer Details',
      `Please transfer the amount to the following account:${bankDetails}`,
      [
        {
          text: 'Copy Details',
          onPress: () => {
            // In a real app, you would copy to clipboard
            showToast({
              message: 'Bank details copied to clipboard',
              type: 'success',
            });
          },
        },
        {
          text: 'Share Details',
          onPress: () => {
            SharingService.shareText(
              `Bank Transfer Details for Venue Booking:${bankDetails}`,
              'Bank Transfer Details'
            );
          },
        },
        {
          text: 'OK',
          onPress: () => navigation.navigate('Main'),
        },
      ]
    );
  };

  const processCashPayment = async () => {
    Alert.alert(
      'Cash Payment',
      'You have selected to pay at the venue. Please contact the venue directly to confirm your booking and payment arrangements.',
      [
        {
          text: 'Call Venue',
          onPress: () => {
            Linking.openURL(`tel:${venue.phone}`);
          },
        },
        {
          text: 'OK',
          onPress: () => navigation.navigate('Main'),
        },
      ]
    );
  };

  if (error || !venue) {
    return (
      <View style={styles.errorContainer}>
        <Text style={styles.errorTitle}>Venue not found</Text>
        <Button
          title="Go Back"
          onPress={() => navigation.goBack()}
          style={styles.errorButton}
        />
      </View>
    );
  }

  return (
    <ScrollView style={styles.container}>
      <Card style={styles.card}>
        <View style={styles.header}>
          <Icon name="card" size={24} color="#007AFF" />
          <View style={styles.headerText}>
            <Text style={styles.title}>Payment</Text>
            <Text style={styles.subtitle}>Complete your booking payment</Text>
          </View>
        </View>

        {/* Booking Summary */}
        <Card style={styles.summaryCard}>
          <Text style={styles.summaryTitle}>Booking Summary</Text>
          <View style={styles.summaryRow}>
            <Text style={styles.summaryLabel}>Venue:</Text>
            <Text style={styles.summaryValue}>{venue.name}</Text>
          </View>
          <View style={styles.summaryRow}>
            <Text style={styles.summaryLabel}>Date:</Text>
            <Text style={styles.summaryValue}>{bookingData?.date || 'TBD'}</Text>
          </View>
          <View style={styles.summaryRow}>
            <Text style={styles.summaryLabel}>Guests:</Text>
            <Text style={styles.summaryValue}>{bookingData?.guests || 'TBD'}</Text>
          </View>
          <View style={[styles.summaryRow, styles.totalRow]}>
            <Text style={styles.totalLabel}>Total:</Text>
            <Text style={styles.totalValue}>{formatPrice(venue.price)}</Text>
          </View>
        </Card>

        {/* Payment Methods */}
        <View style={styles.paymentMethods}>
          <Text style={styles.sectionTitle}>Select Payment Method</Text>

          {paymentMethods.map((method) => (
            <TouchableOpacity
              key={method.id}
              style={[
                styles.paymentMethod,
                selectedPaymentMethod === method.id && styles.paymentMethodSelected,
                !method.available && styles.paymentMethodDisabled,
              ]}
              onPress={() => method.available && handlePaymentMethodSelect(method.id)}
              disabled={!method.available}
            >
              <View style={styles.paymentMethodContent}>
                <Icon
                  name={method.icon}
                  size={24}
                  color={selectedPaymentMethod === method.id ? "#007AFF" : "#6B7280"}
                />
                <View style={styles.paymentMethodText}>
                  <Text style={[
                    styles.paymentMethodName,
                    selectedPaymentMethod === method.id && styles.paymentMethodNameSelected
                  ]}>
                    {method.name}
                  </Text>
                  <Text style={styles.paymentMethodDescription}>
                    {method.description}
                  </Text>
                </View>
              </View>
              {selectedPaymentMethod === method.id && (
                <Icon name="checkmark-circle" size={24} color="#007AFF" />
              )}
            </TouchableOpacity>
          ))}
        </View>

        {/* Card Details Form (only show if card is selected) */}
        {selectedPaymentMethod === 'card' && (
          <Card style={styles.cardForm}>
            <Text style={styles.cardFormTitle}>Card Details</Text>
            <Input
              label="Card Number"
              placeholder="1234 5678 9012 3456"
              value={cardDetails.number}
              onChangeText={(text) => setCardDetails(prev => ({ ...prev, number: text }))}
              keyboardType="numeric"
            />
            <View style={styles.cardRow}>
              <Input
                label="Expiry Date"
                placeholder="MM/YY"
                value={cardDetails.expiry}
                onChangeText={(text) => setCardDetails(prev => ({ ...prev, expiry: text }))}
                containerStyle={styles.cardInput}
              />
              <Input
                label="CVV"
                placeholder="123"
                value={cardDetails.cvv}
                onChangeText={(text) => setCardDetails(prev => ({ ...prev, cvv: text }))}
                keyboardType="numeric"
                containerStyle={styles.cardInput}
              />
            </View>
            <Input
              label="Cardholder Name"
              placeholder="John Doe"
              value={cardDetails.name}
              onChangeText={(text) => setCardDetails(prev => ({ ...prev, name: text }))}
            />
          </Card>
        )}

        <View style={styles.actions}>
          <Button
            title={isProcessing ? 'Processing...' : 'Complete Payment'}
            onPress={handlePayment}
            loading={isProcessing}
            disabled={!selectedPaymentMethod}
            style={styles.payButton}
          />
          <Button
            title="Cancel"
            onPress={() => navigation.goBack()}
            variant="outline"
            style={styles.cancelButton}
          />
        </View>
      </Card>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F9FAFB',
  },
  card: {
    margin: 16,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 24,
  },
  headerText: {
    marginLeft: 12,
    flex: 1,
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#111827',
    marginBottom: 4,
  },
  subtitle: {
    fontSize: 14,
    color: '#6B7280',
  },
  summaryCard: {
    backgroundColor: '#F8FAFC',
    marginBottom: 24,
  },
  summaryTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#111827',
    marginBottom: 16,
  },
  summaryRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 8,
    borderBottomWidth: 1,
    borderBottomColor: '#E5E7EB',
  },
  summaryLabel: {
    fontSize: 14,
    color: '#6B7280',
  },
  summaryValue: {
    fontSize: 14,
    color: '#111827',
    fontWeight: '500',
  },
  totalRow: {
    borderBottomWidth: 0,
    paddingTop: 16,
    marginTop: 8,
    borderTopWidth: 2,
    borderTopColor: '#E5E7EB',
  },
  totalLabel: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#111827',
  },
  totalValue: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#007AFF',
  },
  paymentMethods: {
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#111827',
    marginBottom: 16,
  },
  paymentMethod: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 16,
    borderWidth: 1,
    borderColor: '#E5E7EB',
    borderRadius: 8,
    marginBottom: 12,
    backgroundColor: '#FFFFFF',
  },
  paymentMethodSelected: {
    borderColor: '#007AFF',
    backgroundColor: '#F0F9FF',
  },
  paymentMethodDisabled: {
    opacity: 0.5,
  },
  paymentMethodContent: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  paymentMethodText: {
    marginLeft: 12,
    flex: 1,
  },
  paymentMethodName: {
    fontSize: 16,
    fontWeight: '600',
    color: '#111827',
    marginBottom: 2,
  },
  paymentMethodNameSelected: {
    color: '#007AFF',
  },
  paymentMethodDescription: {
    fontSize: 14,
    color: '#6B7280',
  },
  cardForm: {
    marginBottom: 24,
    backgroundColor: '#F8FAFC',
  },
  cardFormTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#111827',
    marginBottom: 16,
  },
  cardRow: {
    flexDirection: 'row',
    gap: 12,
  },
  cardInput: {
    flex: 1,
  },
  actions: {
    gap: 12,
  },
  payButton: {
    marginBottom: 8,
  },
  cancelButton: {
    marginBottom: 16,
  },
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 32,
  },
  errorTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#EF4444',
    marginBottom: 24,
  },
  errorButton: {
    paddingHorizontal: 32,
  },
});
