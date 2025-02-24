import React, { useState, useRef, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';
import JoeyLogo from '../../assets/joey-logo.png';

const Layout: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isEventsMenuOpen, setIsEventsMenuOpen] = useState(false);
  const eventsMenuRef = useRef<HTMLDivElement>(null);
  const timeoutRef = useRef<ReturnType<typeof setTimeout>>();
  const [isLoggingOut, setIsLoggingOut] = useState(false);
  const { logout } = useAuth();
  const location = useLocation();

  const navItems = [
    { path: '/', label: 'Dashboard' },
    {
      path: '/events',
      label: 'Events',
      subItems: [
        { path: '/events', label: 'Event History' },
        { path: '/events/new', label: 'Add Event' },
        { path: '/events/categories', label: 'Categories' },
      ],
    },
    { path: '/analytics', label: 'Analytics' },
    { path: '/family/config', label: 'Family Settings' }
  ];

  const isPathActive = (path: string) => {
    if (path === '/') {
      return location.pathname === path;
    }
    return location.pathname.startsWith(path);
  };

  const handleMouseEnter = () => {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }
    setIsEventsMenuOpen(true);
  };

  const handleMouseLeave = () => {
    timeoutRef.current = setTimeout(() => {
      setIsEventsMenuOpen(false);
    }, 100);
  };

  // Cleanup timeout on unmount
  useEffect(() => {
    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, []);

  // Close mobile menu when location changes
  useEffect(() => {
    setIsMobileMenuOpen(false);
  }, [location]);

  const handleLogout = async () => {
    setIsLoggingOut(true);
    try {
      await logout();
    } finally {
      setIsLoggingOut(false);
    }
  };

  return (
    <div className="min-h-screen bg-orange-50/30">
      <nav className="bg-white shadow-md">
        <div className="max-w-7xl mx-auto px-4">
          <div className="flex justify-between h-16">
            <div className="flex">
              <div className="flex-shrink-0 flex items-center space-x-2">
                <img 
                  src={JoeyLogo} 
                  alt="Good Joeys Logo" 
                  className="h-10 w-auto"
                />
                <Link to="/" className="text-2xl font-bold text-primary-600 flex items-center">
                  Good Joeys
                </Link>
              </div>
              
              {/* Desktop Navigation */}
              <div className="hidden sm:ml-6 sm:flex sm:space-x-8">
                {navItems.map((item) => 
                  item.subItems ? (
                    <div
                      key={item.path}
                      ref={eventsMenuRef}
                      className="relative flex items-center"
                      onMouseEnter={handleMouseEnter}
                      onMouseLeave={handleMouseLeave}
                    >
                      <button
                        className={`
                          inline-flex items-center h-16 px-1 border-b-2
                          text-sm font-medium transition-colors duration-200
                          ${isPathActive(item.path)
                            ? 'border-orange-500 text-orange-600'
                            : 'border-transparent text-gray-500 hover:border-orange-300 hover:text-orange-700'}
                        `}
                      >
                        {item.label}
                        <svg
                          className={`ml-2 h-4 w-4 transition-transform duration-200 ${isEventsMenuOpen ? 'rotate-180' : ''}`}
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
                        </svg>
                      </button>
                      <div 
                        className={`
                          absolute z-10 left-0 top-full w-56 mt-1 
                          rounded-md bg-white shadow-lg ring-1 ring-black ring-opacity-5 
                          focus:outline-none transition-opacity duration-150
                          ${isEventsMenuOpen ? 'opacity-100 visible' : 'opacity-0 invisible'}
                        `}
                      >
                        <div className="py-1">
                          {item.subItems.map((subItem) => (
                            <Link
                              key={subItem.path}
                              to={subItem.path}
                              className={`
                                block px-4 py-2 text-sm transition-colors duration-200
                                ${location.pathname === subItem.path
                                  ? 'bg-gray-100 text-primary-600'
                                  : 'text-gray-700 hover:bg-gray-50 hover:text-gray-900'}
                              `}
                            >
                              {subItem.label}
                            </Link>
                          ))}
                        </div>
                      </div>
                    </div>
                  ) : (
                    <Link
                      key={item.path}
                      to={item.path}
                      className={`
                        inline-flex items-center h-16 px-1 border-b-2
                        text-sm font-medium transition-colors duration-200
                        ${isPathActive(item.path)
                          ? 'border-orange-500 text-orange-600'
                          : 'border-transparent text-gray-500 hover:border-orange-300 hover:text-orange-700'}
                      `}
                    >
                      {item.label}
                    </Link>
                  )
                )}
              </div>
            </div>

            <div className="flex items-center">
              {/* Desktop Logout */}
              <div className="hidden sm:flex sm:items-center sm:ml-6">
                <button
                  onClick={handleLogout}
                  disabled={isLoggingOut}
                  className="text-gray-500 hover:text-gray-700 px-3 py-2 rounded-md text-sm font-medium transition-colors duration-200"
                >
                  {isLoggingOut ? 'Logging out...' : 'Logout'}
                </button>
              </div>

              {/* Mobile menu button */}
              <div className="flex items-center sm:hidden">
                <button
                  onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                  className="inline-flex items-center justify-center p-2 rounded-md text-gray-400 hover:text-gray-500 hover:bg-gray-100 transition-colors duration-200"
                >
                  <span className="sr-only">Open main menu</span>
                  {isMobileMenuOpen ? (
                    <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  ) : (
                    <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                    </svg>
                  )}
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Mobile menu */}
        <div className={`sm:hidden ${isMobileMenuOpen ? 'block' : 'hidden'}`}>
          <div className="pt-2 pb-3 space-y-1">
            {navItems.map((item) => 
              item.subItems ? (
                <div key={item.path} className="space-y-1">
                  <div
                    className={`
                      px-3 py-2 text-base font-medium border-l-4
                      ${isPathActive(item.path)
                        ? 'border-orange-500 text-orange-600 bg-orange-50'
                        : 'border-transparent text-gray-500 hover:bg-gray-50 hover:border-orange-300 hover:text-orange-700'}
                    `}
                  >
                    {item.label}
                  </div>
                  <div className="pl-4">
                    {item.subItems.map((subItem) => (
                      <Link
                        key={subItem.path}
                        to={subItem.path}
                        onClick={() => setIsMobileMenuOpen(false)}
                        className={`
                          block py-2 pl-3 pr-4 text-base font-medium border-l-4
                          ${location.pathname === subItem.path
                            ? 'border-orange-500 text-orange-600 bg-orange-50'
                            : 'border-transparent text-gray-500 hover:bg-gray-50 hover:border-orange-300 hover:text-orange-700'}
                        `}
                      >
                        {subItem.label}
                      </Link>
                    ))}
                  </div>
                </div>
              ) : (
                <Link
                  key={item.path}
                  to={item.path}
                  onClick={() => setIsMobileMenuOpen(false)}
                  className={`
                    block py-2 pl-3 pr-4 text-base font-medium border-l-4
                    ${isPathActive(item.path)
                      ? 'border-orange-500 text-orange-600 bg-orange-50'
                      : 'border-transparent text-gray-500 hover:bg-gray-50 hover:border-orange-300 hover:text-orange-700'}
                  `}
                >
                  {item.label}
                </Link>
              )
            )}
            <button
              onClick={handleLogout}
              disabled={isLoggingOut}
              className="block w-full text-left py-2 pl-3 pr-4 text-base font-medium border-l-4 border-transparent text-gray-500 hover:bg-gray-50 hover:border-orange-300 hover:text-orange-700"
            >
              {isLoggingOut ? 'Logging out...' : 'Logout'}
            </button>
          </div>
        </div>
      </nav>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {children}
      </main>
    </div>
  );
};

export default Layout; 