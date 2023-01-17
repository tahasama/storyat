import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { addDoc, collection, getDocs } from "firebase/firestore";
import { Alert } from "react-native";
import { db } from "../../firebase";


// const USER_URL: any = process.env.REACT_APP_USER_URL;

interface storyProps {
    userId: string;
  title: string;
  content: string;

}

export const loadStories = createAsyncThunk(
  "loadStories",
  async () => {
    try {
        let result = [];
        const querySnapshot = await getDocs(collection(db, "stories"));
    querySnapshot.forEach((doc: any) =>
      result.push({ ...doc.data(), id: doc.id })
    );
      return result
     
    } catch (error: any) {
      return error;
    }
  }
);

export const addStories = createAsyncThunk(
    "addStories",
    async ({title,content,userId}:storyProps) => {
        try {
            console.log('the res is',title,content,userId)
          
             const res= await addDoc(collection(db, "stories"), {
                  title: title,
                  content: content,
                  writerId: userId,
                  timestamp: Date.now(),
                })
                console.log('the res is',res)
             return res
          } catch (e) {
            console.error("Error adding document: ", e);
            Alert.alert("action failed please try again");
          }
    }
  );

export interface storiesProps {
    storiesStates: {
        result:any[],
        title: string,
        content: string,
        writerId: string,
        timestamp: string,
  };
}

export const storiesInitialState = {
    result:[],
    title:'',
    content:'',
    writerId:'',
    timestamp:'',
};

export const storiesSlice = createSlice({
  name: "stories-redux",
  initialState: storiesInitialState,
  reducers: {

    // commentRoute: (state, action) => {
    //   state.commentRouteValue = action.payload;
    // },
  },
  extraReducers: (builder) => {
    builder.addCase(loadStories.fulfilled, (state, action: any) => {
        state.result=action.payload
   
    });
//     builder.addCase(addStories.fulfilled, (state, action) => {
// state=action.payload
       
//     });
},
});

export const getstoriesData = (state: storiesProps) => state.storiesStates;
export const { } = storiesSlice.actions;
export default storiesSlice.reducer;