import { createSlice } from "@reduxjs/toolkit";


const initialState = {
    currentUser: null,
    error: null,
    loading: false,
}

const userSlice = createSlice({
    name:'user',
    initialState,
    reducers:{
        signinStart: (state) => {
            state.loading = true;
        },
        signinSuccess: (state, action) => {
            state.currentUser = action.payload
            state.loading = false
            state.error = null
        },
        signinFailure : (state, action) => {
            state.loading = false
            state.error = action.payload
        },
        updateUserStart: (state, action) => {
            state.loading = true
            state.error = null
        },
        updateUserSuccess: (state, action) => {
            state.loading = false
            state.currentUser = action.payload
            state.error = null
        },
        updateUserFailed: (state, action) => {
            state.loading = false
            state.error = action.payload
        },
    }
});


export const {
    signinFailure, 
    signinSuccess, 
    signinStart,
    updateUserStart,
    updateUserSuccess,
    updateUserFailed
    
} = userSlice.actions;

export default userSlice.reducer;