import axios from 'axios';
import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom';

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faUser, faLock } from '@fortawesome/free-solid-svg-icons';

const ResetPassword = () => {

    const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [otpGen, setOtpGen]= useState(false);

  const handleGetOtp= () =>{
       if(username.length>0){
        setOtpGen(true);
        generateOtp();
       }
       else{
        alert("Enter username");
       }
  }

  const handleSubmit = (e) => {
    e.preventDefault();
    validateOtp();
  }
  const navigate = useNavigate();





  const generateOtp = async () => {
    try {

      const response = await axios.post("https://military-asset-be-1.onrender.com/user/otp", { username});
      
      if (response.data.message === "user not found") {
        setOtpGen(false)
        alert("username not found");
      }
     
      
      

    } catch (error) {
      console.log(error);
    }
  }


  const validateOtp = async () => {
    try {

      const response = await axios.post("https://military-asset-be-1.onrender.com/user/otpverify", { username, otp:password});
      
      if (response.data.message === "Invalid OTP") {
       
        alert("Invalid OTP");
      }
      else if("OTP validated successfully"){
        navigate(`/newpassword/${username}`);
        
     
      }
     
      
      

    } catch (error) {
      console.log(error);
    }
  }
  return (
    <div className='d-flex flex-column justify-content-center align-items-center' id='loginPage' style={{ width: "100vw", height: "100vh", backgroundImage: `url('/loginBg1.jpg')`, backgroundSize: "cover", backgroundPosition: "center", backgroundRepeat: "no-repeat" }} >
         <form className='border border-5 p-5' onSubmit={handleSubmit} style={{ borderRadius: "25px", backdropFilter: "blur(3px)", cursor: "pointer" }}>
           <h1 className='text-center text-light'>LOGIN PAGE</h1>
   
           <div
             className="usernameDiv mt-5"
             id="loginUser"
             style={{
               position: "relative",
               width: "100%",
               backgroundColor: "transparent"
             }}
           >
   
             <span style={{ position: "absolute", right: "10px", top: "50%", transform: "translateY(-50%)" }}>
               <FontAwesomeIcon icon={faUser} style={{ color: "white", marginRight: "10px" }} />
             </span>
   
   
             <label
               id="userLabel"
               className="text-light"
               style={{
                 position: "absolute",
                 left: "10px",
                 top: "50%",
                 transform: "translateY(-50%)",
                 transition: "0.3s ease-in-out",
                 pointerEvents: "none",
               }}
             >
               Username
             </label>
   
   
             <input
               className="custom-input"
               type="text"
               name="username"
               value={username}
               onChange={(e) => setUsername(e.target.value)}
               style={{
                 border: "none",
                 borderBottom: "2px solid white",
                 outline: "none",
                 width: "100%",
                 backgroundColor: "transparent",
                 padding: "5px",
                 color: "#fff",
               }}
               required
               onFocus={(e) => (document.getElementById("userLabel").style.top = "-5px")}
               onBlur={(e) => {
                 if (!e.target.value) document.getElementById("userLabel").style.top = "50%";
               }}
             />
           </div>
   
   
   
   
         { otpGen ?( <> <div className="passwordDiv mt-5" style={{
             position: "relative",
             border: "none",
             outline: "none",
             borderBottom: "2px solid white"
           }}>
             <span style={{
               position: "absolute",
               right: "10px",
               top: "50%",
               transform: "translateY(-50%)",
             }}><FontAwesomeIcon icon={faLock} style={{ color: "white", marginRight: "10px" }} /></span>
             <label className="text-light" id='passwordLabel' style={{ position: "absolute", left: "10px", top: "50%", transform: "translateY(-50%)", transition: "0.3s ease-in-out" }}>OTP</label>
             <input
               className="custom_input"
               type="text"
               name="otp"
               value={password}
               onChange={(e) => setPassword(e.target.value)}
               style={{
                 border: "none",
                 outline: "none",
                 backgroundColor: "transparent",
                 color: "#fff",
               }}
               required
               onFocus={(e) => document.getElementById("passwordLabel").style.top = "-10px"}
               onBlur={(e) => {
                 if (!e.target.value) document.getElementById("passwordLabel").style.top = "50%";
               }}
             />
   
           </div>
           <p className='text-light'>* OTP sent to your mail</p>
           </>
        ):null}
          
           <div className="d-flex justify-content-evenly mt-5">
   
            { otpGen ? ( <div><button className='btn btn-primary' type='submit' onClick={handleSubmit}>Submit</button>
             </div>) : (<div><button className='btn btn-primary' type='button' onClick={handleGetOtp} >Get OTP</button>
             </div>)}
   
           </div>
         </form>
       </div>
  )
}

export default ResetPassword