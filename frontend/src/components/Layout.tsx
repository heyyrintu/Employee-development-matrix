import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { 
  BarChart3, 
  Settings, 
  BookOpen, 
  Menu, 
  X, 
  Sun, 
  Moon,
  LogOut,
  User,
  Building2
} from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { useSettings } from '../contexts/SettingsContext';
import LoginModal from './LoginModal';

interface LayoutProps {
  children: React.ReactNode;
}

const Layout: React.FC<LayoutProps> = ({ children }) => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [userMenuOpen, setUserMenuOpen] = useState(false);
  const [loginModalOpen, setLoginModalOpen] = useState(false);
  const { state: authState, logout, isAdmin } = useAuth();
  const { state: settingsState, updateTheme } = useSettings();
  const location = useLocation();

  const navigation = [
    { name: 'Dashboard', href: '/', icon: BarChart3 },
    ...(isAdmin() ? [{ name: 'Settings', href: '/settings', icon: Settings }] : []),
  ];

  const handleThemeToggle = () => {
    const newTheme = settingsState.settings?.theme === 'light' ? 'dark' : 'light';
    updateTheme(newTheme);
  };

  const handleLogout = () => {
    logout();
    setUserMenuOpen(false);
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      {/* Mobile sidebar */}
      <div className={`fixed inset-0 z-50 lg:hidden ${sidebarOpen ? 'block' : 'hidden'}`}>
        <div className="fixed inset-0 bg-gray-600 bg-opacity-75" onClick={() => setSidebarOpen(false)} />
        <div className="relative flex-1 flex flex-col max-w-xs w-full bg-white dark:bg-gray-800">
          <div className="absolute top-0 right-0 -mr-12 pt-2">
            <button
              type="button"
              className="ml-1 flex items-center justify-center h-10 w-10 rounded-full focus:outline-none focus:ring-2 focus:ring-inset focus:ring-white"
              onClick={() => setSidebarOpen(false)}
            >
              <X className="h-6 w-6 text-white" />
            </button>
          </div>
          <div className="flex-1 h-0 pt-5 pb-4 overflow-y-auto">
            <div className="flex-shrink-0 flex items-center px-4">
              <div className="flex items-center space-x-3">
                <div className="relative">
                  <img 
                    src="https://media.licdn.com/dms/image/v2/D560BAQGb0alHDJIMkg/company-logo_200_200/company-logo_200_200/0/1712907659264/drona_logitech_pvt_ltd_logo?e=2147483647&v=beta&t=01P2rlTJNWijcdi8fc26EiLIqMgBI1iCB8xHm8eKBtM" 
                    alt="Drona Logitech" 
                    className="h-10 w-10 rounded-lg object-contain bg-white p-1 shadow-soft"
                    onError={(e) => {
                      e.currentTarget.style.display = 'none';
                      e.currentTarget.nextElementSibling?.classList.remove('hidden');
                    }}
                  />
                  <div className="hidden h-10 w-10 rounded-lg bg-gradient-to-br from-primary-500 to-secondary-500 flex items-center justify-center">
                    <Building2 className="h-6 w-6 text-white" />
                  </div>
                </div>
                <div className="flex flex-col">
                  <span className="text-lg font-bold text-gray-900 dark:text-white">
                    Drona Logitech
                  </span>
                  <span className="text-xs text-gray-500 dark:text-gray-400">
                    Employee Development
                  </span>
                </div>
              </div>
            </div>
            <nav className="mt-5 px-2 space-y-1">
              {navigation.map((item) => {
                const isActive = location.pathname === item.href;
                return (
                  <Link
                    key={item.name}
                    to={item.href}
                    className={`${
                      isActive
                        ? 'bg-gradient-to-r from-primary-50 to-primary-100 text-primary-700 dark:from-primary-900 dark:to-primary-800 dark:text-primary-100 shadow-soft'
                        : 'text-gray-600 hover:bg-gradient-to-r hover:from-gray-50 hover:to-gray-100 hover:text-gray-900 dark:text-gray-300 dark:hover:from-gray-700 dark:hover:to-gray-600 dark:hover:text-white'
                    } group flex items-center px-3 py-2.5 text-base font-medium rounded-lg transition-all duration-200`}
                    onClick={() => setSidebarOpen(false)}
                  >
                    <item.icon className="mr-4 h-6 w-6" />
                    {item.name}
                  </Link>
                );
              })}
            </nav>
          </div>
        </div>
      </div>

      {/* Desktop sidebar */}
      <div className="hidden lg:flex lg:w-64 lg:flex-col lg:fixed lg:inset-y-0">
        <div className="flex-1 flex flex-col min-h-0 bg-white dark:bg-gray-800 border-r border-gray-200 dark:border-gray-700">
          <div className="flex-1 flex flex-col pt-5 pb-4 overflow-y-auto">
            <div className="flex items-center flex-shrink-0 px-4">
              <div className="flex items-center space-x-3">
                <div className="relative">
                  <img 
                    src="https://media.licdn.com/dms/image/v2/D560BAQGb0alHDJIMkg/company-logo_200_200/company-logo_200_200/0/1712907659264/drona_logitech_pvt_ltd_logo?e=2147483647&v=beta&t=01P2rlTJNWijcdi8fc26EiLIqMgBI1iCB8xHm8eKBtM" 
                    alt="Drona Logitech" 
                    className="h-12 w-12 rounded-lg object-contain bg-white p-1 shadow-soft"
                    onError={(e) => {
                      e.currentTarget.style.display = 'none';
                      e.currentTarget.nextElementSibling?.classList.remove('hidden');
                    }}
                  />
                  <div className="hidden h-12 w-12 rounded-lg bg-gradient-to-br from-primary-500 to-secondary-500 flex items-center justify-center">
                    <Building2 className="h-7 w-7 text-white" />
                  </div>
                </div>
                <div className="flex flex-col">
                  <span className="text-xl font-bold text-gray-900 dark:text-white">
                    Drona Logitech
                  </span>
                  <span className="text-sm text-gray-500 dark:text-gray-400">
                    Employee Development Matrix
                  </span>
                </div>
              </div>
            </div>
            <nav className="mt-5 flex-1 px-2 space-y-1">
              {navigation.map((item) => {
                const isActive = location.pathname === item.href;
                return (
                  <Link
                    key={item.name}
                    to={item.href}
                    className={`${
                      isActive
                        ? 'bg-gradient-to-r from-primary-50 to-primary-100 text-primary-700 dark:from-primary-900 dark:to-primary-800 dark:text-primary-100 shadow-soft'
                        : 'text-gray-600 hover:bg-gradient-to-r hover:from-gray-50 hover:to-gray-100 hover:text-gray-900 dark:text-gray-300 dark:hover:from-gray-700 dark:hover:to-gray-600 dark:hover:text-white'
                    } group flex items-center px-3 py-2.5 text-sm font-medium rounded-lg transition-all duration-200`}
                  >
                    <item.icon className="mr-3 h-5 w-5" />
                    {item.name}
                  </Link>
                );
              })}
            </nav>
          </div>
        </div>
      </div>

      {/* Main content */}
      <div className="lg:pl-64 flex flex-col flex-1">
        {/* Top navigation */}
        <div className="sticky top-0 z-10 flex-shrink-0 flex h-16 bg-white/95 dark:bg-gray-800/95 backdrop-blur-sm border-b border-gray-200 dark:border-gray-700 shadow-soft">
          <button
            type="button"
            className="px-4 border-r border-gray-200 dark:border-gray-700 text-gray-500 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-primary-500 lg:hidden"
            onClick={() => setSidebarOpen(true)}
          >
            <Menu className="h-6 w-6" />
          </button>
          <div className="flex-1 px-4 flex justify-between">
            <div className="flex-1 flex">
              <div className="w-full flex md:ml-0">
                <div className="relative w-full text-gray-400 focus-within:text-gray-600 dark:focus-within:text-gray-300">
                  <div className="absolute inset-y-0 left-0 flex items-center pointer-events-none">
                    <BookOpen className="h-5 w-5" />
                  </div>
                  <h1 className="block w-full pl-8 pr-3 py-2 border-transparent rounded-md leading-5 bg-transparent text-gray-900 dark:text-white placeholder-gray-500 focus:outline-none focus:placeholder-gray-400 focus:ring-0 focus:border-transparent sm:text-sm">
                    {location.pathname === '/' ? 'Dashboard' : 'Settings'}
                  </h1>
                </div>
              </div>
            </div>
            <div className="ml-4 flex items-center md:ml-6">
              {/* Theme toggle */}
              <button
                type="button"
                className="p-2 rounded-md text-gray-400 hover:text-gray-500 hover:bg-gray-100 dark:hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-primary-500"
                onClick={handleThemeToggle}
              >
                {settingsState.settings?.theme === 'dark' ? (
                  <Sun className="h-5 w-5" />
                ) : (
                  <Moon className="h-5 w-5" />
                )}
              </button>

              {/* User menu */}
              <div className="ml-3 relative">
                {authState.isAuthenticated ? (
                  <>
                    <div>
                      <button
                        type="button"
                        className="max-w-xs bg-white dark:bg-gray-800 flex items-center text-sm rounded-full focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500"
                        onClick={() => setUserMenuOpen(!userMenuOpen)}
                      >
                        <div className="h-8 w-8 rounded-full bg-primary-100 dark:bg-primary-900 flex items-center justify-center">
                          <User className="h-5 w-5 text-primary-600 dark:text-primary-300" />
                        </div>
                      </button>
                    </div>
                    {userMenuOpen && (
                      <div className="origin-top-right absolute right-0 mt-2 w-56 rounded-xl shadow-strong py-2 bg-white dark:bg-gray-800 ring-1 ring-black ring-opacity-5 focus:outline-none animate-slide-up">
                        <div className="px-4 py-3 text-sm text-gray-700 dark:text-gray-300 border-b border-gray-200 dark:border-gray-700">
                          <div className="font-semibold text-gray-900 dark:text-white">{authState.user?.username}</div>
                          <div className="text-xs text-gray-500 dark:text-gray-400 capitalize flex items-center">
                            <div className={`w-2 h-2 rounded-full mr-2 ${
                              authState.user?.role === 'admin' ? 'bg-primary-500' : 
                              authState.user?.role === 'manager' ? 'bg-secondary-500' : 
                              'bg-gray-400'
                            }`}></div>
                            {authState.user?.role}
                          </div>
                        </div>
                        <button
                          onClick={handleLogout}
                          className="flex w-full px-4 py-3 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors duration-150"
                        >
                          <LogOut className="mr-3 h-4 w-4" />
                          Sign out
                        </button>
                        <button
                          onClick={() => setLoginModalOpen(true)}
                          className="flex w-full px-4 py-3 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors duration-150"
                        >
                          <User className="mr-3 h-4 w-4" />
                          Switch User
                        </button>
                      </div>
                    )}
                  </>
                ) : (
                  <button
                    onClick={() => setLoginModalOpen(true)}
                    className="bg-gradient-to-r from-primary-500 to-primary-600 hover:from-primary-600 hover:to-primary-700 text-white px-6 py-2.5 rounded-lg text-sm font-medium focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 shadow-brand transition-all duration-200 hover:shadow-medium"
                  >
                    Login
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Page content */}
        <main className="flex-1">
          <div className="py-6">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 md:px-8">
              {children}
            </div>
          </div>
        </main>
      </div>

      {/* Login Modal */}
      <LoginModal 
        isOpen={loginModalOpen} 
        onClose={() => setLoginModalOpen(false)} 
      />
    </div>
  );
};

export default Layout;
