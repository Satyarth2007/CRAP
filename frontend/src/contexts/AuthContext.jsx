import React, { createContext, useState, useEffect } from 'react';
import { authService } from '../services/api';

export const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [user, setUser] = useState(() => {
    try {
      const saved = localStorage.getItem('sealnet_user');
      return saved ? JSON.parse(saved) : null;
    } catch {
      return null;
    }
  });

  const [token, setToken] = useState(() => localStorage.getItem('sealnet_token') || null);

  const login = async (email, password) => {
    const data = await authService.login(email, password);
    setUser(data.user);
    setToken(data.token);
    localStorage.setItem('sealnet_user', JSON.stringify(data.user));
    localStorage.setItem('sealnet_token', data.token);
    return data;
  };

  const registerStudent = async (formData) => {
    const data = await authService.registerStudent(formData);
    setUser(data.user);
    setToken(data.token);
    localStorage.setItem('sealnet_user', JSON.stringify(data.user));
    localStorage.setItem('sealnet_token', data.token);
    return data;
  };

  const registerTpo = async (formData) => {
    const data = await authService.registerTpo(formData);
    setUser(data.user);
    setToken(data.token);
    localStorage.setItem('sealnet_user', JSON.stringify(data.user));
    localStorage.setItem('sealnet_token', data.token);
    return data;
  };

  const registerHod = async (formData) => {
    const data = await authService.registerHod(formData);
    setUser(data.user);
    setToken(data.token);
    localStorage.setItem('sealnet_user', JSON.stringify(data.user));
    localStorage.setItem('sealnet_token', data.token);
    return data;
  };

  const forgotPassword = async (email) => {
    return await authService.forgotPassword(email);
  };

  const logout = () => {
    setUser(null);
    setToken(null);
    localStorage.removeItem('sealnet_user');
    localStorage.removeItem('sealnet_token');
  };

  return (
    <AuthContext.Provider value={{ user, token, login, registerStudent, registerTpo, registerHod, forgotPassword, logout }}>
      {children}
    </AuthContext.Provider>
  );
}
