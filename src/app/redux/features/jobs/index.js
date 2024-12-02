import { createSlice } from "@reduxjs/toolkit";
import { getJobs } from "../../services/jobs";


const initialState = {
  jobs: [],
};

const JobSlice = createSlice({
  name: "jobs",
  initialState,
  reducers: {
    setJobs: (state, action) => {
      state.jobs = action.payload;
    },
  
    
  },
});

export const {
  setJobs,
} = JobSlice.actions;


export const fetchJobs = () => async (dispatch) => {
    
    try {
      const data = await getJobs();
      dispatch(setJobs(data));
    } catch (error) {
      dispatch(setError(error.message));
    }
  };





export default JobSlice.reducer;
