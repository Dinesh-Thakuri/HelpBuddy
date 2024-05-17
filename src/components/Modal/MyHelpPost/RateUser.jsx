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
import StarRating from "react-native-star-rating-widget";
import { AuthContext } from "../../../context/AuthContext";
import client from "../../../api/client";
import { useNavigation } from "@react-navigation/native";

const RateUser = ({ helpPostId }) => {
  const navigation = useNavigation();

  const [modalVisible, setModalVisible] = useState(false);
  const { userToken } = useContext(AuthContext);
  const [rating, setRating] = useState(0);
  const [helper, setHelper] = useState();
  useEffect(() => {
    getHelperId();
  }, []);

  const getHelperId = async () => {
    try {
      const response = await client.get(
        `/user/getHelperId/${helpPostId.helpPostId}`,
        {
          headers: {
            Authorization: `Bearer ${userToken}`,
          },
        }
      );
      setHelper(response.data.data[0].helperId);
      return response.data;
    } catch (error) {
      console.log(error);
    }
  };

  const handleRateUser = async () => {
    try {
      const response = await client.post(
        `/rating/rateUser`,
        { rating: rating, toUserId: helper },
        {
          headers: {
            Authorization: `Bearer ${userToken}`,
          },
        }
      );
      console.log("Rated successfull:::", response.data);
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
        <View className="flex w-full h-full justify-end items-center pb-14 ">
          <View className="bg-orange-100 rounded-xl shadow-md p-4 w-[90%] mt-4">
            <View className="flex flex-row justify-between gap-4 py-4">
              <Text className="text-xl font-bold ">Rate User!</Text>
              <Pressable
                className=" bg-red-500 rounded-sm px-2 py-1"
                onPress={() => setModalVisible(!modalVisible)}
              >
                <Text className="text-white font-black">X</Text>
              </Pressable>
            </View>
            <View className="flex justify-center items-center p-4">
              <StarRating rating={rating} onChange={setRating} />
              <Text className="font-semibold text-lg">
                I will rate {rating} out of 5
              </Text>
            </View>
            <Pressable
              className="bg-orange-600 rounded-full p-3 mb-2"
              onPress={handleRateUser}
            >
              <Text className="text-white font-bold text-center">Submit</Text>
            </Pressable>
          </View>
        </View>
      </Modal>
      <Pressable
        className="bg-orange-500 p-2 rounded-3xl w-full mt-3"
        onPress={() => setModalVisible(true)}
      >
        <Text className="text-center text-white font-medium text-lg">Give Rating to helper</Text>
      </Pressable>
    </View>
  );
};

export default RateUser;
