import { BIUserDTO } from "@/lib/types/User";
import { PayloadAction, createSlice } from "@reduxjs/toolkit";

interface UserState {
  user: BIUserDTO | null;
}

const initialState: UserState = {
  user: null
}

const userSlice = createSlice({
  name: 'user',
  initialState,
  reducers: {
    setUser: (state, action: PayloadAction<BIUserDTO | null>) => {
      state.user = action.payload
    },
  },
})

export const { setUser } = userSlice.actions;
export default userSlice.reducer;