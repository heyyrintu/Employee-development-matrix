import React, { useState } from 'react';
import { useSettings } from '../contexts/SettingsContext';
import { useAuth } from '../contexts/AuthContext';
import { Save, Palette, Target, EyeOff } from 'lucide-react';

const Settings: React.FC = () => {
  const { state, updateSettings, updateTheme } = useSettings();
  const { isAdmin } = useAuth();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  if (!isAdmin()) {
    return (
      <div className="text-center py-12">
        <div className="text-red-600 mb-4">Access Denied</div>
        <p className="text-gray-600 dark:text-gray-400">
          You need admin privileges to access settings.
        </p>
      </div>
    );
  }

  const handleSave = async () => {
    setLoading(true);
    setError(null);
    setSuccess(null);

    try {
      if (state.settings) {
        await updateSettings(state.settings);
        setSuccess('Settings saved successfully!');
        setTimeout(() => setSuccess(null), 3000);
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to save settings');
    } finally {
      setLoading(false);
    }
  };

  const handleLevelChange = (index: number, field: string, value: any) => {
    if (!state.settings?.levels) return;

    const newLevels = [...state.settings.levels];
    newLevels[index] = { ...newLevels[index], [field]: value };
    
    updateSettings({ levels: newLevels });
  };

  const addLevel = () => {
    if (!state.settings?.levels) return;

    const newLevel = {
      level: Math.max(...state.settings.levels.map(l => l.level)) + 1,
      label: `Level ${Math.max(...state.settings.levels.map(l => l.level)) + 1}`,
      color: '#6b7280',
      description: '',
    };

    updateSettings({ levels: [...state.settings.levels, newLevel] });
  };

  const removeLevel = (index: number) => {
    if (!state.settings || state.settings.levels.length <= 1) return;

    const newLevels = state.settings.levels.filter((_, i) => i !== index);
    updateSettings({ levels: newLevels });
  };

  const handleThemeChange = (theme: 'light' | 'dark') => {
    updateTheme(theme);
  };

  if (!state.settings) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-600"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
            Settings
          </h1>
          <p className="text-gray-600 dark:text-gray-400">
            Configure application settings and preferences
          </p>
        </div>
        <button
          onClick={handleSave}
          disabled={loading}
          className="btn btn-primary flex items-center"
        >
          <Save className="h-4 w-4 mr-2" />
          {loading ? 'Saving...' : 'Save Settings'}
        </button>
      </div>

      {/* Status Messages */}
      {error && (
        <div className="bg-red-50 dark:bg-red-900 border border-red-200 dark:border-red-700 rounded-md p-4">
          <p className="text-sm text-red-600 dark:text-red-300">{error}</p>
        </div>
      )}

      {success && (
        <div className="bg-green-50 dark:bg-green-900 border border-green-200 dark:border-green-700 rounded-md p-4">
          <p className="text-sm text-green-600 dark:text-green-300">{success}</p>
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Theme Settings */}
        <div className="card p-6">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4 flex items-center">
            <Palette className="h-5 w-5 mr-2" />
            Appearance
          </h3>
          
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Theme
              </label>
              <div className="flex space-x-4">
                <button
                  onClick={() => handleThemeChange('light')}
                  className={`px-4 py-2 rounded-md text-sm font-medium ${
                    state.settings.theme === 'light'
                      ? 'bg-primary-100 text-primary-700 dark:bg-primary-900 dark:text-primary-300'
                      : 'bg-gray-100 text-gray-700 dark:bg-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600'
                  }`}
                >
                  Light
                </button>
                <button
                  onClick={() => handleThemeChange('dark')}
                  className={`px-4 py-2 rounded-md text-sm font-medium ${
                    state.settings.theme === 'dark'
                      ? 'bg-primary-100 text-primary-700 dark:bg-primary-900 dark:text-primary-300'
                      : 'bg-gray-100 text-gray-700 dark:bg-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600'
                  }`}
                >
                  Dark
                </button>
              </div>
            </div>

            <div className="flex items-center justify-between">
              <div>
                <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
                  Show Avatars
                </label>
                <p className="text-xs text-gray-500 dark:text-gray-400">
                  Display employee avatars in the matrix
                </p>
              </div>
              <button
                onClick={() => updateSettings({ show_avatars: !state.settings?.show_avatars })}
                className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                  state.settings?.show_avatars ? 'bg-primary-600' : 'bg-gray-200 dark:bg-gray-700'
                }`}
              >
                <span
                  className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                    state.settings?.show_avatars ? 'translate-x-6' : 'translate-x-1'
                  }`}
                />
              </button>
            </div>

            <div className="flex items-center justify-between">
              <div>
                <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
                  Compact View
                </label>
                <p className="text-xs text-gray-500 dark:text-gray-400">
                  Use a more compact layout for the matrix
                </p>
              </div>
              <button
                onClick={() => updateSettings({ compact_view: !state.settings?.compact_view })}
                className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                  state.settings?.compact_view ? 'bg-primary-600' : 'bg-gray-200 dark:bg-gray-700'
                }`}
              >
                <span
                  className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                    state.settings?.compact_view ? 'translate-x-6' : 'translate-x-1'
                  }`}
                />
              </button>
            </div>
          </div>
        </div>

        {/* Training Levels */}
        <div className="card p-6">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4 flex items-center">
            <Target className="h-5 w-5 mr-2" />
            Training Levels
          </h3>
          
          <div className="space-y-4">
            {state.settings?.levels.map((level, index) => (
              <div key={level.level} className="flex items-center space-x-3 p-3 border border-gray-200 dark:border-gray-600 rounded-lg">
                <div className="flex-shrink-0">
                  <div
                    className="w-6 h-6 rounded-full"
                    style={{ backgroundColor: level.color }}
                  ></div>
                </div>
                <div className="flex-1 grid grid-cols-2 gap-2">
                  <input
                    type="text"
                    value={level.label}
                    onChange={(e) => handleLevelChange(index, 'label', e.target.value)}
                    className="text-sm border border-gray-300 dark:border-gray-600 rounded px-2 py-1 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                  />
                  <input
                    type="color"
                    value={level.color}
                    onChange={(e) => handleLevelChange(index, 'color', e.target.value)}
                    className="h-8 w-full border border-gray-300 dark:border-gray-600 rounded"
                  />
                </div>
                <div className="flex-shrink-0">
                  <input
                    type="text"
                    value={level.description || ''}
                    onChange={(e) => handleLevelChange(index, 'description', e.target.value)}
                    placeholder="Description"
                    className="text-xs border border-gray-300 dark:border-gray-600 rounded px-2 py-1 bg-white dark:bg-gray-700 text-gray-900 dark:text-white w-32"
                  />
                </div>
                {state.settings?.levels && state.settings.levels.length > 1 && (
                  <button
                    onClick={() => removeLevel(index)}
                    className="text-red-600 hover:text-red-800 dark:text-red-400 dark:hover:text-red-300"
                  >
                    <EyeOff className="h-4 w-4" />
                  </button>
                )}
              </div>
            ))}
            
            <button
              onClick={addLevel}
              className="w-full py-2 px-4 border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-lg text-gray-500 dark:text-gray-400 hover:border-gray-400 dark:hover:border-gray-500 hover:text-gray-600 dark:hover:text-gray-300 transition-colors"
            >
              + Add Level
            </button>
          </div>
        </div>

        {/* Completion Method */}
        <div className="card p-6">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
            Completion Calculation
          </h3>
          
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Completion Method
              </label>
              <select
                value={state.settings.completion_method}
                onChange={(e) => updateSettings({ completion_method: e.target.value as 'average' | 'weighted' })}
                className="input"
              >
                <option value="average">Average</option>
                <option value="weighted">Weighted</option>
              </select>
              <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                How to calculate overall completion rates
              </p>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Default Target Level
              </label>
              <select
                value={state.settings.default_target_level}
                onChange={(e) => updateSettings({ default_target_level: Number(e.target.value) })}
                className="input"
              >
                {state.settings?.levels.map((level) => (
                  <option key={level.level} value={level.level}>
                    {level.level} - {level.label}
                  </option>
                ))}
              </select>
              <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                Default target level for new training modules
              </p>
            </div>
          </div>
        </div>

        {/* System Info */}
        <div className="card p-6">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
            System Information
          </h3>
          
          <div className="space-y-2 text-sm">
            <div className="flex justify-between">
              <span className="text-gray-600 dark:text-gray-400">Version:</span>
              <span className="text-gray-900 dark:text-white">1.0.0</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600 dark:text-gray-400">Database:</span>
              <span className="text-gray-900 dark:text-white">SQLite</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600 dark:text-gray-400">Environment:</span>
              <span className="text-gray-900 dark:text-white">Production</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Settings;
