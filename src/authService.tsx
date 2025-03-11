import axios from "axios";
import {jwtDecode} from "jwt-decode"; 


export const getAccessToken = async (): Promise<String | null> => {
    let accessToken = localStorage.getItem("accessToken");
    const refreshToken = localStorage.getItem("refreshToken");

    // Check if the access token is expired
    if (accessToken) 
    {
      try {
          const decodedToken: any = jwtDecode(accessToken);
          const currentTime = Math.floor(Date.now() / 1000);

          if (decodedToken.exp < currentTime) {
              console.log("Access token is expired.");
              accessToken = null; // Mark as expired
          }
      } catch (error) {
          console.error("Error decoding token:", error);
          accessToken = null; // If token is invalid, treat it as expired
      }
    }

    // If no valid access token, attempt refresh
    if (!accessToken && refreshToken) {
        try {
          console.log("Access token expired. Trying to refresh...");
          const refreshResponse = await axios.post("http://192.168.1.44:8282/restaurant/bff/api/refresh", {
            refreshToken,
          });

          if (refreshResponse.data?.accessToken) {
            accessToken = refreshResponse.data.accessToken;
            if (accessToken) 
            {
                localStorage.setItem("accessToken", accessToken);
            }
          } else {
            throw new Error("Failed to refresh token");
          }
        } catch (error) {
          console.error("Token refresh failed:", error);
          //setError("Session expired. Please log in again.");
          localStorage.removeItem("accessToken");
          localStorage.removeItem("refreshToken");
          //navigate("/"); // Redirect to login page
          return null;
        }
    }

    return accessToken

    /*if (!accessToken) {
        setError("You are not authenticated. Please log in.");
        setLoading(false);
        navigate("/");
        return;
    }*/
}