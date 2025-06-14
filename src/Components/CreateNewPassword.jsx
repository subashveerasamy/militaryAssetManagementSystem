import axios from "axios";
import React, { useState } from 'react';
import { useNavigate, useParams } from "react-router-dom";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faUser, faLock } from '@fortawesome/free-solid-svg-icons';

const ResetPassword = () => {
    const params = useParams();
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [errors, setErrors] = useState({});

    const navigate = useNavigate();

    const validatePassword = (password) => {
        const errors = {};
        if (password.length < 8) {
            errors.length = "Password must be at least 8 characters long.";
        }
        if (!/[A-Z]/.test(password)) {
            errors.uppercase = "Password must contain at least one uppercase letter.";
        }
        if (!/[a-z]/.test(password)) {
            errors.lowercase = "Password must contain at least one lowercase letter.";
        }
        if (!/[0-9]/.test(password)) {
            errors.number = "Password must contain at least one number.";
        }
        if (!/[!@#$%^&*]/.test(password)) {
            errors.specialChar = "Password must contain at least one special character.";
        }
        return errors;
    }

    const handleSubmit = (e) => {
        e.preventDefault();
        const passwordErrors = validatePassword(password);
        if (Object.keys(passwordErrors).length > 0) {
            setErrors(passwordErrors);
            return;
        }
        if (password !== confirmPassword) {
            alert("Passwords do not match!");
            return;
        }
        resetPassword();
    }

    const resetPassword = async () => {
        const username = params.username;
        const response = await axios.put("https://military-asset-be-1.onrender.com/user/resetPassword", { username, password });
        alert(response.data.message);
        if (response.data.message === "Password updated successfully") {
            navigate('/');
        }
        else{
            alert('User not found')
        }
    }

    return (
        <div className='d-flex text-light flex-column justify-content-center align-items-center' id="passwordReset" style={{ width: "100vw", height:"100vh",  backgroundImage: `url('/loginBg1.jpg')`, backgroundSize: "cover", backgroundPosition: "center", backgroundRepeat: "no-repeat"}}>
            <form className='border border-5 p-5' onSubmit={handleSubmit} style={{ borderRadius: "25px", backdropFilter:"blur(5px)" }}>
                <h1 className="text-center text-light">Reset Password</h1>
                <div className="passwordDiv mt-5" 
                style={{
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
                    <label className="text-light" id="passwordLabel" style={{ position: "absolute", left: "10px", top: "50%", transform: "translateY(-50%)", transition: "0.3s ease-in-out" }}>New password</label>
                    <input className=" mt-3" type="password" name="password" value={password} onChange={(e) => setPassword(e.target.value)}
                    style={{
              border: "none",
              outline: "none",
              backgroundColor: "transparent",
              color: "#fff",
            }}
            onFocus={(e) => document.getElementById("passwordLabel").style.top = "-10px"}
            onBlur={(e) => {
              if (!e.target.value) document.getElementById("passwordLabel").style.top = "50%";
            }}
                    required />
                    
                </div>
               {errors.length && <p className="text-danger">{errors.length}</p>}
                    {errors.uppercase && <p className="text-danger">{errors.uppercase}</p>}
                    {errors.lowercase && <p className="text-danger">{errors.lowercase}</p>}
                    {errors.number && <p className="text-danger">{errors.number}</p>}
                    {errors.specialChar && <p className="text-danger">{errors.specialChar}</p>}
               
               
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
                    <label className="text-light" id="confirmPassword" style={{ position: "absolute", left: "10px", top: "50%", transform: "translateY(-50%)", transition: "0.3s ease-in-out" }}>Confirm password</label>
                    <input className=" mt-3" type="password" name="confirmPassword" value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)}
                     style={{
              border: "none",
              outline: "none",
              backgroundColor: "transparent",
              color: "#fff",
            }}
            onFocus={(e) => document.getElementById("confirmPassword").style.top = "-10px"}
            onBlur={(e) => {
              if (!e.target.value) document.getElementById("confirmPassword").style.top = "50%";
            }}
                required />
                </div>
                <div className="text-center mt-5">
                    <button className="btn btn-primary" type='submit'>Submit</button>
                </div>
            </form>
        </div>
    )
}

export default ResetPassword;

