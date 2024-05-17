import React, { useState, useEffect, useContext } from "react";
import { Modal, View, Text, Image, Pressable, TextInput } from "react-native";
import { FontAwesome } from "@expo/vector-icons";
import { BlurView } from "expo-blur";
import { AntDesign } from "@expo/vector-icons";
import KhaltiExample from "../../Khalti";

const AddMoney = () => {
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
        <BlurView
          className="w-full h-[100vh]"
          intensity={100}
          tint="prominent"
        >
          <View className="flex w-full h-full justify-center items-center ">
            <View className="bg-orange-200 rounded-xl shadow-md p-4 w-[90%] mt-4">
              <View className="flex flex-row justify-between gap-4 py-4">
                <Text className="text-xl font-bold ">
                  Add Money To your account
                </Text>
                <Pressable
                  className=" bg-red-500 rounded-sm px-2 py-1"
                  onPress={() => setModalVisible(!modalVisible)}
                >
                  <Text className="text-white font-black">X</Text>
                </Pressable>
              </View>
              <View className=" flex-col h-80 gap-4 px-4 mt-2">
                <KhaltiExample price="100" />
                <KhaltiExample price="400" />
                <KhaltiExample price="600" />
                <KhaltiExample price="1000" />
              </View>
            </View>
          </View>
        </BlurView>
      </Modal>
      <Pressable
        className="flex-row bg-green-400 p-2 w-[80%] rounded-lg justify-center items-center"
        onPress={() => setModalVisible(true)}
      >
        <AntDesign name="plus" size={24} color="white" />
        <Text className="text-white font-bold ml-2">Add Money</Text>
      </Pressable>
    </View>
  );
};

export default AddMoney;
