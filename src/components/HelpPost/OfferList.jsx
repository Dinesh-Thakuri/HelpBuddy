import React, { useState, useEffect, useContext } from "react";
import {
  Modal,
  View,
  Text,
  Image,
  Pressable,
  TextInput,
  ActivityIndicator,
  Alert,
} from "react-native";
import client from "../../api/client.js";
import { AuthContext } from "../../context/AuthContext.jsx";
import OfferCard from "./OfferCard.jsx";
import { useNavigation } from "@react-navigation/native";

const OfferList = ({ helpPostId }) => {
  const navigation = useNavigation();
  const { userToken, userId } = useContext(AuthContext);

  const [helpOffers, setHelpOffers] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getAllHelpOffers();
  }, []);

  const getAllHelpOffers = async () => {
    try {
      const config = {
        headers: {
          Authorization: `Bearer ${userToken}`,
        },
      };
      const response = await client.get(
        `/helpPost/helpOffers/${helpPostId}`,
        config
      );
      console.log("hey hey hye", response.data.data);
      setHelpOffers(response.data.data);
      setLoading(false);
    } catch (error) {
      console.log(error);
    }
  };

  const acceptRequest = async (helpPostId, helper) => {
    try {
      const config = {
        headers: {
          Authorization: `Bearer ${userToken}`,
        },
      };
      const response = await client.post(
        `/helpPost/acceptOffer/${helpPostId}/${helper}`,
        {},
        config
      );
      Alert.alert("Success", "Request accepted successfully.");
      getAllHelpOffers();
      navigation.navigate("MyHelpPosts");
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <View>
      {loading ? (
        <ActivityIndicator size="large" color="#0000ff" />
      ) : (
        Array.from(helpOffers).map((helpOffer) => (
          // <OfferCard key={helpOffer.id} helpOffer={helpOffer} />
          <View
            className="w-full bg-orange-100 p-1 rounded-xl mt-2"
            key={helpOffer.id}
          >
            <View className="flex-row justify-between items-center">
              <Pressable
                className="flex flex-row items-center mb-2"
                onPress={() => {
                  navigation.navigate("View-profile", {
                    userID: helpOffer.Helper.userId,
                  });
                }}
              >
                {helpOffer.Helper.profilePictureUrl && (
                  <Image
                    source={{ uri: helpOffer.Helper.profilePictureUrl }}
                    className="rounded-full w-10 h-10 mr-2"
                  />
                )}
                <View>
                  <Text className="font-semibold text-lg">{`${helpOffer.Helper.firstName} ${helpOffer.Helper.lastName}`}</Text>
                </View>
              </Pressable>
              <Text className="text-xs text-gray-500">
                {helpOffer.offerDate}
              </Text>
            </View>
            <View className="flex-row justify-between">
              <Text className="text-sm mb-2">
                Approach: {helpOffer.message}
              </Text>
              <Text className="text-sm mb-2">Bid: {helpOffer.bid}</Text>
            </View>
            {helpOffer.status === "accepted" && (
              <Text className="bg-green-400 rounded-lg p-2 text-white font-bold text-lg text-center">
                Accepted
              </Text>
            )}
            {helpOffer.status === "rejected" && (
              <Text className="bg-red-400 rounded-lg p-2 text-white font-bold text-lg text-center">
                Rejected
              </Text>
            )}
            {helpOffer.status === "Completed" && (
              <Text className="bg-orange-400 rounded-lg p-2 text-white font-bold text-lg text-center">
                Completed
              </Text>
            )}
            {helpOffer.status !== "accepted" &&
              helpOffer.status !== "rejected" && (
                <Pressable
                  className="bg-orange-300 rounded-lg p-2"
                  onPress={() => {
                    acceptRequest(
                      helpOffer.helpPostId,
                      helpOffer.Helper.userId
                    );
                  }}
                >
                  <Text className="text-white font-bold text-lg text-center">
                    Accept
                  </Text>
                </Pressable>
              )}
          </View>
        ))
      )}
    </View>
  );
};

export default OfferList;
