import { configureStore } from '@reduxjs/toolkit';
import { counterSlice } from './default-reducer';
import { emptyRTKApi } from './api';

export const store = configureStore({
  reducer: {
    [counterSlice.name]: counterSlice.reducer,
    [emptyRTKApi.reducerPath]: emptyRTKApi.reducer,
  },
  middleware: (getDefaultMiddleware) => getDefaultMiddleware().concat(emptyRTKApi.middleware),
});

export type AppDispatch = typeof store.dispatch;
export type RootState = ReturnType<typeof store.getState>;
