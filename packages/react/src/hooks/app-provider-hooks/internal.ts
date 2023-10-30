import type { ThunkDispatch, AnyAction } from '@reduxjs/toolkit';
import { TypedUseSelectorHook, useDispatch, useSelector } from 'react-redux';
import { _themeSlice } from '../../components/app/redux-slices/theme';
import { _userEventsSlice } from '../../components/app/redux-slices/user-event';

export const useInternalAppSelector: TypedUseSelectorHook<{
  _theme: ReturnType<typeof _themeSlice.getInitialState>;
  '_user-events': ReturnType<typeof _userEventsSlice.getInitialState>;
}> = useSelector;

export const useInternalAppDispatch = () => useDispatch<ThunkDispatch<any, any, AnyAction>>();