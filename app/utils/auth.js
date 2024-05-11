// auth.js

import axios from 'axios';

const isAuthenticated = async () => {
  try {
    const response = await axios.get('http://localhost:3000/patient-auth/check-session', {
      withCredentials: true
    });
    return {
      isAuthenticated: response.data.isAuthenticated,
      userId: response.data.userId
    };
  } catch (error) {
    console.log("Failed to check authentication:", error);
    setTimeout(() => {
      localStorage.removeItem('userId');
      localStorage.removeItem('token');
    }, 6000); 
    return {
      isAuthenticated: false,
      userId: null
    };
  }
};

export default isAuthenticated;
