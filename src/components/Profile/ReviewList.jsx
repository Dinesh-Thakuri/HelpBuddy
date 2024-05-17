import { View, Text, Image, ScrollView } from "react-native";
import React, { useState, useEffect, useContext } from "react";
import client from "../../api/client";
import { AuthContext } from "../../context/AuthContext";

const ReviewList = ({ userId }) => {
  console.log("userId from review", userId);
  const { userToken } = useContext(AuthContext);

  const [rating, setRating] = useState([]);

  useEffect(() => {
    getMyReviews();
  }, []);

  const getMyReviews = async () => {
    try {
      const response = await client.get(`/rating/myRatings/${userId}`, {
        headers: {
          Authorization: `Bearer ${userToken}`,
        },
      });
      setRating(response.data.data);
      return response.data;
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <View className="flex-row ">
      {rating && rating.length === 0 && (
        <Text className="text-lg font-bold text-gray-600">
          Not received any Reviews Yet
        </Text>
      )}
      {rating.length > 0 && (
        <ScrollView
          className="w-full"
          horizontal={true}
          showsHorizontalScrollIndicator={false}
        >
          {rating.map((review) => (
            <View
              key={review.userRatingId}
              className="flex-row  mr-2  p-2 border rounded-lg"
            >
              <Image
                source={{ uri: review.byUser.profilePictureUrl }}
                className="h-[60px] w-[60px] rounded-full mr-3"
              />
              <View>
                <Text className="text-lg font-bold">
                  {review.byUser.firstName}
                </Text>
                <Text className="text-lg">{review.rating}/5</Text>
              </View>
            </View>
          ))}
        </ScrollView>
      )}
    </View>
  );
};

export default ReviewList;
