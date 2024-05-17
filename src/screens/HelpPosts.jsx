import { ScrollView, SafeAreaView, ActivityIndicator } from "react-native";

import React, { useState, useEffect } from "react";
import Header from "../components/Home/Header";
import HelpPostsList from "../components/HelpPost/HelpPostList";

const HelpPosts = () => {
  return (
    <SafeAreaView className="flex w-full mt-5 px-2">
      <ScrollView className="flex gap-2 mt-1">
        <HelpPostsList />
      </ScrollView>
    </SafeAreaView>
  );
};

export default HelpPosts;
