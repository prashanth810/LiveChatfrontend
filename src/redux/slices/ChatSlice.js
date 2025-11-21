import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { handlegetchatgetbyid, handlegetchatinfo, handlegetcontactinfo, handlesendmessages } from "../../apis/Apis";

// get contact info data 
export const Getcontactinfo = createAsyncThunk("/chat/fetchcontacts", async (_, thunnkAPI) => {
    try {
        const response = await handlegetcontactinfo();
        return response.data.data;
    }
    catch (error) {
        return thunnkAPI.rejectWithValue(error.message);
    }
});

export const getchatinfo = createAsyncThunk("chat/fetchallchat", async (_, thunnkAPI) => {
    try {
        const response = await handlegetchatinfo();
        return response.data.data;
    }
    catch (error) {
        return thunnkAPI.rejectWithValue(error.message);
    }
})

export const getchatmessagesbyid = createAsyncThunk("chat/fetchbyid", async (id, thunnkAPI) => {
    try {
        const response = await handlegetchatgetbyid(id);
        return response.data.data;
    }
    catch (error) {
        return thunnkAPI.rejectWithValue(error.message);
    }
})


// send messsages 
export const sendmessages = createAsyncThunk(
    "chat/sendchat",
    async ({ receiverId, data }, thunkAPI) => {
        try {
            const response = await handlesendmessages(receiverId, data);
            return response.data.data;
        } catch (error) {
            return thunkAPI.rejectWithValue(error.response?.data?.message || error.message);
        }
    }
);


const initialState = {
    contactinfo: {
        contactdata: {},
        contactloading: false,
        contacterror: null,
    },
    chatinfo: {
        chatdata: {},
        chatloading: false,
        chaterror: null,
    },
    singlechat: {
        singlechatdata: {},
        singleloading: false,
        sngleerror: null,
    },
    sendmessages: {
        sending: false,
        sendSuccess: false,
        sendError: null,
        messages: []
    },
    actveTab: "chat",
    selectedUser: null,
    isSoundEnabled: localStorage.getItem("isSoundEnabled") === true,
}
const ChatSlice = createSlice({
    name: "chat",
    initialState,
    reducers: {
        toggleSound: () => {
            localStorage.setItem("isSoundEnabled", !get().isSoundEnabled)
            setInterval({ isSoundEnabled: !get().isSoundEnabled })
        },
        setActiveTab: (tab) => set({ actveTab }),
        setSelectedUser: (selectedUser) => set({ selectedUser }),
    },
    extraReducers: (builder) => {
        builder
            // get contact info api 
            .addCase(Getcontactinfo.pending, (state) => {
                state.contactinfo.contactloading = true;
                state.contactinfo.contacterror = null;
            })
            .addCase(Getcontactinfo.fulfilled, (state, action) => {
                state.contactinfo.contactloading = false;
                state.contactinfo.contactdata = action.payload;
                state.contactinfo.contacterror = null;
            })
            .addCase(Getcontactinfo.rejected, (state, action) => {
                state.contactinfo.contactloading = false;
                state.contactinfo.contacterror = action.payload;
            })

            // get chat info data api 
            .addCase(getchatinfo.pending, (state) => {
                state.chatinfo.chatloading = true;
                state.chatinfo.chaterror = null;
            })
            .addCase(getchatinfo.fulfilled, (state, action) => {
                state.chatinfo.chatloading = false;
                state.chatinfo.chatdata = action.payload;
            })
            .addCase(getchatinfo.rejected, (state, action) => {
                state.chatinfo.chatloading = false;
                state.chatinfo.chaterror = action.payload;
            })

            // get single chat by id 
            .addCase(getchatmessagesbyid.pending, (state) => {
                state.singlechat.singleloading = true;
                state.singlechat.sngleerror = null;
            })
            .addCase(getchatmessagesbyid.fulfilled, (state, action) => {
                state.singlechat.singleloading = false;
                state.singlechat.singlechatdata = action.payload;
            })
            .addCase(getchatmessagesbyid.rejected, (state, action) => {
                state.singlechat.singleloading = false;
                state.singlechat.sngleerror = action.payload;
            })

            // sendng message to other
            .addCase(sendmessages.pending, (state) => {
                state.sendmessages.sending = true;
                state.sendmessages.sendSuccess = false;
                state.sendmessages.sendError = null;
            })
            .addCase(sendmessages.fulfilled, (state, action) => {
                state.sendmessages.sending = false;
                state.sendmessages.sendSuccess = true;
                if (Array.isArray(state.singlechat.singlechatdata)) {
                    state.singlechat.singlechatdata.push(action.payload);
                }

            })
            .addCase(sendmessages.rejected, (state, action) => {
                state.sendmessages.sending = false;
                state.sendmessages.sendError = action.payload;
            })
    }
})

export default ChatSlice.reducer;