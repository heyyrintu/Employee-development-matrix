import React, { createContext, useContext, useReducer, useEffect } from 'react';
import { settingsApi } from '../services/api';
import type { AppSettings, LevelConfig } from '../types';

interface SettingsState {
  settings: AppSettings | null;
  loading: boolean;
  error: string | null;
}

type SettingsAction =
  | { type: 'SET_LOADING'; payload: boolean }
  | { type: 'SET_SETTINGS'; payload: AppSettings }
  | { type: 'SET_ERROR'; payload: string }
  | { type: 'UPDATE_SETTINGS'; payload: Partial<AppSettings> };

const defaultSettings: AppSettings = {
  levels: [
    { level: 0, label: 'Not Trained', color: '#ef4444', description: 'No training completed' },
    { level: 1, label: 'In Progress', color: '#f59e0b', description: 'Training in progress' },
    { level: 2, label: 'Complete', color: '#10b981', description: 'Training completed' },
  ],
  theme: 'light',
  default_target_level: 2,
  completion_method: 'average',
  show_avatars: true,
  compact_view: false,
};

const initialState: SettingsState = {
  settings: defaultSettings,
  loading: false,
  error: null,
};

function settingsReducer(state: SettingsState, action: SettingsAction): SettingsState {
  switch (action.type) {
    case 'SET_LOADING':
      return { ...state, loading: action.payload };
    
    case 'SET_SETTINGS':
      return { ...state, settings: action.payload, loading: false, error: null };
    
    case 'SET_ERROR':
      return { ...state, error: action.payload, loading: false };
    
    case 'UPDATE_SETTINGS':
      return {
        ...state,
        settings: state.settings ? { ...state.settings, ...action.payload } : null
      };
    
    default:
      return state;
  }
}

interface SettingsContextType {
  state: SettingsState;
  loadSettings: () => Promise<void>;
  updateSettings: (settings: Partial<AppSettings>) => Promise<void>;
  updateLevels: (levels: LevelConfig[]) => Promise<void>;
  updateTheme: (theme: 'light' | 'dark') => Promise<void>;
  getLevelConfig: (level: number) => LevelConfig | undefined;
  getLevelColor: (level: number) => string;
  getLevelLabel: (level: number) => string;
}

const SettingsContext = createContext<SettingsContextType | undefined>(undefined);

export function SettingsProvider({ children }: { children: React.ReactNode }) {
  const [state, dispatch] = useReducer(settingsReducer, initialState);

  const loadSettings = async () => {
    dispatch({ type: 'SET_LOADING', payload: true });
    try {
      const settings = await settingsApi.getSettings();
      dispatch({ type: 'SET_SETTINGS', payload: settings });
    } catch (error) {
      console.error('Failed to load settings:', error);
      dispatch({ type: 'SET_ERROR', payload: error instanceof Error ? error.message : 'Failed to load settings' });
    }
  };

  const updateSettings = async (settings: Partial<AppSettings>) => {
    try {
      const updatedSettings = await settingsApi.updateSettings(settings);
      dispatch({ type: 'SET_SETTINGS', payload: updatedSettings });
    } catch (error) {
      console.error('Failed to update settings:', error);
      throw error;
    }
  };

  const updateLevels = async (levels: LevelConfig[]) => {
    try {
      await settingsApi.updateLevels(levels);
      dispatch({ type: 'UPDATE_SETTINGS', payload: { levels } });
    } catch (error) {
      console.error('Failed to update levels:', error);
      throw error;
    }
  };

  const updateTheme = async (theme: 'light' | 'dark') => {
    try {
      await settingsApi.updateTheme(theme);
      dispatch({ type: 'UPDATE_SETTINGS', payload: { theme } });
      
      // Apply theme to document
      document.documentElement.classList.toggle('dark', theme === 'dark');
    } catch (error) {
      console.error('Failed to update theme:', error);
      throw error;
    }
  };

  const getLevelConfig = (level: number): LevelConfig | undefined => {
    return state.settings?.levels.find(l => l.level === level);
  };

  const getLevelColor = (level: number): string => {
    const config = getLevelConfig(level);
    return config?.color || '#6b7280';
  };

  const getLevelLabel = (level: number): string => {
    const config = getLevelConfig(level);
    return config?.label || `Level ${level}`;
  };

  // Load settings on mount
  useEffect(() => {
    loadSettings();
  }, []);

  // Apply theme on mount and when settings change
  useEffect(() => {
    if (state.settings?.theme) {
      document.documentElement.classList.toggle('dark', state.settings.theme === 'dark');
    }
  }, [state.settings?.theme]);

  const value: SettingsContextType = {
    state,
    loadSettings,
    updateSettings,
    updateLevels,
    updateTheme,
    getLevelConfig,
    getLevelColor,
    getLevelLabel,
  };

  return (
    <SettingsContext.Provider value={value}>
      {children}
    </SettingsContext.Provider>
  );
}

export function useSettings() {
  const context = useContext(SettingsContext);
  if (context === undefined) {
    throw new Error('useSettings must be used within a SettingsProvider');
  }
  return context;
}
