import {
  Text,
  TextInput,
  TouchableOpacity,
  SafeAreaView,
  Image,
  View,
} from "react-native";
import React, { useState, useContext } from "react";
import { AuthContext } from "../context/AuthContext";

export const Login = ({ navigation }) => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isFocusedEmail, setIsFocusedEmail] = useState(false);
  const [isFocusedPassword, setIsFocusedPassword] = useState(false);
  const { emailVerification } = useContext(AuthContext);

  const handleLogin = () => {
    emailVerification(email, password);
  };

  return (
    <SafeAreaView className="flex-1 bg-white justify-center px-6">
      <Image className="mx-auto mb-8" source={require("../assets/logo.png")} />
      <Text className="text-left text-lg font-semibold mb-6">
        Hi, Enter your details to sign in to your account
      </Text>
      <View className="mb-5">
        <TextInput
          className={`border rounded-lg px-4 py-3 ${
            isFocusedEmail ? "border-orange-600" : "border-gray-300"
          }`}
          placeholder="Email or Phone number"
          value={email}
          keyboardType="email-address"
          autoCapitalize="none"
          onChangeText={(text) => setEmail(text)}
          onFocus={() => setIsFocusedEmail(true)}
          onBlur={() => setIsFocusedEmail(false)}
        />
      </View>
      <View className="mb-6">
        <TextInput
          className={`border rounded-lg px-4 py-3 ${
            isFocusedPassword ? "border-orange-600" : "border-gray-300"
          }`}
          placeholder="Password"
          value={password}
          onChangeText={(text) => setPassword(text)}
          secureTextEntry
          onFocus={() => setIsFocusedPassword(true)}
          onBlur={() => setIsFocusedPassword(false)}
        />
      </View>
      <TouchableOpacity
        onPress={handleLogin}
        className="bg-orange-600 rounded-lg py-4 mb-4 shadow-lg"
      >
        <Text className="text-white text-center text-lg font-semibold">
          Login
        </Text>
      </TouchableOpacity>
      <Text className="text-right text-gray-600 mb-2">Forgot password?</Text>
      <Text className="text-center text-base">
        Don't have an account?{" "}
        <Text
          onPress={() => {
            navigation.navigate("Signup");
          }}
          className="text-blue-500 font-bold underline"
        >
          Sign up
        </Text>
      </Text>
    </SafeAreaView>
  );
};

export default Login;
