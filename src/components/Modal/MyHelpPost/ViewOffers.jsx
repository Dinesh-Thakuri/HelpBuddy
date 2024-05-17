import React, { useState, useEffect, useContext } from "react";
import {
  Modal,
  View,
  Text,
  Image,
  Pressable,
  TextInput,
  ScrollView,
} from "react-native";
import { AuthContext } from "../../../context/AuthContext";
import client from "../../../api/client";
import OfferList from "../../HelpPost/OfferList";

const ViewOffer = ({ helpPostId }) => {
  const [modalVisible, setModalVisible] = useState(false);
  const { userToken } = useContext(AuthContext);
  const [bid, setBid] = useState("");
  const [message, setMessage] = useState("");

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
        <View className="flex justify-center items-center ">
          <View className="bg-orange-200 rounded-xl shadow-md p-4 w-[98%] mt-4">
            <View className="flex flex-row justify-between gap-4 py-4">
              <Text className="text-xl font-bold ">All Help Offers</Text>
              <Pressable
                className=" bg-red-500 rounded-sm px-2 py-1"
                onPress={() => setModalVisible(!modalVisible)}
              >
                <Text className="text-white font-black">X</Text>
              </Pressable>
            </View>

            {/* Place for offers list cards */}
            <ScrollView className=" h-4/5">
              <OfferList helpPostId={helpPostId} />
            </ScrollView>
          </View>
        </View>
      </Modal>
      <Pressable
        className="w-full bg-orange-500 rounded-full py-1 px-3"
        onPress={() => setModalVisible(!modalVisible)}
      >
        <Text className="text-white font-bold">View Offer</Text>
      </Pressable>
    </View>
  );
};

export default ViewOffer;
