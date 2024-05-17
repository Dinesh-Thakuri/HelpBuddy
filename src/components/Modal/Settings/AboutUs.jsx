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

const AboutUsModal = () => {
  const [modalVisible, setModalVisible] = useState(false);

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
              <Text className="text-xl font-bold ">About Us</Text>
              <Pressable
                className=" bg-red-500 rounded-sm px-2 py-1"
                onPress={() => setModalVisible(!modalVisible)}
              >
                <Text className="text-white font-black">X</Text>
              </Pressable>
            </View>
            {/* Input for current password, new password, confirm new password */}
            <Text className="text">
              {"    "}Help Buddy is a mobile app designed to connect users with
              reliable service providers for a wide range of tasks and services.
              Our mission is to make your life easier by providing a convenient
              and trustworthy platform where you can find skilled professionals
              to assist you with anything from household chores and repairs to
              professional services and more.
            </Text>
            <Text className="mt-3 text-lg font-bold">Our Values</Text>
            <Text>
              {"    "}At Help Buddy, we are committed to providing a safe,
              transparent, and user-friendly experience for everyone who uses
              our platform. We value:
            </Text>
            <Text>
              {"    "}Trust: We thoroughly vet all service providers on our
              platform to ensure they meet our high standards of professionalism
              and reliability.
            </Text>
            <Text>
              {"    "}Convenience: Our app is designed to make finding and
              booking services as easy and hassle-free as possible.
            </Text>
            <Text>
              {"    "}Quality: We strive to maintain a network of highly skilled
              and experienced service providers who deliver exceptional quality
              work.
            </Text>
            <Text>
              {"    "}Community: We believe in fostering a sense of community by
              connecting local users with local service providers, supporting
              small businesses, and promoting sustainable practices.
            </Text>
          </View>
        </View>
      </Modal>
      <Pressable
        className=" flex-row bg-orange-400 p-5 m-2 rounded-md"
        onPress={() => setModalVisible(true)}
      >
        <FontAwesome5 name="info-circle" size={24} color="white" />
        <Text className="text-white  font-bold text-xl ml-3">About Us</Text>
      </Pressable>
    </View>
  );
};

export default AboutUsModal;
