import React, { useState, useEffect, useContext } from "react";
import {
  View,
  Text,
  Image,
  TouchableOpacity,
  Pressable,
  Alert,
} from "react-native";
import { AuthContext } from "../../context/AuthContext.jsx";
import client from "../../api/client.js";
import { useNavigation } from "@react-navigation/native";

const OfferCard = ({ helpOffer }) => {
  const navigation = useNavigation();

  const { userToken } = useContext(AuthContext);

  // Function to accept the request
  const acceptRequest = async () => {
    try {
      const config = {
        headers: {
          Authorization: `Bearer ${userToken}`,
        },
      };
      const response = await client.post(
        `/helpPost/acceptOffer/${helpOffer.helpPostId}/${helpOffer.Helper.userId}`,
        {},
        config
      );
      Alert.alert("Success", "Request accepted successfully.");
      navigation.navigate("MyHelpPosts");
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <View className="w-full bg-orange-100 p-1 rounded-xl">
      <View className="flex-row justify-between items-center">
        <View className="flex flex-row items-center mb-2">
          {helpOffer.Helper.profilePictureUrl && (
            <Image
              source={{ uri: helpOffer.Helper.profilePictureUrl }}
              className="rounded-full w-10 h-10 mr-2"
            />
          )}
          <View>
            <Text className="font-semibold text-lg">{`${helpOffer.Helper.firstName} ${helpOffer.Helper.lastName}`}</Text>
          </View>
        </View>
        <Text className="text-xs text-gray-500">
          Offerd Date: {helpOffer.offerDate}
        </Text>
      </View>
      <View className="flex-row justify-between">
        <Text className="text-sm mb-2">Approach: {helpOffer.message}</Text>
        <Text className="text-sm mb-2">Bid: {helpOffer.bid}</Text>
      </View>
      <Pressable className="bg-red-300 rounded-lg p-2" onPress={acceptRequest}>
        <Text className="text-blue-500 text-center">Accept</Text>
      </Pressable>
    </View>
  );
};

export default OfferCard;
