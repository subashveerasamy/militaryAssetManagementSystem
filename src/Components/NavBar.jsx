import React, { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'

const NavBar = () => {
  const navigate = useNavigate();
  const [navig, setNavig] = useState("app/dashboard")
  useEffect(() => {
    navigate(`/${navig}`);
  }, [navig]);
  return (
    <div className='d-flex justify-content-around align-items-center p-1 bg-secondary text-light' style={{ cursor: "pointer", width: "100%" }}>
      <div style={{ width: "5%" }}>
        <img src="/Logo.png" alt="Logo" style={{ width: "70px" }} />
      </div>
      <div className="d-flex justify-content-around align-items-center" style={{ width: "35%" }}>
        <>
          <div className='p-2' onClick={() => setNavig("app/dashboard")} style={{ borderBottom: navig === "app/dashboard" ? "5px solid white" : "none", borderRadius: "25%" }} >Dashboard</div>
          <div className='p-2' onClick={() => setNavig("app/purchase")} style={{ borderBottom: navig === "app/purchase" ? "5px solid white" : "none", borderRadius: "25%" }}>Purchase</div>
          <div className='p-2' onClick={() => setNavig("app/transfer")} style={{ borderBottom: navig === "app/transfer" ? "5px solid white" : "none", borderRadius: "25%" }}>Transfer</div>
        </>
      </div>
      <div className="d-flex justify-content-around align-items-center" style={{ width: "35%" }}>
        <div className='p-2' onClick={() => setNavig("app/assign")} style={{ borderBottom: navig === "app/assign" ? "5px solid white" : "none", borderRadius: "25%" }}>A & E</div>
        <div className='p-2' onClick={() => setNavig("app/reports")} style={{ borderBottom: navig === "app/reports" ? "5px solid white" : "none", borderRadius: "25%" }}>Reports</div>
        <div className='p-2' onClick={() => { sessionStorage.removeItem('token'); setNavig("") }}> Log Out</div>
      </div>
    </div>
  )
}

export default NavBar