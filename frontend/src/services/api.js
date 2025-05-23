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

    if (!response.ok) {
      const data = await response.json();
      throw new Error(data.detail || 'Failed to send email');
    }

    const data = await response.json();
    return data;
  } catch (error) {
    throw new Error(error.message || 'Failed to send email');
  }
};


export const createPhishingEmail = async ({ subject, body, email_type }) => {
  const token = localStorage.getItem('access_token');

  try {
    const res = await fetch(`${BASE_URL}create-email/`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`,
        'role': localStorage.getItem('role'), 
      },
      body: JSON.stringify({ subject, body, email_type }),
    });

    if (!res.ok) {
      const data = await res.json();
      throw new Error(data.detail || 'Failed to create email');
    }

    return await res.json();
  } catch (error) {
    throw new Error(error.message || 'Request failed');
  }
};

export const startSimulation = async () => {
  const token = localStorage.getItem('access_token');
  try {
    const response = await fetch(`${BASE_URL}simulation/start/`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${token}`,
      },
    });
    if (!response.ok) {
      throw new Error('Failed to start simulation');
    }
    return await response.json();
  } catch (error) {
    throw new Error(error.message || 'Failed to start simulation');
  }
};

export const stopSimulation = async (simulationId) => {
  const token = localStorage.getItem('access_token');
  try {
    const response = await fetch(`${BASE_URL}simulation/stop/`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`,
      },
      body: JSON.stringify({ simulation_id: simulationId }),
    });
    if (!response.ok) {
      throw new Error('Failed to stop simulation');
    }
    return await response.json();
  } catch (error) {
    throw new Error(error.message || 'Failed to stop simulation');
  }
};

export const addTargetEmails = async (simulationId, emails) => {
  const token = localStorage.getItem('access_token');
  try {
    const response = await fetch(`${BASE_URL}simulation/add-emails/`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`,
      },
      body: JSON.stringify({ simulation_id: simulationId, emails }),
    });
    if (!response.ok) {
      throw new Error('Failed to add target emails');
    }
    return await response.json();
  } catch (error) {
    throw new Error(error.message || 'Failed to add target emails');
  }
};

export const updateEmailStatus = async (email, status) => {
  const token = localStorage.getItem('access_token');
  try {
    const response = await fetch(`${BASE_URL}simulation/update-status/`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`,
      },
      body: JSON.stringify({ email, status }),
    });
    if (!response.ok) {
      throw new Error('Failed to update email status');
    }
    return await response.json();
  } catch (error) {
    throw new Error(error.message || 'Failed to update email status');
  }
};

export const generateReport = async (simulationId) => {
  const token = localStorage.getItem('access_token');
  try {
    const response = await fetch(`${BASE_URL}simulation/generate-report/?simulation_id=${simulationId}`, {
      headers: {
        'Authorization': `Bearer ${token}`,
      },
    });
    if (!response.ok) {
      throw new Error('Failed to generate report');
    }
    return await response.json();
  } catch (error) {
    throw new Error(error.message || 'Failed to generate report');
  }
};