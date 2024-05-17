import React, { useState, useEffect, useContext } from "react";
import {
  Modal,
  View,
  Text,
  Image,
  Pressable,
  TextInput,
  Alert,
} from "react-native";
import { useNavigation } from "@react-navigation/native";
import { AuthContext } from "../../../context/AuthContext";
import client from "../../../api/client";
import { FontAwesome5 } from "@expo/vector-icons";

const ChangePasswordModal = ({ helpPostId }) => {
  const navigation = useNavigation();

  const [modalVisible, setModalVisible] = useState(false);
  const { userToken, userId } = useContext(AuthContext);

  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmNewPassword, setConfirmNewPassword] = useState("");

  const handleChangePassword = async () => {
    if (newPassword !== confirmNewPassword) {
      Alert.alert("New Passwords do not match");
      return;
    }

    try {
      const response = await client.patch(
        `/auth/changePassword/${userId}`,
        {
          currentPassword: currentPassword,
          newPassword: newPassword,
        },
        {
          headers: {
            Authorization: `Bearer ${userToken}`,
          },
        }
      );

      if (response.data.data === "Password do not match") {
        Alert.alert("Password do not match");
      }
      if (response.status === 200) {
        Alert.alert("Password Changed Successfully");
        setModalVisible(!modalVisible);
      }
      return response.data;
    } catch (error) {
      console.log(error);
    }
  };
  //dinesh.khawas.s22@icp.edu.np

  return (
    <View className="flex  ">
      <Modal
        // animationType pop up
        animationType="slide"
        transparent={true}
        visible={modalVisible}
        onRequestClose={() => {
          setModalVisible(!modalVisible);
        }}
      >
        <View className="flex justify-center items-center ">
          <View className="bg-white rounded-xl shadow-md p-4 w-full mt-4">
            <View className="flex flex-row justify-between gap-4 py-4">
              <Text className="text-xl font-bold ">Change Password</Text>
              <Pressable
                className=" bg-red-500 rounded-sm px-2 py-1"
                onPress={() => setModalVisible(!modalVisible)}
              >
                <Text className="text-white font-black">X</Text>
              </Pressable>
            </View>
            {/* Input for current password, new password, confirm new password */}
            <View className="flex flex-col gap-4 mb-3">
              <TextInput
                placeholder="Current Password"
                className="border-b-2 border-gray-400 p-2"
                onChangeText={(text) => setCurrentPassword(text)}
              />
              <TextInput
                placeholder="New Password"
                className="border-b-2 border-gray-400 p-2"
                onChangeText={(text) => setNewPassword(text)}
              />
              <TextInput
                placeholder="Confirm New Password"
                className="border-b-2 border-gray-400 p-2"
                onChangeText={(text) => setConfirmNewPassword(text)}
              />
            </View>
            <Pressable
              className="bg-orange-600 rounded-full p-3 mb-2"
              onPress={handleChangePassword}
            >
              <Text className="text-white font-bold text-center">Submit</Text>
            </Pressable>
          </View>
        </View>
      </Modal>
      <Pressable
        className="flex-row bg-orange-400 p-5 m-2 rounded-md"
        onPress={() => setModalVisible(true)}
      >
        <FontAwesome5 name="user-lock" size={24} color="white" />
        <Text className="ml-3 text-white  font-bold text-xl">
          Change Password
        </Text>
      </Pressable>
    </View>
  );
};

export default ChangePasswordModal;
