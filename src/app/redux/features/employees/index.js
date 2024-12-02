import { createSlice } from "@reduxjs/toolkit";
import { fetchAllLeaves, fetchUserLeave } from "../../services/employees";


const initialState = {
  leaves: [],
  allLeaves: [],
};

const EmployeeSlice = createSlice({
  name: "employee",
  initialState,
  reducers: {
    setLeave: (state, action) => {
      state.leaves = action.payload;
    },
    setAllLeaves: (state, action) => {
      state.allLeaves = action.payload;
    },
    
  },
});

export const {
  setLeave,
  setAllLeaves,
} = EmployeeSlice.actions;


export const fetchLeaveData = (auth) => async (dispatch) => {
    
    try {
      const data = await fetchUserLeave(auth);
      dispatch(setLeave(data));
    } catch (error) {
      dispatch(setError(error.message));
    }
  };
export const fetchGeneralLeaveData = (auth) => async (dispatch) => {
    
    try {
      const data = await fetchAllLeaves(auth);
      dispatch(setAllLeaves(data));
    } catch (error) {
      dispatch(setError(error.message));
    }
  };





export default EmployeeSlice.reducer;
