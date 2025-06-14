import axios from 'axios';
import { useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faUser, faLock } from '@fortawesome/free-solid-svg-icons';

import { useNavigate, Link } from 'react-router-dom';

const Login = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    loginUser();
  }
  const navigate = useNavigate();





  const loginUser = async () => {
    try {

      const response = await axios.post("https://military-asset-be.onrender.com/user/userlogin", { username, password });
      if (response.data.message === "Successfully Login") {


        sessionStorage.setItem('token', response.data.token);
        alert("Successfully Login");
        navigate("/app");
      }
      if (response.data.message === "username not found") {
        alert("username not found");
      }
      if (response.data.message === "Invalid credentials") {
        alert("Invalid credentials");
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




        <div className="passwordDiv mt-5" style={{
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
          <label className="text-light" id='passwordLabel' style={{ position: "absolute", left: "10px", top: "50%", transform: "translateY(-50%)", transition: "0.3s ease-in-out" }}>password</label>
          <input
            className="custom_input"
            type="password"
            name="password"
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
        <div className="mt-5 ">
          <Link className='text-light' to="/resetpassword" >forgot Password?</Link>
        </div>
        <div className="d-flex justify-content-evenly mt-5">

          <div><button className='btn btn-primary' type='submit'>Submit</button>
          </div>

        </div>
      </form>
    </div>
  )
}

export default Login