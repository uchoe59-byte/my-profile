import React, { useState } from 'react';
import {
  User,
  MapPin,
  Phone,
  Mail,
  Copy,
  Check,
  BadgeCheck,
  GraduationCap,
  Lock,
  Eye,
  ShieldCheck,
  LogIn,
  X,
  FileCheck,
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { CertificateModal, CertificateItem } from './CertificateModal';

interface ProfileSidebarProps {
  darkMode?: boolean;
  onOpenAuth?: () => void;
}

const CERTIFICATES: CertificateItem[] = [
  {
    id: 'adsp',
    title: 'ADsP (데이터분석 준전문가)',
    issuer: '한국데이터산업진흥원 (데이터 기획 및 분석)',
    tag: '데이터 분석',
    tagColor: 'bg-blue-600 text-white',
    fileUrl: '/certificates/adsp.png',
    fileType: 'image',
  },
  {
    id: 'invest_manager',
    title: '투자자산운용사',
    issuer: '금융투자협회 (자산 배분 및 포트폴리오 분석)',
    tag: '자산운용',
    tagColor: 'bg-slate-200 dark:bg-slate-700 text-slate-700 dark:text-slate-200',
    fileUrl: '/certificates/invest_manager.pdf',
    fileType: 'pdf',
  },
  {
    id: 'afpk',
    title: 'AFPK (재무설계사)',
    issuer: '한국FPSB (종합 리스크 및 플래닝)',
    tag: '플래닝',
    tagColor: 'bg-slate-200 dark:bg-slate-700 text-slate-700 dark:text-slate-200',
    fileUrl: '/certificates/afpk.pdf',
    fileType: 'pdf',
  },
  {
    id: 'history_level2',
    title: '한국사능력검정시험 2급',
    issuer: '국사편찬위원회',
    tag: '기본소양',
    tagColor: 'bg-slate-200 dark:bg-slate-700 text-slate-700 dark:text-slate-200',
    fileUrl: '/certificates/history_level2.pdf',
    fileType: 'pdf',
  },
];

export const ProfileSidebar: React.FC<ProfileSidebarProps> = ({ onOpenAuth }) => {
  const [copiedPhone, setCopiedPhone] = useState(false);
  const [copiedEmail, setCopiedEmail] = useState(false);
  const [selectedCert, setSelectedCert] = useState<CertificateItem | null>(null);
  const [showAuthNotice, setShowAuthNotice] = useState(false);
  const [attemptedCertName, setAttemptedCertName] = useState('');

  const { isOwner } = useAuth();

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

  const handleCertificateClick = (cert: CertificateItem) => {
    if (isOwner) {
      setSelectedCert(cert);
    } else {
      setAttemptedCertName(cert.title);
      setShowAuthNotice(true);
    }
  };

  return (
    <aside className="lg:col-span-4 space-y-6">
      {/* 프로필 카드 */}
      <div className="bg-white dark:bg-[#131B2E] rounded-3xl p-6 shadow-sm border border-slate-200/80 dark:border-slate-800/80 relative overflow-hidden transition-colors duration-300">
        <div className="h-24 bg-gradient-to-r from-blue-600 via-indigo-600 to-sky-500 -mx-6 -mt-6 mb-4"></div>

        <div className="relative flex flex-col items-center text-center">
          {/* 메인 프로필 사진 (정사각형 1:1 프레임) */}
          <div className="relative w-28 h-28 sm:w-32 sm:h-32 rounded-2xl sm:rounded-3xl border-4 border-white dark:border-slate-800 shadow-xl bg-white dark:bg-slate-900 -mt-14 sm:-mt-16 mb-2 overflow-hidden flex items-center justify-center">
            <img
              src="/profile.png"
              alt="최우혁 프로필 사진"
              className="w-full h-full object-cover"
            />
          </div>

          {/* 이름 */}
          <div className="flex items-center gap-2 mt-3.5">
            <h1 className="text-2xl font-black text-slate-900 dark:text-white tracking-tight">최우혁</h1>
            {isOwner && (
              <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-100 text-emerald-700 dark:bg-emerald-950/70 dark:text-emerald-400 border border-emerald-300 dark:border-emerald-800">
                <ShieldCheck className="w-3 h-3" />
                본인 인증됨
              </span>
            )}
          </div>

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

      {/* 보유 자격 사항 (Certifications) */}
      <div className="bg-white dark:bg-[#131B2E] rounded-3xl p-6 shadow-sm border border-slate-200/80 dark:border-slate-800/80 transition-colors duration-300">
        <div className="flex items-center justify-between mb-3">
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

        {/* 보안 안내 배너 */}
        {isOwner ? (
          <div className="mb-3 p-2.5 rounded-xl bg-emerald-50 dark:bg-emerald-950/30 border border-emerald-200 dark:border-emerald-800/50 flex items-center gap-2 text-xs text-emerald-800 dark:text-emerald-300">
            <ShieldCheck className="w-4 h-4 text-emerald-600 shrink-0" />
            <span className="text-[11px] font-medium leading-relaxed">
              최우혁 본인 인증 완료 — 자격증 클릭 시 합격증 원본 열람 가능
            </span>
          </div>
        ) : (
          <div className="mb-3 p-2.5 rounded-xl bg-amber-50/80 dark:bg-amber-950/30 border border-amber-200/80 dark:border-amber-800/50 flex items-center gap-2 text-xs text-amber-800 dark:text-amber-300">
            <Lock className="w-3.5 h-3.5 text-amber-600 shrink-0" />
            <span className="text-[11px] leading-relaxed">
              합격증 원본 서류는 <strong>최우혁 본인 계정(Google)</strong>으로 로그인 시 열람 가능합니다.
            </span>
          </div>
        )}

        {/* 자격증 리스트 (클릭 시 원본 열람 / 로그인 유도) */}
        <div className="space-y-2.5">
          {CERTIFICATES.map((cert) => (
            <button
              key={cert.id}
              onClick={() => handleCertificateClick(cert)}
              className="w-full text-left p-3 rounded-2xl border transition-all duration-200 group relative flex items-center justify-between bg-slate-50/70 hover:bg-blue-50/60 dark:bg-slate-800/40 dark:hover:bg-slate-800/80 border-slate-200/70 dark:border-slate-800 hover:border-blue-300 dark:hover:border-blue-700 shadow-sm hover:shadow"
            >
              <div className="flex items-center gap-2.5 pr-2 min-w-0">
                <div
                  className={`w-2 h-2 rounded-full shrink-0 ${
                    cert.id === 'adsp' ? 'bg-blue-600' : 'bg-slate-400 dark:bg-slate-500'
                  }`}
                />
                <div className="min-w-0">
                  <div className="flex items-center gap-1.5 flex-wrap">
                    <h3 className="text-xs font-bold text-slate-800 dark:text-slate-100 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors truncate">
                      {cert.title}
                    </h3>
                  </div>
                  <p className="text-[11px] text-slate-500 dark:text-slate-400 truncate mt-0.5">
                    {cert.issuer}
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-1.5 shrink-0">
                {isOwner ? (
                  <span className="inline-flex items-center gap-1 text-[10px] font-bold text-emerald-700 dark:text-emerald-300 bg-emerald-100 dark:bg-emerald-950/80 px-2 py-0.5 rounded-full border border-emerald-300/60 dark:border-emerald-800 group-hover:scale-105 transition-transform">
                    <Eye className="w-3 h-3" />
                    열람
                  </span>
                ) : (
                  <span className="inline-flex items-center gap-1 text-[10px] font-medium text-slate-500 dark:text-slate-400 bg-slate-200/70 dark:bg-slate-700/60 px-1.5 py-0.5 rounded-full group-hover:text-amber-600 dark:group-hover:text-amber-400 transition-colors">
                    <Lock className="w-3 h-3" />
                    인증필요
                  </span>
                )}
              </div>
            </button>
          ))}
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

      {/* 서류 열람 모달 (본인 인증 완료 시 열림) */}
      <CertificateModal
        certificate={selectedCert}
        onClose={() => setSelectedCert(null)}
      />

      {/* 본인 인증 필요 알림 팝업 (미인증 사용자가 클릭 시 안내) */}
      {showAuthNotice && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fadeIn">
          <div className="relative w-full max-w-sm bg-white dark:bg-[#131B2E] rounded-3xl p-6 shadow-2xl border border-slate-200 dark:border-slate-800 text-center">
            <button
              onClick={() => setShowAuthNotice(false)}
              className="absolute top-4 right-4 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 p-1 rounded-xl hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="w-12 h-12 rounded-2xl bg-amber-100 dark:bg-amber-950/60 text-amber-600 dark:text-amber-400 flex items-center justify-center mx-auto mb-3.5 shadow-inner">
              <Lock className="w-6 h-6" />
            </div>

            <h3 className="text-base font-bold text-slate-900 dark:text-white mb-1.5">
              본인 인증이 필요한 서류입니다
            </h3>

            <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed mb-4">
              <strong>[{attemptedCertName}]</strong> 합격증 및 자격 서류 원본은 개인정보 보호를 위해{' '}
              <strong className="text-blue-600 dark:text-blue-400">최우혁 본인 계정(uchoe59@gmail.com)</strong>으로 로그인 시에만
              열람하실 수 있습니다.
            </p>

            <div className="space-y-2">
              <button
                type="button"
                onClick={() => {
                  setShowAuthNotice(false);
                  onOpenAuth?.();
                }}
                className="w-full py-2.5 px-4 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white rounded-xl text-xs font-bold flex items-center justify-center gap-2 shadow-md shadow-blue-500/20 transition-all"
              >
                <LogIn className="w-4 h-4" />
                <span>본인 인증 로그인하기</span>
              </button>

              <button
                type="button"
                onClick={() => setShowAuthNotice(false)}
                className="w-full py-2 px-3 text-xs font-medium text-slate-500 hover:text-slate-700 dark:text-slate-400 dark:hover:text-slate-200 rounded-xl transition-colors"
              >
                닫기
              </button>
            </div>
          </div>
        </div>
      )}
    </aside>
  );
};
