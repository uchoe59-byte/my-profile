import React, { useState, useEffect } from 'react';
import {
  Calendar as CalendarIcon,
  ChevronLeft,
  ChevronRight,
  Plus,
  Trash2,
  X,
  Lock,
  LogIn,
  Check,
  Clock,
  Sparkles,
  CalendarDays,
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';

export type PriorityColor = 'red' | 'blue' | 'green';

export interface ScheduleEvent {
  id: string;
  date: string; // YYYY-MM-DD
  title: string;
  description?: string;
  priority: PriorityColor;
  createdAt: number;
}

interface ScheduleCalendarProps {
  onOpenAuth: () => void;
}

const STORAGE_KEY = 'profile_owner_schedules';

const INITIAL_SAMPLE_EVENTS: ScheduleEvent[] = [
  {
    id: 'sample-1',
    date: '2026-07-15',
    title: '캠코 AI 공모전 대상',
    description: '캠코 AI 활용 국유재산 공모전 대상 수상식',
    priority: 'red',
    createdAt: Date.now() - 5000000,
  },
  {
    id: 'sample-2',
    date: '2026-09-25',
    title: '캠코터즈 활동 수료',
    description: '4편 전작 공식 유튜브 게시 및 서포터즈 대상',
    priority: 'blue',
    createdAt: Date.now() - 3000000,
  },
  {
    id: 'sample-3',
    date: '2026-11-20',
    title: '데이터 분석 프로젝트 기획',
    description: '포트폴리오 고도화 및 하반기 주요 일정',
    priority: 'green',
    createdAt: Date.now() - 1000000,
  },
];

export const ScheduleCalendar: React.FC<ScheduleCalendarProps> = ({ onOpenAuth }) => {
  const { isOwner } = useAuth();

  // 2026 ~ 2030 연도 범위 설정
  const MIN_YEAR = 2026;
  const MAX_YEAR = 2030;

  const today = new Date();
  const currentInitialYear = Math.min(Math.max(today.getFullYear(), MIN_YEAR), MAX_YEAR);
  const currentInitialMonth = today.getMonth(); // 0-indexed

  const [currentYear, setCurrentYear] = useState<number>(currentInitialYear);
  const [currentMonth, setCurrentMonth] = useState<number>(currentInitialMonth);

  // 일정 목록 상태 관리
  const [events, setEvents] = useState<ScheduleEvent[]>(() => {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) {
        try {
          return JSON.parse(saved);
        } catch {
          return INITIAL_SAMPLE_EVENTS;
        }
      }
    }
    return INITIAL_SAMPLE_EVENTS;
  });

  // 일정 추가/수정 모달 상태
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingEventId, setEditingEventId] = useState<string | null>(null);
  const [formDate, setFormDate] = useState<string>('');
  const [formTitle, setFormTitle] = useState<string>('');
  const [formDesc, setFormDesc] = useState<string>('');
  const [formPriority, setFormPriority] = useState<PriorityColor>('red');

  // 일정 변경 시 localStorage 저장
  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(events));
  }, [events]);

  // 이전 달 / 다음 달 이동
  const handlePrevMonth = () => {
    if (currentMonth === 0) {
      if (currentYear > MIN_YEAR) {
        setCurrentYear(currentYear - 1);
        setCurrentMonth(11);
      }
    } else {
      setCurrentMonth(currentMonth - 1);
    }
  };

  const handleNextMonth = () => {
    if (currentMonth === 11) {
      if (currentYear < MAX_YEAR) {
        setCurrentYear(currentYear + 1);
        setCurrentMonth(0);
      }
    } else {
      setCurrentMonth(currentMonth + 1);
    }
  };

  // 날짜 클릭 시 새 일정 추가 모달 열기
  const handleDayClick = (dateStr: string) => {
    setEditingEventId(null);
    setFormDate(dateStr);
    setFormTitle('');
    setFormDesc('');
    setFormPriority('red');
    setIsModalOpen(true);
  };

  // 기존 일정 클릭 시 수정 모달 열기
  const handleEventClick = (e: React.MouseEvent, event: ScheduleEvent) => {
    e.stopPropagation();
    setEditingEventId(event.id);
    setFormDate(event.date);
    setFormTitle(event.title);
    setFormDesc(event.description || '');
    setFormPriority(event.priority);
    setIsModalOpen(true);
  };

  // 일정 저장
  const handleSaveEvent = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formTitle.trim() || !formDate) return;

    if (editingEventId) {
      setEvents((prev) =>
        prev.map((ev) =>
          ev.id === editingEventId
            ? {
                ...ev,
                date: formDate,
                title: formTitle.trim(),
                description: formDesc.trim(),
                priority: formPriority,
              }
            : ev
        )
      );
    } else {
      const newEvent: ScheduleEvent = {
        id: 'event_' + Date.now() + '_' + Math.random().toString(36).substring(2, 6),
        date: formDate,
        title: formTitle.trim(),
        description: formDesc.trim(),
        priority: formPriority,
        createdAt: Date.now(),
      };
      setEvents((prev) => [...prev, newEvent]);
    }
    setIsModalOpen(false);
  };

  // 일정 삭제
  const handleDeleteEvent = (id: string) => {
    if (window.confirm('이 일정을 삭제하시겠습니까?')) {
      setEvents((prev) => prev.filter((ev) => ev.id !== id));
      setIsModalOpen(false);
    }
  };

  // 달력 날짜 계산
  const firstDayOfMonth = new Date(currentYear, currentMonth, 1).getDay(); // 0 (일) ~ 6 (토)
  const daysInMonth = new Date(currentYear, currentMonth + 1, 0).getDate();

  // 이전 달의 마지막 일자들
  const prevMonthDaysCount = new Date(currentYear, currentMonth, 0).getDate();
  const prevMonthDays = [];
  for (let i = firstDayOfMonth - 1; i >= 0; i--) {
    prevMonthDays.push(prevMonthDaysCount - i);
  }

  // 이번 달 일자들
  const currentMonthDays = [];
  for (let i = 1; i <= daysInMonth; i++) {
    currentMonthDays.push(i);
  }

  // 다음 달 일자들 (총 35칸 or 42칸으로 맞추기)
  const totalCells = Math.ceil((firstDayOfMonth + daysInMonth) / 7) * 7;
  const nextMonthDaysCount = totalCells - (firstDayOfMonth + daysInMonth);
  const nextMonthDays = [];
  for (let i = 1; i <= nextMonthDaysCount; i++) {
    nextMonthDays.push(i);
  }

  // 테두리 스타일 매핑 함수 (빨강, 파랑, 초록)
  const getPriorityStyle = (priority: PriorityColor) => {
    switch (priority) {
      case 'red':
        return 'border-2 border-red-500 bg-red-50/90 text-red-900 dark:bg-red-950/40 dark:border-red-500 dark:text-red-200';
      case 'blue':
        return 'border-2 border-blue-500 bg-blue-50/90 text-blue-900 dark:bg-blue-950/40 dark:border-blue-500 dark:text-blue-200';
      case 'green':
        return 'border-2 border-emerald-500 bg-emerald-50/90 text-emerald-900 dark:bg-emerald-950/40 dark:border-emerald-500 dark:text-emerald-200';
      default:
        return 'border-2 border-slate-400 bg-slate-50 text-slate-800';
    }
  };

  // 이번 달의 일정 필터링
  const monthPrefix = `${currentYear}-${String(currentMonth + 1).padStart(2, '0')}`;
  const thisMonthEvents = events
    .filter((ev) => ev.date.startsWith(monthPrefix))
    .sort((a, b) => a.date.localeCompare(b.date));

  // 미인증 시 본인 로그인 안내 화면
  if (!isOwner) {
    return (
      <div className="bg-white dark:bg-[#131B2E] rounded-3xl p-8 sm:p-12 shadow-sm border border-slate-200/80 dark:border-slate-800/80 text-center transition-colors duration-300">
        <div className="w-16 h-16 mx-auto rounded-3xl bg-blue-50 dark:bg-blue-950/60 border border-blue-200 dark:border-blue-800 text-blue-600 dark:text-blue-400 flex items-center justify-center shadow-lg shadow-blue-500/10 mb-4">
          <Lock className="w-8 h-8" />
        </div>
        <h3 className="text-xl font-black text-slate-900 dark:text-white mb-2">
          최우혁 본인 전용 일정 캘린더
        </h3>
        <p className="text-sm text-slate-600 dark:text-slate-300 max-w-md mx-auto leading-relaxed mb-6">
          개인 일정 및 목표 계획(2026~2030)은 개인 정보 보호를 위해{' '}
          <strong className="text-blue-600 dark:text-blue-400">최우혁 본인 계정</strong>으로 인증 후 열람 및 등록할 수 있습니다.
        </p>
        <button
          onClick={onOpenAuth}
          className="inline-flex items-center gap-2 px-6 py-3 rounded-2xl bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white font-bold text-sm shadow-md shadow-blue-500/20 transition-all hover:scale-105"
        >
          <LogIn className="w-4 h-4" />
          <span>본인 인증 로그인하기</span>
        </button>
      </div>
    );
  }

  // 본인 인증 완료 시 표시되는 캘린더 화면
  return (
    <div className="bg-white dark:bg-[#131B2E] rounded-3xl p-5 sm:p-7 shadow-sm border border-slate-200/80 dark:border-slate-800/80 transition-colors duration-300 space-y-6">
      {/* 캘린더 헤더 & 컨트롤 */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-100 dark:border-slate-800">
        <div>
          <h2 className="text-base font-bold text-slate-900 dark:text-white flex items-center gap-2">
            <span className="p-1.5 bg-blue-100 dark:bg-blue-950/60 text-blue-600 dark:text-blue-400 rounded-lg">
              <CalendarDays className="w-4 h-4" />
            </span>
            목표 및 일정 캘린더 (2026 ~ 2030)
          </h2>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
            날짜를 클릭하여 일정을 등록하고 중요도별(빨강·파랑·초록) 테두리로 관리하세요.
          </p>
        </div>

        {/* 연도 & 월 선택 셀렉터 */}
        <div className="flex items-center gap-2 flex-wrap">
          {/* 연도 선택 (2026 ~ 2030) */}
          <select
            value={currentYear}
            onChange={(e) => setCurrentYear(Number(e.target.value))}
            className="text-xs font-bold px-3 py-1.5 bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            {[2026, 2027, 2028, 2029, 2030].map((yr) => (
              <option key={yr} value={yr}>
                {yr}년
              </option>
            ))}
          </select>

          {/* 월 선택 (1월 ~ 12월) */}
          <select
            value={currentMonth}
            onChange={(e) => setCurrentMonth(Number(e.target.value))}
            className="text-xs font-bold px-3 py-1.5 bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            {Array.from({ length: 12 }, (_, i) => (
              <option key={i} value={i}>
                {i + 1}월
              </option>
            ))}
          </select>

          {/* 이전/다음 달 이동 버튼 */}
          <div className="flex items-center border border-slate-200 dark:border-slate-700 rounded-xl overflow-hidden bg-slate-50 dark:bg-slate-800">
            <button
              onClick={handlePrevMonth}
              disabled={currentYear === MIN_YEAR && currentMonth === 0}
              className="p-1.5 hover:bg-slate-200 dark:hover:bg-slate-700 disabled:opacity-30 transition-colors text-slate-600 dark:text-slate-300"
              title="이전 달"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>
            <button
              onClick={handleNextMonth}
              disabled={currentYear === MAX_YEAR && currentMonth === 11}
              className="p-1.5 hover:bg-slate-200 dark:hover:bg-slate-700 disabled:opacity-30 transition-colors text-slate-600 dark:text-slate-300"
              title="다음 달"
            >
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>

          {/* 새 일정 추가 버튼 */}
          <button
            onClick={() =>
              handleDayClick(
                `${currentYear}-${String(currentMonth + 1).padStart(2, '0')}-${String(
                  today.getDate()
                ).padStart(2, '0')}`
              )
            }
            className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-xs font-bold shadow-sm shadow-blue-500/20 transition-all"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>새 일정</span>
          </button>
        </div>
      </div>

      {/* 중요도 테두리 안내 가이드 */}
      <div className="flex items-center gap-4 text-xs font-semibold px-2 py-1 bg-slate-50 dark:bg-slate-900/60 rounded-xl border border-slate-100 dark:border-slate-800 flex-wrap">
        <span className="text-[11px] text-slate-500 dark:text-slate-400">중요도 테두리 구분:</span>
        <span className="inline-flex items-center gap-1.5 text-[11px] px-2 py-0.5 rounded-md border-2 border-red-500 bg-red-50 dark:bg-red-950/40 text-red-800 dark:text-red-300">
          <span className="w-2 h-2 rounded-full bg-red-500"></span>
          빨강 (중요 / 긴급)
        </span>
        <span className="inline-flex items-center gap-1.5 text-[11px] px-2 py-0.5 rounded-md border-2 border-blue-500 bg-blue-50 dark:bg-blue-950/40 text-blue-800 dark:text-blue-300">
          <span className="w-2 h-2 rounded-full bg-blue-500"></span>
          파랑 (주요 / 보통)
        </span>
        <span className="inline-flex items-center gap-1.5 text-[11px] px-2 py-0.5 rounded-md border-2 border-emerald-500 bg-emerald-50 dark:bg-emerald-950/40 text-emerald-800 dark:text-emerald-300">
          <span className="w-2 h-2 rounded-full bg-emerald-500"></span>
          초록 (일반 / 완료)
        </span>
      </div>

      {/* 캘린더 그리드 */}
      <div className="border border-slate-200 dark:border-slate-800 rounded-2xl overflow-hidden shadow-sm">
        {/* 요일 헤더 */}
        <div className="grid grid-cols-7 bg-slate-100/80 dark:bg-slate-800/80 text-center text-xs font-bold py-2 border-b border-slate-200 dark:border-slate-700">
          <span className="text-red-500">일</span>
          <span className="text-slate-700 dark:text-slate-300">월</span>
          <span className="text-slate-700 dark:text-slate-300">화</span>
          <span className="text-slate-700 dark:text-slate-300">수</span>
          <span className="text-slate-700 dark:text-slate-300">목</span>
          <span className="text-slate-700 dark:text-slate-300">금</span>
          <span className="text-blue-500">토</span>
        </div>

        {/* 날짜 셀 그리드 */}
        <div className="grid grid-cols-7 auto-rows-fr bg-slate-200 dark:bg-slate-800 gap-[1px]">
          {/* 이전 달 일자들 */}
          {prevMonthDays.map((d) => (
            <div
              key={`prev-${d}`}
              className="bg-white/40 dark:bg-slate-900/40 min-h-[90px] sm:min-h-[105px] p-1.5 opacity-40 text-slate-400 select-none"
            >
              <span className="text-xs font-medium">{d}</span>
            </div>
          ))}

          {/* 이번 달 일자들 */}
          {currentMonthDays.map((d) => {
            const dateStr = `${currentYear}-${String(currentMonth + 1).padStart(2, '0')}-${String(
              d
            ).padStart(2, '0')}`;
            const isToday =
              today.getFullYear() === currentYear &&
              today.getMonth() === currentMonth &&
              today.getDate() === d;

            const dayOfWeek = new Date(currentYear, currentMonth, d).getDay();
            const dayEvents = events.filter((ev) => ev.date === dateStr);

            return (
              <div
                key={`current-${d}`}
                onClick={() => handleDayClick(dateStr)}
                className={`bg-white dark:bg-[#131B2E] min-h-[90px] sm:min-h-[105px] p-1.5 cursor-pointer hover:bg-blue-50/40 dark:hover:bg-slate-800/60 transition-colors flex flex-col justify-between group relative`}
              >
                <div className="flex items-center justify-between">
                  <span
                    className={`text-xs font-bold w-6 h-6 flex items-center justify-center rounded-full ${
                      isToday
                        ? 'bg-blue-600 text-white shadow-sm'
                        : dayOfWeek === 0
                        ? 'text-red-500'
                        : dayOfWeek === 6
                        ? 'text-blue-500'
                        : 'text-slate-700 dark:text-slate-200'
                    }`}
                  >
                    {d}
                  </span>
                  <span className="opacity-0 group-hover:opacity-100 transition-opacity text-[10px] text-blue-500 font-bold p-0.5">
                    +
                  </span>
                </div>

                {/* 해당 날짜의 일정 칩 표시 */}
                <div className="space-y-1 mt-1 overflow-y-auto max-h-[64px] scrollbar-none">
                  {dayEvents.map((ev) => (
                    <div
                      key={ev.id}
                      onClick={(e) => handleEventClick(e, ev)}
                      className={`text-[10px] font-bold px-1.5 py-0.5 rounded-md truncate transition-transform hover:scale-[1.02] shadow-sm ${getPriorityStyle(
                        ev.priority
                      )}`}
                      title={`${ev.title}${ev.description ? ` - ${ev.description}` : ''}`}
                    >
                      {ev.title}
                    </div>
                  ))}
                </div>
              </div>
            );
          })}

          {/* 다음 달 일자들 */}
          {nextMonthDays.map((d) => (
            <div
              key={`next-${d}`}
              className="bg-white/40 dark:bg-slate-900/40 min-h-[90px] sm:min-h-[105px] p-1.5 opacity-40 text-slate-400 select-none"
            >
              <span className="text-xs font-medium">{d}</span>
            </div>
          ))}
        </div>
      </div>

      {/* 이번 달 등록된 일정 리스트 요약 */}
      <div className="pt-2">
        <div className="flex items-center justify-between mb-3">
          <h3 className="text-xs font-bold text-slate-800 dark:text-slate-200 flex items-center gap-1.5">
            <Clock className="w-3.5 h-3.5 text-blue-500" />
            <span>
              {currentYear}년 {currentMonth + 1}월 일정 목록 ({thisMonthEvents.length}개)
            </span>
          </h3>
        </div>

        {thisMonthEvents.length === 0 ? (
          <div className="p-4 text-center text-xs text-slate-400 dark:text-slate-500 bg-slate-50/60 dark:bg-slate-900/40 rounded-2xl border border-dashed border-slate-200 dark:border-slate-800">
            이번 달에 등록된 일정이 없습니다. 달력의 날짜 칸을 클릭하여 새 일정을 추가해 보세요!
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
            {thisMonthEvents.map((ev) => (
              <div
                key={ev.id}
                onClick={(e) => handleEventClick(e, ev)}
                className={`p-3 rounded-2xl cursor-pointer hover:shadow transition-all flex items-start justify-between gap-2 ${getPriorityStyle(
                  ev.priority
                )}`}
              >
                <div className="min-w-0">
                  <div className="flex items-center gap-2">
                    <span className="text-[10px] font-black opacity-80">{ev.date}</span>
                    <span className="text-xs font-bold truncate">{ev.title}</span>
                  </div>
                  {ev.description && (
                    <p className="text-[11px] opacity-80 mt-1 line-clamp-2 leading-relaxed">
                      {ev.description}
                    </p>
                  )}
                </div>
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    handleDeleteEvent(ev.id);
                  }}
                  className="text-slate-400 hover:text-red-600 p-1 rounded-lg transition-colors shrink-0"
                  title="일정 삭제"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* 일정 추가 / 수정 모달 */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fadeIn">
          <div className="relative w-full max-w-sm bg-white dark:bg-[#131B2E] rounded-3xl p-6 shadow-2xl border border-slate-200 dark:border-slate-700">
            <button
              onClick={() => setIsModalOpen(false)}
              className="absolute top-4 right-4 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 p-1 rounded-xl hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>

            <h3 className="text-base font-bold text-slate-900 dark:text-white mb-4 flex items-center gap-2">
              <CalendarIcon className="w-4 h-4 text-blue-500" />
              <span>{editingEventId ? '일정 수정' : '새 일정 등록'}</span>
            </h3>

            <form onSubmit={handleSaveEvent} className="space-y-3.5">
              {/* 날짜 선택 */}
              <div>
                <label className="block text-[11px] font-bold text-slate-600 dark:text-slate-300 mb-1">
                  날짜 (2026 ~ 2030)
                </label>
                <input
                  type="date"
                  required
                  min="2026-01-01"
                  max="2030-12-31"
                  value={formDate}
                  onChange={(e) => setFormDate(e.target.value)}
                  className="w-full text-xs px-3 py-2 rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              {/* 일정 제목 */}
              <div>
                <label className="block text-[11px] font-bold text-slate-600 dark:text-slate-300 mb-1">
                  일정 제목
                </label>
                <input
                  type="text"
                  required
                  placeholder="예: 데이터 분석 자격증 시험, 프로젝트 발표 등"
                  value={formTitle}
                  onChange={(e) => setFormTitle(e.target.value)}
                  className="w-full text-xs px-3 py-2 rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              {/* 일정 세부 내용 (선택) */}
              <div>
                <label className="block text-[11px] font-bold text-slate-600 dark:text-slate-300 mb-1">
                  세부 내용 (선택)
                </label>
                <textarea
                  rows={2}
                  placeholder="목표 및 세부 계획 작성"
                  value={formDesc}
                  onChange={(e) => setFormDesc(e.target.value)}
                  className="w-full text-xs px-3 py-2 rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
                />
              </div>

              {/* 중요도 테두리 선택 (빨강, 파랑, 초록) */}
              <div>
                <label className="block text-[11px] font-bold text-slate-600 dark:text-slate-300 mb-1.5">
                  중요도 테두리 색상 선택
                </label>
                <div className="grid grid-cols-3 gap-2">
                  <button
                    type="button"
                    onClick={() => setFormPriority('red')}
                    className={`py-2 px-2 rounded-xl text-[11px] font-bold border-2 transition-all flex items-center justify-center gap-1.5 ${
                      formPriority === 'red'
                        ? 'border-red-500 bg-red-50 text-red-700 dark:bg-red-950/60 dark:text-red-300 shadow-sm ring-1 ring-red-400'
                        : 'border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-400 hover:bg-slate-50'
                    }`}
                  >
                    <span className="w-2.5 h-2.5 rounded-full bg-red-500"></span>
                    <span>빨강 (중요)</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => setFormPriority('blue')}
                    className={`py-2 px-2 rounded-xl text-[11px] font-bold border-2 transition-all flex items-center justify-center gap-1.5 ${
                      formPriority === 'blue'
                        ? 'border-blue-500 bg-blue-50 text-blue-700 dark:bg-blue-950/60 dark:text-blue-300 shadow-sm ring-1 ring-blue-400'
                        : 'border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-400 hover:bg-slate-50'
                    }`}
                  >
                    <span className="w-2.5 h-2.5 rounded-full bg-blue-500"></span>
                    <span>파랑 (보통)</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => setFormPriority('green')}
                    className={`py-2 px-2 rounded-xl text-[11px] font-bold border-2 transition-all flex items-center justify-center gap-1.5 ${
                      formPriority === 'green'
                        ? 'border-emerald-500 bg-emerald-50 text-emerald-700 dark:bg-emerald-950/60 dark:text-emerald-300 shadow-sm ring-1 ring-emerald-400'
                        : 'border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-400 hover:bg-slate-50'
                    }`}
                  >
                    <span className="w-2.5 h-2.5 rounded-full bg-emerald-500"></span>
                    <span>초록 (여유)</span>
                  </button>
                </div>
              </div>

              {/* 버튼 그룹 */}
              <div className="flex items-center gap-2 pt-2">
                {editingEventId && (
                  <button
                    type="button"
                    onClick={() => handleDeleteEvent(editingEventId)}
                    className="p-2.5 bg-red-50 hover:bg-red-100 dark:bg-red-950/40 dark:hover:bg-red-950/80 text-red-600 rounded-xl transition-colors"
                    title="일정 삭제"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                )}
                <button
                  type="submit"
                  className="flex-1 py-2.5 bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs rounded-xl shadow-md shadow-blue-500/20 transition-all"
                >
                  {editingEventId ? '일정 수정 완료' : '일정 저장'}
                </button>
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="py-2.5 px-3.5 bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-600 dark:text-slate-300 font-bold text-xs rounded-xl transition-colors"
                >
                  취소
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
