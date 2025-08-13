import fetch from 'node-fetch';

const testRegistration = async () => {
  try {
    const response = await fetch('http://localhost:3000/api/auth/register', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        username: 'testuser',
        password: 'testpass',
        name: 'Test User',
        email: 'test@example.com'
      })
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.log('Registration failed:', response.status, errorText);
      return;
    }

    const result = await response.json();
    console.log('Registration successful:', result);
  } catch (error) {
    console.error('Error testing registration:', error.message);
  }
};

testRegistration();
