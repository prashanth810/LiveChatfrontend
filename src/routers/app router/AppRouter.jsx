import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import AdminLayoutPage from '../layout/AdminLayoutPage';
import Authpage from '../../pages/auth page/Authpage';
import Chatpage from '../../pages/chat page/Chatpage';
import Contactpage from '../../pages/contacts/Contactpage';
import SingleChatpage from '../../pages/single chat/SingleChatpage';
import { useSelector } from "react-redux";
import Defaultpage from '../../pages/Default/Defaultpage';

const AppRouter = () => {

    const { isAuthenticated } = useSelector((state) => state.Auth.auth);

    return (
        <section>
            <Routes>

                {/* LOGIN PAGE */}
                <Route
                    path="/login"
                    element={!isAuthenticated ? <Authpage /> : <Navigate to="/chat" />}
                />

                {/* PROTECTED CHAT LAYOUT */}
                <Route
                    path="/chat"
                    element={isAuthenticated ? <AdminLayoutPage /> : <Navigate to="/login" />}
                >

                    {/* DEFAULT RIGHT SIDE (NO REDIRECT) */}
                    <Route index element={<Defaultpage />} />

                    {/* RIGHT SIDE ROUTES */}
                    <Route path="chats" element={<Chatpage />} />
                    <Route path="contacts" element={<Contactpage />} />
                    <Route path=":id" element={<SingleChatpage />} />
                </Route>

                {/* CATCH-ALL */}
                <Route path="*" element={<Navigate to="/chat" />} />

            </Routes>
        </section>
    );
};

export default AppRouter;
