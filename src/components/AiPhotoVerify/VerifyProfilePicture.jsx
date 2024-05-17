import React, { useState, useEffect, useContext, useRef } from "react";
import {
  View,
  ActivityIndicator,
  SafeAreaView,
  Text,
  Image,
  Button,
  Alert,
  Pressable,
} from "react-native";
import { AuthContext } from "../../context/AuthContext.jsx";
import { Camera } from "expo-camera";
import client from "../../api/client.js";
import { useNavigation } from "@react-navigation/native";
import { FontAwesome6 } from "@expo/vector-icons";

const VerifyProfilePicture = () => {
  const navigation = useNavigation();
  const { userToken, userId } = useContext(AuthContext);

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

  const cameraRef = useRef();
  const [hasPermission, setHasPermission] = useState();
  const [photo, setPhoto] = useState(null);
  const [similarityScore, setSimilarityScore] = useState(null);
  const [cameraType, setCameraType] = useState(Camera.Constants.Type.front);
  const [isCameraMounted, setIsCameraMounted] = useState(true);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    (async () => {
      const { status } = await Camera.requestCameraPermissionsAsync();
      setHasPermission(status === "granted");
    })();

    return () => {
      setIsCameraMounted(false);
    };
  }, []);

  if (hasPermission === undefined) {
    return (
      <View>
        <Text>Requesting for camera permission</Text>
      </View>
    );
  } else if (!hasPermission) {
    return (
      <View>
        <Text>No access to camera</Text>
      </View>
    );
  }

  const takePic = async () => {
    setLoading(true);
    let options = { quality: 1, base64: true, exif: false };
    let newPhoto = await cameraRef.current.takePictureAsync(options);

    setPhoto(newPhoto);

    if (newPhoto !== null) {
      try {
        const url = "https://api.luxand.cloud/photo/similarity";
        const formData = new FormData();
        formData.append("face1", {
          uri: newPhoto.uri,
          name: "face1.jpg",
          type: "image/jpeg",
        });
        formData.append("face2", {
          uri: myData.profilePictureUrl,
          name: "face2.jpg",
          type: "image/jpeg",
        });
        formData.append("token", "541be7c016f04d5aad0f2f9cf02c81c7");

        const response = await fetch(url, {
          method: "POST",
          body: formData,
        });

        const data = await response.json();
        console.log("photo Match:", data);
        setSimilarityScore(data.score);
        console.log("Score:", similarityScore);

        if (data.score >= 0.85) {
          Alert.alert(
            "Success",
            "Photos match! Your account is now verified.  Re login to access all features."
          );
          await updateUserStatus();
          setIsCameraMounted(false); // Dismount the camera
          setLoading(false);
          navigation.navigate("Profiles");
        } else {
          Alert.alert("Error", "Photos do not match.");
        }
      } catch (error) {
        console.log(error);
      }
      // await checkIfMatch();
    } else {
      Alert.alert("Error", "Unable to take photo. Please try again.");
    }
  };

  const switchCamera = () => {
    setCameraType((prevType) =>
      prevType === Camera.Constants.Type.back
        ? Camera.Constants.Type.front
        : Camera.Constants.Type.back
    );
  };

  const checkIfMatch = async () => {
    try {
      const url = "https://api.luxand.cloud/photo/similarity";
      const formData = new FormData();
      formData.append("face1", {
        uri: photo.uri,
        name: "face1.jpg",
        type: "image/jpeg",
      });
      formData.append("face2", {
        uri: myData.profilePictureUrl,
        name: "face2.jpg",
        type: "image/jpeg",
      });
      formData.append("token", "541be7c016f04d5aad0f2f9cf02c81c7");

      const response = await fetch(url, {
        method: "POST",
        body: formData,
      });

      const data = await response.json();
      console.log("photo Match:", data);
      setSimilarityScore(data.score);
      console.log("Score:", similarityScore);

      if (data.score >= 0.85) {
        Alert.alert("Success", "Photos match!");
        await updateUserStatus();
        setIsCameraMounted(false); // Dismount the camera
      } else {
        Alert.alert("Error", "Photos do not match.");
      }
    } catch (error) {
      console.log(error);
    }
  };

  const updateUserStatus = async () => {
    try {
      const response = await client.patch(
        `/user/updateUserIsVerified/${userId}`,
        {
          isVerified: true,
        },
        {
          headers: {
            Authorization: `Bearer ${userToken}`,
          },
        }
      );
      console.log(response);
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <SafeAreaView className="mt-9">
      <View className="flex-row justify-between">
        <Pressable
          className="p-2  "
          onPress={() => navigation.navigate("Profiles")}
        >
          <Text
            onPress={() => navigation.navigate("Profiles")}
            className="font-lg bg-red-500 p-2 rounded-md"
          >
            Go Back
          </Text>
        </Pressable>
        <Text className="text-right font-semibold p-2 text-lg">
          AI Profile Picture Verification
        </Text>
      </View>
      {isCameraMounted && (
        <Camera ref={cameraRef} type={cameraType} className="h-[65vh]">
          <View></View>
        </Camera>
      )}
      <View className="flex-row  justify-center items-center gap-3 mt-10">
        <Pressable
          className="flex-row items-center bg-orange-400 p-2 rounded-xl "
          onPress={switchCamera}
        >
          <FontAwesome6 name="camera-rotate" size={24} color="white" />
          <Text className=" ml-2 text-base font-bold text-white">
            Switch Camera
          </Text>
        </Pressable>
        <Pressable
          className="flex-row items-center bg-orange-400 p-2 rounded-xl"
          onPress={takePic}
        >
          <FontAwesome6 name="camera" size={24} color="white" />
          <Text className=" ml-2 text-base font-bold text-white">
            Verify Photo
          </Text>
          {loading && <ActivityIndicator />}
        </Pressable>
      </View>
      {photo && (
        <View>
          <Image source={{ uri: photo.uri }} />
          {similarityScore !== null && (
            <Text>Similarity Score: {(similarityScore * 100).toFixed(2)}%</Text>
          )}
        </View>
      )}
    </SafeAreaView>
  );
};

export default VerifyProfilePicture;
