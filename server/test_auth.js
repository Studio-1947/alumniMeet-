const API_URL = 'http://127.0.0.1:5000/api/auth';

const testAuth = async () => {
  const email = `testuser_${Date.now()}@example.com`;
  const password = 'password123';
  const userData = {
    fullName: 'Test User',
    email,
    password,
    batchYear: 2020,
    department: 'CS',
    currentStatus: 'Alumni',
    currentRole: 'Developer',
    currentOrganization: 'Tech Corp',
    location: 'City',
  };

  try {
    console.log('Registering user...');
    const registerRes = await fetch(`${API_URL}/signup`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(userData),
    });
    
    if (!registerRes.ok) {
      const errorData = await registerRes.json();
      throw new Error(`Registration failed: ${registerRes.status} ${JSON.stringify(errorData)}`);
    }
    console.log('Registration successful:', registerRes.status);

    console.log('Logging in...');
    const loginRes = await fetch(`${API_URL}/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password }),
    });

    if (!loginRes.ok) {
      const errorData = await loginRes.json();
      throw new Error(`Login failed: ${loginRes.status} ${JSON.stringify(errorData)}`);
    }
    
    const loginData = await loginRes.json();
    console.log('Login successful:', loginRes.status);
    console.log('Token received:', !!loginData.token);
  } catch (error) {
    console.error('Auth test failed:', error.message);
  }
};

testAuth();
