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
import { FontAwesome6 } from "@expo/vector-icons";
import { BlurView } from "expo-blur";

const WithdrawMoney = (walletBalance) => {
  const [modalVisible, setModalVisible] = useState(false);

  const [withdrawAmount, setWithdrawAmount] = useState("");
  const { userToken, profilePictureUrl } = useContext(AuthContext);

  const requestForWithdraw = async () => {
    try {
      const totalBalance = parseFloat(walletBalance.walletBalance);
      const withdrawAmountValue = parseFloat(withdrawAmount);

      // Check if the remaining balance after withdrawal is less than 100
      const remainingBalance = totalBalance - withdrawAmountValue;
      console.log("Remaining balance:", remainingBalance);

      if (withdrawAmountValue < 100) {
        console.log("Withdrawal amount should be at least 100");
        Alert.alert("Withdrawal amount should be at least 100");
        return;
      }

      if (remainingBalance <= 100) {
        console.log("Amount Not able to withdraw");
        Alert.alert(`Please enter amount less than ${totalBalance}.`);
        return;
      }

      // Make the withdrawal request
      const response = await client.post(
        "/wallet/withdrawMoneyRequest",
        {
          amount: withdrawAmountValue,
          totalBalance: totalBalance,
        },
        {
          headers: {
            Authorization: `Bearer ${userToken}`,
          },
        }
      );

      console.log("Withdrawal successful:", response.data);
      Alert.alert("Withdrawal Request sent successfully");
      setModalVisible(!modalVisible);
      // You can add additional logic here, such as updating the UI or state
    } catch (error) {
      console.error("Withdrawal error:", error);
      Alert.alert(
        "Error",
        "An error occurred while processing the withdrawal. Please try again later."
      );
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
          <View className="flex w-full h-full justify-center pb-14 items-center ">
            <View className="bg-orange-200 rounded-xl shadow-md p-4 w-[90%] mt-4">
              <View className="flex flex-row justify-between gap-4 py-4">
                <Text className="text-xl font-bold ">Withdraw Money</Text>
                <Pressable
                  className=" bg-red-500 rounded-sm px-2 py-1"
                  onPress={() => setModalVisible(!modalVisible)}
                >
                  <Text className="text-white font-black">X</Text>
                </Pressable>
              </View>
              <Text>
                Please enter amount in between 100 to{" "}
                {walletBalance.walletBalance - 100}
              </Text>
              <TextInput
                className="bg-white border p-2 rounded-lg"
                keyboardType="numeric"
                placeholder="Amount"
                value={withdrawAmount}
                onChangeText={(text) => setWithdrawAmount(text)}
              />
              <Pressable className="mt-3" onPress={requestForWithdraw}>
                <Text className="rounded-full p-2 bg-orange-500 text-white font-bold text-lg text-center">
                  Withdraw
                </Text>
              </Pressable>
            </View>
          </View>
        </BlurView>
      </Modal>
      <Pressable
        className="flex-row bg-red-400 p-2 w-[80%] rounded-lg justify-center items-center"
        onPress={() => setModalVisible(true)}
      >
        <FontAwesome6 name="money-bills" size={24} color="white" />
        <Text className="text-white font-bold ml-2">Withdraw Money</Text>
      </Pressable>
    </View>
  );
};

export default WithdrawMoney;
