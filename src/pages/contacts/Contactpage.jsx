import React, { useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { Getcontactinfo } from '../../redux/slices/ChatSlice'
import avatar from '../../../public/avatar.png' // fallback image
import { logoutUser } from '../../redux/slices/AuthSlice';
import { NavLink } from 'react-router-dom';

const Contactpage = () => {
    const dispatch = useDispatch();

    const { contactdata, contactloading, contacterror } = useSelector(
        (state) => state.chat.contactinfo
    );

    useEffect(() => {
        dispatch(Getcontactinfo());
    }, []);


    if (contactloading) return <p className="text-gray-300 p-4">Loading contacts...</p>;
    if (contacterror) return <p className="text-red-400 p-4">{contacterror}</p>;



    return (
        <div className="mt-4">
            {/* HEADER */}
            <p className="text-sm text-gray-400 mb-3">Contacts</p>

            {/* LIST */}
            <div className="flex flex-col gap-y-2 h-[27rem] overflow-auto"
                style={{ scrollbarWidth: "none" }} >
                {contactdata && contactdata.length > 0 ? (
                    contactdata.map((user) => (
                        <NavLink key={user._id} to={`/chat/${user._id}`}>
                            <div
                                className="flex items-center gap-3 p-2 rounded-lg hover:bg-[#224157] cursor-pointer transition"
                            >
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
                    <p className="text-gray-300 p-2">No Contacts Found</p>
                )}
            </div>
        </div>
    );
};

export default Contactpage;
