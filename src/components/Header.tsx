import React from 'react';
import { Sparkles, Moon, Sun, Printer, Mail, LogIn, LogOut, UserCheck } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

interface HeaderProps {
  darkMode: boolean;
  onToggleTheme: () => void;
  onOpenAuth: () => void;
}

export const Header: React.FC<HeaderProps> = ({ darkMode, onToggleTheme, onOpenAuth }) => {
  const { currentUser, logout, isFirebaseMode } = useAuth();

  return (
    <header className="sticky top-0 z-40 bg-white/90 dark:bg-[#0B0F19]/90 backdrop-blur-md border-b border-slate-200 dark:border-slate-800 px-4 sm:px-6 py-3.5 no-print transition-colors duration-300">
      <div className="max-w-6xl mx-auto flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-blue-600 via-indigo-600 to-sky-500 text-white flex items-center justify-center font-bold text-sm shadow-md shadow-blue-500/20">
            <Sparkles className="w-4 h-4" />
          </div>
          <div>
            <span className="font-bold text-slate-900 dark:text-white text-base tracking-tight">최우혁의 포트폴리오 &amp; 프로필</span>
            <span className="hidden sm:inline-block ml-2 text-xs text-blue-600 dark:text-blue-400 font-medium bg-blue-50 dark:bg-blue-950/60 px-2 py-0.5 rounded-full border border-blue-100 dark:border-blue-900/60">
              데이터 분석 &amp; AI 기획
            </span>
          </div>
        </div>

        <div className="flex items-center gap-2">
          {/* 다크모드 토글 */}
          <button
            onClick={onToggleTheme}
            className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-slate-700 dark:text-slate-200 hover:text-slate-900 dark:hover:text-white bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 border border-slate-200/60 dark:border-slate-700/60 rounded-lg transition-all"
            title="테마 변경"
          >
            {darkMode ? (
              <>
                <Sun className="w-4 h-4 text-amber-400" />
                <span className="hidden sm:inline">라이트 모드</span>
              </>
            ) : (
              <>
                <Moon className="w-4 h-4 text-slate-600" />
                <span className="hidden sm:inline">다크 모드</span>
              </>
            )}
          </button>

          {/* 인쇄 버튼 */}
          <button
            onClick={() => window.print()}
            className="hidden sm:flex items-center gap-1.5 px-3.5 py-1.5 text-xs font-semibold text-slate-700 dark:text-slate-200 hover:text-slate-900 dark:hover:text-white bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 rounded-lg transition-all"
          >
            <Printer className="w-4 h-4" />
            <span>인쇄 / PDF</span>
          </button>

          {/* 이메일 */}
          <a
            href="mailto:dngur7960@naver.com"
            className="hidden md:flex items-center gap-1.5 px-3.5 py-1.5 text-xs font-semibold text-white bg-blue-600 hover:bg-blue-700 rounded-lg shadow-sm shadow-blue-500/20 transition-all"
          >
            <Mail className="w-4 h-4" />
            <span>이메일</span>
          </a>

          {/* 인증 상태 및 로그인 버튼 */}
          {currentUser ? (
            <div className="flex items-center gap-1.5 bg-slate-100 dark:bg-slate-800 p-1 pl-2.5 rounded-lg border border-slate-200 dark:border-slate-700">
              <span className="text-xs font-semibold text-slate-800 dark:text-slate-200 flex items-center gap-1">
                <UserCheck className="w-3.5 h-3.5 text-emerald-500" />
                <span className="max-w-[80px] sm:max-w-[120px] truncate">{currentUser.displayName}</span>
              </span>
              <button
                onClick={logout}
                title="로그아웃"
                className="p-1 text-slate-500 hover:text-rose-600 dark:hover:text-rose-400 transition-colors"
              >
                <LogOut className="w-3.5 h-3.5" />
              </button>
            </div>
          ) : (
            <button
              onClick={onOpenAuth}
              className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-slate-800 dark:text-white bg-indigo-50 dark:bg-indigo-950/60 hover:bg-indigo-100 dark:hover:bg-indigo-900/80 border border-indigo-200/80 dark:border-indigo-800/60 rounded-lg transition-all"
            >
              <LogIn className="w-3.5 h-3.5 text-indigo-600 dark:text-indigo-400" />
              <span>로그인</span>
            </button>
          )}
        </div>
      </div>
    </header>
  );
};
