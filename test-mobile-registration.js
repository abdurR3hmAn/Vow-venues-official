/**
 * Simple test to verify mobile app registration works with server
 */

const axios = require('axios');

const SERVER_URL = 'http://localhost:3000';

async function testHealth() {
  try {
    console.log('Testing server health...');
    const response = await axios.get(`${SERVER_URL}/api/health`);
    console.log('✅ Server health:', response.data);
    return true;
  } catch (error) {
    console.error('❌ Server health check failed:', error.message);
    return false;
  }
}

async function testRegistration() {
  try {
    console.log('Testing registration...');
    
    const testUser = {
      username: 'testuser_' + Date.now(),
      password: 'testpass123',
      name: 'Test User',
      email: 'test_' + Date.now() + '@example.com'
    };

    const response = await axios.post(`${SERVER_URL}/api/auth/register`, testUser, {
      headers: {
        'Content-Type': 'application/json'
      },
      withCredentials: true
    });

    console.log('✅ Registration successful:', {
      status: response.status,
      user: response.data.user.username,
      message: response.data.message
    });
    
    return response.data.user;
  } catch (error) {
    console.error('❌ Registration failed:', {
      status: error.response?.status,
      message: error.response?.data?.message || error.message
    });
    return null;
  }
}

async function testLogin() {
  try {
    console.log('Testing login...');
    
    const loginData = {
      username: 'testuser',
      password: 'testpass123'
    };

    const response = await axios.post(`${SERVER_URL}/api/auth/login`, loginData, {
      headers: {
        'Content-Type': 'application/json'
      },
      withCredentials: true
    });

    console.log('✅ Login successful:', {
      status: response.status,
      user: response.data.user.username,
      message: response.data.message
    });
    
    return response.data.user;
  } catch (error) {
    console.error('❌ Login failed:', {
      status: error.response?.status,
      message: error.response?.data?.message || error.message
    });
    return null;
  }
}

async function runTests() {
  console.log('🚀 Starting mobile app server tests...\n');
  
  const healthOk = await testHealth();
  if (!healthOk) {
    console.log('❌ Server not reachable. Make sure the server is running with: npm run dev');
    return;
  }

  console.log();
  const user = await testRegistration();
  
  if (user) {
    console.log('\n📝 Summary:');
    console.log('✅ Server is running and reachable');
    console.log('✅ Registration endpoint is working');
    console.log('✅ Mobile app should be able to register users');
    console.log('\n💡 Next steps:');
    console.log('1. Make sure the mobile app is using the correct server URL');
    console.log('2. Test with the actual mobile app');
  } else {
    console.log('\n❌ Registration is not working properly');
    console.log('Check the server logs for more details');
  }
}

runTests();
