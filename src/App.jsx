import React, { useEffect, useState } from 'react'
import NavBar from './Components/NavBar.jsx'
import axios from 'axios'

import { Outlet } from 'react-router-dom'
import BaseContext from './Context/BaseContext.jsx'
import UserContext from './Context/UserContext.jsx'
const App = () => {
  const [base, setBase] = useState();
  const [user, setUser] = useState()

  useEffect(() => {
    const fetchBaseDetails = async () => {
      try {
        const token = sessionStorage.getItem("token");
        if (!token) {
          console.error("Token is missing");
          return;
        }

        const response = await axios.get("https://military-asset-be.onrender.com/base/getbasedata", {
          headers: {
            Authorization: `Bearer ${sessionStorage.getItem("token")}`
          }
        });

        if (response.data.base) {
          setBase(response.data.base);
        }

        const userResponse = await axios.get("https://military-asset-be.onrender.com/user/getuser", {
          headers: {
            Authorization: `Bearer ${sessionStorage.getItem("token")}`
          }
        });

        console.log("User Data:", userResponse.data.user);
        if (userResponse.data.user) {
          setUser(userResponse.data.user);
        }
      } catch (error) {
        console.error("Error fetching base details:", error.response?.data || error.message);
      }

    };
    fetchBaseDetails();
  }, [])


  return (
    <BaseContext.Provider value={{ base, setBase }}>
      <UserContext.Provider value={{ user, setUser }}>
        {base && user ? (
          <>
            <NavBar />

            <Outlet />
          </>
        ) : (
          <div>Loading Base Data...</div>
        )}

      </UserContext.Provider>
    </ BaseContext.Provider>

  )
}

export default App;