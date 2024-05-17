import React, { useState, useEffect, useContext } from "react";
import { View, Text, Image, Pressable, Alert } from "react-native";
import client from "../../api/client.js"; // Assuming you have a client for making API requests
import { AuthContext } from "../../context/AuthContext.jsx";
import CommentHelpPostModal from "../Modal/HelpPost/CommentHelpPostModal.jsx";
import SendHelpOffer from "../Modal/HelpPost/SendHelpOffer.jsx";

const HelpPostCard = ({ helpPost }) => {
  const { userToken, userId } = useContext(AuthContext);

  const {
    postDate,
    helpPostDescription,
    helpPostPictureUrl,
    commentCount,
    reward,
    Requester: { firstName, lastName, profilePictureUrl },
    upVoteCount: initialUpVoteCount,
    helpPostId,
    relativeDate,
    tags,
  } = helpPost;

  const [upVoteCount, setUpVoteCount] = useState(initialUpVoteCount);
  const [liked, setLiked] = useState(false);

  const [myData, setMyData] = useState({});

  useEffect(() => {
    getMyData();
    getLikedStatus();
  }, []);

  const getMyData = async () => {
    const response = await client.get(`/user/getUserInfoById/${userId}`, {
      headers: {
        Authorization: `Bearer ${userToken}`,
      },
    });
    setMyData(response.data.data);
  };

  const getLikedStatus = async () => {
    try {
      const response = await client.get(`/helpPost/likedStatus/${helpPostId}`, {
        headers: {
          Authorization: `Bearer ${userToken}`,
        },
      });
      setLiked(response.data.data);
    } catch (error) {
      console.log("aaa", error);
    }
  };

  const handleLike = async () => {
    if (!myData.isProfilePictureVerified) {
      Alert.alert("You need to verify your account to like a post");
      return;
    }
    try {
      if (!liked) {
        await client.get(`/helpPost/likeAndUnLike/${helpPostId}`, {
          headers: {
            Authorization: `Bearer ${userToken}`,
          },
        });
        setUpVoteCount(upVoteCount + 1);
        setLiked(true);
      } else {
        await client.get(`/helpPost/likeAndUnLike/${helpPostId}`, {
          headers: {
            Authorization: `Bearer ${userToken}`,
          },
        });
        setUpVoteCount(upVoteCount - 1);
        setLiked(false);
      }
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <View className="bg-white shadow-black shadow-2xl rounded-xl p-2 m-2">
      <View className="flex flex-row items-center">
        {profilePictureUrl && (
          <Image
            source={{ uri: profilePictureUrl }}
            className="rounded-full w-10 h-10 mr-2"
          />
        )}
        <View>
          <Text>{`${firstName} ${lastName}`}</Text>
          <Text className="text-xs text-gray-500">{relativeDate}</Text>
        </View>
      </View>

      <Text className="text-base mt-1 ml-1">{helpPostDescription}</Text>

      {tags.length > 0 && (
        <View className="flex flex-row flex-wrap ">
          {helpPost.tags.map((tag, index) => (
            <View
              key={index}
              className="bg-orange-100 shadow-2xl px-3 py-1 m-1 rounded-full flex-row items-center"
            >
              <Text className="px-1 mr-1 rounded-full">#{tag}</Text>
            </View>
          ))}
        </View>
      )}

      {helpPostPictureUrl && (
        <Image
          source={{ uri: helpPostPictureUrl }}
          className="border rounded-lg w-full h-80 mb-2 object-cover"
        />
      )}

      <View className="flex flex-row justify-between items-center">
        <Text className="font-bold">Rs.{reward}</Text>

        <Pressable className="ml-9">
          <SendHelpOffer helpPostId={helpPostId} />
        </Pressable>

        <View className="flex flex-row">
          <View className="flex flex-row">
            <CommentHelpPostModal helpPostId={helpPostId} />
            <Text> {commentCount}</Text>
          </View>
          <Pressable
            className="flex-row items-center mr-4"
            onPress={handleLike}
          >
            <Text style={{ marginRight: 5 }}>👍</Text>
            <Text>{upVoteCount}</Text>
          </Pressable>
        </View>
      </View>
    </View>
  );
};

export default HelpPostCard;
