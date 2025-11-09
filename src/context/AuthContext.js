import React, { createContext, useContext, useState, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { wooCommerceAPI } from '../services/wooCommerceAPI'; // Make sure this file exists

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(null);
  const [loading, setLoading] = useState(true);

  // Load user data on startup
  useEffect(() => {
    const loadUserData = async () => {
      try {
        const storedToken = await AsyncStorage.getItem('userToken');
        const storedUser = await AsyncStorage.getItem('userData');
        if (storedToken && storedUser) {
          setToken(storedToken);
          setUser(JSON.parse(storedUser));
          wooCommerceAPI.setAuthToken(storedToken);
        }
      } catch (error) {
        console.error('Error loading user data:', error);
      } finally {
        setLoading(false);
      }
    };
    loadUserData();
  }, []);

  const login = async (username, password, navigation) => {
    try {
      const result = await wooCommerceAPI.login(username, password);

      if (result?.token) {
        setToken(result.token);
        setUser(result.user);
        wooCommerceAPI.setAuthToken(result.token);

        await AsyncStorage.setItem('userToken', result.token);
        await AsyncStorage.setItem('userData', JSON.stringify(result.user));

        console.log('✅ User logged in successfully');

        // redirect to Checkout if navigation is passed
        if (navigation) {
          navigation.navigate('Checkout');
        }

        return { success: true };
      } else {
        return { success: false, error: 'Invalid login response' };
      }
    } catch (error) {
      console.error('Login error:', error);
      return { success: false, error: error.message };
    }
  };

  const logout = async () => {
  try {
    await AsyncStorage.removeItem('userToken');
    await AsyncStorage.removeItem('userData');
    setToken(null);
    setUser(null);
    wooCommerceAPI.setAuthToken(null);
    console.log('✅ Logged out successfully');
  } catch (error) {
    console.error('Logout error:', error);
  }
};
return (
    <AuthContext.Provider
      value={{
        user,
        token,
        isAuthenticated: !!user,
        login,
        logout,
        loading,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};


export const useAuth = () => useContext(AuthContext); 
