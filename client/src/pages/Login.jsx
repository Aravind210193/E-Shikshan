import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";

const Login = ({setIsLoggedIn}) => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({ email: "", password: "" });
  const handleLogin = (e) =>{
    e.preventDefault();
    setIsLoggedIn(true);
    navigate('/');
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log(formData);
  };

  return (
    <div
      className="  flex items-center justify-center bg-cover bg-gray-800 bg-center"
    >
      <div className="flex w-full  max-w-5xl rounded-2xl  overflow-hidden">
        
  
        {/* Left Side */}
        <div className="hidden  md:flex flex-col  justify-center w-1/2 p-10 text-white">
                  <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent flex flex-col justify-between p-6">
            <div className="flex justify-between items-center">
              <h1 className="text-white text-lg  font-bold">                      
                <img src='/logo1.png' alt='logo' className='h-30 w-auto ' />
              </h1>
              <button onClick ={()=> navigate('/')} className="bg-white/20 px-3 py-1 rounded-full text-white text-sm hover:bg-white/30">
                Back to website →
              </button>
            </div>
            </div>
          <h1 className="text-4xl font-bold">E-SHIKSHAN</h1>
          <h2 className="text-2xl font-bold mt-4 leading-tight">
            Learn.Practice.Achive
          </h2>
          <p className="mt-4 text-lg text-gray-200">
            Your Journey to mastering AI,DataScrienc,and Roadmap starts here.
          </p>
          <p className="mt-2 text-sm text-gray-300">
            Unlock videos,roadmaps,job details and challenges-all in one place
          </p>
        </div>

        {/* Right Side - Glass Form */}
        <div className="w-full md:w-1/2  mt-21  flex justify-center items-center p-8">
          <div className="bg-white/20 backdrop-blur-lg p-8 rounded-xl w-full max-w-md shadow-lg">
            <form onSubmit={handleLogin} className="space-y-4">
              <div>
                <label className="block text-white text-sm mb-1">Email</label>
                <input
                  type="email"
                  name="email"
                  placeholder="Enter your email"
                  value={formData.email}
                  onChange={handleChange}
                  required

                  className="w-full px-4 py-2 rounded-md bg-white/30 text-white placeholder-gray-200 outline-none"
                />
              </div>

              <div>
                <label className="block text-white text-sm mb-1">Password</label>
                <input
                  type="password"
                  name="password"
                  placeholder="****"
                  value={formData.password}
                  onChange={handleChange}
                  className="w-full px-4 py-2 rounded-md bg-white/30 text-white placeholder-gray-200 outline-none"
                />
                <a
                  href="#"
                  className="text-xs text-blue-300 hover:underline mt-1 block text-right"
                >
                  Forgot password?
                </a>
              </div>

              <button
                type="submit"
                className="w-full py-2 bg-blue-500 hover:bg-blue-600 text-white rounded-md font-semibold"
              >
                Login
              </button>
            </form>

            
            <div className="flex items-center gap-2 mt-6 mb-4">
              <hr className="flex-1 border-gray-400" />
              <span className="text-white text-sm">or</span>
              <hr className="flex-1 border-gray-400" />
            </div>

            
            <button className="w-full flex items-center justify-center gap-2 border border-gray-400 py-2 rounded-md text-white hover:bg-white/10">
              Sign in with Google
            </button>

            <p className="text-center text-sm text-white mt-4">
              Are you new?{" "}
              <a href="/signup" className="text-blue-300 hover:underline">
                Create an Account
              </a>
            </p>
          </div>
        </div>
        </div>
    
    </div>
  );
};

export default Login;