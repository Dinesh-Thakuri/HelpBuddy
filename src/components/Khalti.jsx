import React, { useState, useEffect, useContext } from "react";
import { Button, Text, Pressable, SafeAreaView, Alert } from "react-native";

import { KhatiSdk } from "rn-all-nepal-payment";
import client from "../api/client";
import { AuthContext } from "../context/AuthContext";

const KhaltiExample = ({ price }) => {
  const [isVisible, setIsVisible] = useState(false);
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

  const amount = price * 10;

  const _onPaymentComplete = (data) => {
    setIsVisible(false);
    const str = data.nativeEvent.data;
    const resp = JSON.parse(str);
    const balance = resp.data.amount / 10;
    const idx = resp.data.idx;
    addMoneyToWallet(balance);
    recordTransaction(balance, idx);
    Alert.alert("Recharge Successful");
  };

  //add money to wallet and record transaction
  const addMoneyToWallet = async (balance) => {
    try {
      const { data } = await client.post(
        "/wallet/addMoney",
        {
          balance,
        },
        {
          headers: {
            Authorization: `Bearer ${userToken}`,
          },
        }
      );
      console.log("Add Money", data);
    } catch (error) {
      console.log(error);
    }
  };

  const recordTransaction = async (balance, idx) => {
    try {
      const data = await client.post(
        "/transaction/recordTransaction",
        {
          balance,
          idx,
          transactionType: "Recharge",
        },
        {
          headers: {
            Authorization: `Bearer ${userToken}`,
          },
        }
      );
      console.log("Record Transaction", data);
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <SafeAreaView>
      {/* <Button title={`${price}`} onPress={() => setIsVisible(true)} /> */}
      <Pressable
        className="w-full bg-white px-5 py-3 rounded-lg flex-row justify-between items-center mt-2"
        onPress={() => {
          if (!myData.isProfilePictureVerified) {
            Alert.alert(
              "You need to verify your account to recharge your wallet."
            );
            return;
          }
          setIsVisible(true);
        }}
      >
        <Text className="font-medium text-lg">
          Rs.{price} for {price}Points
        </Text>
        <Text className="font-bold text-lg text-yellow-400 bg-white px-2 py-1 rounded-xl">
          Buy
        </Text>
      </Pressable>
      <KhatiSdk
        amount={amount} // Number in paisa
        isVisible={isVisible} // Bool to show model
        paymentPreference={[
          // Array of services needed from Khalti
          "KHALTI",
          "EBANKING",
          "MOBILE_BANKING",
          "CONNECT_IPS",
          "SCT",
        ]}
        productName={price} // Name of product
        productIdentity={"1234567890"} // Unique product identifier at merchant
        onPaymentComplete={_onPaymentComplete} // Callback from Khalti Web Sdk
        productUrl={"http://gameofthrones.wikia.com/wiki/Dragons"} // Url of product
        publicKey={"test_public_key_c1711563f7894de58e18b02f4b7c6715"} // Test or live public key which identifies the merchant
      />
    </SafeAreaView>
  );
};

export default KhaltiExample;
