import React from 'react';
import { X, ExternalLink, ShieldCheck, Download, Award } from 'lucide-react';

export interface CertificateItem {
  id: string;
  title: string;
  issuer: string;
  tag: string;
  tagColor: string;
  fileUrl: string;
  fileType: 'image' | 'pdf';
}

interface CertificateModalProps {
  certificate: CertificateItem | null;
  onClose: () => void;
}

export const CertificateModal: React.FC<CertificateModalProps> = ({ certificate, onClose }) => {
  if (!certificate) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/75 backdrop-blur-md animate-fadeIn">
      <div className="relative w-full max-w-3xl bg-white dark:bg-[#131B2E] rounded-3xl shadow-2xl border border-slate-200 dark:border-slate-700 overflow-hidden flex flex-col max-h-[90vh] transition-colors duration-300">
        
        {/* 모달 헤더 */}
        <div className="px-5 py-4 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between bg-slate-50/80 dark:bg-slate-900/50">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-blue-600 to-indigo-600 text-white flex items-center justify-center shadow-md shadow-blue-500/20">
              <Award className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-sm sm:text-base font-bold text-slate-900 dark:text-white">
                  {certificate.title}
                </h3>
                <span className="px-2 py-0.5 text-[10px] font-bold bg-emerald-100 text-emerald-700 dark:bg-emerald-950/70 dark:text-emerald-400 rounded-md border border-emerald-200 dark:border-emerald-800 flex items-center gap-1">
                  <ShieldCheck className="w-3 h-3" />
                  인증 완료
                </span>
              </div>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">{certificate.issuer}</p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 text-slate-400 hover:text-slate-700 dark:hover:text-white rounded-xl transition-colors hover:bg-slate-200 dark:hover:bg-slate-800"
            title="닫기"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* 모달 본문 - 증명서 뷰어 */}
        <div className="flex-1 overflow-auto p-4 sm:p-6 bg-slate-100/60 dark:bg-slate-950/50 flex flex-col items-center justify-center">
          {certificate.fileType === 'image' ? (
            <div className="max-w-xl w-full bg-white dark:bg-slate-900 rounded-2xl shadow-lg border border-slate-200 dark:border-slate-800 overflow-hidden p-2 flex items-center justify-center">
              <img
                src={certificate.fileUrl}
                alt={certificate.title}
                className="w-full h-auto object-contain rounded-xl max-h-[65vh]"
              />
            </div>
          ) : (
            <div className="w-full h-[62vh] rounded-2xl overflow-hidden border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-lg">
              <iframe
                src={`${certificate.fileUrl}#toolbar=0&navpanes=0`}
                title={certificate.title}
                className="w-full h-full"
              />
            </div>
          )}
        </div>

        {/* 모달 푸터 */}
        <div className="px-5 py-3 border-t border-slate-200 dark:border-slate-800 flex flex-col sm:flex-row items-center justify-between gap-2.5 bg-slate-50/80 dark:bg-slate-900/50">
          <div className="flex items-center gap-1.5 text-xs text-slate-500 dark:text-slate-400">
            <ShieldCheck className="w-4 h-4 text-emerald-500" />
            <span>최우혁 본인 계정(uchoe59@gmail.com) 인증 열람 중</span>
          </div>

          <div className="flex items-center gap-2">
            <a
              href={certificate.fileUrl}
              target="_blank"
              rel="noopener noreferrer"
              download
              className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-slate-700 dark:text-slate-200 bg-white dark:bg-slate-800 hover:bg-slate-100 dark:hover:bg-slate-700 border border-slate-200 dark:border-slate-700 rounded-xl transition-all shadow-sm"
            >
              <Download className="w-3.5 h-3.5" />
              <span>파일 다운로드</span>
            </a>
            <a
              href={certificate.fileUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 px-3.5 py-1.5 text-xs font-semibold text-white bg-blue-600 hover:bg-blue-700 rounded-xl shadow-sm transition-all"
            >
              <ExternalLink className="w-3.5 h-3.5" />
              <span>새 탭에서 원본 보기</span>
            </a>
          </div>
        </div>
      </div>
    </div>
  );
};
