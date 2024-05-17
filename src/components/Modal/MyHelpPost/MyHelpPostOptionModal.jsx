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
import { Entypo } from "@expo/vector-icons";
import DeleteHelpPostModal from "./DeleteHelpPostModal";
import CompleteHelpPostModal from "../HelpPost/CompleteHelpPostModal";
import RateUser from "./RateUser";
import { BlurView } from "expo-blur";

const MyHelpPostOptionModal = (helpPostId) => {
  const [modalVisible, setModalVisible] = useState(false);

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
          <View className=" flex w-full h-full justify-end pb-14 items-center ">
            <View className="bg-orange-200 rounded-xl shadow-md p-4 w-[90%] mt-4">
              <View className="flex flex-row justify-between gap-4 py-4">
                <Text className="text-xl font-bold ">Are you sure?</Text>
                <Pressable
                  className=" bg-red-500 rounded-sm px-2 py-1"
                  onPress={() => setModalVisible(!modalVisible)}
                >
                  <Text className="text-white font-black">X</Text>
                </Pressable>
              </View>

              <DeleteHelpPostModal helpPostId={helpPostId} />
              <CompleteHelpPostModal helpPostId={helpPostId} />
              <RateUser helpPostId={helpPostId} />
            </View>
          </View>
        </BlurView>
      </Modal>
      <Pressable onPress={() => setModalVisible(true)}>
        <Entypo name="dots-three-vertical" size={20} color="black" />
      </Pressable>
    </View>
  );
};

export default MyHelpPostOptionModal;
