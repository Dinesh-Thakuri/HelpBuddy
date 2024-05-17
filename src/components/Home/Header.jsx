import { View, Text, TextInput, Pressable, Image } from "react-native";
import React, { useState, useContext, useEffect } from "react";
import { AuthContext } from "../../context/AuthContext";
import { useNavigation } from "@react-navigation/native";
import client from "../../api/client";

export default function Header() {
  const navigation = useNavigation();

  const [search, setSearch] = useState("");

  const { userId, userToken } = useContext(AuthContext);

  const [myData, setMyData] = useState({});
  useEffect(() => {
    const getMyData = async () => {
      if (!userId || !userToken) return; // Skip if userId or userToken is not available

      try {
        const response = await client.get(`/user/getUserInfoById/${userId}`, {
          headers: {
            Authorization: `Bearer ${userToken}`,
          },
        });
        setMyData(response.data.data);
      } catch (error) {
        console.error("Error fetching user data:", error);
      }
    };

    getMyData();
  }, [userId, userToken]); // Add userId and userToken as dependencies

  return (
    <View className="w-full flex-row items-center justify-between">
      <TextInput
        className="border border-slate-400 rounded-xl px-4 w-3/4 h-10 ml-4 mt-3"
        placeholder="Search"
        value={search}
        onChangeText={(text) => setSearch(text)}
      />
      <Pressable
        className="  rounded-md  px-3 mt-4"
        onPress={() => navigation.navigate("Profile")}
      >
        {myData.profilePictureUrl && (
          <Image
            //use source of profilePictureUrl
            source={{ uri: myData.profilePictureUrl }}
            className="rounded-full w-16 h-16 "
          />
        )}

        
      </Pressable>
    </View>
  );
}
