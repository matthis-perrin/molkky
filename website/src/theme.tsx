import {createDataStore} from '@shared-web/lib/data_store';
import {createTheme} from '@shared-web/theme/theme_base';
import {FrontendTheme} from '@shared-web/theme/theme_model';

export const lightTheme: FrontendTheme = createTheme({accentColor: '#0049be', dark: false});
export const darkTheme: FrontendTheme = createTheme({accentColor: '#be6f00', dark: true});

const INITIAL_THEME = darkTheme;

const themeDataStore = createDataStore<FrontendTheme>(INITIAL_THEME);
export const getThemeData = themeDataStore.getData;
export const setThemeData = themeDataStore.setData;
export const useThemeData = themeDataStore.useData;
