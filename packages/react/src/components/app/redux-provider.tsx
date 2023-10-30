/* eslint-disable @typescript-eslint/no-explicit-any */

import { Action, Reducer, ReducersMapObject, Slice, combineReducers, configureStore } from '@reduxjs/toolkit';
import { Api } from '@reduxjs/toolkit/dist/query';
import { Provider } from 'react-redux';
import { PersistGate } from 'redux-persist/integration/react';
import { persistStore, FLUSH, REHYDRATE, PAUSE, PERSIST, PURGE, REGISTER, persistReducer } from 'redux-persist';
import storage from 'redux-persist/lib/storage';
import type { PersistPartial } from 'redux-persist/lib/persistReducer';
import { encryptTransform } from 'redux-persist-transform-encrypt';

export type AppReduxProviderProps = {
  preloadedState?: any;
  slices?: Slice[];
  rtkApi?: Api<any, any, any, any, any>;
  devTools?: boolean;
  disablePersist?: boolean;
  persistSecret?: string;
};
export const ReduxProvider = ({
  children,
  slices,
  rtkApi,
  preloadedState,
  devTools,
  disablePersist,
  persistSecret,
}: React.PropsWithChildren<AppReduxProviderProps>) => {
  const root = combineReducers({
    ...slices?.reduce((acc, slice) => {
      acc[slice.name] = slice.reducer;
      return acc;
    }, {} as ReducersMapObject),
    ...(rtkApi ? { [rtkApi?.reducerPath]: rtkApi?.reducer } : {}),
  });

  let persistedReducer = undefined as ReturnType<typeof persistReducer> | undefined;
  const blacklistReducers = rtkApi ? [rtkApi.reducerPath] : [];
  if (!disablePersist) {
    persistedReducer = persistReducer(
      {
        key: 'root',
        storage: storage,
        transforms: persistSecret
          ? [
              encryptTransform({
                secretKey: persistSecret,
                onError: function (error) {
                  console.error('encryptTransform error', error);
                },
              }),
            ]
          : undefined,
        blacklist: blacklistReducers,
      },
      root
    );
  }

  const store = configureStore({
    reducer: (persistedReducer as Reducer<PersistPartial, Action<any>>) ?? root,
    middleware: (getDefaultMiddleware) =>
      getDefaultMiddleware({
        serializableCheck: {
          ignoredActions: [FLUSH, REHYDRATE, PAUSE, PERSIST, PURGE, REGISTER],
        },
      }).concat(rtkApi?.middleware || []),
    preloadedState,
    devTools,
  });

  if (!disablePersist) {
    const persistor = persistStore(store);
    return (
      <Provider store={store}>
        <PersistGate loading={null} persistor={persistor}>
          {children}
        </PersistGate>
      </Provider>
    );
  }

  return <Provider store={store}>{children}</Provider>;
};
