import { createSlice } from "@reduxjs/toolkit";
import { fetchProfile } from '../../services/profile'


const initialState = {
  profileData: {},
};

const ProfileSlice = createSlice({
  name: "profile",
  initialState,
  reducers: {
    setProfile: (state, action) => {
      state.profileData = action.payload;
    },
    
  },
});

export const {
  setProfile,
} = ProfileSlice.actions;


export const fetchProfileData = (auth) => async (dispatch) => {
    
    try {
      const data = await fetchProfile(auth);
      dispatch(setProfile(data));
    } catch (error) {
      console.log("SLICE_ERROR ",error);
      dispatch(setError(error.message));
    }
  };





export default ProfileSlice.reducer;
