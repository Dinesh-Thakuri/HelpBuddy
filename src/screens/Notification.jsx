import {
  Text,
  View,
  SafeAreaView,
  ScrollView,
  Image,
  RefreshControl,
} from "react-native";

import { useContext, useEffect, useState } from "react";
import { AuthContext } from "../context/AuthContext";
import client from "../api/client";

const Notification = () => {
  const [notifications, setNotifications] = useState([]);
  const { userToken, userId } = useContext(AuthContext);
  const [refreshing, setRefreshing] = useState(false);

  const [loading, setLoading] = useState(true);
  const getMyNotifications = async () => {
    try {
      const config = {
        headers: {
          Authorization: `Bearer ${userToken}`,
        },
      };

      const response = await client.get(`/notification/myNotification`, config);
      setNotifications(response.data.data.reverse());
      console.log("Notifications", response.data.data.reverse());
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    getMyNotifications();
  }, []);

  return (
    <SafeAreaView className="flex w-full mt-12 px-2">
      <Text className="font-semibold text-2xl mb-3">Notification</Text>
      <ScrollView
        className="h-[80vh]"
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={getMyNotifications}
          />
        }
      >
        {console.log("noti:::", notifications.length)}
        {notifications.length === 0 && (
          <View className="h-[80vh] justify-center items-center">
            <Text className="font-bold text-xl">You have no notifications</Text>
          </View>
        )}
        {notifications.reverse().map((notification) => (
          <View
            key={notification.notificationId}
            className="bg-orange-200 p-3 rounded-2xl mb-2"
          >
            <View className="flex flex-row justify-between items-center mb-1">
              <View className="flex-row items-end">
                <Image
                  source={{ uri: notification.sender.profilePictureUrl }}
                  className="w-8 h-8 rounded-full mr-2"
                />
                <Text className=" text-lg mr-2">
                  {notification.sender.firstName} {notification.sender.lastName}
                </Text>
              </View>
              <Text>{notification.relativeDate}</Text>
            </View>
            {notification.type === "bid" && (
              <Text>
                {notification.sender.firstName} offered help to your post
              </Text>
            )}
            {notification.type === "like" && (
              <Text>{notification.sender.firstName} liked your help post</Text>
            )}
            {notification.type === "acceptOffer" && (
              <Text>{notification.sender.firstName} accepted your offer</Text>
            )}
            {notification.type === "comment" && (
              <Text>
                {notification.sender.firstName} commented on your post
              </Text>
            )}
            {notification.type === "wrthdrawSuccessfull" && (
              <Text>
                {notification.sender.firstName} approved your withdrawal request
              </Text>
            )}
          </View>
        ))}
      </ScrollView>
    </SafeAreaView>
  );
};

export default Notification;
