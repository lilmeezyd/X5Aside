

//src/store/slices/databaseSlice.js
import { createSlice } from "@reduxjs/toolkit";

const savedDb = localStorage.getItem("dbName");

const initialState = {
  dbName: savedDb || "", // fallback to empty string
};

const databaseSlice = createSlice({
  name: "database",
  initialState,
  reducers: {
    setDbName: (state, action) => {
      state.dbName = action.payload;
      localStorage.setItem("dbName", action.payload); // persist it
    },
  },
});

export const { setDbName } = databaseSlice.actions;
export default databaseSlice.reducer;
