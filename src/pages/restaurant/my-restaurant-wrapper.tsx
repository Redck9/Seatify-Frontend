import { useParams } from "react-router-dom";
import MyRestaurantPage from "./my-restaurant-page";

const MyRestaurantWrapper = () => {
  const { restaurantUid } = useParams<{ restaurantUid: string }>();

  if (!restaurantUid) {
    return <p>Invalid restaurant ID</p>;
  }

  return <MyRestaurantPage restaurantUid={restaurantUid} tablesCapacity={10} />; // Adjust capacity as needed
};

export default MyRestaurantWrapper;
