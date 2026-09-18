import React from 'react';
import { CheckCheck, BarChart3, Bot, LayoutDashboard } from 'lucide-react';

export const CoreStrengths: React.FC = () => {
  return (
    <div className="bg-white dark:bg-[#131B2E] rounded-3xl p-6 sm:p-7 shadow-sm border border-slate-200/80 dark:border-slate-800/80 transition-colors duration-300">
      <h2 className="text-base font-bold text-slate-900 dark:text-white mb-4 flex items-center gap-2">
        <span className="p-1.5 bg-emerald-100 dark:bg-emerald-950/60 text-emerald-600 dark:text-emerald-400 rounded-lg">
          <CheckCheck className="w-4 h-4" />
        </span>
        핵심 역량 요약 (Core Competencies)
      </h2>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {/* 역량 1: 데이터 분석 */}
        <div className="p-4 rounded-2xl bg-blue-50/50 dark:bg-blue-950/30 border border-blue-100 dark:border-blue-900/40 flex flex-col justify-between">
          <div>
            <div className="w-8 h-8 rounded-xl bg-blue-600 text-white flex items-center justify-center mb-3">
              <BarChart3 className="w-4 h-4" />
            </div>
            <h3 className="font-bold text-slate-900 dark:text-white text-xs mb-1">정량적 데이터 분석 (ADsP)</h3>
            <p className="text-[11px] text-slate-600 dark:text-slate-300 leading-relaxed">
              <b>ADsP 자격</b>을 바탕으로 데이터를 체계적으로 수집·분석하고, 숫자에 기반한 논리적 인사이트를 도출합니다.
            </p>
          </div>
        </div>

        {/* 역량 2: AI 융합 및 기획 */}
        <div className="p-4 rounded-2xl bg-indigo-50/50 dark:bg-indigo-950/30 border border-indigo-100 dark:border-indigo-900/40 flex flex-col justify-between">
          <div>
            <div className="w-8 h-8 rounded-xl bg-indigo-600 text-white flex items-center justify-center mb-3">
              <Bot className="w-4 h-4" />
            </div>
            <h3 className="font-bold text-slate-900 dark:text-white text-xs mb-1">최신 생성형 AI 응용 &amp; 기획</h3>
            <p className="text-[11px] text-slate-600 dark:text-slate-300 leading-relaxed">
              생성형 AI 기술을 실무에 적극 도입하여 <b>공모전 대상(1위)</b>을 수상한 검증된 기획력을 보유하고 있습니다.
            </p>
          </div>
        </div>

        {/* 역량 3: 데이터 시각화 & 콘텐츠 성과 */}
        <div className="p-4 rounded-2xl bg-sky-50/50 dark:bg-sky-950/30 border border-sky-100 dark:border-sky-900/40 flex flex-col justify-between">
          <div>
            <div className="w-8 h-8 rounded-xl bg-sky-600 text-white flex items-center justify-center mb-3">
              <LayoutDashboard className="w-4 h-4" />
            </div>
            <h3 className="font-bold text-slate-900 dark:text-white text-xs mb-1">콘텐츠 기획 &amp; 시각화 성과</h3>
            <p className="text-[11px] text-slate-600 dark:text-slate-300 leading-relaxed">
              <b>캠코터즈 4개월 연속 최우수 영상</b> 선정 및 <b>공식 유튜브 채널 4편 전작 게시</b>를 이끌어낸 높은 퀄리티의 전달력
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
