import React from 'react';

export const Footer: React.FC = () => {
  return (
    <footer className="mt-12 py-6 border-t border-slate-200 dark:border-slate-800 bg-white dark:bg-[#0B0F19] text-center text-xs text-slate-400 dark:text-slate-500 no-print transition-colors duration-300">
      <div className="max-w-6xl mx-auto px-4 flex flex-col sm:flex-row items-center justify-between gap-2">
        <p>© 2026 최우혁 (Choi Woo-Hyuk). All rights reserved.</p>
        <p className="flex items-center gap-1">
          <span>Data &amp; AI Experience Portfolio</span>
          <span>·</span>
          <span className="text-slate-600 dark:text-slate-400 font-medium">dngur7960@naver.com</span>
        </p>
      </div>
    </footer>
  );
};
