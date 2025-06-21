import React, { useEffect, useState } from 'react'
import NavBar from './Components/NavBar.jsx'
import axios from 'axios'

import { Outlet } from 'react-router-dom'
import BaseContext from './Context/BaseContext.jsx'
import BaseDataContext from './Context/BaseDataContext.jsx'
import UserContext from './Context/UserContext.jsx'
import CurrentBaseContext from './Context/CurrentBaseContect.jsx'
const App = () => {
  const [base, setBase] = useState();
  const [user, setUser] = useState();
  const [fetchBase, setFetchBase] = useState();
  const [selectBase, setSelectBase] = useState();

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
          setFetchBase(response.data.base);
        }


      } catch (error) {
        console.error("Error fetching base details:", error.response?.data || error.message);
      }

    };
    fetchBaseDetails();
  }, [selectBase])

  useEffect(() => {
    const getUser = async () => {
      try {
        const userResponse = await axios.get("https://military-asset-be.onrender.com/user/getuser", {
          headers: {
            Authorization: `Bearer ${sessionStorage.getItem("token")}`
          }
        });

        console.log("User Data:", userResponse.data.user);
        if (userResponse.data.user) {
          setUser(userResponse.data.user);
          if (!selectBase) {

            setSelectBase(userResponse.data.user.base);
          }
        }
      } catch (error) {

        console.error("Error fetching user details:", error.response?.data || error.message);
      }

    }
    getUser();
  }, [])


  useEffect(() => {
    if (selectBase && fetchBase) {
      const baseObj = user?.role === "admin" ? fetchBase.find(item => item.basename === selectBase) : fetchBase;
      if (baseObj !== base) {
        setBase(baseObj || null);
      }
    }
  }, [selectBase, fetchBase]);


  return (
    <CurrentBaseContext.Provider value={{ selectBase, setSelectBase }}>
      <BaseDataContext.Provider value={{ fetchBase, setFetchBase }}>
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
      </BaseDataContext.Provider>
    </CurrentBaseContext.Provider>

  )
}

export default App;