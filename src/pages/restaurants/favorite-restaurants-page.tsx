import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/app/components/ui/table";
import axios from "axios";
import { useEffect, useState } from "react";
import { Skeleton } from "@/app/components/ui/skeleton";
import { useNavigate } from "react-router-dom";
import { getAccessToken } from "@/authService";
import { Star } from "lucide-react";


interface Restaurant {
    id: number;
    uid: string;
    name: string;
    location: string;
    tablesCapacity: number;
    isFavorite?: boolean;
  }
  
export default function FavoriteRestaurantsPage()
{
    const [favoriteRestaurants, setFavoriteRestaurants] = useState<Restaurant[]>([]);
    const [error, setError] = useState<string | null>(null);
    const [loading, setLoading] = useState<boolean>(true);
    const navigate = useNavigate();


    useEffect(() => 
    {
        const fetchFavoriteRestaurants = async () => 
        {   
            setLoading(true);
            setError(null);
      
            const accessToken = await getAccessToken();
            console.log("Access Token:", accessToken);
      
            if (!accessToken) 
            {
                setError("Session expired. Please log in again.");
                navigate("/");
                return;
            }
          
            try
            {
                const userUid = localStorage.getItem("userUid");
                if (userUid) 
                {
                    // Fetch user's favorite restaurants
                    const favoriteRestaurantsResponse = await axios.get<string[]>(`http://192.168.1.44:8282/restaurant/bff/api/user/${userUid}/favorites`, {
                        headers: {
                        Authorization: `Bearer ${accessToken}`,
                        },
                    });
                    const favoriteSet: Set<string> = new Set(favoriteRestaurantsResponse.data);

                    //Fetch all restaurants
                    const allRestaurantsResponse = await axios.get<Restaurant[]>("http://192.168.1.44:8282/restaurant/bff/api/restaurant", {
                        headers: {
                            Authorization: `Bearer ${accessToken}`,
                          },
                    })

                    //Filter only favorite restaurants
                    const filteredRestaurants = allRestaurantsResponse.data
                        .filter((r) => favoriteSet.has(r.uid))
                        .map((r) => ({...r, isFavorite: true}));

                    setFavoriteRestaurants(filteredRestaurants);
                }

            } 
            catch (err)
            {
                setError("Failed to fetch favorite restaurants. Please try again.");
                console.error("Error fetching restaurants:", err);
            } 
            finally 
            {
                setLoading(false);
            }
        };

        fetchFavoriteRestaurants();

    }, []);
    
    const handleRemoveFavoriteClick = async (uid: string) => {
        setFavoriteRestaurants(prevState => prevState.filter(r => r.uid !== uid));

        const accessToken = await getAccessToken();
        if (!accessToken) 
        {
            setError("Session expired. Please log in again.");
            navigate("/");
            return;
        }

        const userUid = localStorage.getItem("userUid");
        try {
            if (userUid) 
            {
                await axios.delete(`http://192.168.1.44:8282/restaurant/bff/api/user/${userUid}/favorites/${uid}`, {
                    headers: {
                      Authorization: `Bearer ${accessToken}`,
                    },
                  });
            }
        }catch(error)
        {
            console.log("Error removing favorite: ", error);
            setError("Failed to remove favorite. Please try again.");
        }

    }
      
    return (
        <div>
            <div className="flex flex-col items-center w-full min-h-screen px-4 pt-20">
                {/* Welcome Section */}
                <div className="text-center">
                    <h2 className="text-3xl font-extrabold leading-snug text-center md:text-4xl">
                        Favorite <span className="text-blue-600">Restaurants</span>!🍽️  
                    </h2>
                </div>
            
            
                {/* Loading State */}
                {loading && (
                    <div className="space-y-3">
                        <Skeleton className="w-full h-10" />
                        <Skeleton className="w-full h-10" />
                        <Skeleton className="w-full h-10" />
                    </div>
                    )}

                {/* Error State */}
                {error && <p className="text-red-500">{error}</p>}

                {/* Favorites Tabl */}
                {!loading && !error && favoriteRestaurants.length > 0 &&(
                    <div className="mt-8">
                        <Table>
                            <TableHeader>
                                <TableRow>
                                    <TableHead>Name</TableHead>
                                    <TableHead>Location</TableHead>
                                    <TableHead>Number of Tables</TableHead>
                                    <TableHead>Favorite</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {favoriteRestaurants.map((r) => (
                                    <TableRow key={r.id}
                                        onClick={() => navigate(`/restaurant/${r.uid}`)} className="transition duration-200 cursor-pointer hover:bg-gray-700 ">
                                        <TableCell>{r.name}</TableCell>
                                        <TableCell>{r.location}</TableCell>
                                        <TableCell>{r.tablesCapacity}</TableCell>
                                        <TableCell>
                                            <button onClick={() => handleRemoveFavoriteClick(r.uid)}>
                                                <Star
                                                    className={`h-4 w-4 ${r.isFavorite ? "text-yellow-500" : "text-gray-400"}`}
                                                />
                                                </button> </TableCell>
                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>
                    </div>
                )}

                {/* No Favorites Message */}
                {!loading && !error && favoriteRestaurants.length === 0 && (
                    <div className="flex items-center justify-center p-4 border border-dashed rounded-md text-muted-foreground">
                    <p>No favorite restaurants found.</p>
                    </div>
                )}
            </div>
        </div>

    )
}