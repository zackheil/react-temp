import { PayloadAction, createSlice } from '@reduxjs/toolkit';

export type ThemeSliceState = {
  theme: 'light' | 'dark';
  usingSystemTheme: boolean;
};

const initialState: ThemeSliceState = {
  theme: window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light',
  usingSystemTheme: true,
};

export const _themeSlice = createSlice({
  name: '_theme',
  initialState,
  reducers: {
    toggleTheme: (state) => {
      if (state.usingSystemTheme) {
        state.theme = 'light';
        state.usingSystemTheme = false;
        return;
      } else if (state.theme === 'light') {
        state.theme = 'dark';
        state.usingSystemTheme = false;
        return;
      } else if (state.theme === 'dark') {
        {
          state.theme = window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
          state.usingSystemTheme = true;
        }
      };
    },
    setThemeLight: (state) => {
      state.theme = 'light';
      state.usingSystemTheme = false;
    },
    setThemeDark: (state) => {
      state.theme = 'dark';
      state.usingSystemTheme = false;
    },
    setThemeSystem: (state) => {
      state.theme = window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
      state.usingSystemTheme = true;
    },
    setTheme: (state, action: PayloadAction<'light' | 'dark' | 'system'>) => {
      state.theme = window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
      state.usingSystemTheme = action.payload === 'system';
    },
  },
});

export const {
  toggleTheme,
  setThemeLight,
  setThemeDark,
  setThemeSystem,
  setTheme,
} = _themeSlice.actions;