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
import { Entypo } from "@expo/vector-icons";

const CompleteHelpPostModal = (helpPostId) => {
  const helpPostID = helpPostId.helpPostId.helpPostId;
  const [modalVisible, setModalVisible] = useState(false);
  const { userToken, userId } = useContext(AuthContext);
  const [finish, setFinish] = useState("");

  const handleCompletePost = async () => {
    try {
      if (finish !== "Finish") {
        Alert.alert(
          "Invalid Input",
          "Please enter 'Finish' to complete the job."
        );
        return;
      }
      const response = await client.get(`/helpPost/finish/${helpPostID}`, {
        headers: {
          Authorization: `Bearer ${userToken}`,
        },
      });

      const response2 = await client.get(
        `/helpPost/getHelpPostById/${response.data.data.helpPostId}`,
        {
          headers: {
            Authorization: `Bearer ${userToken}`,
          },
        }
      );

      const helperId = response.data.data.helperId;
      const price = response2.data.data[0].reward - 5;

      addMoneyToWallet(price, helperId);

      const myWallet = await client.get(`/wallet/getWallet/${userId}`, {
        headers: {
          Authorization: `Bearer ${userToken}`,
        },
      });

      const response3 = await client.get(`/wallet/getWallet/${helperId}`, {
        headers: {
          Authorization: `Bearer ${userToken}`,
        },
      });

      const walletId = response3.data.data.walletId;
      const myWalletId = myWallet.data.data.walletId;
      recordTransaction(price, walletId, myWalletId);
      Alert.alert("Success", "Help post completed successfully.");
      setModalVisible(false);
    } catch (error) {
      console.log(error);
    }
  };

  const addMoneyToWallet = async (balance, helperId) => {
    try {
      const { data } = await client.post(
        `/wallet/addMoney/${helperId}`,
        {
          balance,
        },
        {
          headers: {
            Authorization: `Bearer ${userToken}`,
          },
        }
      );
    } catch (error) {
      console.log(error);
    }
  };

  const recordTransaction = async (balance, walletId, myWalletId) => {
    try {
      const data = await client.post(
        "/transaction/recordTransaction/completeHelp",
        {
          balance,
          helpPostId: helpPostID,
          walletId: walletId,
          myWalletId: myWalletId,
        },
        {
          headers: {
            Authorization: `Bearer ${userToken}`,
          },
        }
      );
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <View className="flex justify-center items-center">
      <Modal
        animationType="slide"
        transparent={true}
        visible={modalVisible}
        onRequestClose={() => {
          setModalVisible(!modalVisible);
        }}
      >
        <View className="flex w-full h-full pb-8 justify-end items-center ">
          <View className="bg-orange-300 rounded-xl shadow-md p-4 w-[90%] h-[250px] mt-4">
            <View className="flex flex-row justify-between gap-4 py-4">
              <Text className="text-xl font-bold ">Are you sure?</Text>
              <Pressable
                className=" bg-red-500 rounded-sm px-2 py-1"
                onPress={() => setModalVisible(!modalVisible)}
              >
                <Text className="text-white font-black">X</Text>
              </Pressable>
            </View>

            <Text className="text-lg font-bold">
              Type Finish to complete the job.
            </Text>
            <TextInput
              placeholder="Finish"
              onChangeText={(text) => setFinish(text)}
              value={finish}
              className="bg-gray-200 w-full h-10 px-4 py-2 mb-2 rounded"
            />
            <Pressable
              className="bg-orange-600 rounded-full p-3 mb-2"
              onPress={handleCompletePost}
            >
              <Text className="text-white text-center font-bold">Submit</Text>
            </Pressable>
          </View>
        </View>
      </Modal>
      <Pressable
        className="bg-orange-500 p-2 rounded-3xl w-full mt-3"
        onPress={() => setModalVisible(true)}
      >
        <Text className="text-center font-medium text-lg text-white">
          Complete help post
        </Text>
      </Pressable>
    </View>
  );
};

export default CompleteHelpPostModal;
