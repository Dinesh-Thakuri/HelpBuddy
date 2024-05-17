import React, { useState, useEffect, useContext } from "react";
import {
  Modal,
  View,
  Text,
  Pressable,
} from "react-native";

import { FontAwesome5 } from "@expo/vector-icons";

const TermsAndConditionsModal = () => {
  const [modalVisible, setModalVisible] = useState(false);


  const termsAndConditionsContent = `
    User Responsibilities
    Users must provide accurate and up-to-date information when registering for the Help Buddy application.
    Users are solely responsible for the actions they take while using the Help Buddy application.
    Users agree to treat other Users with respect and refrain from engaging in any behavior that may be harmful, offensive, or illegal.
    Users must comply with all applicable laws and regulations while using the Help Buddy application.

    Payments and Fees
    Help Buddy may facilitate payments between Users for services rendered.
    Users agree to pay any applicable fees or charges associated with using the Help Buddy application.
    Help Buddy may charge a service fee for transactions processed through the platform. The amount and terms of this fee will be disclosed to Users before completing a transaction.

    Privacy Policy
    Help Buddy collects and stores personal information from Users in accordance with its Privacy Policy. By using the Help Buddy application, Users consent to the collection, storage, and use of their personal information as described in the Privacy Policy.

    Termination
    Help Buddy reserves the right to terminate or suspend User accounts at any time and for any reason without prior notice.
    Users may terminate their accounts with Help Buddy at any time by contacting customer support.

    Modifications
    Help Buddy reserves the right to modify these terms and conditions at any time without prior notice. Changes will be effective immediately upon posting on this page.

    Contact Information
    If you have any questions or concerns about these terms and conditions, please contact us at [Your Contact Information].
  `;


  return (
    <View className="flex  ">
      <Modal
        // animationType pop up
        animationType="slide"
        transparent={true}
        visible={modalVisible}
        onRequestClose={() => {
          setModalVisible(!modalVisible);
        }}
      >
        <View className="flex justify-center items-center ">
          <View className="bg-white rounded-xl shadow-md p-4 w-full mt-4">
            <View className="flex flex-row justify-between gap-4 py-4">
              <Text className="text-xl font-bold "> Terms And Conditions</Text>
              <Pressable
                className=" bg-red-500 rounded-sm px-2 py-1"
                onPress={() => setModalVisible(!modalVisible)}
              >
                <Text className="text-white font-black">X</Text>
              </Pressable>
            </View>
            {/* Input for current password, new password, confirm new password */}
            <Text>{termsAndConditionsContent}</Text>
          </View>
        </View>
      </Modal>
      <Pressable
        className=" flex-row bg-orange-400 p-5 m-2 rounded-md"
        onPress={() => setModalVisible(true)}
      >
        <FontAwesome5 name="clipboard-check" size={24} color="white" />
        <Text className="text-white  font-bold text-xl ml-4">
          Terms And Conditions
        </Text>
      </Pressable>
    </View>
  );
};

export default TermsAndConditionsModal;
