import React, { useState, useEffect, useContext } from "react";
import {
  Modal,
  View,
  Text,
  Image,
  Pressable,
  TextInput,
  Alert,
  SafeAreaView,
  ActivityIndicator,
} from "react-native";
import * as ImagePicker from "expo-image-picker";
import { AuthContext } from "../../../context/AuthContext";
import client from "../../../api/client";
import { useNavigation } from "@react-navigation/native";
import { BlurView } from "expo-blur";

const CreateHelpPostModal = () => {
  const navigation = useNavigation();
  const { userToken, userId } = useContext(AuthContext);
  const [loading, setLoading] = useState(false);
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

  const [modalVisible, setModalVisible] = useState(false);
  const [selectedImage, setSelectedImage] = useState(null);
  const [description, setDescription] = useState("");
  const [price, setPrice] = useState("");
  const [tags, setTags] = useState([]);
  const [tagInput, setTagInput] = useState("");

  useEffect(() => {
    // Request permission to access the camera roll
    (async () => {
      const { status } =
        await ImagePicker.requestMediaLibraryPermissionsAsync();
      if (status !== "granted") {
        Alert.alert(
          "Permission Denied",
          "Sorry, we need camera roll permissions to make this work!"
        );
      }
    })();
  }, []);

  const handleImagePicker = async () => {
    try {
      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: true,
        aspect: [1, 1],
        quality: 1,
      });
      if (!result.cancelled) {
        setSelectedImage(result.assets[0].uri);
      } else {
        console.log(
          "User canceled image selection or result URI is undefined:",
          result
        );
      }
    } catch (error) {
      // console.error("ImagePicker Error:", error);
      // Alert.alert("Choose Photo", "Please try again.");
    }
  };

  const handleAddTag = () => {
    if (tags.length >= 5) {
      Alert.alert("Maximum Tags Reached", "You can only add up to 5 tags.");
      return;
    }
    if (tagInput.trim() !== "") {
      setTags([...tags, tagInput.trim()]);
      setTagInput("");
    }
  };

  const handleRemoveTag = (index) => {
    const newTags = [...tags];
    newTags.splice(index, 1);
    setTags(newTags);
    console.log("tags", tags);
  };

  const handleCreatePost = async () => {
    setLoading(true);
    if (!myData.isProfilePictureVerified) {
      Alert.alert("You need to verify your account Create Help Post");
      return;
    }

    if (!description || !price || !selectedImage || tags.length === 0) {
      setLoading(false);
      Alert.alert("Invalid Input", "Please enter required fields.");
      return;
    }
    const formData = new FormData();
    formData.append("helpPostDescription", description);
    formData.append("reward", price);
    formData.append("helpPostPicture", {
      name: `${description}_${price}.jpeg`,
      type: "image/jpeg",
      uri: selectedImage,
    });

    tags.forEach((tag, index) => {
      formData.append(`tags[${index}]`, tag);
    });

    const config = {
      headers: {
        "Content-Type": "multipart/form-data",
        Authorization: `Bearer ${userToken}`,
      },
      transformRequest: () => {
        return formData;
      },
    };
    const response = await client.post("/helpPost/create", formData, config);
    setLoading(false);
    Alert.alert("Success", "Help post created successfully!");
    navigation.navigate("MyHelpPosts");
    setModalVisible(false);
  };

  return (
    <SafeAreaView className="flex justify-center items-center">
      <Modal
        // animationType pop up
        animationType="slide"
        transparent={true}
        visible={modalVisible}
        onRequestClose={() => {
          setModalVisible(!modalVisible);
        }}
      >
        <BlurView className="w-full h-[100vh]" intensity={100} tint="prominent">
          <View className="flex h-full w-full justify-center items-center ">
            <View className="bg-orange-200 rounded-xl shadow-md p-4 w-[90%] mt-4">
              <View className="flex flex-row justify-between gap-4 py-4">
                <Text className="text-xl font-bold ">Create a Help Post!</Text>
                <Pressable
                  className=" bg-red-500 rounded-sm px-2 py-1"
                  onPress={() => setModalVisible(!modalVisible)}
                >
                  <Text className="text-white font-black">X</Text>
                </Pressable>
              </View>

              <TextInput
                placeholder="Description"
                onChangeText={(text) => setDescription(text)}
                value={description}
                className="bg-white w-full h-10 px-4 py-2 mb-2 rounded"
              />
              <TextInput
                placeholder="Price"
                onChangeText={(text) => setPrice(text)}
                value={price}
                keyboardType="numeric"
                className="bg-white w-full h-10 px-4 py-2 mb-2 rounded"
              />

              {/* Tag Inputs */}
              <TextInput
                placeholder="Add Tag"
                onChangeText={(text) => setTagInput(text)}
                value={tagInput}
                onSubmitEditing={handleAddTag}
                className="bg-white w-full h-10 px-4 py-2 mb-2 rounded"
              />

              {/* Display Selected Tags */}
              <View className="flex flex-row flex-wrap">
                {tags.map((tag, index) => (
                  <View
                    key={index}
                    className="bg-white px-3 py-1 m-1 rounded-full flex-row items-center"
                  >
                    <Text className="bg-orange-200 px-3 mr-1 rounded-full">
                      {tag}
                    </Text>
                    <Pressable
                      className="bg-red-300 rounded-3xl px-2"
                      onPress={() => handleRemoveTag(index)}
                    >
                      <Text>X</Text>
                    </Pressable>
                  </View>
                ))}
              </View>

              <View className="flex justify-center items-center py-4">
                {selectedImage && (
                  <Image
                    className=" w-80 h-80 rounded-md "
                    source={{ uri: selectedImage }}
                  />
                )}
              </View>
              <Pressable
                className="bg-orange-600 rounded-full p-3 mb-2"
                onPress={handleImagePicker}
              >
                <Text className="text-white text-center font-bold">
                  Select Photo
                </Text>
              </Pressable>
              <Pressable
                className="flex-row justify-center bg-orange-600 rounded-full p-3 mb-2"
                onPress={handleCreatePost}
              >
                <Text className="text-white text-center font-bold">Submit</Text>
                {/* {loading && <ActivityIndicator className="" />} */}
                {loading && (
                  <ActivityIndicator className="ml-5" color="#ffff" />
                )}
              </Pressable>
            </View>
          </View>
        </BlurView>
      </Modal>
      <Pressable
        className="  w-[90%] mx-3 bg-orange-400 rounded-2xl py-2"
        onPress={() => setModalVisible(true)}
      >
        <Text className="text-white font-bold text-xl text-center">
          Create a Help Post
        </Text>
      </Pressable>
    </SafeAreaView>
  );
};

export default CreateHelpPostModal;
