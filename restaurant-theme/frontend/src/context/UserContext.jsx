import React, { createContext, useContext, useState, useEffect } from 'react';

const UserContext = createContext(null);

const DIVISIONS = ['Dhaka', 'Chattogram', 'Sylhet', 'Rajshahi', 'Khulna', 'Barishal', 'Rangpur', 'Mymensingh'];

const DEFAULT_USER = {
  isLoggedIn: true,
  profile: {
    name:   'Rafiqul Islam',
    phone:  '01712345678',
    email:  'rafiq@example.com',
    avatar: '👨‍💼',
    joinedDate: 'January 2024',
  },
  addresses: [
    {
      id: 'a1', label: '🏠 Home',
      fullAddress: 'House 12, Road 5, Dhanmondi, Dhaka 1205',
      division: 'Dhaka', district: 'Dhaka', area: 'Dhanmondi',
      apartment: 'Flat 3B', isDefault: true,
    },
    {
      id: 'a2', label: '🏢 Office',
      fullAddress: 'Level 8, Bashundhara City, Panthapath, Dhaka',
      division: 'Dhaka', district: 'Dhaka', area: 'Panthapath',
      apartment: 'Level 8', isDefault: false,
    },
  ],
};

export function UserProvider({ children }) {
  const [user, setUser] = useState(() => {
    try {
      const stored = localStorage.getItem('duare_user');
      return stored ? JSON.parse(stored) : DEFAULT_USER;
    } catch { return DEFAULT_USER; }
  });

  useEffect(() => {
    localStorage.setItem('duare_user', JSON.stringify(user));
  }, [user]);

  const updateProfile = (patch) =>
    setUser(u => ({ ...u, profile: { ...u.profile, ...patch } }));

  const addAddress = (addr) => {
    const id = `a${Date.now()}`;
    const newAddr = { id, ...addr };
    setUser(u => ({
      ...u,
      addresses: [...u.addresses, newAddr],
    }));
    return id;
  };

  const setDefaultAddress = (id) =>
    setUser(u => ({
      ...u,
      addresses: u.addresses.map(a => ({ ...a, isDefault: a.id === id })),
    }));

  const deleteAddress = (id) =>
    setUser(u => ({ ...u, addresses: u.addresses.filter(a => a.id !== id) }));

  const logout = () => setUser(u => ({ ...u, isLoggedIn: false }));
  const login  = () => setUser(u => ({ ...u, isLoggedIn: true  }));

  return (
    <UserContext.Provider value={{
      ...user, DIVISIONS,
      updateProfile, addAddress, setDefaultAddress, deleteAddress, logout, login,
    }}>
      {children}
    </UserContext.Provider>
  );
}

export const useUser = () => {
  const ctx = useContext(UserContext);
  if (!ctx) throw new Error('useUser must be inside UserProvider');
  return ctx;
};
