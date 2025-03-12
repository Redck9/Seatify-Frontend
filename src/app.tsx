import { useEffect, useState } from "react"
import Layout from "./app/components/SideBar/layout";
import { InputForm } from "./app/components/LoginForm/loginForm";
import { BrowserRouter as Router, Route, Routes, Navigate } from "react-router-dom";
import Page from "./pages/dashboard-page/page";
import HomePage from "./pages/homepage";
import AllRestaurantsPage from "./pages/restaurants/all-restaurants-page";
import FavoriteRestaurantsPage from "./pages/restaurants/favorite-restaurants-page";
import CreateRestaurant from "./pages/restaurants/create-restaurant-page";
import { Toaster } from "@/app/components/ui/toaster";
import MyRestaurantsPage from "./pages/restaurants/my-restaurants-page";
import MyRestaurantWrapper from "./pages/restaurant/my-restaurant-wrapper";
import RestaurantPage from "./pages/restaurant/restaurant-page";


export function App() {

  const [isDarkMode, setIsDarkMode] = useState(() => {
    const storedPreference = localStorage.getItem("theme");
    return storedPreference === "dark" || (!storedPreference && window.matchMedia('(prefers-color-sche,e: dark)').matches);
  });

  const [isLoggedIn, setIsLoggedIn] = useState(() => {
    return localStorage.getItem("isLoggedIn") === "true";
  });

  useEffect(() => {
    if(isDarkMode)
    {
      document.documentElement.classList.add("dark");
      localStorage.setItem("theme", "dark");
    }
    else
    {
      document.documentElement.classList.remove('dark');
      localStorage.setItem('theme', 'light');
    }
  }, [isDarkMode]);

  const toggleDarkMode = () => {
    setIsDarkMode(!isDarkMode)
  }

  // Function to handle login
  const handleLoginSuccess = () => {
    setIsLoggedIn(true);
    localStorage.setItem("isLoggedIn", "true");
  };

    
  // Function to handle logout
  /* const handleLogout = () => {
    setIsLoggedIn(false);
    localStorage.removeItem("isLoggedIn");
  }; */

  return (
    <Router>
      <Routes>
        {/* Redirect to homepage if logged in */}
        <Route 
          path="/" 
          element={isLoggedIn ? <Navigate to="/homepage" replace /> : (
            <div className="flex items-center justify-center min-h-screen bg-background text-foreground">
              {/* Main flex container */}
              <div className="flex flex-col items-center justify-center w-full max-w-6xl px-4 mx-auto space-x-4 space-y-8 sm:space-x-8 sm:flex-row ">
                {/* Left section: Heading and button */}
                <div className="flex flex-col items-center w-full space-y-4 text-center sm:w-1/3">
                  <h1 className="text-4xl font-bold">Hello There👋</h1>
                  <button
                    onClick={toggleDarkMode}  
                    className="px-4 py-2 text-white bg-blue-500 rounded"
                  >
                    Toggle {isDarkMode ? "Light" : "Dark"} Mode
                  </button>
                </div>

                {/* Right section: Input form */}
                <div className="w-2/3 sm:w-2/3">
                  <InputForm onLoginSuccess={handleLoginSuccess} />
                </div>
              </div>
            </div> // Redirect to login if not logged in
          )}
        />

        {/* Protected route for HomePage */}
        <Route 
          path="/homepage" 
          element={isLoggedIn ? (
            <Layout>
              <HomePage />
            </Layout>
          ) : (
            <Navigate to="/" replace />  // Redirect to login if not logged in
          )}
        />

        {/* Protected route for Page */}
        <Route 
          path="/page" 
          element={isLoggedIn ? (
            <Layout>
              <Page />
            </Layout>
          ) : (
            <Navigate to="/" replace />  // Redirect to login if not logged in
          )}
        />

         {/* Protected route for AllRestaurantsPage */}
         <Route 
          path="/restaurants" 
          element={isLoggedIn ? (
            <Layout>
              <AllRestaurantsPage />
            </Layout>
          ) : (
            <Navigate to="/" replace />  // Redirect to login if not logged in
          )}
        />

        {/* Protected route for AllRestaurantsPage */}
        <Route 
          path="/favorite-restaurants" 
          element={isLoggedIn ? (
            <Layout>
              <FavoriteRestaurantsPage />
            </Layout>
          ) : (
            <Navigate to="/" replace />  // Redirect to login if not logged in
          )}
        />

        {/* Protected route for AllRestaurantsPage */}
        <Route 
          path="/favorite-restaurants" 
          element={isLoggedIn ? (
            <Layout>
              <FavoriteRestaurantsPage />
            </Layout>
          ) : (
            <Navigate to="/" replace />  // Redirect to login if not logged in
          )}

        />{/* Protected route for create Restaurant */}
        <Route 
          path="/create-restaurant" 
          element={isLoggedIn ? (
            <Layout>
              <CreateRestaurant />
            </Layout>
          ) : (
            <Navigate to="/" replace />  // Redirect to login if not logged in
          )}
        />


        <Route 
          path="/my-restaurants" 
          element={isLoggedIn ? (
            <Layout>
              <MyRestaurantsPage />
            </Layout>
          ) : (
            <Navigate to="/" replace />  // Redirect to login if not logged in
          )}
        />

        <Route 
          path="/my-restaurant/:restaurantUid" 
          element={isLoggedIn ? (
            <Layout>
              <MyRestaurantWrapper />
            </Layout>
          ) : (
            <Navigate to="/" replace />  // Redirect to login if not logged in
          )}
        />

        <Route
          path="/restaurant/:restaurantUid"
          element={isLoggedIn ? (
            <Layout>
              <RestaurantPage />
            </Layout>
          ) : (
            <Navigate to = "/" replace />
          )}
        />

      </Routes>
      <Toaster />
    </Router>
  );
}

