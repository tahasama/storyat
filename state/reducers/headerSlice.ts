import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";


// const USER_URL: any = process.env.REACT_APP_USER_URL;

// interface valueProps {
//   email: string;
//   password: string;
//   provider?: GoogleAuthProvider;
//   useremail?: string;
//   username?: string;
//   userimage?: string;
// // }

// export const registerUser = createAsyncThunk(
//   "registerUser",
//   async ({ email, password }: valueProps) => {
//     try {
//       const res = await createUserWithEmailAndPassword(auth, email, password);
//       return res.user
     
//     } catch (error: any) {
//       return error;
//     }
//   }
// );

export interface HeaderProps {
    headerStates: {
        menuStateValue:boolean,
        storyRouteValue:string,
        commentRouteValue:string,
        modalStateValue:boolean,

  };
}

export const headerInitialState = {

  menuStateValue:false,
  storyRouteValue:'',
  commentRouteValue:'',
  modalStateValue:false
};

export const headerSlice = createSlice({
  name: "header-redux",
  initialState: headerInitialState,
  reducers: {

    menuState: (state, action) => {
      state.menuStateValue = action.payload;
    },
    modalState: (state, action) => {
      state.modalStateValue = action.payload;
      console.log(state.modalStateValue)
    },
    storyRoute: (state, action) => {
      state.storyRouteValue = action.payload;
    },
    commentRoute: (state, action) => {
      state.commentRouteValue = action.payload;
    },
  },
//   extraReducers: (builder) => {
//     builder.addCase(registerUser.fulfilled, (state, action: any) => {
//       state.email = action.payload.email;
//       state.err.code = action.payload.code;
//       state.err.message = action.payload.message;
//     });
//   },
});

export const getHeaderData = (state: HeaderProps) => state.headerStates;
export const { menuState,storyRoute, commentRoute,modalState} = headerSlice.actions;
export default headerSlice.reducer;