import React, { useState } from "react";
import authImage from '../../../public/signup.png';
import login from '../../../public/login.png';
import { MessageCircle, Mail, User, LockKeyhole, EyeClosed, Eye } from 'lucide-react';
import { useDispatch } from 'react-redux';
import { Authlogin, AuthSingup } from "../../redux/slices/AuthSlice";
import { useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import { ToastError, ToastSuccess } from "../../componenets/All toast/ToastMessages";



const Authpage = () => {
    const [state, setState] = useState("login");
    const [showpass, setShowpass] = useState(false);

    const [formdata, setFormdata] = useState({
        fullName: "",
        email: "",
        password: "",
    });

    const dispatch = useDispatch();
    const navigate = useNavigate();

    const handlechange = (e) => {
        const { name, value } = e.target;
        setFormdata({ ...formdata, [name]: value });
    }

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (state === "signup" && !formdata.fullName.trim()) {
            return toast.error(<ToastError message={"Please enter full name"} />);
        }

        if (!formdata.email.trim()) {
            return toast.error(<ToastError message={"Please enter email"} />);
        }

        if (!formdata.password.trim()) {
            return toast.error(<ToastError message={"Please enter password"} />);
        }


        const data = {
            fullName: formdata.fullName,
            email: formdata.email,
            password: formdata.password,
        }

        const logindata = {
            email: formdata.email,
            password: formdata.password,
        }


        if (state === "login") {
            const result = await dispatch(Authlogin(logindata));

            if (Authlogin.fulfilled.match(result)) {
                toast.success(<ToastSuccess message={"Login successful!"} />);
                navigate("/chat");
            } else {
                toast.error(<ToastError message={result.payload || "Login failed!"} />);
                console.log(result.message);
            }


        } else {
            const result = await dispatch(AuthSingup(data));

            if (AuthSingup.fulfilled.match(result)) {
                toast.success(<ToastSuccess message={"Signup successful!"} />);
                setState("login");
            } else {
                toast.error(<ToastError message={result.payload || "Signup failed!"} />);
            }
        }
    }


    return (
        <section className="h-screen overflow-y-auto sidebar flex items-center justify-center text-white px-6">
            {/* Container */}
            <div className="relative p-[3px] rounded-sm animate-spin-slow bg-gradient-to-r 
from-[#0f172a] via-slate-500 via-blue-500 via-purple-500 via-pink-500 to-slate-700">

                <div className="w-full max-w-5xl shadow-xl flex flex-col md:flex-row bg-[#0f172a] rounded-xl">

                    {/* Left Side - Form */}
                    <div className="w-full md:w-1/2 p-8 md:p-12 flex flex-col justify-center">
                        <div className="pt-12">
                            <div className="flex flex-col justify-center items-center gap-y-1">
                                <p className="text-slate-300">   <MessageCircle size={50} />  </p>
                                {state === "login" ? (
                                    <>
                                        <h2 className="text-2xl font-semibold"> Well Come Back </h2>
                                        <p> Login to access your account</p>
                                    </>
                                ) : (
                                    <>
                                        <h2 className="text-3xl font-semibold">Create Account</h2>
                                        <p>Sign up for new account</p>
                                    </>
                                )}

                            </div>
                            <form className="flex flex-col gap-4" onSubmit={handleSubmit}>
                                {/* Full Name */}
                                {state === 'login' ? (null) : (
                                    <div className="flex flex-col gap-y-2">
                                        <label className="block text-sm text-gray-300">Full Name</label>
                                        <div className="px-3 py-3 border border-gray-700 flex items-center gap-x-3 
    focus-within:border-blue-400 focus-within:ring-1 focus-within:ring-blue-400 transition">
                                            <p className="text-gray-400">
                                                <User size={20} />
                                            </p>

                                            <input
                                                type="text"
                                                name="fullName"
                                                value={formdata.fullName}
                                                onChange={handlechange}
                                                placeholder="John Doe"
                                                className="w-full text-sm text-white bg-transparent placeholder-gray-400 focus:outline-none"
                                            />
                                        </div>

                                    </div>
                                )}

                                {/* Email */}
                                <div className="flex flex-col gap-y-2">
                                    <label className="block text-sm text-gray-300">Email</label>

                                    <div className="px-3 py-3 border border-gray-700 flex items-center gap-x-3 
    focus-within:border-blue-400 focus-within:ring-1 focus-within:ring-blue-400 transition">
                                        <p className="text-gray-400">
                                            <Mail size={20} />
                                        </p>

                                        <input
                                            type="email"
                                            name="email"
                                            value={formdata.email}
                                            onChange={handlechange}
                                            placeholder="johndoe@gmail.com"
                                            className="w-full text-sm text-white bg-transparent placeholder-gray-400 focus:outline-none"
                                        />
                                    </div>

                                </div>

                                {/* Password */}
                                <div className="flex flex-col gap-y-2">
                                    <label className="block text-sm text-gray-300">Password</label>
                                    <div className="px-3 py-3 border border-gray-700 flex items-center gap-x-3 focus-within:border-blue-400 focus-within:ring-1 focus-within:ring-blue-400 transition">
                                        <p className="text-gray-400">
                                            <LockKeyhole size={20} />
                                        </p>
                                        <input
                                            type={showpass ? "text" : "password"}
                                            name="password"
                                            value={formdata.password}
                                            onChange={handlechange}
                                            placeholder="Enter your password"
                                            className="w-full text-sm text-white bg-transparent placeholder-gray-400 focus:outline-none"
                                        />
                                        <button type="button" onClick={() => setShowpass((prev) => !prev)}> {showpass ? <EyeClosed size={20} color="gray" /> : <Eye size={20} color="gray" />} </button>
                                    </div>

                                </div>

                                {/* Button */}
                                {state === "login" ? (
                                    <button type="submit"
                                        className="mt-2 w-full bg-[#06b6d4] hover:bg-[#0ea5e9] transition-all py-2 rounded font-semibold text-white focus:outline-1 outline-white" >
                                        Login
                                    </button>
                                ) : (
                                    <button type="submit"
                                        className="mt-2 w-full bg-[#06b6d4] hover:bg-[#0ea5e9] transition-all py-2 rounded font-semibold text-white focus:outline-1 outline-white">
                                        Create Account
                                    </button>
                                )}

                            </form>

                            {/* Login Link */}
                            {state === "login" ? (
                                <p className="text-sm text-gray-400 mt-4">
                                    Create new account? {" "}
                                    <button className="text-[#06b6d4] hover:underline cursor-pointer" onClick={() => setState("signup")}> Sign Up ? </button>
                                </p>
                            ) : (
                                <p className="text-sm text-gray-400 mt-4">
                                    Already have an account? {" "}
                                    <button className="text-[#06b6d4] hover:underline cursor-pointer" onClick={() => setState("login")}> Login </button>
                                </p>
                            )}
                        </div>
                    </div>
                    <p className="bg-[#16263d] w-0.5" />
                    {/* Right Side - Illustration */}
                    <div className="w-full md:w-1/2 flex flex-col items-center justify-center text-center p-6 md:p-10">
                        <div className="pt-12 text-cyan-500 ">
                            <img
                                src={state === "login" ? login : authImage}
                                alt="Auth illustration"
                                className="w-[80%] md:w-[70%] mx-auto object-contain"
                            />
                            {
                                state === "login" ? (<h3 className="text-lg md:text-xl font-semibold mt-6 mb-3">
                                    Connect any time every time
                                </h3>) : (
                                    <h3 className="text-lg md:text-xl font-semibold mt-6 mb-3">
                                        Start Your Journey Today
                                    </h3>
                                )
                            }
                            <div className="flex items-center justify-center gap-3 font-semibold">
                                <span className="px-3 py-1 text-sm bg-[#1e293b] border border-gray-600 rounded-full">
                                    Free
                                </span>
                                <span className="px-3 py-1 text-sm bg-[#1e293b] border border-gray-600 rounded-full">
                                    Easy Setup
                                </span>
                                <span className="px-3 py-1 text-sm bg-[#1e293b] border border-gray-600 rounded-full">
                                    Private
                                </span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
};

export default Authpage;
