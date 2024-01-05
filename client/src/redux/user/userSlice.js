import { createSlice } from '@reduxjs/toolkit'

const initialState = {
    loading: false,
    currentUser: null,
    updateLoading: false
}

const userSlice = createSlice({
    name: 'user',
    initialState,
    reducers: {
        signInStart: (state) => {
            state.loading = true
        },
        signInFailed: (state) => {
            state.loading = false
        },
        signInSuccess: (state, action) => {
            state.currentUser = action.payload,
                state.loading = false
        },
        logOutSuccess: (state) => {
            state.currentUser = null
        },
        uploadDataLoading: (state) => {
            state.updateLoading = true
        },
        uploaDataSuccess: (state) => {
            state.updateLoading = false
        }
    }
})

export const { signInStart, signInFailed, signInSuccess, logOutSuccess, uploadDataLoading, uploaDataSuccess } = userSlice.actions

export default userSlice.reducer
