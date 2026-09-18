import React, { useState, useEffect } from 'react';
import { Header } from './components/Header';
import { ProfileSidebar } from './components/ProfileSidebar';
import { HighlightBanner } from './components/HighlightBanner';
import { Timeline } from './components/Timeline';
import { CoreStrengths } from './components/CoreStrengths';
import { GuestbookSection } from './components/GuestbookSection';
import { Footer } from './components/Footer';
import { AuthModal } from './components/AuthModal';

export const App: React.FC = () => {
  const [darkMode, setDarkMode] = useState<boolean>(() => {
    if (typeof window !== 'undefined') {
      return (
        localStorage.getItem('theme') === 'dark' ||
        (!('theme' in localStorage) && window.matchMedia('(prefers-color-scheme: dark)').matches)
      );
    }
    return false;
  });

  const [isAuthModalOpen, setIsAuthModalOpen] = useState<boolean>(false);

  useEffect(() => {
    if (darkMode) {
      document.documentElement.classList.add('dark');
      localStorage.setItem('theme', 'dark');
    } else {
      document.documentElement.classList.remove('dark');
      localStorage.setItem('theme', 'light');
    }
  }, [darkMode]);

  const toggleDarkMode = () => {
    setDarkMode((prev) => !prev);
  };

  return (
    <div className="min-h-screen flex flex-col bg-[#F8FAFC] dark:bg-[#0B0F19] text-slate-800 dark:text-slate-100 transition-colors duration-300">
      <Header
        darkMode={darkMode}
        onToggleTheme={toggleDarkMode}
        onOpenAuth={() => setIsAuthModalOpen(true)}
      />

      <main className="flex-1 max-w-6xl w-full mx-auto px-4 sm:px-6 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-7 items-start">
          {/* 좌측 사이드바 (4 cols) */}
          <ProfileSidebar darkMode={darkMode} />

          {/* 우측 메인 섹션 (8 cols) */}
          <section className="lg:col-span-8 space-y-6">
            <HighlightBanner />
            <Timeline />
            <CoreStrengths />
            <GuestbookSection onOpenAuth={() => setIsAuthModalOpen(true)} />
          </section>
        </div>
      </main>

      <Footer />

      <AuthModal
        isOpen={isAuthModalOpen}
        onClose={() => setIsAuthModalOpen(false)}
      />
    </div>
  );
};

export default App;
