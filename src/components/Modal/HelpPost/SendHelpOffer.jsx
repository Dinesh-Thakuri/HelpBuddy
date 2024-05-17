import React, { useState, useEffect, useContext } from "react";
import { Modal, View, Text, Alert, Pressable, TextInput } from "react-native";
import { AuthContext } from "../../../context/AuthContext";
import client from "../../../api/client";
import { useNavigation } from "@react-navigation/native";
import { BlurView } from "expo-blur";

const SendHelpOffer = ({ helpPostId }) => {
  const navigation = useNavigation();

  const [modalVisible, setModalVisible] = useState(false);
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

  const [bid, setBid] = useState("");
  const [message, setMessage] = useState("");

  const submitBid = async () => {
    if (!myData.isProfilePictureVerified) {
      Alert.alert(
        "You need to verify your account to submit bid for a help post"
      );
      return;
    }
    if (bid == "") {
      Alert.alert("Invalid Input", "Please enter bid amount.");
      return;
    }
    if (bid < 10) {
      Alert.alert("Invalid Input", "Bid amount should be more than 10.");
      return;
    }

    const config = {
      headers: {
        Authorization: `Bearer ${userToken}`,
      },
    };
    const response = await client.post(
      `/helpPost/offerHelp/${helpPostId}`,
      { bid, message },
      config
    );
    navigation.navigate("HelpPost");
    Alert.alert("Bid successfull");
    setModalVisible(false);
  };

  const handleBidChange = (text) => {
    // Check if the input is a valid number and greater than or equal to 10
    if (/^\d+$/.test(text) && parseInt(text) >= 10) {
      setBid(text);
    }
  };

  return (
    <View className="flex justify-center items-center">
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
          <View className="flex w-full h-[100vh] justify-center items-center ">
            <View className="flex justify-between bg-orange-200 rounded-xl shadow-md p-4 w-[90%] h-[30%] mt-4">
              <View>
                <View className="flex flex-row justify-between gap-4 py-4">
                  <Text className="text-xl font-bold ">Offer Help</Text>
                  <Pressable
                    className=" bg-red-500 rounded-sm px-2 py-1"
                    onPress={() => setModalVisible(false)}
                  >
                    <Text className="text-white font-black">X</Text>
                  </Pressable>
                </View>
                <TextInput
                  placeholder="Bid Amount: More than 10"
                  onChangeText={handleBidChange}
                  keyboardType="numeric"
                  style={{
                    backgroundColor: "#ffff",
                    width: "100%",
                    height: 40,
                    paddingHorizontal: 10,
                    marginBottom: 10,
                    borderRadius: 8,
                  }}
                />
                <TextInput
                  placeholder="Approach Message"
                  onChangeText={(text) => setMessage(text)}
                  style={{
                    backgroundColor: "#ffff",
                    width: "100%",
                    height: 40,
                    paddingHorizontal: 10,
                    marginBottom: 10,
                    borderRadius: 8,
                  }}
                />
              </View>
              <Pressable
                className="bg-orange-600 rounded-full p-3 mb-2"
                onPress={submitBid}
              >
                <Text className="text-white text-center font-bold">Submit</Text>
              </Pressable>
            </View>
          </View>
        </BlurView>
      </Modal>
      <Pressable
        className="w-full bg-orange-500 rounded-full py-1 px-3"
        onPress={() => setModalVisible(true)}
      >
        <Text className="text-white font-bold">Send Help Offer</Text>
      </Pressable>
    </View>
  );
};

export default SendHelpOffer;
