// src/api.js
const BASE_URL = 'http://127.0.0.1:8000/api/'; // Replace with your actual backend URL

// Function to login the user and return the JWT token
export const loginUser = async (username, password) => {
  const credentials = { username, password };

  try {
    const response = await fetch(`${BASE_URL}login/`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(credentials),
    });

    if (!response.ok) {
      throw new Error('Invalid credentials!');
    }

    const data = await response.json();
    const token = data.access_token; // JWT token received
    const role = data.role; // Role received from backend (either 'admin' or 'user')
    localStorage.setItem('access_token', token); // Store the token in local storage
    localStorage.setItem('role', role); // Store the role in local storage
    // Return the token and role
    return { token, role };
  } catch (error) {
    throw new Error(error.message || 'Error logging in!');
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
