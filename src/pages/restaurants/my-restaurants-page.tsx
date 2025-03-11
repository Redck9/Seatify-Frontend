import { Input } from "@/app/components/ui/input";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/app/components/ui/table";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/app/components/ui/select";
import axios from "axios";
import { useEffect, useState } from "react";
import { Skeleton } from "@/app/components/ui/skeleton";
import { useNavigate } from "react-router-dom";
import { getAccessToken } from "@/authService";
import { Trash } from "lucide-react";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "@/app/components/ui/alert-dialog";

interface Restaurant {
  id: number;
  uid: string;
  name: string;
  type: string;
  location: string;
  tablesCapacity: number;
  isFavorite?: boolean;
  userUid: string;
}

export default function MyRestaurantsPage() {
  const [restaurants, setRestaurants] = useState<Restaurant[]>([]);
  const [filteredRestaurants, setFilteredRestaurants] = useState<Restaurant[]>([]);
  const [selectedLocation, setSelectedLocation] = useState("");
  const [selectedType, setSelectedType] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [search, setSearch] = useState("");
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

        const userUid = localStorage.getItem("userUid");

        if(!userUid)
        {
            setError("Session expired. Please log in again.")
            setLoading(false);
            return;
        }

        // Fetch restaurants
        const response = await axios.get<Restaurant[]>("http://192.168.1.44:8282/restaurant/bff/api/restaurant", {
            headers: {
            Authorization: `Bearer ${accessToken}`,
            },
        });

        if (Array.isArray(response.data)) 
        {
            const userRestaurants = response.data.filter((r) => r.userUid === userUid);
            if (userRestaurants.length === 0) 
            {
                setError("You have no registered restaurants.");
            }
            setRestaurants(userRestaurants);
            setFilteredRestaurants(userRestaurants);
        } 
        else 
        {
            setRestaurants([]);
            setFilteredRestaurants([]);
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

  const handleDeleteClick = async (restaurantId: string) => 
    {

    const accessToken = await getAccessToken();
    if(!accessToken)
    {
        setError("Session expired. Please log in again.");
        navigate("/");
        return;
    }

    try
    {
        await axios.delete(`http://192.168.1.44:8282/restaurant/bff/api/restaurant/${restaurantId}`, {
            headers: {
                Authorization: `Bearer ${accessToken}`,
            },
        }),
        setRestaurants((prevRestaurants) => prevRestaurants.filter((r) => r.uid !== restaurantId));
        setFilteredRestaurants((prevFiltered) => prevFiltered.filter((r) => r.uid !== restaurantId));
    }
    catch (err)
    {
        setError("Failed to delete the restaurant. Please try again.")
        console.error("Error deleting restaurant: ", err)
    }
    
  }

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
                <TableHead>Delete</TableHead>
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
                  <AlertDialog>
                    <AlertDialogTrigger asChild>
                      <button className="p-2 text-red-500 transition hover:text-red-700">
                        <Trash className="w-4 h-4" />
                      </button>
                    </AlertDialogTrigger>
                    <AlertDialogContent>
                      <AlertDialogHeader>
                        <AlertDialogTitle>Are you sure?</AlertDialogTitle>
                        <AlertDialogDescription>
                          This action cannot be undone. This will permanently delete the restaurant <b>{r.name}</b>.
                        </AlertDialogDescription>
                      </AlertDialogHeader>
                      <AlertDialogFooter>
                        <AlertDialogCancel>Cancel</AlertDialogCancel>
                        <AlertDialogAction
                          onClick={() => handleDeleteClick(r.uid)}
                          className="bg-red-600 hover:bg-red-700"
                        >
                          Yes, Delete
                        </AlertDialogAction>
                      </AlertDialogFooter>
                    </AlertDialogContent>
                  </AlertDialog>
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
