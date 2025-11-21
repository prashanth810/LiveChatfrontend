import { createAsyncThunk, createSlice } from '@reduxjs/toolkit'
import { handlegetlogiedinuserdata, handlelogin, handleSignup } from '../../apis/Apis';

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
}

const AuthSlice = createSlice({
    name: "Auth",
    initialState,

    reducers: {
        logoutUser: (state) => {
            // clear redux store
            state.auth.isAuthenticated = false;
            state.auth.authdata = {};
            state.authlogin.logindata = {};

            // clear cookie
            document.cookie = "token= expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";
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
                // state.auth.isAuthenticated = true;
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
    }
})

export const { logoutUser } = AuthSlice.actions;
export default AuthSlice.reducer;