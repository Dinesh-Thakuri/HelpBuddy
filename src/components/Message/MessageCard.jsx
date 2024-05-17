import { View, Text, Image, Pressable, ActivityIndicator } from "react-native";
import React, { useState, useEffect, useContext } from "react";
import { useNavigation } from "@react-navigation/native";
import { AuthContext } from "../../context/AuthContext";
import client from "../../api/client";

const MessageCard = ({ chatRoom }) => {
  console.log("chatRoom", chatRoom)
  const navigation = useNavigation();
  const { userToken, userId } = useContext(AuthContext);
  const [otherUserInfo, setOtherUserInfo] = useState(null);
  console.log("from messageCard", otherUserInfo);

  const getUserInfo = async (id) => {
    try {
      const response = await client.get(`/user/getUserInfoById/${id}`, {
        headers: { Authorization: `Bearer ${userToken}` },
      });
      setOtherUserInfo(response.data.data);
    } catch (error) {
      console.error("Error fetching user info:", error);
    }
  };

  useEffect(() => {
    if (userId == chatRoom.helperId) {
      getUserInfo(chatRoom.requesterId);
    } else if (userId == chatRoom.requesterId) {
      getUserInfo(chatRoom.helperId);
    }
  }, [userId, chatRoom.requesterId, chatRoom.helperId]);

  // Render loading indicator if otherUserInfo is null
  if (!otherUserInfo) {
    return <ActivityIndicator />;
  }

  // Once otherUserInfo is fetched, render the MessageCard components
  return (
    <View className="flex mt-1 ">
      <Pressable
        onPress={() => {
          navigation.navigate("Chats", {
            requesterId: chatRoom.requesterId,
            helperId: chatRoom.helperId,
            chatRoomId: chatRoom.chatRoomId,
          });
        }}
      >
        <View className="flex flex-row pl-2  w-full rounded-lg bg-orange-200 shadow">
          {/* Profile Picture */}
          <View className="p-2">
            <Image
              source={{ uri: otherUserInfo.profilePictureUrl }}
              className="w-12 h-12 rounded-full"
            />
          </View>

          {/* Username, Last Message, and Time */}
          <View className="flex flex-col  p-2">
            {/* Username */}
            <Text className="text-black mb-1">
              {otherUserInfo.firstName} {otherUserInfo.lastName}
            </Text>

            {/* Last Message */}
            <Text className="mb-1">Last message</Text>

            {/* Last Message Time */}
          </View>
        </View>
      </Pressable>
    </View>
  );
};

export default MessageCard;
