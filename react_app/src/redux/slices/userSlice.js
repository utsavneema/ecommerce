import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";
import { baseUrl } from "../../helpers";

const initialState = {
  userDetails: null,
};

export const getUserDetails = createAsyncThunk("userSlice", async () => {
  try {
    const token = localStorage.getItem('authToken');
    if (token) {
      const response = await axios.get(baseUrl + 'api/auth', {
        headers: {
          Authorization: token,
        },
      });
      const { userDetails } = response.data;
      if (userDetails) {
        return userDetails;
      }
    }
  } catch (error) {
    console.error('error:', error);
    throw error;
  }
});


const userSlice = createSlice({
    name: "user",
    initialState, 
    reducers:{}, 
    extraReducers: (builder) => {
        builder
        .addCase(getUserDetails.fulfilled, (state, action)=>{
            state.userDetails = action.payload; //userdetails yha store hui
        })
        // .addCase(getUserDetails.rejected, (state)=>{
        //     console.log("Error")
        // });
    }       
})

export default userSlice.reducer;
