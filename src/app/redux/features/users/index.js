import { createSlice } from "@reduxjs/toolkit";
import { fetchUsers } from '../../services/users'

const initialState = {
  users: [],
};

const UserSlice = createSlice({
  name: "users",
  initialState,
  reducers: {
    setUsers: (state, action) => {
      state.users = action.payload;
    },
    
  },
});

export const {
  setUsers,
} = UserSlice.actions;


export const fetchAllUsers = (auth) => async (dispatch) => {
    
  try {
    const data = await fetchUsers(auth);
    dispatch(setUsers(data));
  } catch (error) {
    dispatch(setError(error.message));
  }
};





export default UserSlice.reducer;
