import { Button, ScrollView, Text, View, SafeAreaView } from "react-native";

import MyHelpPostsList from "../components/HelpPost/MyHelpPostList";
import KhaltiExample from "../components/Khalti";
import CreateHelpPostModal from "../components/Modal/MyHelpPost/CreateHelpPost";

const MyHelpPosts = () => {
  return (
    <SafeAreaView className="flex w-full mt-10 px-2">
      <ScrollView className="flex gap-2 mt-1">
        <CreateHelpPostModal />
        <MyHelpPostsList />
      </ScrollView>
    </SafeAreaView>
  );
};

export default MyHelpPosts;
