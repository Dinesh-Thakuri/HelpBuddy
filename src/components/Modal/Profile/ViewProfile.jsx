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
import * as ImagePicker from "expo-image-picker";
import { AuthContext } from "../../context/AuthContext";
import client from "../../api/client";
import { useNavigation } from "@react-navigation/native";

const ViewProfile = () => {
  const navigation = useNavigation();

  const [modalVisible, setModalVisible] = useState(false);
  const [selectedImage, setSelectedImage] = useState(null);
  const { userToken } = useContext(AuthContext);
  const [description, setDescription] = useState("");
  const [price, setPrice] = useState("");

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
        <View className="flex justify-center items-center "></View>
      </Modal>
      <Pressable
        className="w-full bg-orange-500 rounded-md py-3 px-6 mt-4"
        onPress={() => setModalVisible(true)}
      >
        <Text className="text-white font-bold">Create a Help Post</Text>
      </Pressable>
    </View>
  );
};

export default ViewProfile;
