import React from "react";
import Login from "../screens/Login.jsx";
import Signup from "../screens/Signup.jsx";
import OtpVerification from "../screens/OtpVerification.jsx";

import { createNativeStackNavigator } from "@react-navigation/native-stack";

const Stack = createNativeStackNavigator();

const AuthStack = () => {
  return (
    <Stack.Navigator
      initialRouteName="Home"
      screenOptions={{
        headerShown: false,
      }}
    >
      <Stack.Screen
        name="Login"
        component={Login}
        options={{
          title: "Login",
        }}
      />
      <Stack.Screen
        name="Signup"
        component={Signup}
        options={{
          title: "Signup",
        }}
      />
      <Stack.Screen
        name="OtpVerification"
        component={OtpVerification}
        options={{
          title: "OTP Verification",
        }}
      />
    </Stack.Navigator>
  );
};

export default AuthStack;
