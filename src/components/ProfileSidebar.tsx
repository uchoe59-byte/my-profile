import React, { useState } from 'react';
import {
  Cpu,
  User,
  MapPin,
  Phone,
  Mail,
  Copy,
  Check,
  BadgeCheck,
  GraduationCap,
} from 'lucide-react';

interface ProfileSidebarProps {
  darkMode?: boolean;
}

export const ProfileSidebar: React.FC<ProfileSidebarProps> = () => {
  const [copiedPhone, setCopiedPhone] = useState(false);
  const [copiedEmail, setCopiedEmail] = useState(false);

  const copyToClipboard = (text: string, type: 'phone' | 'email') => {
    navigator.clipboard.writeText(text).then(() => {
      if (type === 'phone') {
        setCopiedPhone(true);
        setTimeout(() => setCopiedPhone(false), 2000);
      } else {
        setCopiedEmail(true);
        setTimeout(() => setCopiedEmail(false), 2000);
      }
    });
  };

  return (
    <aside className="lg:col-span-4 space-y-6">
      {/* 프로필 카드 */}
      <div className="bg-white dark:bg-[#131B2E] rounded-3xl p-6 shadow-sm border border-slate-200/80 dark:border-slate-800/80 relative overflow-hidden transition-colors duration-300">
        <div className="h-24 bg-gradient-to-r from-blue-600 via-indigo-600 to-sky-500 -mx-6 -mt-6 mb-4"></div>

        <div className="relative flex flex-col items-center text-center">
          {/* 아바타 아이콘 */}
          <div className="relative w-24 h-24 rounded-2xl border-4 border-white dark:border-slate-800 shadow-lg bg-gradient-to-br from-slate-800 to-blue-900 -mt-14 overflow-hidden flex items-center justify-center text-white">
            <div className="relative flex flex-col items-center justify-center">
              <Cpu className="w-9 h-9 text-sky-400" />
              <span className="text-[9px] font-bold text-slate-300 mt-1 uppercase tracking-widest">DATA · AI</span>
            </div>
          </div>

          {/* 이름 */}
          <h1 className="text-2xl font-black text-slate-900 dark:text-white mt-3.5 tracking-tight">최우혁</h1>

          <div className="flex items-center gap-3 text-xs text-slate-500 dark:text-slate-400 mt-2 font-medium">
            <span className="flex items-center gap-1">
              <User className="w-3.5 h-3.5 text-slate-400" />
              <span>26세</span>
            </span>
            <span>·</span>
            <span className="flex items-center gap-1">
              <MapPin className="w-3.5 h-3.5 text-slate-400" />
              <span>대한민국</span>
            </span>
          </div>

          {/* 연락처 정보 */}
          <div className="w-full mt-4 space-y-2 text-xs text-left">
            <div className="flex items-center justify-between p-2.5 rounded-xl bg-slate-50/60 dark:bg-slate-800/40 border border-slate-100 dark:border-slate-800">
              <span className="flex items-center gap-2 text-slate-700 dark:text-slate-200">
                <Phone className="w-4 h-4 text-blue-500" />
                <span className="font-medium">010-5281-8966</span>
              </span>
              <button
                onClick={() => copyToClipboard('010-5281-8966', 'phone')}
                className="text-slate-400 hover:text-blue-600 dark:hover:text-blue-400 transition-colors p-1"
                title="전화번호 복사"
              >
                {copiedPhone ? <Check className="w-3.5 h-3.5 text-emerald-500" /> : <Copy className="w-3.5 h-3.5" />}
              </button>
            </div>

            <div className="flex items-center justify-between p-2.5 rounded-xl bg-slate-50/60 dark:bg-slate-800/40 border border-slate-100 dark:border-slate-800">
              <span className="flex items-center gap-2 text-slate-700 dark:text-slate-200">
                <Mail className="w-4 h-4 text-indigo-500" />
                <span className="font-medium">dngur7960@naver.com</span>
              </span>
              <button
                onClick={() => copyToClipboard('dngur7960@naver.com', 'email')}
                className="text-slate-400 hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors p-1"
                title="이메일 복사"
              >
                {copiedEmail ? <Check className="w-3.5 h-3.5 text-emerald-500" /> : <Copy className="w-3.5 h-3.5" />}
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* 보유 자격증 (Certifications) */}
      <div className="bg-white dark:bg-[#131B2E] rounded-3xl p-6 shadow-sm border border-slate-200/80 dark:border-slate-800/80 transition-colors duration-300">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-sm font-bold text-slate-900 dark:text-white flex items-center gap-2">
            <span className="p-1.5 bg-blue-100 dark:bg-blue-950/60 text-blue-600 dark:text-blue-400 rounded-lg">
              <BadgeCheck className="w-4 h-4" />
            </span>
            보유 자격 사항 (Certifications)
          </h2>
          <span className="text-[11px] font-bold text-blue-600 dark:text-blue-400 bg-blue-50 dark:bg-blue-950/60 px-2 py-0.5 rounded-md border border-blue-100/60 dark:border-blue-900/60">
            4종 보유
          </span>
        </div>

        <div className="space-y-2.5">
          {/* 1. ADsP */}
          <div className="p-3 bg-gradient-to-r from-blue-50/70 to-indigo-50/70 dark:from-blue-950/40 dark:to-indigo-950/40 rounded-2xl border border-blue-200/80 dark:border-blue-800/60 flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <div className="w-2.5 h-2.5 rounded-full bg-blue-600 dark:bg-blue-400"></div>
              <div>
                <h3 className="text-xs font-bold text-slate-900 dark:text-white">ADsP (데이터분석 준전문가)</h3>
                <p className="text-[11px] text-slate-500 dark:text-slate-400">한국데이터산업진흥원 (데이터 기획 및 분석)</p>
              </div>
            </div>
            <span className="text-[10px] font-semibold bg-blue-600 text-white px-2 py-0.5 rounded-full">데이터 분석</span>
          </div>

          {/* 2. 투자자산운용사 */}
          <div className="p-3 bg-slate-50 dark:bg-slate-800/50 rounded-2xl border border-slate-100 dark:border-slate-800 flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <div className="w-2 h-2 rounded-full bg-slate-400"></div>
              <div>
                <h3 className="text-xs font-bold text-slate-800 dark:text-slate-200">투자자산운용사</h3>
                <p className="text-[11px] text-slate-500 dark:text-slate-400">금융투자협회 (자산 배분 및 포트폴리오 분석)</p>
              </div>
            </div>
            <span className="text-[10px] font-medium bg-slate-200 dark:bg-slate-700 text-slate-700 dark:text-slate-200 px-2 py-0.5 rounded-full">
              자산운용
            </span>
          </div>

          {/* 3. AFPK */}
          <div className="p-3 bg-slate-50 dark:bg-slate-800/50 rounded-2xl border border-slate-100 dark:border-slate-800 flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <div className="w-2 h-2 rounded-full bg-slate-400"></div>
              <div>
                <h3 className="text-xs font-bold text-slate-800 dark:text-slate-200">AFPK (재무설계사)</h3>
                <p className="text-[11px] text-slate-500 dark:text-slate-400">한국FPSB (종합 리스크 및 플래닝)</p>
              </div>
            </div>
            <span className="text-[10px] font-medium bg-slate-200 dark:bg-slate-700 text-slate-700 dark:text-slate-200 px-2 py-0.5 rounded-full">
              플래닝
            </span>
          </div>

          {/* 4. 한국사 2급 */}
          <div className="p-3 bg-slate-50 dark:bg-slate-800/50 rounded-2xl border border-slate-100 dark:border-slate-800 flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <div className="w-2 h-2 rounded-full bg-slate-400"></div>
              <div>
                <h3 className="text-xs font-bold text-slate-800 dark:text-slate-200">한국사능력검정시험 2급</h3>
                <p className="text-[11px] text-slate-500 dark:text-slate-400">국사편찬위원회</p>
              </div>
            </div>
            <span className="text-[10px] font-medium bg-slate-200 dark:bg-slate-700 text-slate-700 dark:text-slate-200 px-2 py-0.5 rounded-full">
              기본소양
            </span>
          </div>
        </div>
      </div>

      {/* 학력 사항 (Education) */}
      <div className="bg-white dark:bg-[#131B2E] rounded-3xl p-6 shadow-sm border border-slate-200/80 dark:border-slate-800/80 transition-colors duration-300">
        <h2 className="text-sm font-bold text-slate-900 dark:text-white mb-3 flex items-center gap-2">
          <span className="p-1.5 bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 rounded-lg">
            <GraduationCap className="w-4 h-4" />
          </span>
          학력 사항 (Education)
        </h2>
        <div className="border-l-2 border-blue-500 pl-3.5 py-1">
          <p className="font-bold text-slate-900 dark:text-white text-xs">울산대학교</p>
          <p className="text-xs text-slate-600 dark:text-slate-400 mt-0.5">식품영양학과 4학년 재학</p>
        </div>
      </div>
    </aside>
  );
};
