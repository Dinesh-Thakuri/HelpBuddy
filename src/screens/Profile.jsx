import {
  Text,
  View,
  Image,
  SafeAreaView,
  TouchableOpacity,
} from "react-native";
import { useState, useEffect, useContext } from "react";
import { AuthContext } from "../context/AuthContext";
import EditProfile from "../components/Profile/EditProfile";
import { useNavigation } from "@react-navigation/native";
import { AntDesign } from "@expo/vector-icons"; // Import the AntDesign icon library
import client from "../api/client";

const Profile = () => {
  const navigation = useNavigation();

  const { userToken, userId } = useContext(AuthContext);
  const { logout } = useContext(AuthContext);

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

  return (
    <SafeAreaView className="flex justify-center items-center w-full mt-10">
      <Text className="font-semibold text-2xl">Profile</Text>
      <View className="relative">
        <Image
          source={{ uri: myData.profilePictureUrl }}
          className=" h-[100px] w-[100px] rounded-full border-2 mt-8 "
        />
        {/* Blue tick icon if user is verified */}
        {myData.isProfilePictureVerified && (
          <View className="absolute bottom-0 right-0">
            <AntDesign name="checkcircle" size={24} color="#51AFF7" />
          </View>
        )}
        {!myData.isProfilePictureVerified && (
          <View className="absolute bottom-0 right-0">
            <AntDesign name="closecircle" size={24} color="#ff392e" />
          </View>
        )}
      </View>
      <Text className="text-2xl font-bold mt-1">
        {myData.firstName} {myData.middleName} {myData.lastName}
      </Text>
      <Text> {myData.email} </Text>

      <View className=" border-t gap-2 pt-5 mt-10">
        <TouchableOpacity
          className="rounded-lg w-80 p-3 bg-orange-400"
          onPress={() => {
            navigation.navigate("MyProfile");
          }}
        >
          <Text className="font-bold text-lg text-white text-center">
            My Profile
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          className="rounded-lg w-80 p-3 bg-orange-400"
          onPress={() => {
            navigation.navigate("Wallet");
          }}
        >
          <Text className="font-bold text-lg text-white text-center">
            Wallet
          </Text>
        </TouchableOpacity>

        {!myData.isProfilePictureVerified && (
          <TouchableOpacity
            className="rounded-lg w-80 p-3 bg-orange-400"
            onPress={() => {
              navigation.navigate("VerifyProfilePicture");
            }}
          >
            <Text className="font-bold text-lg text-white text-center">
              Verify Profile Picture
            </Text>
          </TouchableOpacity>
        )}
        <TouchableOpacity
          className="rounded-lg w-80 p-3 bg-orange-400"
          onPress={() => {
            navigation.navigate("Settings");
          }}
        >
          <Text className="font-bold text-lg text-white text-center">
            Settings
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          className="rounded-lg w-80 p-3 bg-orange-400"
          onPress={() => {
            logout();
          }}
        >
          <Text className="font-bold text-lg text-white text-center">
            LogOut
          </Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
};

export default Profile;
