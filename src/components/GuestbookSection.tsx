import React, { useState, useEffect } from 'react';
import {
  MessageSquare,
  Send,
  Heart,
  Trash2,
  Database,
  CheckCircle2,
  Sparkles,
  Lock,
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { db, isFirebaseConfigured } from '../firebase/config';
import {
  collection,
  addDoc,
  onSnapshot,
  query,
  orderBy,
  deleteDoc,
  doc,
  updateDoc,
  increment,
} from 'firebase/firestore';
import { GuestbookEntry } from '../types';

const INITIAL_MOCK_ENTRIES: GuestbookEntry[] = [
  {
    id: 'mock-1',
    authorName: '캠코 공모전 심사위원',
    category: 'cheer',
    message:
      '최우혁 님의 <On하다> 영상은 생성형 AI 기술의 실무 적용과 스토리텔링 완성도가 매우 뛰어난 수작이었습니다. 대상 수상을 다시 한번 축하드립니다!',
    likes: 12,
    createdAt: Date.now() - 1000 * 60 * 60 * 24 * 3,
  },
  {
    id: 'mock-2',
    authorName: 'IT 데이터팀 채용담당자',
    category: 'inquiry',
    message:
      'ADsP 역량과 실무 영상 기획을 함께 갖추신 점이 매우 흥미롭습니다. 데이터 기반 콘텐츠 기획 직무 관련하여 커피챗 제안드리고 싶습니다.',
    likes: 7,
    createdAt: Date.now() - 1000 * 60 * 60 * 12,
  },
];

export const GuestbookSection: React.FC<{ onOpenAuth: () => void }> = ({ onOpenAuth }) => {
  const { currentUser } = useAuth();
  const [entries, setEntries] = useState<GuestbookEntry[]>([]);
  const [authorName, setAuthorName] = useState('');
  const [message, setMessage] = useState('');
  const [category, setCategory] = useState<'cheer' | 'inquiry' | 'feedback'>('cheer');
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    if (currentUser?.displayName) {
      setAuthorName(currentUser.displayName);
    }
  }, [currentUser]);

  // DB 실시간 구독 (Firestore 또는 LocalStorage)
  useEffect(() => {
    if (isFirebaseConfigured && db) {
      const q = query(collection(db, 'guestbook'), orderBy('createdAt', 'desc'));
      const unsubscribe = onSnapshot(
        q,
        (snapshot) => {
          const list: GuestbookEntry[] = snapshot.docs.map((docSnap) => ({
            id: docSnap.id,
            ...(docSnap.data() as Omit<GuestbookEntry, 'id'>),
          }));
          setEntries(list.length > 0 ? list : INITIAL_MOCK_ENTRIES);
        },
        (error) => {
          console.warn('Firestore subscription fallback:', error);
          loadLocalStorageEntries();
        }
      );
      return () => unsubscribe();
    } else {
      loadLocalStorageEntries();
    }
  }, []);

  const loadLocalStorageEntries = () => {
    const saved = localStorage.getItem('profile_guestbook_entries');
    if (saved) {
      try {
        setEntries(JSON.parse(saved));
        return;
      } catch (e) {
        console.error(e);
      }
    }
    setEntries(INITIAL_MOCK_ENTRIES);
    localStorage.setItem('profile_guestbook_entries', JSON.stringify(INITIAL_MOCK_ENTRIES));
  };

  const saveLocalEntries = (newEntries: GuestbookEntry[]) => {
    setEntries(newEntries);
    localStorage.setItem('profile_guestbook_entries', JSON.stringify(newEntries));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!message.trim()) return;

    const nameToUse = authorName.trim() || currentUser?.displayName || '방문자';
    setSubmitting(true);

    const newEntry: Omit<GuestbookEntry, 'id'> = {
      authorName: nameToUse,
      authorUid: currentUser?.uid || 'guest_' + Date.now(),
      authorEmail: currentUser?.email || undefined,
      category,
      message: message.trim(),
      likes: 0,
      createdAt: Date.now(),
    };

    try {
      if (isFirebaseConfigured && db) {
        await addDoc(collection(db, 'guestbook'), newEntry);
      } else {
        const fullEntry: GuestbookEntry = {
          ...newEntry,
          id: 'local_' + Date.now(),
        };
        const updated = [fullEntry, ...entries];
        saveLocalEntries(updated);
      }
      setMessage('');
    } catch (err) {
      console.error('Error adding entry:', err);
      alert('저장 중 오류가 발생했습니다. 다시 시도해 주세요.');
    } finally {
      setSubmitting(false);
    }
  };

  const handleLike = async (entry: GuestbookEntry) => {
    if (isFirebaseConfigured && db && !entry.id.startsWith('mock-') && !entry.id.startsWith('local_')) {
      try {
        const ref = doc(db, 'guestbook', entry.id);
        await updateDoc(ref, { likes: increment(1) });
      } catch (e) {
        console.warn('Like error:', e);
      }
    } else {
      const updated = entries.map((item) =>
        item.id === entry.id ? { ...item, likes: item.likes + 1 } : item
      );
      saveLocalEntries(updated);
    }
  };

  const handleDelete = async (entryId: string) => {
    if (!window.confirm('이 글을 삭제하시겠습니까?')) return;

    if (isFirebaseConfigured && db && !entryId.startsWith('mock-') && !entryId.startsWith('local_')) {
      try {
        await deleteDoc(doc(db, 'guestbook', entryId));
      } catch (e) {
        console.warn('Delete error:', e);
      }
    } else {
      const updated = entries.filter((item) => item.id !== entryId);
      saveLocalEntries(updated);
    }
  };

  return (
    <div className="bg-white dark:bg-[#131B2E] rounded-3xl p-6 sm:p-7 shadow-sm border border-slate-200/80 dark:border-slate-800/80 transition-colors duration-300">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-6 pb-4 border-b border-slate-100 dark:border-slate-800">
        <div>
          <h2 className="text-base font-bold text-slate-900 dark:text-white flex items-center gap-2">
            <span className="p-1.5 bg-blue-100 dark:bg-blue-950/60 text-blue-600 dark:text-blue-400 rounded-lg">
              <MessageSquare className="w-4 h-4" />
            </span>
            실시간 방명록 &amp; 프로젝트 문의 (Database Board)
          </h2>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
            인증 계정 또는 게스트로 메시지를 작성하고 실시간 데이터베이스에 기록할 수 있습니다.
          </p>
        </div>

        {/* DB 상태 뱃지 */}
        <div className="flex items-center gap-1.5 self-start sm:self-auto text-[11px] font-semibold px-2.5 py-1 rounded-full bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300">
          <Database className="w-3 h-3 text-blue-500" />
          <span>{isFirebaseConfigured ? 'Cloud Firestore 실시간 연동' : '로컬 DB 동기화 모드'}</span>
          <span className={`w-2 h-2 rounded-full ${isFirebaseConfigured ? 'bg-emerald-500' : 'bg-amber-400'}`}></span>
        </div>
      </div>

      {/* 작성 폼 */}
      <form onSubmit={handleSubmit} className="mb-8 p-4 rounded-2xl bg-slate-50/80 dark:bg-slate-800/50 border border-slate-200/80 dark:border-slate-700/80 space-y-3">
        <div className="flex flex-col sm:flex-row sm:items-center gap-3">
          <div className="flex-1">
            <label className="block text-[11px] font-bold text-slate-600 dark:text-slate-300 mb-1">작성자 명</label>
            <input
              type="text"
              required
              value={authorName}
              onChange={(e) => setAuthorName(e.target.value)}
              placeholder={currentUser ? currentUser.displayName : '성함 또는 닉네임을 입력하세요'}
              className="w-full text-xs px-3 py-2 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div>
            <label className="block text-[11px] font-bold text-slate-600 dark:text-slate-300 mb-1">분류</label>
            <div className="flex gap-1">
              <button
                type="button"
                onClick={() => setCategory('cheer')}
                className={`text-xs px-2.5 py-2 rounded-xl border transition-all font-semibold ${
                  category === 'cheer'
                    ? 'bg-blue-600 text-white border-blue-600'
                    : 'bg-white dark:bg-slate-900 text-slate-600 dark:text-slate-300 border-slate-200 dark:border-slate-700'
                }`}
              >
                🎉 응원
              </button>
              <button
                type="button"
                onClick={() => setCategory('inquiry')}
                className={`text-xs px-2.5 py-2 rounded-xl border transition-all font-semibold ${
                  category === 'inquiry'
                    ? 'bg-indigo-600 text-white border-indigo-600'
                    : 'bg-white dark:bg-slate-900 text-slate-600 dark:text-slate-300 border-slate-200 dark:border-slate-700'
                }`}
              >
                💼 채용/협업
              </button>
              <button
                type="button"
                onClick={() => setCategory('feedback')}
                className={`text-xs px-2.5 py-2 rounded-xl border transition-all font-semibold ${
                  category === 'feedback'
                    ? 'bg-emerald-600 text-white border-emerald-600'
                    : 'bg-white dark:bg-slate-900 text-slate-600 dark:text-slate-300 border-slate-200 dark:border-slate-700'
                }`}
              >
                💬 피드백
              </button>
            </div>
          </div>
        </div>

        <div>
          <label className="block text-[11px] font-bold text-slate-600 dark:text-slate-300 mb-1">남기실 메시지</label>
          <textarea
            required
            rows={2}
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            placeholder="최우혁 님에게 남길 응원이나 프로젝트/채용 문의 메시지를 작성해주세요..."
            className="w-full text-xs px-3 py-2 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        <div className="flex items-center justify-between pt-1">
          {!currentUser ? (
            <button
              type="button"
              onClick={onOpenAuth}
              className="text-xs text-blue-600 dark:text-blue-400 font-medium hover:underline flex items-center gap-1"
            >
              <Lock className="w-3.5 h-3.5" />
              <span>로그인 후 작성하면 본인 글 관리 가능</span>
            </button>
          ) : (
            <span className="text-[11px] text-emerald-600 dark:text-emerald-400 font-medium flex items-center gap-1">
              <CheckCircle2 className="w-3.5 h-3.5" />
              <span>{currentUser.displayName} 님으로 등록됩니다</span>
            </span>
          )}

          <button
            type="submit"
            disabled={submitting || !message.trim()}
            className="flex items-center gap-1.5 px-4 py-2 bg-blue-600 hover:bg-blue-700 disabled:opacity-50 text-white text-xs font-bold rounded-xl transition-all shadow-sm shadow-blue-500/20"
          >
            <Send className="w-3.5 h-3.5" />
            <span>{submitting ? '저장 중...' : '메시지 등록'}</span>
          </button>
        </div>
      </form>

      {/* 등록된 목록 */}
      <div className="space-y-3">
        {entries.length === 0 ? (
          <div className="text-center py-8 text-xs text-slate-400">
            등록된 메시지가 없습니다. 첫 번째 메시지를 남겨보세요!
          </div>
        ) : (
          entries.map((item) => (
            <div
              key={item.id}
              className="p-4 rounded-2xl bg-slate-50/60 dark:bg-slate-800/40 border border-slate-100 dark:border-slate-700/60 flex flex-col justify-between gap-2.5 transition-all hover:border-slate-300 dark:hover:border-slate-600"
            >
              <div className="flex items-start justify-between gap-2">
                <div className="flex items-center gap-2">
                  <div className="w-7 h-7 rounded-lg bg-blue-100 dark:bg-blue-900/60 text-blue-600 dark:text-blue-300 font-black text-xs flex items-center justify-center">
                    {item.authorName.charAt(0)}
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-bold text-slate-900 dark:text-white">
                        {item.authorName}
                      </span>
                      {item.category === 'cheer' && (
                        <span className="text-[10px] font-bold px-1.5 py-0.2 bg-blue-50 dark:bg-blue-950/60 text-blue-600 dark:text-blue-400 rounded">
                          응원
                        </span>
                      )}
                      {item.category === 'inquiry' && (
                        <span className="text-[10px] font-bold px-1.5 py-0.2 bg-indigo-50 dark:bg-indigo-950/60 text-indigo-600 dark:text-indigo-400 rounded">
                          협업 문의
                        </span>
                      )}
                      {item.category === 'feedback' && (
                        <span className="text-[10px] font-bold px-1.5 py-0.2 bg-emerald-50 dark:bg-emerald-950/60 text-emerald-600 dark:text-emerald-400 rounded">
                          피드백
                        </span>
                      )}
                    </div>
                    <span className="text-[10px] text-slate-400">
                      {new Date(item.createdAt).toLocaleDateString('ko-KR', {
                        year: 'numeric',
                        month: 'short',
                        day: 'numeric',
                      })}
                    </span>
                  </div>
                </div>

                <div className="flex items-center gap-1.5">
                  <button
                    onClick={() => handleLike(item)}
                    className="flex items-center gap-1 text-[11px] font-semibold text-rose-500 bg-rose-50 dark:bg-rose-950/40 hover:bg-rose-100 dark:hover:bg-rose-900/60 px-2 py-1 rounded-lg transition-colors"
                  >
                    <Heart className="w-3 h-3 fill-rose-500" />
                    <span>{item.likes}</span>
                  </button>

                  {(currentUser?.uid === item.authorUid || !item.authorUid) && (
                    <button
                      onClick={() => handleDelete(item.id)}
                      title="삭제"
                      className="p-1 text-slate-400 hover:text-rose-500 transition-colors"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  )}
                </div>
              </div>

              <p className="text-xs text-slate-700 dark:text-slate-200 leading-relaxed pl-9">
                {item.message}
              </p>
            </div>
          ))
        )}
      </div>
    </div>
  );
};
