import { useState, useEffect, useContext } from "react";
import {
  Text,
  View,
  SafeAreaView,
  Image,
  TextInput,
  Pressable,
  ActivityIndicator,
  RefreshControl,
  ScrollView,
} from "react-native";
import MessageList from "../components/Message/MessageList";
import { useNavigation } from "@react-navigation/native";
import client from "../api/client";
import { AuthContext } from "../context/AuthContext";

const Message = () => {
  const { userToken } = useContext(AuthContext);
  const [refreshing, setRefreshing] = useState(false);
  const [chatRooms, setChatRooms] = useState([]);
  const [loading, setLoading] = useState(true);

  const navigation = useNavigation();

  useEffect(() => {
    getChatRoom();
  }, []);

  const getChatRoom = async () => {
    try {
      const response = await client.get("/chat/getChats", {
        headers: {
          Authorization: `Bearer ${userToken}`,
        },
      });
      setChatRooms(response.data.data);
      console.log("asdfjhn", response.data.data);
      setLoading(false);
    } catch (error) {
      console.log(error);
    }
  };

  const onRefresh = () => {
    setRefreshing(true);
    getChatRoom();
    setRefreshing(false);
  };

  if (chatRooms.length === 0) {
    return (
      <ScrollView
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
      >
        <SafeAreaView className="flex w-full mt-5 px-2">
          <View className="mt-4">
            <Text className="font-semibold text-2xl"></Text>
            <TextInput
              className="border border-slate-400 rounded-xl p-2 mt-3"
              placeholder="Search"
            />
          </View>
          <View className=" h-[80vh] justify-center items-center">
            <Text className="font-bold text-xl">No Messages</Text>
          </View>
        </SafeAreaView>
      </ScrollView>
    );
  }

  return (
    <ScrollView
      refreshControl={
        <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
      }
    >
      <SafeAreaView className="flex w-full mt-10 px-2">
        <View className="mt-4">
          {/* TextInput for search bar */}
          <Text className="font-semibold text-2xl">Messages</Text>
          <TextInput
            className="border border-slate-400 rounded-xl p-2 mt-3"
            placeholder="Search"
          />
        </View>
        <View className="flex-col-reverse mt-3 mb-3">
          {loading ? (
            <ActivityIndicator size="large" color="#0000ff" />
          ) : (
            Array.from(chatRooms).map((chatRoom) => (
              <MessageList key={chatRoom.chatRoomId} chatRoom={chatRoom} />
            ))
          )}
        </View>
      </SafeAreaView>
    </ScrollView>
  );
};

export default Message;
