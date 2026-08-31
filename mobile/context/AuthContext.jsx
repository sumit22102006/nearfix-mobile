import React, {
  createContext,
  useContext,
  useEffect,
  useState,
} from "react";

import AsyncStorage from
  "@react-native-async-storage/async-storage";

import { API_URI as API_URL } from "../api/config";


// ==========================================
// CREATE CONTEXT
// ==========================================

const AuthContext = createContext();


// ==========================================
// AUTH PROVIDER
// ==========================================

export const AuthProvider = ({ children }) => {

  const [user, setUser] = useState(null);

  const [token, setToken] = useState(null);

  const [loading, setLoading] = useState(true);


  // ========================================
  // CHECK LOGIN WHEN APP STARTS
  // ========================================

  useEffect(() => {
    loadUser();
  }, []);


  const loadUser = async () => {
    try {

      const savedToken =
        await AsyncStorage.getItem("token");


      if (!savedToken) {
        setLoading(false);
        return;
      }


      // Get current user from backend
      const response = await fetch(
        `${API_URL}/api/auth/me`,
        {
          method: "GET",

          headers: {
            Authorization:
              `Bearer ${savedToken}`,
          },
        }
      );


      if (!response.ok) {

        // Token expired/invalid
        await AsyncStorage.removeItem("token");

        setToken(null);
        setUser(null);

        setLoading(false);

        return;
      }


      const data =
        await response.json();


      setToken(savedToken);

      setUser(data.user);

    } catch (error) {

      console.log(
        "Load user error:",
        error
      );

    } finally {

      setLoading(false);

    }
  };


  // ========================================
  // LOGIN
  // ========================================

  const login = async (
    email,
    password
  ) => {

    try {

      const response = await fetch(
        `${API_URL}/api/auth/login`,
        {
          method: "POST",

          headers: {
            "Content-Type":
              "application/json",
          },

          body: JSON.stringify({
            email,
            password,
          }),
        }
      );


      const data =
        await response.json();


      if (!response.ok) {

        throw new Error(
          data.message ||
          "Login failed"
        );

      }


      // Save token
      await AsyncStorage.setItem(
        "token",
        data.token
      );


      setToken(data.token);

      setUser(data.user);


      return {
        success: true,
        data,
      };

    } catch (error) {

      console.log(
        "Login error:",
        error
      );


      return {
        success: false,
        message: error.message,
      };

    }
  };


  // ========================================
  // REGISTER
  // ========================================

  const register = async (
    name,
    email,
    phone,
    password,
    role
  ) => {

    try {

      const response = await fetch(
        `${API_URL}/api/auth/register`,
        {
          method: "POST",

          headers: {
            "Content-Type":
              "application/json",
          },

          body: JSON.stringify({

            name,
            email,
            phone,
            password,
            role,

          }),
        }
      );


      const data =
        await response.json();


      if (!response.ok) {

        throw new Error(
          data.message ||
          "Registration failed"
        );

      }


      // Save token
      await AsyncStorage.setItem(
        "token",
        data.token
      );


      setToken(data.token);

      setUser(data.user);


      return {
        success: true,
        data,
      };

    } catch (error) {

      console.log(
        "Register error:",
        error
      );


      return {
        success: false,
        message: error.message,
      };

    }
  };


  // ========================================
  // LOGOUT
  // ========================================

  const logout = async () => {

    try {

      await AsyncStorage.removeItem(
        "token"
      );

      setToken(null);
      setUser(null);

    } catch (error) {

      console.log(
        "Logout error:",
        error
      );

    }
  };


  return (
    <AuthContext.Provider
      value={{
        user,
        token,
        loading,
        login,
        register,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};


// ==========================================
// CUSTOM HOOK
// ==========================================

export const useAuth = () => {

  return useContext(AuthContext);

};