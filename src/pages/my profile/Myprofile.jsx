import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { handleprogileslice } from "../../redux/slices/AuthSlice";
import avatar from '../../../public/avatar.png'

const Myprofile = () => {
    const dispatch = useDispatch();

    const { logedinuserdata, logedinuserloading } = useSelector(
        (state) => state?.Auth?.logedinuser
    );

    useEffect(() => {
        dispatch(handleprogileslice());
    }, [dispatch]);

    return (
        <section className="h-52 xl:mt-20 flex flex-col items-center justify-center gap-2">

            {/* Profile Image */}
            <img
                src={logedinuserdata?.profile || avatar}   // fallback image
                alt="profile"
                className="w-20 h-20 rounded-full object-cover shadow-md"
            />

            {/* Full Name */}
            <h2 className="text-lg font-semibold">
                {logedinuserdata?.fullName || "Full Name"}
            </h2>

            {/* Email */}
            <p className="text-gray-600 text-sm">
                {logedinuserdata?.email || "email@example.com"}
            </p>

            {/* Save Button (Disabled default) */}
            <button
                disabled
                className="px-5 py-2 rounded-md bg-gray-300 text-gray-600 cursor-not-allowed mt-2"
            >
                Save
            </button>
        </section>
    );
};

export default Myprofile;
