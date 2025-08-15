import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import Login from "./Login";

const Signin = () => {
  const navigate = useNavigate();
  const [showLogin,setShowLogin] = useState(false);
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    password: "",
    agree: false,
  });

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log(formData); // Just logging for now
  };

  return (
    <div className="  md:flex-row  flex flex-col items-center min-h-screen   justify-center bg-[#3c3553] px-4">
      <div className="  m-20 flex flex-col md:flex-row max-w-5xl max-h-120   min-w-xl   border-black  rounded-xl shadow-lg overflow-hidden">
        
        {/* Left Side */}
        <div className="w-full md:w-1/2 relative">
          <img
            src="src\assets\login.jpeg"
            alt="Nature"
            className="w-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent flex flex-col justify-between p-6">
            <div className="flex justify-between items-center">
              <h1 className="text-white text-lg font-bold">E-SHIKSHAN</h1>
              <button onClick ={()=> navigate('/')} className="bg-white/20 px-3 py-1 rounded-full text-white text-sm hover:bg-white/30">
                Back to website →
              </button>
            </div>
            <p className="text-white text-3xl">Empowering Education through Online Learning</p>
          </div>
        </div>

        {/* Right Side */}
        <div className="w-full  md:w-1/2 bg-[#1d1b29] p-8">
        <div className="flex items-center justify-center transiton-transform duration-500">
      
        <Link to='/signup' className="text-lg hover:underline font-bold  p-4">Register</Link>
        <Link to='/login' className="text-lg hover:underline font-bold  p-4">Login</Link>
        
          
        
        </div>
          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Name fields */}
            <div className="flex flex-col md:flex-row gap-4">
              <input
                type="text"
                name="firstName"
                placeholder="First name"
                value={formData.firstName}
                onChange={handleChange}
                className="w-full md:w-1/2 px-4 py-2 rounded-md bg-[#2b273d] text-white placeholder-gray-400 outline-none"
              />
              <input
                type="text"
                name="lastName"
                placeholder="Last name"
                value={formData.lastName}
                onChange={handleChange}
                className="w-full md:w-1/2 px-4 py-2 rounded-md bg-[#2b273d] text-white placeholder-gray-400 outline-none"
              />
            </div>

            {/* Email */}
            <input
              type="email"
              name="email"
              placeholder="Email"
              value={formData.email}
              onChange={handleChange}
              className="w-full px-4 py-2 rounded-md bg-[#2b273d] text-white placeholder-gray-400 outline-none"
            />

            {/* Password */}
            <input
              type="password"
              name="password"
              placeholder="Enter your password"
              value={formData.password}
              onChange={handleChange}
              className="w-full px-4 py-2 rounded-md bg-[#2b273d] text-white placeholder-gray-400 outline-none"
            />

            {/* Checkbox */}
            <label className="flex items-center text-gray-400 text-sm">
              <input
                type="checkbox"
                name="agree"
                checked={formData.agree}
                onChange={handleChange}
                className="mr-2"
                
              />
              I agree to the{" "}
              <a href="#" className="text-purple-400 hover:underline ml-1">Terms & Conditions</a>
            </label>

            {/* Submit */}
            <button
            onClick={()=>navigate('/login')}
            
              type="submit"
              className="w-full py-2 rounded-md bg-purple-500 hover:bg-purple-600 text-white font-semibold"
            >
              Create account
            </button>
          </form>
                    
          <p className="text-gray-400 text-sm flex items-center justify-center mt-5 mb-6">
            Already have an account?{" "}
            <a href="/login" className="text-purple-400 hover:underline">Log in</a>
          </p>


          {/* Divider */}
          <div className="flex items-center gap-2 mt-6 mb-4">
            <hr className="flex-1 border-gray-600" />
            <span className="text-gray-400 text-sm">Or register with</span>
            <hr className="flex-1 border-gray-600" />
          </div>

          {/* Social Buttons */}
          <div className="flex flex-col md:flex-row gap-6 mb-8">
            <button className="flex-1 border border-gray-600 p-2 rounded-md text-white hover:bg-gray-700">
              <span className="mr-2">🌐</span> Google
            </button>
            <button className="flex-1 border border-gray-600 p-2 rounded-md text-white hover:bg-gray-700">
              <span className="mr-2"></span> Apple
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Signin;

