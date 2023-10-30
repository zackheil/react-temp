// eslint-disable @typescript-eslint/no-empty-function

import { useInternalAppDispatch, useInternalAppSelector } from './internal';
import {
  ThemeSliceState,
  toggleTheme as _toggleTheme,
  setThemeLight as _setThemeLight,
  setThemeDark as _setThemeDark,
  setThemeSystem as _setThemeSystem,
  setTheme as _setTheme,
} from '../../components/app/redux-slices/theme';
import { addEvent as _addEvent } from '../../components/app/redux-slices/user-event';

/**
 * A hook to get the current state of the internal theme from the `<App>` context.
 *
 * @returns {ThemeSliceState} The current theme state info from the `<App>` context. Because this can be 
 * overridden with custom App component providers and not redux-toolkit, it will return undefined if 
 * the context isn't found instead of throwing an error.
 */
export const useGetAppThemeState = (): ThemeSliceState | undefined => {
  try {
    return useInternalAppSelector((state) => state['_theme']);
  } catch (e) {
    return undefined;
  }
};

type AppThemeStateReducer = () => {
  /**
   * Toggles between light, dark, and system themes in that order.
   */
  toggleTheme: (...params: Parameters<typeof _toggleTheme>) => void;
  /**
   * Sets the internal theme to be light, forcing the `usingSystemTheme` flag to be false.
   */
  setThemeLight: (...params: Parameters<typeof _setThemeLight>) => void;
  /**
   * Sets the internal theme to be dark, forcing the `usingSystemTheme` flag to be false.
   */
  setThemeDark: (...params: Parameters<typeof _setThemeDark>) => void;
  /**
   * Sets the internal theme to be whatever the user's OS preference is, setting the 
   * `usingSystemTheme` flag to true.
   */
  setThemeSystem: (...params: Parameters<typeof _setThemeSystem>) => void;
  /**
   * Sets the internal theme to be whatever is passed in. Functions the same as
   * `setThemeLight`, `setThemeDark`, and `setThemeSystem` but is handled in one function.
   * 
   * @see {@link AppThemeStateReducer[setThemeLight]}
   * @see {@link AppThemeStateReducer[setThemeDark]}
   * @see {@link AppThemeStateReducer[setThemeSystem]}
   */
  setTheme: (...params: Parameters<typeof _setTheme>) => void;
};

const reducers = {
  toggleTheme: _toggleTheme,
  setThemeLight: _setThemeLight,
  setThemeDark: _setThemeDark,
  setThemeSystem: _setThemeSystem,
  setTheme: _setTheme,
};

/**
 * A hook to set the current state of the theme from the `<App>` context.
 *
 * @returns A tuple of the dispatchable reducer functions for the theme state from the 
 * `<App>` context.
 */
export const useAppThemeStateReducer: AppThemeStateReducer = () => {
  try {
    const dispatch = useInternalAppDispatch();
    return {
      toggleTheme: (params) => {
        dispatch(_addEvent('User theme toggle triggered'))
        dispatch(_toggleTheme(params))
      },
      setThemeLight: (params) => {
        dispatch(_addEvent('User theme set to light'))
        dispatch(_setThemeLight(params))
      },
      setThemeDark: (params) => {
        dispatch(_addEvent('User theme set to dark'))
        dispatch(_setThemeDark(params))
      },
      setThemeSystem: (params) => {
        dispatch(_addEvent(('User theme set to system theme')))
        dispatch(_setThemeSystem(params))
      },
      setTheme: (params) => {
        dispatch(_addEvent('User theme set to ' + params))
        dispatch(_setTheme(params))
      },
    };
  } catch (e) {
    return reducers;
  }
};
