import React from 'react';
import { Outlet } from 'react-router-dom';
import Sidebarpage from '../../componenets/sidebar/Sidebarpage';

const AdminLayoutPage = () => {
    return (
        <section>
            <div className="w-full h-[95vh] overflow-y-hidden sidebar my-2 max-w-7xl mx-auto shadow-xl flex flex-col md:flex-row bg-[#0f172a] gap-x-1 rounded-lg border border-blue-500"
                style={{ scrollbarWidth: "none" }} >

                {/* LEFT SIDE = Sidebar */}
                <div className="w-[25%] hidden md:block">
                    <Sidebarpage />
                </div>

                {/* RIGHT SIDE = Dynamic Content */}
                <div className="w-full md:w-[75%] overflow-y-auto sidebar">
                    <Outlet />
                </div>

            </div>
        </section>
    );
};

export default AdminLayoutPage;
