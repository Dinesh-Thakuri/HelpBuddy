import { View, Text, SafeAreaView, Pressable } from "react-native";
import React from "react";
import ChangePassword from "../components/Modal/Settings/ChangePasswordModal";
import { useNavigation } from "@react-navigation/native";
import AboutUsModal from "../components/Modal/Settings/AboutUs";
import TermsAndConditionsModal from "../components/Modal/Settings/TermsAndConditionsModal";
import { Ionicons } from "@expo/vector-icons";

const Settings = () => {
  const navigation = useNavigation();

  return (
    <SafeAreaView className="mt-10 p-2">
      <View className="flex-row items-center justify-between mb-4">
        <Text
          onPress={() => navigation.navigate("Profiles")}
          className="font-lg  p-2 rounded-md"
        >
          <Ionicons name="chevron-back" size={25} color="black" />{" "}
        </Text>
        <Text className="font-semibold text-2xl">Settings</Text>
      </View>
      <View className="gap-2">
        {/* three buttons About us, Terms and Conditions ,Change Password */}
        <AboutUsModal />

        <TermsAndConditionsModal />

        <ChangePassword />
      </View>
    </SafeAreaView>
  );
};

export default Settings;
