// src/api.js
const isDevelopment = process.env.NODE_ENV === 'development';
const BASE_URL = isDevelopment ? 'http://localhost:8000/api/' : 'https://dphish-backend.onrender.com/api/';


console.log('Base URL:', BASE_URL); // Debugging

export const loginUser = async (username, password) => {
  const endpoint = `${BASE_URL}login/`.replace(/([^:]\/)\/+/g, '$1'); // Fix double slashes
  console.log('Login endpoint:', endpoint); // Debugging

   const credentials = { username, password };

  try {
    const response = await fetch(`${BASE_URL}login/`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(credentials),
    });

    const text = await response.text();
    
    let data;
    try {
      data = text ? JSON.parse(text) : {};
    } catch (parseError) {
      throw new Error('Invalid JSON response from server');
    }

    if (!response.ok) {
      const errorMsg = data?.detail || 'Login failed';
      throw new Error(errorMsg);
    }

    const token = data.access_token;
    const role = data.role;

    localStorage.setItem('access_token', token);
    localStorage.setItem('role', role);

    return { token, role };
  } catch (error) {
    throw new Error(error.message || 'Error logging in!');
  }
};

export const registerUser = async (username, email, password) => {
  const endpoint = `${BASE_URL}register/`.replace(/([^:]\/)\/+/g, '$1');

  const payload = { username, email, password };

  try {
    const response = await fetch(endpoint, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(payload),
    });

    const text = await response.text();
    let data;
    try {
      data = text ? JSON.parse(text) : {};
    } catch (parseError) {
      throw new Error('Invalid JSON response from server');
    }

    if (!response.ok) {
      const errorMsg = data?.detail || 'Registration failed';
      throw new Error(errorMsg);
    }

    const token = data.access_token;
    const role = data.role;

    return { token, role };
  } catch (error) {
    throw new Error(error.message || 'Error registering!');
  }
};

export const sendEmail = async (email) => {
  const token = localStorage.getItem('access_token');

  try {
    const response = await fetch(`${BASE_URL}send-email/`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`, 
      },
      body: JSON.stringify({ email }),
    });

    const data = await response.json();
    return data; 
  } catch (error) {
    throw new Error('Failed to send email');
  }
};
