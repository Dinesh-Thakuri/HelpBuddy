import React, { useState, useEffect, useContext } from "react";
import {
  View,
  Text,
  TextInput,
  Pressable,
  Image,
  ActivityIndicator,
} from "react-native";
import HelpPostCard from "./HelpPostCard.jsx";
import client from "../../api/client.js";
import { AuthContext } from "../../context/AuthContext.jsx";
import { useNavigation } from "@react-navigation/native";

const HelpPostsList = () => {
  const navigation = useNavigation();
  const [helpPosts, setHelpPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const { userId, userToken } = useContext(AuthContext);
  const [myData, setMyData] = useState({});

  useEffect(() => {
    getAllHelpPosts();
    const getMyData = async () => {
      if (!userId || !userToken) return;
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
  }, [userId, userToken]);

  const getAllHelpPosts = async (tags = "") => {
    try {
      if (tags === "") {
        const response = await client.get("/helpPost/allHelpPost");
        setHelpPosts(response.data.data.reverse());
        console.log(response.data.data.reverse());
        setLoading(false);
        return;
      }
      const response = await client.get(
        `/helpPost/search?tags=${tags.replace(/\s+/g, ",")}`
      );
      setHelpPosts(response.data.data.reverse());
      console.log(response.data.data.reverse());
      setLoading(false);
    } catch (error) {
      console.log(error);
    }
  };

  const handleSearch = (text) => {
    setSearch(text);
    if (text.trim() === "") {
      getAllHelpPosts();
    } else {
      getAllHelpPosts(text.trim());
    }
  };

  return (
    <View>
      <View className="w-full flex-row items-center justify-between">
        <TextInput
          className="border border-slate-400 rounded-xl px-4 w-3/4 h-10 ml-4 mt-3"
          placeholder="Search"
          value={search}
          onChangeText={handleSearch}
        />
        <Pressable
          className=" rounded-md px-3 mt-4"
          onPress={() => navigation.navigate("Profile")}
        >
          {myData.profilePictureUrl && (
            <Image
              source={{ uri: myData.profilePictureUrl }}
              className="rounded-full w-16 h-16 "
            />
          )}
        </Pressable>
      </View>
      {loading ? (
        <ActivityIndicator size="large" color="#0000ff" />
      ) : (
        Array.from(helpPosts)
          .map((helpPost) => (
            <HelpPostCard key={helpPost.helpPostId} helpPost={helpPost} />
          ))
          .reverse()
      )}
    </View>
  );
};

export default HelpPostsList;
