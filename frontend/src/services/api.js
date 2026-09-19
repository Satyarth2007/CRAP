// SealNet REST API Service
const API_BASE = 'http://localhost:5000/api/auth';

export const authService = {
  // Shared Login for All Roles (Student, TPO, etc.)
  login: async (email, password) => {
    try {
      const res = await fetch(`${API_BASE}/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password })
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message || 'Authentication failed');
      return data;
    } catch (err) {
      throw err;
    }
  },

  // Student Registration (Requires Roll Number in TPO Roster)
  registerStudent: async (formData) => {
    try {
      const res = await fetch(`${API_BASE}/register/student`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message || 'Student registration failed');
      return data;
    } catch (err) {
      throw err;
    }
  },

  // TPO Registration
  registerTpo: async (formData) => {
    try {
      const res = await fetch(`${API_BASE}/register/tpo`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message || 'TPO registration failed');
      return data;
    } catch (err) {
      throw err;
    }
  },

  // HoD Registration (Departmental Head with Department field)
  registerHod: async (formData) => {
    try {
      const res = await fetch(`${API_BASE}/register/hod`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message || 'HoD registration failed');
      return data;
    } catch (err) {
      throw err;
    }
  },

  // Forgot Password
  forgotPassword: async (email) => {
    try {
      const res = await fetch(`${API_BASE}/forgot-password`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email })
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message || 'Password reset request failed');
      return data;
    } catch (err) {
      throw err;
    }
  }
};
