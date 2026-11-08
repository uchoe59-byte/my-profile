import React, { useState, useEffect, useRef } from 'react';
import { X, Lock, Mail, ShieldCheck } from 'lucide-react';
import { useAuth, GOOGLE_CLIENT_ID, parseJwt, ADMIN_EMAIL } from '../context/AuthContext';

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const AuthModal: React.FC<AuthModalProps> = ({ isOpen, onClose }) => {
  const { loginWithEmail, loginWithGoogleCredential } = useAuth();
  const [email, setEmail] = useState(ADMIN_EMAIL);
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const googleBtnRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!isOpen) return;

    const renderGoogleBtn = () => {
      if ((window as any).google?.accounts?.id && googleBtnRef.current) {
        try {
          (window as any).google.accounts.id.initialize({
            client_id: GOOGLE_CLIENT_ID,
            callback: (response: any) => {
              if (response?.credential) {
                const payload = parseJwt(response.credential);
                if (payload?.email) {
                  loginWithGoogleCredential({
                    email: payload.email,
                    name: payload.name,
                    picture: payload.picture,
                    sub: payload.sub,
                  });
                  onClose();
                } else {
                  setError('구글 계정 정보를 읽어오지 못했습니다.');
                }
              }
            },
          });

          googleBtnRef.current.innerHTML = '';
          (window as any).google.accounts.id.renderButton(googleBtnRef.current, {
            theme: 'outline',
            size: 'large',
            width: 320,
            text: 'continue_with',
            shape: 'rectangular',
            locale: 'ko',
          });
        } catch (err) {
          console.error('Google button render error:', err);
        }
      }
    };

    if ((window as any).google?.accounts?.id) {
      renderGoogleBtn();
    } else {
      const interval = setInterval(() => {
        if ((window as any).google?.accounts?.id) {
          clearInterval(interval);
          renderGoogleBtn();
        }
      }, 200);
      return () => clearInterval(interval);
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      await loginWithEmail(email, password);
      onClose();
    } catch (err: any) {
      console.error(err);
      if (err.code === 'auth/user-not-found' || err.code === 'auth/wrong-password') {
        setError('비밀번호가 일치하지 않습니다.');
      } else {
        setError(err.message || '인증 처리 중 오류가 발생했습니다.');
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fadeIn">
      <div className="relative w-full max-w-sm bg-white dark:bg-[#131B2E] rounded-3xl p-6 sm:p-7 shadow-2xl border border-slate-200 dark:border-slate-700 transition-colors duration-300">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-1.5 text-slate-400 hover:text-slate-700 dark:hover:text-white rounded-xl transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="text-center mb-5">
          <div className="w-11 h-11 mx-auto rounded-2xl bg-gradient-to-tr from-blue-600 to-indigo-600 text-white flex items-center justify-center shadow-lg shadow-blue-500/20 mb-3">
            <ShieldCheck className="w-6 h-6" />
          </div>
          <h3 className="text-lg font-black text-slate-900 dark:text-white">
            최우혁 본인 인증
          </h3>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
            자격증 합격증 및 원본 서류 열람을 위한 본인 확인입니다.
          </p>
        </div>

        {error && (
          <div className="mb-4 p-2.5 rounded-xl bg-rose-50 dark:bg-rose-950/50 border border-rose-200 dark:border-rose-900/60 text-xs text-rose-600 dark:text-rose-400 text-center font-medium">
            {error}
          </div>
        )}

        {/* 공식 Google 로그인 버튼 */}
        <div className="flex flex-col items-center justify-center my-3">
          <div ref={googleBtnRef} className="min-h-[44px] flex items-center justify-center w-full"></div>
          <p className="text-[10px] text-slate-400 dark:text-slate-500 mt-1.5 text-center">
            {ADMIN_EMAIL} 구글 계정으로 로그인 시 즉시 인증
          </p>
        </div>

        <div className="relative my-4 text-center">
          <div className="absolute inset-0 flex items-center">
            <div className="w-full border-t border-slate-200 dark:border-slate-700"></div>
          </div>
          <span className="relative px-2 bg-white dark:bg-[#131B2E] text-[10px] font-semibold text-slate-400">
            또는 본인 비밀번호로 로그인
          </span>
        </div>

        <form onSubmit={handleSubmit} className="space-y-3">
          <div>
            <label className="block text-[11px] font-bold text-slate-600 dark:text-slate-300 mb-1">
              관리자 계정
            </label>
            <div className="relative">
              <Mail className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="uchoe59@gmail.com"
                className="w-full text-xs pl-9 pr-3 py-2 rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
          </div>

          <div>
            <label className="block text-[11px] font-bold text-slate-600 dark:text-slate-300 mb-1">
              비밀번호
            </label>
            <div className="relative">
              <Lock className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="비밀번호 입력"
                className="w-full text-xs pl-9 pr-3 py-2 rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-2.5 mt-2 bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs rounded-xl shadow-md shadow-blue-500/20 transition-all disabled:opacity-50"
          >
            {loading ? '인증 확인 중...' : '비밀번호로 본인 인증'}
          </button>
        </form>
      </div>
    </div>
  );
};
