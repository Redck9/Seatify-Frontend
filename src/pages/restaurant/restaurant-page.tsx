import { getAccessToken } from "@/authService"
import { useEffect, useState } from "react"
import { useNavigate } from "react-router-dom"
import axios from "axios";
import {
    Tabs,
    TabsContent,
    TabsList,
    TabsTrigger,
  } from "@/app/components/ui/tabs"
import { Separator } from "@/app/components/ui/separator"
import { useParams } from "react-router-dom";

interface Restaurant 
{
    name: string,
    type:  string,
    location: string,
    tablesCapacity: number,
    description: string,
    menuItem: MenuItem[],
    schedule: Schedule[]
}

interface MenuItem
{
    name: string,
    description: string,
    price: number,
    category: string,
    ingredients: string[],
    vegan: boolean,
    glutenFree: boolean,
    calories: number,
    availability: boolean,
    preparationTime: number,
    availableDays: string[]
}

interface Schedule
{
    day: string,
    openTime: string,
    closeTime: string
}

export default function RestaurantPage()
{
    const { restaurantUid } = useParams(); 
    const [restaurant, setRestaurant] = useState<Restaurant | null>(null);
    const [error, setError] = useState<string | null>(null);
    const [loading, setLoading] = useState<boolean>(true);
    const navigate = useNavigate();

    const fetchRestaurant = async () =>
    {
        setLoading(true);
        setError(null);
        
        const accessToken = await getAccessToken();
        if(!accessToken)
        {
            setError("Session expired. Please log in again.");
            navigate("/");
            return;
        }

        try{
            const response = await axios.get<Restaurant>(`http://192.168.1.44:8282/restaurant/bff/api/restaurant/${restaurantUid}`, {
                headers: {
                    Authorization: `Bearer ${accessToken}`,
                }
            })
            setRestaurant(response.data)
    
        }
        catch (err)
        {
            setError("Failed to fetch restaurant. Please try again.");
            console.error("Error fetching restaurant:", err);
        }
        finally
        {
            setLoading(false);
        }
    }

    useEffect(() => {
        fetchRestaurant();
        const intervalId = setInterval(fetchRestaurant, 120000);
        return () => clearInterval(intervalId);
    }, [])

    return(
        <div className="w-full min-h-screen px-4 pt-20 mx-auto max-w-screen-3xl">
            <h2 className="w-full mb-4 text-3xl font-bold text-blue-600">
                {restaurant?.name}
            </h2>
        
            <Separator className="my-4" />
            <Tabs defaultValue="Information" className="w-full max-w-none">
                <TabsList className="grid w-full grid-cols-3 gap-4 px-2">
                    <TabsTrigger value="Information">Information</TabsTrigger>
                    <TabsTrigger value="Menu">Menu</TabsTrigger>
                    <TabsTrigger value="Live Layout">Live Layout</TabsTrigger>
                </TabsList>

                <TabsContent value="Information" className="flex w-full">
                    <div className="flex-1 p-4">
                        <p className="mb-4 text-gray-400">{restaurant?.description || "No description available"}</p>
                        <p><strong>Type:</strong> {restaurant?.type}</p>
                        <p><strong>Location:</strong> {restaurant?.location}</p>
                        <p><strong>Tables Capacity:</strong> {restaurant?.tablesCapacity}</p>
                        <h3 className="mt-4 text-lg font-semibold">Weekly Schedule: </h3>
                        <ul className="pl-5 list-disc">
                            {restaurant?.schedule.map((s, index) => (
                                <li key={index}>
                                    <strong>{s.day}:</strong> {s.openTime} - {s.closeTime}
                                </li>
                            ))}
                        </ul>
                    </div>  
                </TabsContent>

                <TabsContent value="Menu" className="flex w-full">
                    <div className="flex-1 p-4">
                        {restaurant?.menuItem.length === 0 ? (
                            <p><strong>No menu items available.</strong></p>
                        ): (
                            <ul className="space-y-4">
                                {restaurant?.menuItem.map((m, index) => (
                                    <li key={index} className="p-4 border rounded-md shadow-md">
                                        <h3 className="text-lg font-semibold">{m.name}</h3>
                                        <p className="mb-4 text-gray-400">{m.description || "No description available"}</p>
                                        
                                        <p className="mb-1"><strong>Price:</strong> {m.price ? `${m.price} €` : "Not available"}</p>
                                        <p className="mb-1"><strong>Category:</strong> {m.category || "Not categorized"}</p>
                                        <p className="mb-1"><strong>Ingredients:</strong> {m.ingredients && m.ingredients.length > 0 ? m.ingredients.join(", ") : "No ingredients listed"}</p>
                                        <p className="mb-1"><strong>Vegan:</strong> {m.vegan !== undefined ? (m.vegan ? "Yes" : "No") : "Not specified"}</p>
                                        <p className="mb-1"><strong>Gluten Free:</strong> {m.glutenFree !== undefined ? (m.glutenFree ? "Yes" : "No") : "Not specified"}</p>
                                        <p className="mb-1"><strong>Calories:</strong> {m.calories ? m.calories : "Not specified"}</p>
                                        <p className="mb-1"><strong>Availability:</strong> {m.availability !== undefined ? (m.availability ? "Yes" : "No") : "Unknown"}</p>
                                        <p className="mb-1"><strong>Preparation Time:</strong> {m.preparationTime ? `${m.preparationTime} minutes` : "Not provided"}</p>
                                        <p className="mb-1"><strong>Available Days:</strong> {m.availableDays && m.availableDays.length > 0 ? m.availableDays.join(", ") : "No specific days"}</p>
                                    </li>
                                ))}
                            </ul>            
                            )}
                    </div>
                </TabsContent>

                <TabsContent value="Live Layout" className="flex w-full">
                            {/* Nothing yet */}
                    <div className="flex-1 p-4">
                        <p className="text-gray-500">Live Layout coming soon...</p>
                    </div>
                </TabsContent>
            </Tabs>
        </div>
    )
}