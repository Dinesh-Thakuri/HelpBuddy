import React, { useState, useEffect, useContext } from "react";
import { View, Text, Image, TouchableOpacity } from "react-native";
import client from "../../api/client.js"; // Assuming you have a client for making API requests
import { AuthContext } from "../../context/AuthContext.jsx";
import CommentHelpPostModal from "../Modal/HelpPost/CommentHelpPostModal.jsx";
import ViewOffer from "../Modal/MyHelpPost/ViewOffers.jsx";
import MyHelpPostOptionModal from "../Modal/MyHelpPost/MyHelpPostOptionModal.jsx";

const MyHelpPostCard = ({ helpPost }) => {
  const { userToken } = useContext(AuthContext);

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
    status,
  } = helpPost;

  const [upVoteCount, setUpVoteCount] = useState(initialUpVoteCount);
  const [liked, setLiked] = useState(false);

  useEffect(() => {
    getLikedStatus();
  }, []);

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
    <View className="w-full bg-orange-100 rounded-xl p-3 m-2">
      <View className="flex flex-row items-center justify-between">
        <View className="flex flex-row items-center">
          {profilePictureUrl && (
            <Image
              source={{ uri: profilePictureUrl }}
              className="rounded-full w-10 h-10 mr-2"
            />
          )}
          <View>
            <Text>{`${firstName} ${lastName}`}</Text>
            <Text className="text-xs text-gray-500">{postDate}</Text>
          </View>
        </View>
        <View className="flex-row">
          {status === "Completed" && (
            <Text className="p-1 bg-green-300 rounded-lg">{status}</Text>
          )}
          {status === "Open" && (
            <Text className="p-1 bg-orange-300 rounded-lg">{status}</Text>
          )}
          {status === "OnGoing" && (
            <Text className="p-1 bg-white rounded-lg">{status}</Text>
          )}
          <MyHelpPostOptionModal helpPostId={helpPostId} />
        </View>
      </View>

      <Text className="text-base mt-1 ml-1">{helpPostDescription}</Text>

      {tags.length > 0 && (
        <View className="flex flex-row flex-wrap">
          {helpPost.tags.map((tag, index) => (
            <View
              key={index}
              className="bg-white px-3 py-1 m-1 rounded-full flex-row items-center"
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

        {/* see helper list */}
        <TouchableOpacity className="ml-10">
          <ViewOffer helpPostId={helpPostId} />
        </TouchableOpacity>

        <View className="flex flex-row">
          <View className="flex flex-row">
            <CommentHelpPostModal helpPostId={helpPostId} />
            <Text> {commentCount}</Text>
          </View>

          <TouchableOpacity
            className="flex-row items-center mr-4"
            onPress={handleLike}
          >
            <Text style={{ marginRight: 5 }}>👍</Text>
            <Text>{upVoteCount}</Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
};

export default MyHelpPostCard;
