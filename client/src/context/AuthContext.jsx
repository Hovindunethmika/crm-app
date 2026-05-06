import { createContext, useState } from 'react';
import axios from 'axios';

export const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [user, setUser] = useState(() => {
    const stored = localStorage.getItem('crm_user');
    return stored ? JSON.parse(stored) : null;
  });

  const [token, setToken] = useState(() => localStorage.getItem('crm_token'));

  const login = async (email, password) => {
    const res = await axios.post('http://localhost:5000/api/auth/login', {
      email,
      password,
    });
    setUser(res.data.user);
    setToken(res.data.token);
    localStorage.setItem('crm_user', JSON.stringify(res.data.user));
    localStorage.setItem('crm_token', res.data.token);
  };

  const logout = () => {
    setUser(null);
    setToken(null);
    localStorage.removeItem('crm_user');
    localStorage.removeItem('crm_token');
  };

  return (
    <AuthContext.Provider value={{ user, token, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}