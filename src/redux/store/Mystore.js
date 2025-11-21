import { configureStore } from "@reduxjs/toolkit";
import AuthSlice from '../slices/AuthSlice.js';
import chatSlice from '../slices/ChatSlice.js';

const Mystore = configureStore({
    reducer: {
        Auth: AuthSlice,
        chat: chatSlice,
    }
})

export default Mystore;