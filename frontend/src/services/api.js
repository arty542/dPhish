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

    // Return the token and role
    return { token, role };
  } catch (error) {
    throw new Error(error.message || 'Error logging in!');
  }
};

// Add other API calls here
