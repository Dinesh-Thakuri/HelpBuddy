import React, { useState, useEffect, useContext } from "react";
import {
  Modal,
  View,
  Text,
  Image,
  Pressable,
  TextInput,
  Alert,
} from "react-native";
import { AuthContext } from "../../../context/AuthContext";
import client from "../../../api/client";
import { BlurView } from "expo-blur";

const CommentHelpPostModal = ({ helpPostId }) => {
  const [modalVisible, setModalVisible] = useState(false);
  const [comments, setComments] = useState([]);
  const { userToken, userId } = useContext(AuthContext);

  const [myData, setMyData] = useState({});

  useEffect(() => {
    fetchComments();
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

  const fetchComments = async () => {
    try {
      const response = await client.get(`helpPost/allComments/${helpPostId}`, {
        headers: {
          Authorization: `Bearer ${userToken}`,
        },
      });
      setComments(response.data.data);
    } catch (error) {
      console.log("Error fetching comments:", error);
    }
  };

  const [showCommentInput, setShowCommentInput] = useState(false);
  const [comment, setComment] = useState("");

  const handleToggleCommentInput = () => {
    setShowCommentInput(!showCommentInput);
  };

  const handleCommentChange = (text) => {
    setComment(text);
    console.log("Comment:", text);
  };

  const handleSubmitComment = async () => {
    if (!myData.isProfilePictureVerified) {
      Alert.alert("You need to verify your account to comment in a help post");
      return;
    }
    try {
      // Send API request to submit the comment
      await client.post(
        `/helpPost/comment/${helpPostId}`,
        { comment },
        {
          headers: {
            Authorization: `Bearer ${userToken}`,
          },
        }
      );
      // Reset comment input and hide it
      setComment("");
      setShowCommentInput(false);
      // Refresh comments
      fetchComments();
    } catch (error) {
      console.log("Error submitting comment:", error);
    }
  };

  return (
    <View>
      <Modal
        animationType="slide"
        transparent={true}
        visible={modalVisible}
        onRequestClose={() => {
          setModalVisible(!modalVisible);
        }}
      >
        <BlurView className="w-full h-[100vh]" intensity={100} tint="prominent">
          <View className="flex w-full h-full justify-center items-center">
            <View className="bg-orange-200 p-4 rounded-xl w-11/12 h-[85%]">
              <View className="flex flex-row justify-between items-center mb-2">
                <Text className="font-bold text-lg">Comments</Text>
                <Pressable
                  className="bg-red-500 rounded-sm px-2 py-1"
                  onPress={() => setModalVisible(!modalVisible)}
                >
                  <Text className="text-white font-black">X</Text>
                </Pressable>
              </View>
              <View className="  flex-col justify-between">
                <View>
                  {Array.from(comments).map((comment) => (
                    <View
                      key={comment.helpPostCommentId}
                      className="mb-4 rounded-lg bg-white p-3"
                    >
                      <View className="flex flex-row justify-between items-center">
                        <View className="flex-row">
                          <Image
                            source={{ uri: comment.user.profilePictureUrl }}
                            className="rounded-full w-10 h-10 mr-2"
                          />
                          <View>
                            <View className="flex flex-row justify-between w-[90%]" >
                              <Text className="font-bold">
                                {comment.user.firstName} {comment.user.lastName}
                              </Text>
                              <Text className="text-xs text-gray-500">
                                {comment.relativeDateTime}
                              </Text>
                            </View>
                            <Text className="ml-1 mt-1">{comment.comment}</Text>
                          </View>
                        </View>
                      </View>
                    </View>
                  ))}
                </View>
                <View>
                  {showCommentInput && (
                    <View className="mt-2">
                      <TextInput
                        placeholder="Write a comment..."
                        value={comment}
                        onChangeText={handleCommentChange}
                        multiline={true}
                        className=" bg-white border border-gray-300 rounded-md p-2"
                      />
                      <Pressable
                        onPress={handleSubmitComment}
                        className="mt-2 bg-orange-500 rounded-md p-2"
                      >
                        <Text className="text-white text-center font-bold">
                          Post Comment
                        </Text>
                      </Pressable>
                    </View>
                  )}
                  <Pressable onPress={handleToggleCommentInput} className="">
                    <Text className="font-semibold">
                      {showCommentInput ? "Hide" : "Add a comment"}
                    </Text>
                  </Pressable>
                </View>
              </View>
            </View>
          </View>
        </BlurView>
      </Modal>
      <Pressable onPress={() => setModalVisible(true)}>
        <Text>💬</Text>
      </Pressable>
    </View>
  );
};

export default CommentHelpPostModal;
