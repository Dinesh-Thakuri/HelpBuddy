import React, { useState, useEffect, useContext } from "react";
import { useRoute } from "@react-navigation/native";
import {
  Text,
  View,
  SafeAreaView,
  Image,
  TextInput,
  Pressable,
  ActivityIndicator,
  ScrollView,
} from "react-native";
import { AuthContext } from "../context/AuthContext";
import socketServices from "../utils/socketService.js";
import { useNavigation } from "@react-navigation/native";

import {
  Ionicons,
  MaterialCommunityIcons,
  AntDesign,
} from "@expo/vector-icons";
import client from "../api/client.js";

const Chats = () => {
  const scrollViewRef = React.useRef(null);
  const navigation = useNavigation();
  const route = useRoute();
  const { requesterId, helperId, chatRoomId } = route.params;
  const { userId, userToken } = useContext(AuthContext);
  const [otherUserInfo, setOtherUserInfo] = useState(null);
  const [oldMessages, setOldMessages] = useState([]);
  const [messages, setMessages] = useState("");

  useEffect(() => {
    if (userId == helperId) {
      getUserInfo(requesterId);
    } else if (userId == requesterId) {
      getUserInfo(helperId);
    }
  }, [userId, requesterId, helperId]);

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
    // Initialize socket and send user ID to the server
    socketServices.initializeSocket();
    socketServices.emit("user_id", userId);

    // Fetch old messages
    fetchOldMessages(chatRoomId);

    // Set up socket listener for received messages
    socketServices.on("received_message", (msg) => {
      if (msg.chatRoomId === chatRoomId) {
        setOldMessages((prevMessages) => [msg, ...prevMessages]);
        scrollToBottom();
      }
    });

    scrollToBottom();
    return () => {
      socketServices.off("received_message");
    };
  }, [chatRoomId, userId]);

  const fetchOldMessages = async (chatRoomId) => {
    try {
      const response = await client.get(`/chat/getMessages/${chatRoomId}`, {
        headers: {
          Authorization: `Bearer ${userToken}`,
        },
      });
      await setOldMessages(response.data.data);
      scrollToBottom();
      if (scrollViewRef.current) {
        scrollViewRef.current.scrollToEnd({ animated: true });
      }
    } catch (error) {
      console.error("Error fetching old messages:", error);
    }
  };

  const scrollToBottom = () => {
    if (scrollViewRef.current) {
      scrollViewRef.current.scrollToEnd({ animated: true });
    }
  };

  const sendMessage = async () => {
    if (!!messages) {
      // Emit the message via socket
      socketServices.emit("send_message", {
        chatRoomId: chatRoomId,
        message: messages,
        senderId: userId,
      });

      // Send the message to the backend API endpoint
      try {
        await client.post(
          "/chat/sendMessage",
          {
            chatRoomId: chatRoomId,
            message: messages,
            receiverId: otherUserInfo.userId,
          },
          {
            headers: {
              Authorization: `Bearer ${userToken}`,
            },
          }
        );
        setMessages("");

        scrollToBottom();
      } catch (error) {
        console.error("Error sending message:", error);
      }
    } else {
      alert("Please enter message");
    }
  };

  if (!otherUserInfo) {
    return <ActivityIndicator />;
  }

  return (
    <SafeAreaView className="flex-1 mt-7">
      <View className="flex-1">
        {/* Chat header */}
        <View className="mt-2 px-1">
          <View className="flex-row justify-between px-1">
            <Pressable onPress={() => navigation.navigate("Messages")}>
              <Ionicons name="arrow-back-outline" size={30} color="black" />
            </Pressable>
            <MaterialCommunityIcons
              name="dots-vertical"
              size={30}
              color="black"
            />
          </View>
          <View className="flex-row border-b-2  border-gray-400 pb-4 items-center mt-2 px-1">
            <Image
              source={{ uri: otherUserInfo.profilePictureUrl }}
              className="rounded-full w-14 h-14"
            />
            <View className="flex flex-row justify-between w-[85%]">
              <View className="w-2/3 px-1">
                <View className="ml-1">
                  <Text className="text-xl font-bold">
                    {otherUserInfo.firstName}
                  </Text>
                  <Text className="text-sm p-1 rounded-full w-[50px] bg-green-300">
                    Active
                  </Text>
                </View>
              </View>
              <Pressable
                onPress={() => {
                  navigation.navigate("View-profile", {
                    userID: otherUserInfo.userId,
                  });
                }}
              >
                <AntDesign name="rightcircleo" size={30} color="black" />
              </Pressable>
            </View>
          </View>
        </View>

        {/* Chat View */}
        <View className="flex-1 justify-end   ">
          <ScrollView
            ref={scrollViewRef}
            className="flex-1"
            contentContainerStyle={{
              flexDirection: "column-reverse",
              paddingVertical: 16,
            }}
          >
            {oldMessages.map((message, index) => (
              <View
                key={index}
                className={`flex-row  justify-${
                  userId == message.senderId ? "end" : "start"
                } mb-3`}
              >
                <Text
                  className={`px-3 py-1 rounded-lg ${
                    userId == message.senderId
                      ? "bg-blue-300 "
                      : "bg-orange-200"
                  } text-xl font-semibold `}
                >
                  {message.message}
                </Text>
              </View>
            ))}
          </ScrollView>
        </View>

        {/* Input area */}
        <View className="px-1">
          <View className="flex-row items-center p-1">
            <TextInput
              value={messages}
              className="border flex-1 h-11 rounded-lg p-3"
              placeholder="Enter Your Message"
              onChangeText={(text) => setMessages(text)}
            />
            <Pressable onPress={sendMessage}>
              <Text className="border rounded-lg py-2 px-4 bg-orange-500 font-bold text-white ml-4">
                Send
              </Text>
            </Pressable>
          </View>
        </View>
      </View>
    </SafeAreaView>
  );
};
export default Chats;
