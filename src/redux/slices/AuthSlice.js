import { createAsyncThunk, createSlice } from '@reduxjs/toolkit'
import { handlegetlogiedinuserdata, handlelogin, handleprogile, handleSignup } from '../../apis/Apis';

// sing up  api
export const AuthSingup = createAsyncThunk("auth/signup", async (data, thunkAPI) => {
    try {
        const response = await handleSignup(data);
        return response.data;
    }
    catch (error) {
        return thunkAPI.rejectWithValue(error.message || "Failed sing up !!!");
    }
})


// login api
export const Authlogin = createAsyncThunk("auth/login", async (data, thunkAPI) => {
    try {
        const response = await handlelogin(data);
        return response.data;
    }
    catch (error) {
        return thunkAPI.rejectWithValue(error.message);
    }
})


// logid in user data 
export const handlelogidprofiledata = createAsyncThunk("/auth/profile", async (id, thunkAPI) => {
    try {
        const response = await handlegetlogiedinuserdata(id);
        return response.data.data;
    }
    catch (err) {
        return thunkAPI.rejectWithValue(err.message);
    }
})


export const handleprogileslice = createAsyncThunk("auth/profile", async (_, thunkAPI) => {
    try {
        const response = await handleprogile();
        return response.data.data;
    }
    catch (error) {
        return thunkAPI.rejectWithValue(error.message);
    }
})



const initialState = {
    auth: {
        authloading: false,
        autherror: null,
        authdata: {},
        // isAuthenticated: false,
    },
    authlogin: {
        logindata: {},
        loginloading: false,
        loginerror: null,
        isAuthenticated: false,
    },
    profiledata: {
        profile: {},
        profileloading: false,
        profileerror: null,
    },
    logedinuser: {
        logedinuserdata: {},
        logedinuserloading: false,
        logiedinusererror: null,
    }
}

const AuthSlice = createSlice({
    name: "Auth",
    initialState,

    reducers: {
        logoutUser: (state) => {
            state.auth.isAuthenticated = false;
            state.auth.authdata = {};
            state.authlogin.logindata = {};

            // delete cookie
            document.cookie = "token=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";
        }

    },

    extraReducers: (builder) => {
        builder
            // sing up api 
            .addCase(AuthSingup.pending, (state) => {
                state.auth.authloading = true;
                state.auth.autherror = null;
            })
            .addCase(AuthSingup.fulfilled, (state, action) => {
                state.auth.authloading = false;
                state.auth.authdata = action.payload;
                // ✅ user is now authenticated
                state.auth.isAuthenticated = true;
            })
            .addCase(AuthSingup.rejected, (state, action) => {
                state.auth.authloading = false;
                state.auth.autherror = action.payload;
            })

            // login api 
            .addCase(Authlogin.pending, (state) => {
                state.authlogin.loginloading = true;
                state.authlogin.loginerror = null;
            })
            .addCase(Authlogin.fulfilled, (state, action) => {
                state.authlogin.loginloading = false;
                // is login is true 
                state.auth.isAuthenticated = true;
                state.authlogin.logindata = action.payload;

            })
            .addCase(Authlogin.rejected, (state, action) => {
                state.authlogin.loginloading = false;
                state.authlogin.loginerror = action.payload;
            })

            // fetch profile data 
            .addCase(handlelogidprofiledata.pending, (state) => {
                state.profiledata.profileloading = true;
                state.profiledata.profileerror = null;
            })
            .addCase(handlelogidprofiledata.fulfilled, (state, action) => {
                state.profiledata.profileloading = false;
                state.profiledata.profile = action.payload;
            })
            .addCase(handlelogidprofiledata.rejected, (state, action) => {
                state.profiledata.profileloading = false;
                state.profiledata.profileerror = action.payload;
            })

            .addCase(handleprogileslice.pending, (state) => {
                state.logedinuser.logedinuserloading = true;
                state.logedinuser.logiedinusererror = null;
            })
            .addCase(handleprogileslice.fulfilled, (state, action) => {
                state.logedinuser.logedinuserloading = false;
                state.logedinuser.logedinuserdata = action.payload;
                state.auth.isAuthenticated = true;
            })
            .addCase(handleprogileslice.rejected, (state, action) => {
                state.logedinuser.logedinuserloading = false;
                state.logedinuser.logiedinusererror = action.payload;
            })
    }
})

export const { logoutUser } = AuthSlice.actions;
export default AuthSlice.reducer;