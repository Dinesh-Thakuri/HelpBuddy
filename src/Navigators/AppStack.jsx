import React from "react";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { FontAwesomeIcon } from "@fortawesome/react-native-fontawesome";
import {
  faHome,
  faList,
  faBell,
  faEnvelope,
  faUser,
} from "@fortawesome/free-solid-svg-icons";

import HelpPosts from "../screens/HelpPosts.jsx";
import MyHelpPosts from "../screens/MyHelpPosts.jsx";
import Notification from "../screens/Notification.jsx";
import Message from "../screens/Message.jsx";

import MyProfile from "../screens/MyProfile.jsx";
import Wallet from "../screens/Wallet.jsx";
import History from "../screens/History.jsx";
import Chats from "../screens/Chats.jsx";
import Profile from "../screens/Profile.jsx";
import VerifyProfilePicture from "../components/AiPhotoVerify/VerifyProfilePicture.jsx";
import Settings from "../screens/Settings.jsx";
import ViewProfile from "../screens/ViewProfile.jsx";

const Tab = createBottomTabNavigator();
const Stack = createNativeStackNavigator();

export const AppStack = () => {
  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        tabBarIcon: ({ color, size }) => {
          let icon;
          switch (route.name) {
            case "HelpPosts":
              icon = faHome;
              break;
            case "MyHelpPosts":
              icon = faList;
              break;
            case "Notification":
              icon = faBell;
              break;
            case "Message":
              icon = faEnvelope;
              break;
            case "Profile":
              icon = faUser;
              break;
            default:
              icon = faHome;
          }
          return <FontAwesomeIcon icon={icon} color={color} size={size} />;
        },
        tabBarActiveTintColor: "#FFA500",
        tabBarShowLabel: true,
        tabBarLabelPosition: "below-icon",
        tabBarStyle: {
          display: "flex",
        },
      })}
    >
      <Tab.Screen
        name="HelpPost"
        component={HelpPosts}
        options={{ headerShown: false }}
      />
      <Tab.Screen
        name="MyHelpPosts"
        component={MyHelpPostNavigator}
        options={{ headerShown: false }}
      />
      <Tab.Screen
        name="Notification"
        component={Notification}
        options={{ headerShown: false }}
      />
      <Tab.Screen
        name="Message"
        component={MessageNavigator}
        options={{ headerShown: false }}
      />
      <Tab.Screen
        name="Profile"
        component={StackNavigator}
        options={{ headerShown: false }}
      />
    </Tab.Navigator>
  );
};

const MyHelpPostNavigator = () => {
  return (
    <Stack.Navigator>
      <Stack.Screen
        name="MyHelpPost"
        component={MyHelpPosts}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name="View-profile"
        component={ViewProfile}
        options={{ headerShown: false }}
      />
    </Stack.Navigator>
  );
};

const StackNavigator = () => {
  return (
    <Stack.Navigator>
      <Stack.Screen
        name="Profiles"
        component={Profile}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name="MyProfile"
        component={MyProfile}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name="Wallet"
        component={Wallet}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name="History"
        component={History}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name="Settings"
        component={Settings}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name="VerifyProfilePicture"
        component={VerifyProfilePicture}
        options={{ headerShown: false }}
      />
    </Stack.Navigator>
  );
};
const MessageNavigator = () => {
  return (
    <Stack.Navigator>
      <Stack.Screen
        name="Messages"
        component={Message}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name="Chats"
        component={Chats}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name="View-profile"
        component={ViewProfile}
        options={{ headerShown: false }}
      />
    </Stack.Navigator>
  );
};

export default AppStack;
