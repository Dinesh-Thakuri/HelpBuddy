import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  TextInput,
  Image,
  Alert,
  SafeAreaView,
  TouchableOpacity,
  Platform,
  ScrollView,
  KeyboardAvoidingView,
  ActivityIndicator,
} from "react-native";
import * as ImagePicker from "expo-image-picker";
import client from "../api/client";
import DateTimePicker from "@react-native-community/datetimepicker";

const FormData = global.FormData;

export default Signup = ({ navigation }) => {
  const [firstName, setFirstName] = useState("");
  const [middleName, setMiddleName] = useState("");
  const [lastName, setLastName] = useState("");
  const [dateOfBirth, setDateOfBirth] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [address, setAddress] = useState("");
  const [profilePicture, setProfilePicture] = useState(null);
  const [loading, setLoading] = useState(false);
  const [date, setDate] = useState(new Date());
  const [showPicker, setShowPicker] = useState(false);
  const [isFocusedFirstName, setIsFocusedFirstName] = useState(false);
  const [isFocusedMiddleName, setIsFocusedMiddleName] = useState(false);
  const [isFocusedLastName, setIsFocusedLastName] = useState(false);
  const [isFocusedAddress, setIsFocusedAddress] = useState(false);
  const [isFocusedEmail, setIsFocusedEmail] = useState(false);
  const [isFocusedPhoneNumber, setIsFocusedPhoneNumber] = useState(false);
  const [isFocusedPassword, setIsFocusedPassword] = useState(false);

  const toggleDatePicker = () => {
    setShowPicker(!showPicker);
  };

  const onChange = ({ type }, selectedDate) => {
    if (type === "set") {
      const currentDate = selectedDate;
      setDate(currentDate);

      if (Platform.OS === "android") {
        toggleDatePicker();
        setDateOfBirth(currentDate.toDateString());
      }
    } else {
      toggleDatePicker();
    }
  };

  useEffect(() => {
    (async () => {
      const { status } =
        await ImagePicker.requestMediaLibraryPermissionsAsync();
      if (status !== "granted") {
        Alert.alert(
          "Permission Denied",
          "Sorry, we need camera roll permissions to make this work!"
        );
      }
    })();
  }, []);

  const handleImagePicker = async () => {
    try {
      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: true,
        aspect: [1, 1],
        quality: 1,
      });
      if (!result.cancelled) {
        setProfilePicture(result.assets[0].uri);
      } else {
        console.log("User canceled image selection");
      }
    } catch (error) {
      Alert.alert("Photo not chosen", "Please choose a profile picture.");
    }
  };

  const handleRegister = async () => {
    setLoading(true);
    try {
      if (!firstName || !email || !password) {
        setLoading(false);
        Alert.alert("Invalid Input", "Please enter all fields.");
        return;
      }

      const formData = new FormData();
      formData.append("firstName", firstName);
      formData.append("middleName", middleName);
      formData.append("lastName", lastName);
      formData.append("dateOfBirth", dateOfBirth);
      formData.append("email", email);
      formData.append("password", password);
      formData.append("phoneNumber", phoneNumber);
      formData.append("address", address);
      if (profilePicture) {
        formData.append("profilePicture", {
          name: `${firstName}_${lastName}.jpeg`,
          type: "image/jpeg",
          uri: profilePicture,
        });
      }

      const config = {
        headers: {
          "Content-Type": "multipart/form-data",
        },
        transformRequest: () => {
          return formData;
        },
      };

      const response = await client.post("/auth/register", formData, config);
      const userId = response.data.data.userId;
      setLoading(false);
      if (response.status === 200) {
        navigation.navigate("OtpVerification", { userId });
      } else {
        Alert.alert(
          "Registration Failed",
          response.data.message || "Registration failed"
        );
      }
    } catch (error) {
      console.error("Registration Error:", error);
      Alert.alert("Error", "An unexpected error occurred. Please try again.");
    }
  };

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      style={{ flex: 1 }}
      keyboardVerticalOffset={Platform.OS === "ios" ? 64 : 0}
    >
      <ScrollView contentContainerStyle={{ flexGrow: 1 }}>
        <SafeAreaView className="flex-1 bg-white items-center justify-center px-5 mt-2">
          <View className="flex flex-row justify-around w-full rounded bg-slate-100 p-3 mt-4 mb-6">
            <View>
              <Text className="text-base mb-4">Upload a Profile Picture</Text>
              <TouchableOpacity onPress={handleImagePicker}>
                <Text className="rounded-full bg-orange-600 px-4 py-2 text-white font-bold text-center">
                  Select Photo
                </Text>
              </TouchableOpacity>
            </View>
            <View>
              {profilePicture ? (
                <Image
                  className="rounded-full w-20 h-20"
                  source={{ uri: profilePicture }}
                />
              ) : (
                <Image
                  className="rounded-full w-20 h-20"
                  source={{
                    uri: "https://res.cloudinary.com/helpbuddy01/image/upload/v1712670064/saxwkn0wamvwz0hvnfoq.png",
                  }}
                />
              )}
            </View>
          </View>

          <View className="flex flex-row gap-2 w-full mb-4">
            <TextInput
              className={`border rounded-lg px-4 py-3 flex-1 ${
                isFocusedFirstName ? "border-orange-600" : "border-slate-300"
              }`}
              placeholder="First Name"
              value={firstName}
              onChangeText={(text) => setFirstName(text)}
              onFocus={() => setIsFocusedFirstName(true)}
              onBlur={() => setIsFocusedFirstName(false)}
            />
            <TextInput
              className={`border rounded-lg px-4 py-3 flex-1 ${
                isFocusedMiddleName ? "border-orange-600" : "border-slate-300"
              }`}
              placeholder="Middle Name"
              value={middleName}
              onChangeText={(text) => setMiddleName(text)}
              onFocus={() => setIsFocusedMiddleName(true)}
              onBlur={() => setIsFocusedMiddleName(false)}
            />
          </View>

          <TextInput
            className={`border rounded-lg px-4 py-3 w-full mb-4 ${
              isFocusedLastName ? "border-orange-600" : "border-slate-300"
            }`}
            placeholder="Last Name"
            value={lastName}
            onChangeText={(text) => setLastName(text)}
            onFocus={() => setIsFocusedLastName(true)}
            onBlur={() => setIsFocusedLastName(false)}
          />

          <TextInput
            className={`border rounded-lg px-4 py-3 w-full mb-4 ${
              isFocusedAddress ? "border-orange-600" : "border-slate-300"
            }`}
            placeholder="Address"
            value={address}
            onChangeText={(text) => setAddress(text)}
            onFocus={() => setIsFocusedAddress(true)}
            onBlur={() => setIsFocusedAddress(false)}
          />

          {showPicker && (
            <DateTimePicker
              mode="date"
              display="spinner"
              value={date}
              onChange={onChange}
            />
          )}

          {!showPicker && (
            <TouchableOpacity
              className="w-full mb-4"
              onPress={toggleDatePicker}
            >
              <TextInput
                className="border rounded-lg px-4 py-3 w-full"
                placeholder="Date of Birth"
                value={dateOfBirth}
                editable={false}
              />
            </TouchableOpacity>
          )}

          <TextInput
            className={`border rounded-lg px-4 py-3 w-full mb-4 ${
              isFocusedEmail ? "border-orange-600" : "border-slate-300"
            }`}
            placeholder="Email"
            value={email}
            onChangeText={(text) => setEmail(text)}
            keyboardType="email-address"
            autoCapitalize="none"
            onFocus={() => setIsFocusedEmail(true)}
            onBlur={() => setIsFocusedEmail(false)}
          />

          <TextInput
            className={`border rounded-lg px-4 py-3 w-full mb-4 ${
              isFocusedPhoneNumber ? "border-orange-600" : "border-slate-300"
            }`}
            placeholder="Phone Number"
            value={phoneNumber}
            keyboardType="numeric"
            onChangeText={(text) => setPhoneNumber(text)}
            onFocus={() => setIsFocusedPhoneNumber(true)}
            onBlur={() => setIsFocusedPhoneNumber(false)}
          />

          <TextInput
            className={`border rounded-lg px-4 py-3 w-full mb-6 ${
              isFocusedPassword ? "border-orange-600" : "border-slate-300"
            }`}
            placeholder="Password"
            value={password}
            onChangeText={(text) => setPassword(text)}
            secureTextEntry
            onFocus={() => setIsFocusedPassword(true)}
            onBlur={() => setIsFocusedPassword(false)}
          />

          <TouchableOpacity
            onPress={handleRegister}
            className="flex flex-row justify-center items-center w-2/3 bg-orange-600 p-3 rounded-lg mb-4"
          >
            <Text className="text-white text-center font-bold">Register</Text>
            {loading && (
              <ActivityIndicator className="ml-5" size="small" color="#ffff" />
            )}
          </TouchableOpacity>

          <Text className="text-center text-base mt-2 mb-4">
            By signing up, you agree to our{" "}
            <Text className="text-orange-600 font-bold underline">
              Terms and Conditions
            </Text>
          </Text>
        </SafeAreaView>
      </ScrollView>
    </KeyboardAvoidingView>
  );
};
