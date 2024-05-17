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
import { AuthContext } from "../../../context/AuthContext";
import client from "../../../api/client";
import { Entypo } from "@expo/vector-icons";

const DeleteHelpPostModal = (helpPostId) => {
  const [modalVisible, setModalVisible] = useState(false);
  const { userToken } = useContext(AuthContext);
  const [confirm, setConfirm] = useState("");

  const handleDeleteHelpPost = async () => {
    try {
      if (confirm !== "Confirm") {
        Alert.alert("Invalid Input", "Please enter 'Confirm' to delete.");
        return;
      }
      const response = await client.delete(
        `/helpPost/delete/${helpPostId.helpPostId}`,
        {
          headers: {
            Authorization: `Bearer ${userToken}`,
          },
        }
      );
      console.log(response.data);
      setModalVisible(false);
    } catch (error) {
      console.log(error);
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
        <View className="flex w-full h-full justify-end pb-14 items-center ">
          <View className="bg-orange-300 rounded-xl shadow-md p-4 w-[90%] mt-4">
            <View className="flex flex-row justify-between gap-4 py-4">
              <Text className="text-xl font-bold ">Are you sure?</Text>
              <Pressable
                className=" bg-red-500 rounded-sm px-2 py-1"
                onPress={() => setModalVisible(!modalVisible)}
              >
                <Text className="text-white font-black">X</Text>
              </Pressable>
            </View>

            <Text className="text-lg font-bold">Type Confirm to delete.</Text>
            <TextInput
              placeholder="Confirm"
              onChangeText={(text) => setConfirm(text)}
              value={confirm}
              className="bg-gray-200 w-full h-10 px-4 py-2 mb-2 rounded"
            />
            <Pressable
              className="bg-orange-600 rounded-full p-3 mb-2"
              onPress={handleDeleteHelpPost}
            >
              <Text className="text-white font-bold text-center">Submit</Text>
            </Pressable>
          </View>
        </View>
      </Modal>
      <Pressable
        className="bg-orange-500 p-2 rounded-3xl w-full "
        onPress={() => setModalVisible(true)}
      >
        <Text className="text-center font-medium text-white text-lg">Delete</Text>
      </Pressable>
    </View>
  );
};

export default DeleteHelpPostModal;
