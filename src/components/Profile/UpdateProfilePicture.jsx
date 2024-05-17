import React, { useState, useEffect, useContext } from "react";
import {
  Modal,
  View,
  Text,
  Image,
  Pressable,
  TextInput,
  Alert,
  ActivityIndicator,
} from "react-native";
import { useNavigation } from "@react-navigation/native";
import { BlurView } from "expo-blur";

import * as ImagePicker from "expo-image-picker";
import { AuthContext } from "../../context/AuthContext";
import client from "../../api/client";

const FormData = global.FormData;

const UpdateProfilePicture = () => {
  const navigation = useNavigation();
  const [loading, setLoading] = useState(false);
  const [modalVisible, setModalVisible] = useState(false);
  const [profilePicture, setProfilePicture] = useState(null);
  const { userToken, userId, firstName, lastName } = useContext(AuthContext);

  useEffect(() => {
    // Request permission to access the camera roll
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
      console.log("Image", result);
      if (!result.cancelled) {
        setProfilePicture(result.assets[0].uri);
      } else {
        console.log(
          "User canceled image selection or result URI is undefined:",
          result
        );
      }
    } catch (error) {
      Alert.alert(
        "Photo Not Selected!",
        "Please select a photo and try again."
      );
    }
  };

  const handleUpdateImage = async () => {
    setLoading(true);
    try {
      const formData = new FormData();
      formData.append("profilePicture", {
        //set profile name to firstname + lastname .jpg
        name: `${firstName}_${lastName}.jpeg`,
        type: "image/jpeg",
        uri: profilePicture,
      });

      // Use Axios for the API request
      const config = {
        headers: {
          "Content-Type": "multipart/form-data",
          Authorization: `Bearer ${userToken}`,
        },
        transformRequest: () => {
          return formData;
        },
      };

      const endpoint = `/user/updateProfilePicture/${userId}`;
      const response = await client.patch(endpoint, formData, config);
      const data = response.data;

      if (response.status === 200) {
        setLoading(false);
        console.log("Profile Picture Update Successful");
        navigation.navigate("MyProfile"); // Redirect to the login screen or wherever you want
      } else {
        Alert.alert("Not updated", data.message || "Registration failed");
      }
    } catch (error) {
      Alert.alert(
        "Photo Not Selected!",
        "Please select a photo and try again."
      );
    }
  };

  return (
    <View className="flex justify-center items-center">
      <Modal
        // animationType pop up
        animationType="slide"
        transparent={true}
        visible={modalVisible}
        onRequestClose={() => {
          setModalVisible(!modalVisible);
        }}
      >
        <BlurView className="w-full h-[100vh]" intensity={100} tint="prominent">
          <View className="flex w-full h-full justify-end  items-center pb-14 ">
            <View className="bg-orange-200 rounded-xl shadow-md p-4 w-[90%] mt-4">
              <View className="flex flex-row justify-between gap-4 py-4">
                <Text className="text-xl font-bold ">
                  Choose a new Profile Picture
                </Text>
                <Pressable
                  className=" bg-red-500 rounded-sm px-2 py-1"
                  onPress={() => setModalVisible(!modalVisible)}
                >
                  <Text className="text-white font-black">X</Text>
                </Pressable>
              </View>
              <View className="flex justify-center items-center py-4">
                {profilePicture && (
                  <Image
                    className=" w-80 h-80 rounded-md "
                    source={{ uri: profilePicture }}
                  />
                )}
              </View>
              <Pressable
                className="bg-orange-600 rounded-full p-3 mb-2"
                onPress={handleImagePicker}
              >
                <Text className="text-white text-center font-bold">
                  Select Photo
                </Text>
              </Pressable>
              <Pressable
                className="bg-orange-600 rounded-full p-3 mb-2"
                onPress={handleUpdateImage}
              >
                <Text className="text-white text-center font-bold">Submit</Text>
              </Pressable>
            </View>
          </View>
        </BlurView>
      </Modal>
      <Pressable onPress={() => setModalVisible(true)}>
        <Text className="text-white font-bold">Edit</Text>
      </Pressable>
    </View>
  );
};

export default UpdateProfilePicture;
