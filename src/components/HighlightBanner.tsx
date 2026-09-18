import React from 'react';

export const HighlightBanner: React.FC = () => {
  return (
    <div className="bg-gradient-to-r from-blue-600 via-indigo-600 to-sky-600 rounded-3xl p-6 text-white shadow-md shadow-blue-500/10 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
      <div className="space-y-1">
        <div className="flex items-center gap-2">
          <span className="px-2.5 py-0.5 bg-amber-400 text-slate-950 font-black text-xs rounded-full shadow-sm">
            🏆 공모전 대상 수상
          </span>
          <span className="text-xs text-blue-100 font-medium">캠코 AI 활용 국유재산 공모전 1위</span>
        </div>
        <h2 className="text-lg font-bold tracking-tight">&quot;데이터 분석 기반의 통찰과 AI 기술의 융합&quot;</h2>
        <p className="text-xs text-blue-100">
          캠코터즈 4개월 연속 최우수 영상 선정 및 공모전 대상 수상을 통한 검증된 기획 역량
        </p>
      </div>
      <div className="flex items-center gap-3 shrink-0 bg-white/10 backdrop-blur-md px-4 py-2.5 rounded-2xl border border-white/20">
        <div className="text-center">
          <div className="text-xl font-black text-white">4편 전작</div>
          <div className="text-[10px] text-blue-200">캠코 공식 유튜브 게시</div>
        </div>
        <div className="w-px h-8 bg-white/20"></div>
        <div className="text-center">
          <div className="text-xl font-black text-amber-300">대상</div>
          <div className="text-[10px] text-blue-200">AI 영상 기획 1위</div>
        </div>
      </div>
    </div>
  );
};
