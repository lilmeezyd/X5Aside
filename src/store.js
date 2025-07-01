import { configureStore} from '@reduxjs/toolkit'
import authReducer from './slices/authSlice';
import { apiSlice } from './slices/apiSlice';
import databaseReducer from "./slices/databaseSlice";

const store = configureStore({
    reducer: {
        auth: authReducer,
        database: databaseReducer,
        [apiSlice.reducerPath]: apiSlice.reducer,
    },
    middleware: (getDefaultMiddleware) => 
        getDefaultMiddleware().concat(apiSlice.middleware),
    devTools: true,
})

export default store;
