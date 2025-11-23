import { useState } from "react";
import { useDispatch } from "react-redux";
import { NavLink, useNavigate } from "react-router-dom";
import avatar from '../../../public/avatar.png';
import { logoutUser } from '../../redux/slices/AuthSlice';
import { LogOut } from "lucide-react";
import Contactpage from "../../pages/contacts/Contactpage";   // ADD THIS
import Chatpage from "../../pages/chat page/Chatpage";       // ADD THIS

const Sidebarpage = () => {
    const [activebtn, setActivebtn] = useState("chat");
    const dispatch = useDispatch();
    const navigate = useNavigate();

    const handleChats = () => {
        setActivebtn("chat");
    };

    const handleContacts = () => {
        setActivebtn("contacts");
    };

    const handleLogout = () => {
        dispatch(logoutUser());
        navigate("/login");
    };

    return (
        <section className='bg-[#1C273C] text-white px-4 py-6 h-screen shadow-sm'>

            {/* avatar */}
            <div className="flex items-center justify-between border-b border-gray-700 pb-8">
                <NavLink to={'myprofile'}>
                    <div className='flex items-center gap-x-2'>
                        <img src={avatar} className='rounded-full w-13 h-13 object-contain' />
                        <div>
                            <p className='text-sm'>Prashanth</p>
                            <p className='text-xs'>Online</p>
                        </div>
                    </div>
                </NavLink>

                <button className='hover:bg-gray-600 p-1 rounded-sm' onClick={handleLogout}>
                    <LogOut size={20} />
                </button>
            </div>

            {/* Tabs */}
            <div className='flex items-center pt-4 gap-x-1'>
                <button
                    className={`${activebtn === "chat" ? "bg-[#17495E]" : "border border-[#17495E]"} w-full p-2 rounded-sm`}
                    onClick={handleChats}
                >
                    Chats
                </button>

                <button
                    className={`${activebtn === "contacts" ? "bg-[#17495E]" : "border border-[#17495E]"} w-full p-2 rounded-sm`}
                    onClick={handleContacts}
                >
                    Contacts
                </button>
            </div>

            {/* SHOW CONTENT INSIDE SIDEBAR */}
            <div className="mt-4 h-[75vh] overflow-y-auto">
                {activebtn === "chat" && (
                    <Chatpage />   // Chat list inside sidebar
                )}

                {activebtn === "contacts" && (
                    <Contactpage />  // Contacts list inside sidebar
                )}
            </div>

        </section>
    );
};

export default Sidebarpage;
