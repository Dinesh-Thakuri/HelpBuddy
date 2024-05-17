import React, { useState, useEffect, createContext } from "react";
import { Alert } from "react-native";
import client from "../api/client";

import AsyncStorage from "@react-native-async-storage/async-storage";

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [isLoading, setIsLoading] = useState(true);
  const [userToken, setUserToken] = useState(null);
  const [userId, setUserId] = useState("");

  useEffect(() => {
    const loadUserData = async () => {
      try {
        const userToken = await AsyncStorage.getItem("userToken");
        setUserToken(userToken);
        const userId = await AsyncStorage.getItem("userId");
        setUserId(userId);
        setIsLoading(false);
      } catch (error) {
        console.error("Error loading user data:", error);
        setIsLoading(false);
      }
    };

    loadUserData();
  }, []);

  const emailVerification = async (email, password) => {
    if (!email || !password) {
      Alert.alert("Invalid Input", "Please enter both email and password.");
      return;
    }

    const response = await client.post("/auth/checkEmailVerificationStatus", {
      email,
    });

    if (response.data.data.length === 0) {
      Alert.alert("Email not found", "Please enter a valid email.");
      return;
    }

    try {
      const response = await client.post("/auth/checkEmailVerificationStatus", {
        email,
      });
      if (response.data.data.length === 0) {
        Alert.alert("Email not found", "Please enter a valid email.");
        return;
      }
    } catch (error) {
      Alert.alert("Email and password did not matched.");
    }

    setUserId(response.data.data[0].userId.toString()); // Convert userId to a string
    AsyncStorage.setItem("userId", response.data.data[0].userId.toString()); // Store userId as a string

    if (response.data.data[0].isSuspended === true) {
      Alert.alert("Your Account is Suspended.");
      return;
    }
    if (response.data.data[0].isEmailVerified === false) {
      Alert.alert("Email is not verified", "Please verify your email first.");
      return;
    }

    login(email, password);
  };

  const login = async (email, password) => {
    try {
      const response = await client.post("/auth/login", {
        email,
        password,
      });

      if (response.data.isSuccessful) {
        setIsLoading(true);
        const accessToken = response.data.data;
        setUserToken(accessToken);
        AsyncStorage.setItem("userToken", accessToken);
        setIsLoading(false);
      } else {
        Alert.alert("Login Failed", response.data.message || "Unknown error");
      }
    } catch (error) {
      Alert.alert("Email and password did not matched.");
    }
  };

  const logout = async () => {
    setIsLoading(true);
    try {
      await AsyncStorage.removeItem("userToken");
      setUserToken(null);
      setIsLoading(false);
    } catch (error) {
      console.error("Logout Error:", error);
      Alert.alert("Error", "An unexpected error occurred. Please try again.");
      setIsLoading(false);
    }
  };

  const isLoggedIn = async () => {
    try {
      setIsLoading(true);
      let userToken = await AsyncStorage.getItem("userToken");
      console.log(userToken);
      setUserToken(userToken);
      setIsLoading(false);
    } catch (e) {
      console.error("Error checking user login status:", error);
      setIsLoading(false);
    }
  };

  return (
    <AuthContext.Provider
      value={{
        login,
        emailVerification,
        logout,
        userToken,
        userId,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};
