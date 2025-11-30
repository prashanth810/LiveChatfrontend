import { createAsyncThunk, createSlice } from '@reduxjs/toolkit'
import { handlegetlogiedinuserdata, handlelogin, handleprogile, handleSignup } from '../../apis/Apis';

// ------------------------- SIGNUP -------------------------
export const AuthSingup = createAsyncThunk(
    "auth/signup",
    async (data, thunkAPI) => {
        try {
            const res = await handleSignup(data);
            return res.data;
        } catch (err) {
            return thunkAPI.rejectWithValue(
                err.response?.data?.message || "Failed signup !!!"
            );
        }
    }
);

// ------------------------- LOGIN -------------------------
export const Authlogin = createAsyncThunk(
    "auth/login",
    async (data, thunkAPI) => {
        try {
            const res = await handlelogin(data);
            return res.data;
        } catch (err) {
            return thunkAPI.rejectWithValue(
                err.response?.data?.message || "Login failed"
            );
        }
    }
);

// ------------------------- PROFILE -------------------------
export const handlelogidprofiledata = createAsyncThunk(
    "/auth/profile",
    async (id, thunkAPI) => {
        try {
            const res = await handlegetlogiedinuserdata(id);
            return res.data.data;
        } catch (err) {
            return thunkAPI.rejectWithValue(
                err.response?.data?.message || err.message
            );
        }
    }
);

export const handleprogileslice = createAsyncThunk(
    "auth/profile",
    async (_, thunkAPI) => {
        try {
            const res = await handleprogile();
            return res.data.data;
        } catch (err) {
            return thunkAPI.rejectWithValue(
                err.response?.data?.message || err.message
            );
        }
    }
);


// ------------------------- INITIAL STATE -------------------------
const initialState = {
    auth: {
        authloading: false,
        autherror: null,
        authdata: {},
        isAuthenticated: false,
    },
    authlogin: {
        logindata: {},
        loginloading: false,
        loginerror: null,
        isAuthenticated: false,
        token: null,
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
};

// ------------------------- SLICE -------------------------
const AuthSlice = createSlice({
    name: "Auth",
    initialState,

    reducers: {
        logoutUser: (state) => {
            state.auth.isAuthenticated = false;
            state.auth.authdata = {};
            state.authlogin.logindata = {};
            sessionStorage.removeItem("token");
            document.cookie = "token=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";
        }
    },

    extraReducers: (builder) => {
        builder

            // -------------- SIGNUP --------------
            .addCase(AuthSingup.pending, (state) => {
                state.auth.authloading = true;
                state.auth.autherror = null;
            })
            .addCase(AuthSingup.fulfilled, (state, action) => {
                state.auth.authloading = false;
                state.auth.authdata = action.payload;

                // ❗ FIX: SIGNUP SHOULD NOT LOGIN USER
                state.auth.isAuthenticated = false;
            })
            .addCase(AuthSingup.rejected, (state, action) => {
                state.auth.authloading = false;
                state.auth.autherror = action.payload;
            })

            // -------------- LOGIN --------------
            .addCase(Authlogin.pending, (state) => {
                state.authlogin.loginloading = true;
                state.authlogin.loginerror = null;
            })
            .addCase(Authlogin.fulfilled, (state, action) => {
                state.authlogin.loginloading = false;

                // login success
                state.auth.isAuthenticated = true;
                state.authlogin.logindata = action.payload;

                sessionStorage.setItem("token", action.payload.token);
            })
            .addCase(Authlogin.rejected, (state, action) => {
                state.authlogin.loginloading = false;
                state.authlogin.loginerror = action.payload;
            })

            // -------------- FETCH PROFILE --------------
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

            // -------------- GET LOGGED IN USER --------------
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
            });
    }
});

export const { logoutUser } = AuthSlice.actions;
export default AuthSlice.reducer;
