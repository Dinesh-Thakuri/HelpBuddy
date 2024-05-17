import {
  View,
  SafeAreaView,
  Text,
  Image,
  Pressable,
  ActivityIndicator,
} from "react-native";
import React, { useState, useContext, useEffect } from "react";
import MessageCard from "./MessageCard";
import { useNavigation } from "@react-navigation/native";
import { AuthContext } from "../../context/AuthContext";
import client from "../../api/client";

const MessageList = ({ chatRoom }) => {
  const navigation = useNavigation();
  const { userToken, userId } = useContext(AuthContext);
  const [otherUserInfo, setOtherUserInfo] = useState(null);

  useEffect(() => {
    if (userId == chatRoom.helperId) {
      getUserInfo(chatRoom.requesterId);
    } else if (userId == chatRoom.requesterId) {
      getUserInfo(chatRoom.helperId);
    }
  }, [userId, chatRoom.requesterId, chatRoom.helperId]);

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

  // Render loading indicator if otherUserInfo is null
  if (!otherUserInfo) {
    return <ActivityIndicator />;
  }

  return (
    <SafeAreaView>
      {/* <MessageCard chatRoom={chatRoom} /> */}
      <View className="flex mb-2 ">
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
            <View className="p-2">
              <Image
                source={{ uri: otherUserInfo.profilePictureUrl }}
                className="w-12 h-12 rounded-full"
              />
            </View>

            <View className="flex flex-col  p-2">
              <Text className="text-black mb-1">
                {otherUserInfo.firstName} {otherUserInfo.lastName}
              </Text>
              <Text className="mb-1">Last message</Text>

            </View>
          </View>
        </Pressable>
      </View>
    </SafeAreaView>
  );
};

export default MessageList;
