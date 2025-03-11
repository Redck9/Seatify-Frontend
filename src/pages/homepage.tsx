import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
  } from "@/app/components/ui/card"

import { Input } from "@/app/components/ui/input";
import { Search, Plus, ArrowRightIcon } from "lucide-react";
import { useNavigate } from "react-router-dom";

export default function HomePage() 
{
    const navigate = useNavigate(); 

    return (

            
            <div className="flex flex-col items-center w-full min-h-screen px-4 pt-20">

                {/* Welcome Section */}
                <div className="text-center">
                    <h2 className="text-3xl font-extrabold leading-snug text-center md:text-4xl">
                        Welcome to <span className="text-blue-600">Seatify</span>! 🚀  
                    </h2>
                    <p className="max-w-lg mt-4 text-lg text-center text-gray-400 md:text-xl">
                        <span className="font-semibold">Find Your Seat, Skip the Wait!</span> 🍽️  
                    </p>
                </div>

                {/* Search Bar Section */}
                <div className="relative w-full max-w-md mt-8">
                    <Search className="absolute text-gray-500 transform -translate-y-1/2 left-3 top-1/2" size={18} />
                    <Input
                        type="text"
                        placeholder="Search for a restaurant..."
                        className="py-2 pl-10 pr-4 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                </div>

                {/* Cards Section */}
                <div className="w-full px-4 mt-10 max-w-7xl">
                    <div className="grid justify-center gap-6 auto-rows-min sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-4 ">

                        <Card className="flex flex-col">
                            <CardHeader className="flex-grow">
                                <CardTitle>Create a Restaurant</CardTitle>
                                <CardDescription>
                                    Create a restaurant, define its layout and have access to a wide range of analytics created automatically by our AI based on the data collected.
                                </CardDescription>
                            </CardHeader>
                            <CardContent className="flex items-center justify-between mt-auto">
                                <button 
                                    onClick={() => navigate("/create-restaurant")}
                                    className="p-2 text-white transition bg-blue-600 rounded-full hover:bg-blue-700"
                                >
                                    <Plus size={20} />
                                </button>
                            </CardContent>
                        </Card>

                        <Card className="flex flex-col">
                            <CardHeader className="flex-grow">
                                <CardTitle>Check your Restaurants</CardTitle>
                                <CardDescription>
                                    See real-time analysis of your restaurants, such as busiest seats, average number of customers, average number of views, and much more
                                </CardDescription>
                            </CardHeader>
                            <CardContent className="flex items-center justify-between mt-auto">
                                <button 
                                    onClick={() => navigate("/my-restaurants")}
                                    className="p-2 text-white transition bg-blue-600 rounded-full hover:bg-blue-700"
                                >
                                    <ArrowRightIcon size={20} />
                                </button>
                            </CardContent>
                        </Card>

                        <Card className="flex flex-col">
                            <CardHeader className="flex-grow">
                                <CardTitle>Check all the available Restaurants</CardTitle>
                                <CardDescription>
                                    See all the restaurants available, find the one you want and see how full it is
                                </CardDescription>
                            </CardHeader>
                            <CardContent className="flex items-center justify-between mt-auto">
                                <button 
                                    onClick={() => navigate("/restaurants")}
                                    className="p-2 text-white transition bg-blue-600 rounded-full hover:bg-blue-700"
                                >
                                    <ArrowRightIcon size={20} />
                                </button>
                            </CardContent>
                        </Card>

                        <Card className="flex flex-col">
                            <CardHeader className="flex-grow">
                                <CardTitle>Check your favorite Restaurants</CardTitle>
                                <CardDescription>
                                    Check out your favorite restaurants, see the places occupied in real time.
                                </CardDescription>
                            </CardHeader>
                            <CardContent className="flex items-center justify-between mt-auto">
                                <button 
                                    onClick={() => navigate("/favorite-restaurants")}
                                    className="p-2 text-white transition bg-blue-600 rounded-full hover:bg-blue-700"
                                >
                                    <ArrowRightIcon size={20} />
                                </button>
                            </CardContent>
                        </Card>

                    </div>
                </div>

            </div>

            

            
      )

}
