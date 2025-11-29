import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import AdminLayoutPage from '../layout/AdminLayoutPage';
import Authpage from '../../pages/auth page/Authpage';
import Chatpage from '../../pages/chat page/Chatpage';
import Contactpage from '../../pages/contacts/Contactpage';
import SingleChatpage from '../../pages/single chat/SingleChatpage';
import { useSelector } from "react-redux";
import Defaultpage from '../../pages/Default/Defaultpage';
import Myprofile from '../../pages/my profile/Myprofile';

const AppRouter = () => {

    const { isAuthenticated } = useSelector((state) => state.Auth.auth);

    const storedToken = sessionStorage.getItem("token");
    const loggedIn = isAuthenticated || storedToken;

    return (
        <section>
            <Routes>

                {/* LOGIN PAGE */}
                <Route
                    path="/login"
                    element={!loggedIn ? <Authpage /> : <Navigate to="/chat" />}
                />

                {/* PROTECTED ROUTES */}
                <Route
                    path="/chat"
                    element={loggedIn ? <AdminLayoutPage /> : <Navigate to="/login" />}
                >

                    <Route index element={<Defaultpage />} />
                    <Route path="chats" element={<Chatpage />} />
                    <Route path="contacts" element={<Contactpage />} />
                    <Route path=":id" element={<SingleChatpage />} />
                    <Route path="myprofile" element={<Myprofile />} />
                </Route>

                {/* CATCH ALL */}
                <Route path="*" element={<Navigate to={loggedIn ? "/chat" : "/login"} />} />

            </Routes>
        </section>
    );
};

export default AppRouter;
