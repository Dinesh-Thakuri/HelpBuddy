import React, { useState, useEffect, useContext } from "react";
import {
  Text,
  View,
  ScrollView,
  ActivityIndicator,
  RefreshControl,
} from "react-native"; // Assuming React Native environment
import MyHelpPostCard from "./MyHelpPostCard.jsx"; // Importing the HelpPostCard component
import client from "../../api/client.js";
import { AuthContext } from "../../context/AuthContext.jsx";

const MyHelpPostsList = () => {
  const { userToken, userId } = useContext(AuthContext);
  const [refreshing, setRefreshing] = useState(false);

  const [helpPosts, setHelpPosts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getMyHelpPosts();
  }, []);

  const getMyHelpPosts = async () => {
    try {
      const config = {
        headers: {
          Authorization: `Bearer ${userToken}`,
        },
      };

      const response = await client.get(
        `/helpPost/myHelpPost/${userId}`,
        config
      );
      setHelpPosts(response.data.data.reverse());
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
    }
  };

  const onRefresh = React.useCallback(async () => {
    setRefreshing(true);
    await getMyHelpPosts();
    setRefreshing(false);
  }, []);

  return (
    <ScrollView
      refreshControl={
        <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
      }
    >
      {helpPosts.length === 0 ? (
        <View className=" h-[80vh] justify-center items-center">
          <Text className="font-bold text-xl">
            You have not created any Help Post{" "}
          </Text>
        </View>
      ) : loading ? (
        <ActivityIndicator size="large" color="#0000ff" />
      ) : (
        <View>
          {Array.from(helpPosts).map((helpPost) => (
            <MyHelpPostCard key={helpPost.helpPostId} helpPost={helpPost} />
          ))}
        </View>
      )}
    </ScrollView>
  );
};

export default MyHelpPostsList;
