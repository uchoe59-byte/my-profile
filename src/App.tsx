import React, { useState, useEffect } from 'react';
import { Header } from './components/Header';
import { ProfileSidebar } from './components/ProfileSidebar';
import { Timeline } from './components/Timeline';
import { ScheduleCalendar } from './components/ScheduleCalendar';
import { Footer } from './components/Footer';
import { AuthModal } from './components/AuthModal';
import { useAuth } from './context/AuthContext';
import { Sparkles, CalendarDays, Lock } from 'lucide-react';

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
  const [activeTab, setActiveTab] = useState<'experience' | 'schedule'>('experience');

  const { isOwner } = useAuth();

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
          <ProfileSidebar
            darkMode={darkMode}
            onOpenAuth={() => setIsAuthModalOpen(true)}
          />

          {/* 우측 메인 섹션 (8 cols) */}
          <section className="lg:col-span-8 space-y-5">
            {/* 탭 네비게이션 (경험 / 일정) */}
            <div className="bg-white dark:bg-[#131B2E] p-1.5 rounded-2xl shadow-sm border border-slate-200/80 dark:border-slate-800/80 flex items-center justify-between gap-2 transition-colors duration-300">
              <div className="flex items-center gap-1.5 flex-1 sm:flex-initial">
                <button
                  onClick={() => setActiveTab('experience')}
                  className={`flex-1 sm:flex-initial px-4 py-2 rounded-xl text-xs sm:text-sm font-bold flex items-center justify-center gap-2 transition-all ${
                    activeTab === 'experience'
                      ? 'bg-blue-600 text-white shadow-md shadow-blue-500/20'
                      : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800'
                  }`}
                >
                  <Sparkles className="w-4 h-4" />
                  <span>경험 및 활동</span>
                </button>

                <button
                  onClick={() => setActiveTab('schedule')}
                  className={`flex-1 sm:flex-initial px-4 py-2 rounded-xl text-xs sm:text-sm font-bold flex items-center justify-center gap-2 transition-all ${
                    activeTab === 'schedule'
                      ? 'bg-blue-600 text-white shadow-md shadow-blue-500/20'
                      : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800'
                  }`}
                >
                  <CalendarDays className="w-4 h-4" />
                  <span>일정 및 계획 (2026~2030)</span>
                  {!isOwner && <Lock className="w-3.5 h-3.5 text-slate-400" />}
                </button>
              </div>

              {/* 탭 상태 뱃지 */}
              <div className="hidden sm:flex items-center gap-1 text-[11px] font-semibold text-slate-400 dark:text-slate-500 pr-2">
                {activeTab === 'experience' ? (
                  <span>실전 프로젝트 타임라인</span>
                ) : isOwner ? (
                  <span className="text-emerald-600 dark:text-emerald-400 font-bold">본인 인증 완료 (일정 관리 중)</span>
                ) : (
                  <span>🔒 본인 전용 일정 캘린더</span>
                )}
              </div>
            </div>

            {/* 탭 내용 표시 */}
            {activeTab === 'experience' ? (
              <Timeline />
            ) : (
              <ScheduleCalendar onOpenAuth={() => setIsAuthModalOpen(true)} />
            )}
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
