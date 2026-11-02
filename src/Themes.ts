// src/theme.ts
import { useColorScheme } from 'react-native';
import { useMMKVString } from 'react-native-mmkv';
import { storage } from './Storage';

export type ThemeMode = 'light' | 'dark' | 'system';

export const THEME_KEY = 'app_theme_mode';

// Палитры цветов
const lightColors = {
  background: '#f9f9f9',
  card: '#ffffff',
  text: '#333333',
  textSecondary: '#999999',
  border: '#f0f0f0',
  primary: '#007AFF',
  success: '#34C759',
  danger: '#ff3b30',
  inputBg: '#ffffff',
  icon: '#333333',
};

const darkColors = {
  background: '#121212',
  card: '#1e1e1e',
  text: '#ffffff',
  textSecondary: '#aaaaaa',
  border: '#333333',
  primary: '#0a84ff',
  success: '#30d158',
  danger: '#ff453a',
  inputBg: '#2c2c2e',
  icon: '#ffffff',
};

export const useAppTheme = () => {
  // Получаем системную тему
  const systemScheme = useColorScheme();
  
  // Получаем сохраненную тему из MMKV (по умолчанию 'system')
  const [themeMode, setThemeMode] = useMMKVString(THEME_KEY, storage);
  const currentMode = (themeMode as ThemeMode) || 'system';

  // Определяем, какая тема должна быть активна
  const isDark = 
    currentMode === 'dark' || 
    (currentMode === 'system' && systemScheme === 'dark');

  return {
    isDark,
    colors: isDark ? darkColors : lightColors,
    mode: currentMode,
    setMode: setThemeMode, // Функция для переключения темы
  };
};