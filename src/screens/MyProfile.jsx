import {
  Text,
  View,
  ScrollView,
  SafeAreaView,
  Button,
  Image,
  Pressable,
  RefreshControl,
} from "react-native";
import { useNavigation } from "@react-navigation/native";
import { AuthContext } from "../context/AuthContext";
import React, { useState, useEffect, useContext } from "react";
import EditProfile from "../components/Profile/EditProfile";
import UpdateProfilePicture from "../components/Profile/UpdateProfilePicture";
import ReviewList from "../components/Profile/ReviewList";
import client from "../api/client";
import { Ionicons } from "@expo/vector-icons";

const MyProfile = () => {
  const navigation = useNavigation();
  const { userToken, userId } = useContext(AuthContext);
  const [refreshing, setRefreshing] = useState(false);
  const [myData, setMyData] = useState({});
  useEffect(() => {
    getMyData();
  }, []);
  const getMyData = async () => {
    const response = await client.get(`/user/getUserInfoById/${userId}`, {
      headers: {
        Authorization: `Bearer ${userToken}`,
      },
    });
    setMyData(response.data.data);
  };

  const [overallRating, setOverallRating] = useState(0);
  const [totalSupport, setTotalSupport] = useState(0);

  useEffect(() => {
    getOverallUserRating();
    getTotalSupport();
  }, []);

  const getOverallUserRating = async () => {
    try {
      const response = await client.get(`/rating/overallUserRating`, {
        headers: {
          Authorization: `Bearer ${userToken}`,
        },
      });
      setOverallRating(response.data.data);
    } catch (error) {
      console.log(error);
    }
  };

  const getTotalSupport = async () => {
    try {
      const response = await client.get(`/user/getTotalSupport/${userId}`, {
        headers: { Authorization: `Bearer ${userToken}` },
      });
      setTotalSupport(response.data.data);
    } catch (error) {
      console.log(error);
    }
  };

  const onRefresh = React.useCallback(() => {
    setRefreshing(true);
    getOverallUserRating();
    getTotalSupport();
    getMyData();
    setRefreshing(false);
  }, []);

  return (
    <ScrollView
      refreshControl={
        <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
      }
    >
      <SafeAreaView className="flex w-full mt-10 px-2">
        <View className="flex-row justify-between items-center ">
          <Text
            onPress={() => navigation.navigate("Profiles")}
            className="font-lg  p-2 rounded-md"
          >
            <Ionicons name="chevron-back" size={25} color="black" />{" "}
          </Text>
          <Text className=" font-semibold text-2xl">User Profile</Text>
        </View>
        <View className="w-full flex flex-row ">
          <View className=" w-1/5 relative">
            <Image
              source={{ uri: myData.profilePictureUrl }}
              className=" h-[90px] w-[90px] rounded-full border-2"
            />
            <Pressable className="absolute bottom-7 right-0 bg-blue-600 bg-opacity-50 p-1 rounded-xl">
              {/*----------------------- Update Profile Picture------------------------- */}
              <UpdateProfilePicture />
            </Pressable>
          </View>
          <View className="flex-row ml-3 justify-between w-4/5 p-2">
            <View className="flex pl-2 ">
              <View className="flex-row gap-1">
                <Text className="text-lg font-bold">
                  {myData.firstName} {myData.middleName} {myData.lastName}
                </Text>
              </View>
              <Text className="text-base font-semibold">
                {/* if myData.designation is null then show Add Designation else show */}
                {myData.designation === ""
                  ? "Add Designation"
                  : myData.designation}
              </Text>
              <View className="flex-row gap-2">
                <View className="flex-col gap-1 bg-blue-200 p-1 rounded-xl justify-center items-center">
                  <Text className="text-sm font-bold">Total Rating</Text>
                  <Text>{overallRating === null ? "0" : overallRating}</Text>
                </View>
                <View className="flex-col gap-1 bg-orange-200 p-1 rounded-xl justify-center items-center">
                  <Text className="text-sm font-bold">Total Support</Text>
                  <Text>{totalSupport === null ? "0" : totalSupport}</Text>
                </View>
              </View>
            </View>
            <View>
              {/*----------------------- Edit Profile------------------------- */}
              <EditProfile />
            </View>
          </View>
        </View>

        <View className="mt-4">
          <Text className="text-lg font-bold">About</Text>
          <Text className="text-sm mt-2">
            {/* if myData.bio is null or ""then show Add your Bio else show myData.bio */}
            {console.log("Data Bio", myData.bio)}
            {myData.bio !== undefined && myData.bio !== ""
              ? myData.bio
              : "Add Bio"}
          </Text>
        </View>
        <View className=" border  border-slate-400 rounded-md p-1 mt-5">
          <Text className="text-xl font-bold ">Rating</Text>
          {/* Review card */}
          <ReviewList userId={userId} />
        </View>
      </SafeAreaView>
    </ScrollView>
  );
};

export default MyProfile;
