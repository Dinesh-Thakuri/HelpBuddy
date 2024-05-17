import React, { useState, useEffect, useContext } from "react";
import {
  Modal,
  View,
  Text,
  Pressable,
  TextInput,
  Alert,
  ScrollView,
} from "react-native";
import { AuthContext } from "../../context/AuthContext";
import client from "../../api/client";
import { BlurView } from "expo-blur";

const FormData = global.FormData;

const EditProfile = () => {
  const [modalVisible, setModalVisible] = useState(false);
  const { userToken, userId } = useContext(AuthContext);
  const [myData, setMyData] = useState({});
  const [newFirstName, setNewFirstName] = useState("");
  const [newMiddleName, setNewMiddleName] = useState("");
  const [newLastName, setNewLastName] = useState("");
  const [newDesignation, setNewDesignation] = useState("");
  const [newDescription, setNewDescription] = useState("");

  useEffect(() => {
    getMyData();
  }, []);

  const getMyData = async () => {
    try {
      const response = await client.get(`/user/getUserInfoById/${userId}`, {
        headers: {
          Authorization: `Bearer ${userToken}`,
        },
      });
      const data = response.data.data;
      setMyData(data);
      setNewFirstName(data.firstName || "");
      setNewMiddleName(data.middleName || "");
      setNewLastName(data.lastName || "");
      setNewDesignation(data.designation || "");
      setNewDescription(data.bio || "");
    } catch (error) {
      console.error("Error fetching user data:", error);
      Alert.alert(
        "Error",
        "An unexpected error occurred while fetching user data."
      );
    }
  };

  const handleEdit = async () => {
    try {
      const formData = new FormData();

      formData.append("firstName", newFirstName || "");
      formData.append("middleName", newMiddleName || "");
      formData.append("lastName", newLastName || "");
      formData.append("designation", newDesignation || "");
      formData.append("bio", newDescription || "");

      const config = {
        headers: {
          "Content-Type": "multipart/form-data",
          Authorization: `Bearer ${userToken}`,
        },
        transformRequest: () => {
          return formData;
        },
      };
      const endpoint = `/user/updateUser/${userId}`;
      const response = await client.patch(endpoint, formData, config);

      if (response.status === 200) {
        console.log("Update Successful");
        Alert.alert("Update Successful", "Profile updated successfully");
        setModalVisible(false);
      } else {
        Alert.alert("Update Failed", response.data.message || "Update failed");
      }
    } catch (error) {
      console.error("Update Error:", error);
      Alert.alert("Error", "An unexpected error occurred. Please try again.");
    }
  };

  return (
    <View className="flex justify-center items-center">
      <Modal
        animationType="slide"
        transparent={true}
        visible={modalVisible}
        onRequestClose={() => {
          setModalVisible(false);
        }}
      >
        <BlurView className="w-full h-[100vh]" intensity={100} tint="prominent">
          <View className="flex  w-full justify-center items-center ">
            <ScrollView className="bg-orange-200 rounded-xl shadow-md p-4 w-[90%] mt-4">
              <View className="flex flex-row justify-between gap-4 py-4">
                <Text className="text-xl font-bold ">Edit Profile</Text>
                <Pressable
                  className=" bg-red-500 rounded-sm px-2 py-1"
                  onPress={() => setModalVisible(false)}
                >
                  <Text className="text-white font-black">X</Text>
                </Pressable>
              </View>
              <TextInput
                placeholder="First Name"
                onChangeText={(text) => setNewFirstName(text)}
                value={newFirstName}
                className="bg-white w-full h-10 px-4 py-2 mb-2 rounded"
              />
              <TextInput
                placeholder="Middle Name"
                onChangeText={(text) => setNewMiddleName(text)}
                value={newMiddleName}
                className="bg-white w-full h-10 px-4 py-2 mb-2 rounded"
              />
              <TextInput
                placeholder="Last Name"
                onChangeText={(text) => setNewLastName(text)}
                value={newLastName}
                className="bg-white w-full h-10 px-4 py-2 mb-2 rounded"
              />
              <TextInput
                placeholder="Designation"
                onChangeText={(text) => setNewDesignation(text)}
                value={newDesignation}
                className="bg-white w-full h-10 px-4 py-2 mb-2 rounded"
              />
              <TextInput
                placeholder="Bio"
                onChangeText={(text) => setNewDescription(text)}
                value={newDescription}
                className="bg-white w-full h-10 px-4 py-2 mb-2 rounded"
              />
              <Pressable className="bg-orange-500 rounded-full py-3 px-6 mt-4">
                <Text
                  onPress={handleEdit}
                  className="text-white text-center font-bold"
                >
                  Submit
                </Text>
              </Pressable>
            </ScrollView>
          </View>
        </BlurView>
      </Modal>
      <Pressable
        className="w-full bg-orange-500 rounded-full py-2 px-2 mt-4"
        onPress={() => setModalVisible(true)}
      >
        <Text className="text-white font-bold ">Edit</Text>
      </Pressable>
    </View>
  );
};

export default EditProfile;
