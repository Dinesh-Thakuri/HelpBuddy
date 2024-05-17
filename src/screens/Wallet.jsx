import {
  Text,
  View,
  SafeAreaView,
  Button,
  Image,
  Pressable,
  ScrollView,
  RefreshControl,
} from "react-native";
import { useNavigation } from "@react-navigation/native";
import React, { useState, useEffect, useContext } from "react";
import { FontAwesome } from "@expo/vector-icons";
import { AntDesign } from "@expo/vector-icons";
import { FontAwesome6 } from "@expo/vector-icons";
import { Feather } from "@expo/vector-icons";

import { AuthContext } from "../context/AuthContext";
import AddMoney from "../components/Modal/Wallet/AddMoney";
import WithdrawMoney from "../components/Modal/Wallet/WithdrawMoney";
import client from "../api/client";
import { Ionicons } from "@expo/vector-icons";

const Wallet = () => {
  const navigation = useNavigation();
  const { userToken, profilePictureUrl } = useContext(AuthContext);
  const [refreshing, setRefreshing] = useState(false);
  const [wallet, setWallet] = useState([]);
  const [transaction, setTransaction] = useState([]);
  useEffect(() => {
    getUserWallet();
    getUserTransaction();
  }, []);

  const getUserWallet = async () => {
    try {
      const config = {
        headers: {
          Authorization: `Bearer ${userToken}`,
        },
      };
      const response = await client.get("/wallet/getWallet", config);
      setWallet(response.data.data);
    } catch (error) {
      ``;
      console.log(error);
    }
  };

  const getUserTransaction = async () => {
    try {
      const config = {
        headers: {
          Authorization: `Bearer ${userToken}`,
        },
      };

      const response = await client.get(
        `/transaction/getTransactions/${wallet.walletId}`,
        config
      );

      setTransaction(response.data.data);
    } catch (error) {
      console.log(error);
    }
  };

  const getTransactionColor = (transactionType) => {
    if (transactionType === "Recharge") {
      return "blue-200";
    } else if (transactionType === "Income") {
      return "green-300";
    } else if (transactionType === "Withdraw") {
      return "green-400";
    } else if (transactionType === "Bid") {
      return "orange-200";
    } else if (transactionType === "PostCreation") {
      return "red-200";
    } else if (transactionType === "HelpPostPaid") {
      return "red-200";
    }
  };

  const getIconType = (transactionType) => {
    if (transactionType === "Recharge") {
      return "plus-circle";
    } else if (transactionType === "Income") {
      return "trending-up";
    } else if (transactionType === "Withdraw") {
      return "dollar-sign";
    } else if (transactionType === "Bid") {
      return "minus-circle";
    } else if (transactionType === "PostCreation") {
      return "minus-square";
    } else if (transactionType === "HelpPostPaid") {
      return "minus-circle";
    }
  };

  const onRefresh = React.useCallback(() => {
    setRefreshing(true);
    // Call your API functions to fetch the latest data
    getUserWallet();
    getUserTransaction();
    // After fetching the data, set the refreshing state to false
    setRefreshing(false);
  }, []);

  return (
    <ScrollView
      refreshControl={
        <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
      }
    >
      <SafeAreaView className="flex w-full mt-10 px-2">
        <View className="flex-row justify-between items-center mt-2">
          <Text
            onPress={() => navigation.navigate("Profiles")}
            className="font-lg  p-2 rounded-md"
          >
            <Ionicons name="chevron-back" size={25} color="black" />{" "}
          </Text>
          <Text className="font-semibold text-2xl">Wallet</Text>
        </View>
        <View className="flex-row items-center mt-3 ">
          <Text className="text-xl font-bold">Total Balance: </Text>
          <View className="flex-row gap-2 items-center">
            <Text className="text-2xl font-bold">Rs.{wallet.balance}</Text>
            <FontAwesome name="eye" size={24} color="black" />
          </View>
        </View>
        {/* Pressable to add money and withdraw money */}
        <View className="flex-row justify-around mt-5">
          {/* --------------------------Add Money-------------------------- */}
          <AddMoney />
          {/* --------------------------Withdraw Money-------------------------- */}
          <WithdrawMoney walletBalance={wallet.balance} />
        </View>
        <View className="mt-5 flex-row justify-between border-t-2-">
          <View>
            <Text className="text-lg font-bold  border-slate-600 mt-4 p-2">
              Total Income
            </Text>
            <Text className="text-lg font-bold  border-slate-600 p-2 ">
              {wallet.totalIncome}{" "}
            </Text>
          </View>
          <View>
            <Text className="text-lg font-bold  border-slate-600 mt-4 p-2">
              Total Outgoing{" "}
            </Text>
            <Text className="text-lg font-bold  border-slate-600 p-2 ">
              {wallet.totalExpense}{" "}
            </Text>
          </View>
        </View>
        <View className="mt-5">
          <Text className="text-lg font-bold border-t-2 border-slate-600 mt-4 p-2">
            {" "}
            History
          </Text>
        </View>
        <ScrollView>
          <View className="flex-col-reverse">
            {transaction.map((transaction, index) => (
              <View
                key={index}
                className={`bg-${
                  getTransactionColor(transaction.transactionType) || "gray-200"
                } flex-row justify-between mt-2 p-2 rounded-xl`}
              >
                <View className="flex-row gap-2 items-center">
                  <Feather
                    name={getIconType(transaction.transactionType)}
                    size={24}
                    color="black"
                  />
                  <View>
                    <Text className="">{transaction.transactionType}</Text>
                    <Text className="text-sm">
                      {transaction.transactionDate}
                    </Text>
                  </View>
                </View>
                <Text className="text-base">Rs. {transaction.amount}</Text>
              </View>
            ))}
          </View>
        </ScrollView>
      </SafeAreaView>
    </ScrollView>
  );
};
export default Wallet;
