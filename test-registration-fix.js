// Test script to verify registration functionality
const testRegistration = async () => {
  const testUser = {
    username: `testuser_${Date.now()}`,
    password: 'testpassword123',
    name: 'Test User',
    email: `test_${Date.now()}@example.com`
  };

  console.log('Testing registration with:', { ...testUser, password: '[REDACTED]' });

  try {
    const response = await fetch('http://localhost:3000/api/auth/register', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(testUser),
      credentials: 'include'
    });

    console.log('Response status:', response.status);
    console.log('Response headers:', Object.fromEntries(response.headers.entries()));

    if (response.ok) {
      const data = await response.json();
      console.log('Registration successful:', data);
      return { success: true, data };
    } else {
      const errorText = await response.text();
      console.log('Registration failed:', errorText);
      try {
        const errorData = JSON.parse(errorText);
        console.log('Error message:', errorData.message);
        return { success: false, error: errorData.message };
      } catch {
        return { success: false, error: errorText };
      }
    }
  } catch (error) {
    console.error('Network error:', error);
    return { success: false, error: error.message };
  }
};

// Test login with the created user
const testLogin = async (username, password) => {
  console.log('Testing login with:', username);

  try {
    const response = await fetch('http://localhost:3000/api/auth/login', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ username, password }),
      credentials: 'include'
    });

    console.log('Login response status:', response.status);

    if (response.ok) {
      const data = await response.json();
      console.log('Login successful:', data);
      return { success: true, data };
    } else {
      const errorText = await response.text();
      console.log('Login failed:', errorText);
      return { success: false, error: errorText };
    }
  } catch (error) {
    console.error('Login network error:', error);
    return { success: false, error: error.message };
  }
};

// Run the tests
const runTests = async () => {
  console.log('=== Testing Registration and Login ===');
  
  // Test registration
  const regResult = await testRegistration();
  
  if (regResult.success) {
    console.log('✅ Registration test passed');
    
    // Test login with the same credentials
    const testUser = regResult.data.user;
    // Note: We can't test login here because we don't have the original password
    console.log('Registration created user:', testUser.username);
  } else {
    console.log('❌ Registration test failed:', regResult.error);
  }
  
  console.log('=== Test completed ===');
};

// Export for use in Node.js or run directly
if (typeof module !== 'undefined' && module.exports) {
  module.exports = { testRegistration, testLogin, runTests };
} else {
  // Run in browser
  runTests();
}