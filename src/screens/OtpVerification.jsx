import { height } from "@fortawesome/free-solid-svg-icons/fa0";
import React, { useState } from "react";
import { View, Text, SafeAreaView, Pressable, Alert } from "react-native";
import { OtpInput } from "react-native-otp-entry";
import { useRoute } from "@react-navigation/native";
import client from "../api/client";
import { useNavigation } from "@react-navigation/native";

const OtpVerification = () => {
  const navigation = useNavigation();
  const route = useRoute();
  const { userId } = route.params;

  const [otp, setOtp] = useState("");

  const verifyOtp = async () => {
    try {
      const response = await client.post("/auth/verifyOtp", {
        userId: userId,
        otp: otp,
      });

      if (response.status === 200) {
        Alert.alert("Successful!", "Your email is verified");
        navigation.navigate("Login");
      } else {
        Alert.alert(
          "Email Verified Failed",
          data.message || "Verification failed"
        );
      }
    } catch (error) {
      console.error("Email Verification Error:", error);
      Alert.alert("Error", "An unexpected error occurred. Please try again.");
    }
  };

  return (
    <SafeAreaView className="mt-7">
      <View className="mt-[250px]">
        <Text className="mb-3 text-center text-lg font-lg">
          Please Check Your Email for Otp.
        </Text>
        <OtpInput
          numberOfDigits={4}
          focusColor="green"
          focusStickBlinkingDuration={500}
          //   onTextChange={(text) => setOtp(text)}
          onFilled={(text) => setOtp(text)}
          theme={{
            containerStyle: styles.container,
            inputsContainerStyle: styles.inputsContainer,
            pinCodeContainerStyle: styles.pinCodeContainer,
            pinCodeTextStyle: styles.pinCodeText,
            focusStickStyle: styles.focusStick,
            focusedPinCodeContainerStyle: styles.activePinCodeContainer,
          }}
        />
      </View>
      <View className="w-full items-center mt-9">
        <Pressable
          className="bg-orange-500 px-3 py-1 justify-center items-center  rounded-lg"
          onPress={() => {
            verifyOtp();
          }}
        >
          <Text className="text-white font-semibold text-lg text-center">
            Submit
          </Text>
        </Pressable>
        <Text className=" text-xs font-medium text-gray-500 mt-4">
          Did not received code? Send again.
        </Text>
      </View>
    </SafeAreaView>
  );
};

const styles = {
  container: {
    backgroundColor: "#ffff",
    // height: 100
  },
  inputsContainer: {
    flexDirection: "row",
    justifyContent: "center",
    marginVertical: 20,
  },
  pinCodeContainer: {
    width: 50,
    height: 60,
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 8,
    marginHorizontal: 8,
    justifyContent: "center",
    alignItems: "center",
  },
  pinCodeText: {
    fontSize: 24,
    fontWeight: "bold",
  },
  focusStick: {
    position: "absolute",
    bottom: -15,
    left: 0,
    right: 0,
    // height: 2,
    backgroundColor: "grey",
  },
  activePinCodeContainer: {
    borderColor: "orange",
  },
};

export default OtpVerification;
