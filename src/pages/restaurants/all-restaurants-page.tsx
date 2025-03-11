import { Input } from "@/app/components/ui/input";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/app/components/ui/table";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/app/components/ui/select";
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
  type: string;
  location: string;
  tablesCapacity: number;
  isFavorite?: boolean;
}

export default function AllRestaurantsPage() {
  const [restaurants, setRestaurants] = useState<Restaurant[]>([]);
  const [filteredRestaurants, setFilteredRestaurants] = useState<Restaurant[]>([]);
  const [selectedLocation, setSelectedLocation] = useState("");
  const [selectedType, setSelectedType] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [search, setSearch] = useState("");
  const [favorites, setFavorites] = useState<Set<string>>(new Set());
  const navigate = useNavigate();

  const fetchRestaurants = async () => {
    setLoading(true);
    setError(null);

    const accessToken = await getAccessToken();
    if (!accessToken) {
      setError("Session expired. Please log in again.");
      navigate("/");
      return;
    }

    try {
      // Fetch restaurants
      const response = await axios.get<Restaurant[]>("http://192.168.1.44:8282/restaurant/bff/api/restaurant", {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      });

      if (Array.isArray(response.data)) {
        setRestaurants(response.data);
        setFilteredRestaurants(response.data);
      } else {
        setRestaurants([]);
        setFilteredRestaurants([]);
      }

      // Fetch user's favorite restaurants
      const userUid = localStorage.getItem("userUid");
      if (userUid) {
        const favoriteResponse = await axios.get<string[]>(`http://192.168.1.44:8282/restaurant/bff/api/user/${userUid}/favorites`, {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        });

        const favoriteSet: Set<string> = new Set(favoriteResponse.data);
        setFavorites(favoriteSet); // Store favorites in a Set for easy lookup

        // Update restaurant list with `isFavorite` status based on fetched favorites
        const updatedRestaurants = response.data.map((restaurant) => ({
          ...restaurant,
          isFavorite: favoriteSet.has(restaurant.uid), // Set the favorite status
        }));

        setRestaurants(updatedRestaurants);
        setFilteredRestaurants(updatedRestaurants);
      }
    } catch (err) {
      setError("Failed to fetch restaurants. Please try again.");
      console.error("Error fetching restaurants:", err);
    } finally {
      setLoading(false);
    }
  };

  // Fetch favorites and restaurants when the component is mounted or re-entered
  useEffect(() => {
    fetchRestaurants();

    // Set up polling every 60 seconds to check for updates
    const intervalId = setInterval(fetchRestaurants, 60000);

    // Cleanup the polling when the component unmounts
    return () => clearInterval(intervalId);
  }, []);

  // Filter restaurants based on search, location, and type
  useEffect(() => {
    const filtered = restaurants.filter(
      (r) =>
        r.name.toLowerCase().includes(search.toLowerCase()) &&
        (selectedLocation === "" ||selectedLocation === "all" || r.location.toLowerCase() === selectedLocation.toLowerCase()) &&
        (selectedType === "" || selectedType === "all" || r.type.toLowerCase() === selectedType.toLowerCase()) // Filter by type
    );
    setFilteredRestaurants(filtered);
  }, [search, selectedLocation, selectedType, restaurants]);

  const handleFavoriteClick = async (restaurantId: string) => {
    const accessToken = await getAccessToken();
    if (!accessToken) {
      setError("Session expired. Please log in again.");
      navigate("/");
      return;
    }

    const isCurrentlyFavorite = favorites.has(restaurantId);
    const userUid = localStorage.getItem("userUid");

    try {
      if (userUid) {
        const updatedFavorites = new Set(favorites);
        if (isCurrentlyFavorite) {
          await axios.delete(`http://192.168.1.44:8282/restaurant/bff/api/user/${userUid}/favorites/${restaurantId}`, {
            headers: {
              Authorization: `Bearer ${accessToken}`,
            },
          });
          updatedFavorites.delete(restaurantId);
        } else {
          await axios.post(
            `http://192.168.1.44:8282/restaurant/bff/api/user/${userUid}/favorites/${restaurantId}`,
            {},
            {
              headers: {
                Authorization: `Bearer ${accessToken}`,
              },
            }
          );
          updatedFavorites.add(restaurantId);
        }

        localStorage.setItem("favorites", JSON.stringify([...updatedFavorites]));
        setFavorites(updatedFavorites); // Update the favorites state

        // Now, after updating the favorites, fetch the restaurants again to ensure the isFavorite status is updated.
        fetchRestaurants();  // This is the critical change
      }
    } catch (error) {
      console.error("Error updating favorites:", error);
      setError("Failed to update favorites. Please try again.");
    }
  };

  return (
    <div>

      <div className="flex flex-col items-center w-full min-h-screen px-4 pt-20">
        {/* Welcome Section */}
        <div className="text-center">
            <h2 className="text-3xl font-extrabold leading-snug text-center md:text-4xl">
                All <span className="text-blue-600">Restaurants</span>🍽️  
            </h2>
        </div>

        <div className="flex gap-4 mt-8 mb-4">
          <Input placeholder="Search restaurants..." onChange={(e) => setSearch(e.target.value)} />
          <Select onValueChange={setSelectedLocation}>
            <SelectTrigger>
              <SelectValue placeholder="Filter by location" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Locations</SelectItem>
              {[...new Set(restaurants.map((r) => r.location))].map((loc) => (
                <SelectItem key={loc} value={loc}>
                  {loc}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          {/* New Select for filtering by Type */}
          <Select onValueChange={setSelectedType}>
            <SelectTrigger>
              <SelectValue placeholder="Filter by type" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Types</SelectItem>
              {[...new Set(restaurants.map((r) => r.type))].map((type) => (
                <SelectItem key={type} value={type}>
                  {type}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {/* Show loading state */}
        {loading && (
          <div className="space-y-3">
            <Skeleton className="w-full h-10" />
            <Skeleton className="w-full h-10" />
            <Skeleton className="w-full h-10" />
          </div>
        )}

        {/* Show error if fetching fails */}
        {error && <p className="text-red-500">{error}</p>}

        {/* Show table when data is available */}
        {!loading && !error && filteredRestaurants.length > 0 && (
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Name</TableHead>
                <TableHead>Type</TableHead>
                <TableHead>Location</TableHead>
                <TableHead>Number of Tables</TableHead>
                <TableHead>Favorite</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredRestaurants.map((r) => (
                <TableRow key={r.id}>
                  <TableCell>{r.name}</TableCell>
                  <TableCell>{r.type}</TableCell>
                  <TableCell>{r.location}</TableCell>
                  <TableCell>{r.tablesCapacity}</TableCell>
                  <TableCell>
                    <button onClick={() => handleFavoriteClick(r.uid)}>
                      <Star
                        className={`h-4 w-4 ${r.isFavorite ? "text-yellow-500" : "text-gray-400"}`}
                      />
                    </button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        )}

        {/* Show "No restaurants found" message when the list is empty */}
        {!loading && !error && filteredRestaurants.length === 0 && (
          <div className="flex items-center justify-center p-4 border border-dashed rounded-md text-muted-foreground">
            <p>No restaurants found.</p>
          </div>
        )}
      </div>
    </div>
  );
}
