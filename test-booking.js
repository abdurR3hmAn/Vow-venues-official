const testBooking = async () => {
  try {
    const response = await fetch('http://localhost:3001/api/bookings', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        venueId: '68a48ebd14e5a787c1b33cb9', // Haleem Banquet venue ID
        customerName: 'Test Customer',
        customerEmail: 'test@example.com',
        customerPhone: '+92300123456',
        eventDate: '2025-12-25',
        guestCount: 100,
        eventType: 'wedding',
        specialRequirements: 'Need stage decoration'
      }),
    });

    const result = await response.json();
    console.log('Booking API Response:', result);
    
    if (result.success) {
      console.log('✅ Booking submitted successfully!');
      console.log('Booking ID:', result.bookingId);
      console.log('Note: Check console logs for email sending status');
    } else {
      console.log('❌ Booking failed:', result.message);
    }
  } catch (error) {
    console.error('❌ Error testing booking:', error);
  }
};

testBooking();
