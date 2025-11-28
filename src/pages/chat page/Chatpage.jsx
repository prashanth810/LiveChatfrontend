import React, { useEffect, useState } from 'react'
import Loaderpage from '../../componenets/loader/Loaderpage';
import { logoutUser } from '../../redux/slices/AuthSlice';
import { useDispatch, useSelector } from 'react-redux';
import { getchatinfo } from '../../redux/slices/ChatSlice';
import { NavLink, useLocation } from 'react-router-dom';
import avatar from '../../../public/avatar.png'


const Chatpage = () => {
    const [state, setState] = useState(false);
    const dispatch = useDispatch();
    const location = useLocation();
    const activeChatId = location.pathname.split("/").pop();



    const { chatdata, chatloading, chaterror } = useSelector((state) => state.chat.chatinfo)

    console.log(chatdata, 'chat')

    useEffect(() => {
        dispatch(getchatinfo());
    }, []);

    return (
        <section className='text-white'>
            <div className="flex flex-col gap-y-2 h-[30rem] overflow-auto"
                style={{ scrollbarWidth: "none" }} >
                {chatloading ? (
                    [...Array(6)].map((_, idx) => (
                        <div
                            key={idx}
                            className="flex items-center gap-x-2 p-4 rounded bg-[#1d384b] cursor-pointer transition animate-pulse"
                        >
                            {/* img circle */}
                            <div className="bg-[#1f415b] h-10 w-10 rounded-full animate-pulse" />

                            {/* Name + Email */}
                            <div className="flex flex-col gap-2 w-full">
                                <p className="bg-[#1f415b] h-3 w-32 rounded animate-pulse"></p>
                                <p className="bg-[#1f415b] h-3 w-24 rounded animate-pulse"></p>
                            </div>
                        </div>
                    ))

                ) : (
                    chatdata && chatdata.length > 0 ? (
                        chatdata.map((user) => (
                            <NavLink key={user._id} to={`/chat/${user._id}`}>
                                <div
                                    className={`flex items-center gap-x-2 p-2 rounded-lg hover:bg-[#224157] cursor-pointer transition 
                                      ${activeChatId === user._id
                                            ? "bg-[#1a3548]" //  border border-cyan-800
                                            : "hover:bg-[#224157]"
                                        }`} >
                                    {/* Profile Image */}
                                    <img
                                        src={user.profile ? user.profile : avatar}
                                        className="w-10 h-10 rounded-full object-cover"
                                        alt="profile"
                                    />

                                    {/* Name + Email */}
                                    <div>
                                        <p className="text-white text-sm font-medium truncate">{user.fullName}</p>
                                        <p className="text-gray-400 text-xs">{user.email}</p>
                                    </div>
                                </div>

                            </NavLink>
                        ))
                    ) : (
                        <p className="text-gray-300 p-2">No Chat data Found</p>
                    )
                )}

            </div>



        </section>
    )
}

export default Chatpage
