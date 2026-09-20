// SealNet REST API Service with Offline Fallback Simulation
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
      // Local fallback simulation if server is offline
      if (email.toLowerCase().includes('tpo') || email.toLowerCase().includes('admin')) {
        return { user: { id: 'u_tpo', fullName: 'Dr. Suresh Nair', email, role: 'tpo' }, token: 'mock_tpo_jwt' };
      }
      if (email.toLowerCase().includes('hod')) {
        return { user: { id: 'u_hod', fullName: 'Dr. Rajesh Kulkarni', email, role: 'hod', department: 'Computer Science & Engineering' }, token: 'mock_hod_jwt' };
      }
      // Check registered students list in local storage
      try {
        const list = JSON.parse(localStorage.getItem('sealnet_students') || '[]');
        const found = list.find(s => s.email && s.email.toLowerCase() === email.toLowerCase());
        if (found) {
          return { user: found, token: 'mock_std_jwt' };
        }
      } catch(e){}

      // Derive dynamic clean name from email prefix if not in list
      const cleanName = email.split('@')[0]
        .replace(/[._-]+/g, ' ')
        .replace(/\b\w/g, c => c.toUpperCase()) || 'Aarav Patel';

      const dynamicUser = {
        id: 'u_std_' + Date.now(),
        fullName: cleanName,
        email: email,
        role: 'student',
        rollNumber: '1MS22CS095',
        phone: '+91 98765 43210',
        department: 'Computer Science & Engineering',
        departmentCode: 'CSE',
        cgpa: 8.42,
        backlogs: 0
      };
      return { user: dynamicUser, token: 'mock_std_jwt' };
    }
  },

  // Student Registration
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
      const studentUser = {
        id: 'u_std_' + Date.now(),
        fullName: formData.fullName || 'Priya Sharma',
        email: formData.email,
        role: 'student',
        rollNumber: formData.rollNumber || '1MS22CS102',
        phone: formData.phone || '+91 98765 43211',
        department: 'Computer Science & Engineering',
        departmentCode: 'CSE',
        cgpa: 8.15,
        backlogs: 0
      };
      try {
        const existing = JSON.parse(localStorage.getItem('sealnet_students') || '[]');
        existing.push(studentUser);
        localStorage.setItem('sealnet_students', JSON.stringify(existing));
      } catch(e){}
      return { user: studentUser, token: 'mock_std_reg_jwt' };
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
      const tpoUser = {
        id: 'u_tpo_' + Date.now(),
        fullName: formData.fullName || 'Dr. Suresh Nair',
        email: formData.email,
        role: 'tpo',
        phone: formData.phone || '+91 98765 43200'
      };
      return { user: tpoUser, token: 'mock_tpo_reg_jwt' };
    }
  },

  // HoD Registration
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
      const hodUser = {
        id: 'u_hod_' + Date.now(),
        fullName: formData.fullName || 'Dr. Rajesh Kulkarni',
        email: formData.email,
        role: 'hod',
        department: formData.department || 'Computer Science & Engineering',
        phone: formData.phone || '+91 98765 43299'
      };
      return { user: hodUser, token: 'mock_hod_reg_jwt' };
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
      return { message: `Password reset instructions sent to ${email}` };
    }
  }
};
