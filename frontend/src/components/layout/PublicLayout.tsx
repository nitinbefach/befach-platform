'use client';

import { useEffect, useState } from 'react';
import Header from './Header';
import Footer from './Footer';
import { safeStorage } from '@/lib/safeStorage';

interface PublicLayoutProps {
  children: React.ReactNode;
  showFooter?: boolean;
}

export default function PublicLayout({ children, showFooter = true }: PublicLayoutProps) {
  const [darkMode, setDarkMode] = useState(false);

  useEffect(() => {
    const savedTheme = safeStorage.getItem('theme');
    if (savedTheme === 'dark') {
      setDarkMode(true);
    }

    // Listen for theme changes
    const handleStorage = () => {
      const theme = safeStorage.getItem('theme');
      setDarkMode(theme === 'dark');
    };

    window.addEventListener('storage', handleStorage);

    // Also listen for custom theme change events
    const handleThemeChange = () => {
      const theme = safeStorage.getItem('theme');
      setDarkMode(theme === 'dark');
    };

    window.addEventListener('themeChange', handleThemeChange);

    return () => {
      window.removeEventListener('storage', handleStorage);
      window.removeEventListener('themeChange', handleThemeChange);
    };
  }, []);

  return (
    <div className={`public-layout ${darkMode ? 'dark' : ''}`}>
      <Header />
      <main className="main-content">
        {children}
      </main>
      {showFooter && <Footer />}

      <style jsx>{`
        .public-layout {
          min-height: 100vh;
          display: flex;
          flex-direction: column;
          background: #ffffff;
          font-family: 'Inter', -apple-system, BlinkMacSystemFont, sans-serif;
        }

        .public-layout.dark {
          background: #0f0f0f;
        }

        .main-content {
          flex: 1;
        }
      `}</style>
    </div>
  );
}
