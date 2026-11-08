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
  GripVertical,
  CalendarDays,
  Sparkles,
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

export interface PoolItem {
  id: string;
  title: string;
  description?: string;
  priority: PriorityColor;
}

interface ScheduleCalendarProps {
  onOpenAuth: () => void;
}

const STORAGE_EVENTS_KEY = 'profile_owner_schedules';
const STORAGE_POOL_KEY = 'profile_owner_pool_items';

const INITIAL_SAMPLE_EVENTS: ScheduleEvent[] = [
  {
    id: 'sample-1',
    date: '2026-11-03',
    title: '캠코 AI 면접 마무리',
    description: '공모전 및 서포터즈 성과 정리',
    priority: 'red',
    createdAt: Date.now() - 5000000,
  },
  {
    id: 'sample-2',
    date: '2026-11-15',
    title: '데이터 분석 프로젝트 기획',
    description: '신규 분석 파이프라인 설계',
    priority: 'blue',
    createdAt: Date.now() - 3000000,
  },
];

const INITIAL_POOL_ITEMS: PoolItem[] = [
  {
    id: 'pool-1',
    title: '캠코 AI 면접 마무리',
    description: '공모전 및 서포터즈 성과 정리',
    priority: 'red',
  },
  {
    id: 'pool-2',
    title: '데이터 분석 프로젝트 기획',
    description: '신규 분석 파이프라인 설계',
    priority: 'blue',
  },
  {
    id: 'pool-3',
    title: 'ADsP 자격증 복습',
    description: '데이터 모델링 및 분석 기법 정리',
    priority: 'green',
  },
  {
    id: 'pool-4',
    title: '포트폴리오 업데이트',
    description: '신규 프로젝트 추가 및 배포',
    priority: 'blue',
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

  // 달력 일정 목록 상태
  const [events, setEvents] = useState<ScheduleEvent[]>(() => {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem(STORAGE_EVENTS_KEY);
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

  // 하단 드래그용 "목록" 풀 아이템 상태
  const [poolItems, setPoolItems] = useState<PoolItem[]>(() => {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem(STORAGE_POOL_KEY);
      if (saved) {
        try {
          return JSON.parse(saved);
        } catch {
          return INITIAL_POOL_ITEMS;
        }
      }
    }
    return INITIAL_POOL_ITEMS;
  });

  // 드래그 중인 날짜 셀 하이라이트 상태
  const [dragOverDate, setDragOverDate] = useState<string | null>(null);

  // 일정 추가/수정 모달 상태
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingEventId, setEditingEventId] = useState<string | null>(null);
  const [formDate, setFormDate] = useState<string>('');
  const [formTitle, setFormTitle] = useState<string>('');
  const [formDesc, setFormDesc] = useState<string>('');
  const [formPriority, setFormPriority] = useState<PriorityColor>('red');

  // 목록에 새 항목 등록 모달 상태
  const [isPoolModalOpen, setIsPoolModalOpen] = useState(false);
  const [newPoolTitle, setNewPoolTitle] = useState('');
  const [newPoolDesc, setNewPoolDesc] = useState('');
  const [newPoolPriority, setNewPoolPriority] = useState<PriorityColor>('red');

  // 변경 시 localStorage 저장
  useEffect(() => {
    localStorage.setItem(STORAGE_EVENTS_KEY, JSON.stringify(events));
  }, [events]);

  useEffect(() => {
    localStorage.setItem(STORAGE_POOL_KEY, JSON.stringify(poolItems));
  }, [poolItems]);

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

  // 달력 일정 저장 (새 등록 또는 수정)
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

      // 목록에도 중복되지 않으면 자동 추가
      setPoolItems((prev) => {
        if (prev.some((p) => p.title === newEvent.title)) return prev;
        return [
          {
            id: 'pool_' + Date.now(),
            title: newEvent.title,
            description: newEvent.description,
            priority: newEvent.priority,
          },
          ...prev,
        ];
      });
    }
    setIsModalOpen(false);
  };

  // 달력 일정 삭제
  const handleDeleteEvent = (id: string) => {
    if (window.confirm('이 일정을 삭제하시겠습니까?')) {
      setEvents((prev) => prev.filter((ev) => ev.id !== id));
      setIsModalOpen(false);
    }
  };

  // 목록에 새 항목 등록
  const handleAddPoolItem = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newPoolTitle.trim()) return;

    const newItem: PoolItem = {
      id: 'pool_' + Date.now() + '_' + Math.random().toString(36).substring(2, 6),
      title: newPoolTitle.trim(),
      description: newPoolDesc.trim(),
      priority: newPoolPriority,
    };
    setPoolItems((prev) => [newItem, ...prev]);
    setNewPoolTitle('');
    setNewPoolDesc('');
    setNewPoolPriority('red');
    setIsPoolModalOpen(false);
  };

  // 목록에서 항목 삭제
  const handleDeletePoolItem = (id: string) => {
    setPoolItems((prev) => prev.filter((item) => item.id !== id));
  };

  // 드래그 시작 핸들러 (목록 항목)
  const handleDragStart = (e: React.DragEvent, item: { title: string; description?: string; priority: PriorityColor }) => {
    e.dataTransfer.setData(
      'application/json',
      JSON.stringify({
        title: item.title,
        description: item.description || '',
        priority: item.priority,
      })
    );
    e.dataTransfer.effectAllowed = 'copy';
  };

  // 날짜 셀 드롭 핸들러 (달력에 중복 추가 가능!)
  const handleDropOnDate = (e: React.DragEvent, targetDate: string) => {
    e.preventDefault();
    setDragOverDate(null);

    try {
      const data = e.dataTransfer.getData('application/json');
      if (data) {
        const parsed = JSON.parse(data);
        if (parsed.title) {
          const newEvent: ScheduleEvent = {
            id: 'event_' + Date.now() + '_' + Math.random().toString(36).substring(2, 6),
            date: targetDate,
            title: parsed.title,
            description: parsed.description || '',
            priority: parsed.priority || 'blue',
            createdAt: Date.now(),
          };
          setEvents((prev) => [...prev, newEvent]);
        }
      }
    } catch (err) {
      console.error('Drop error:', err);
    }
  };

  // 달력 날짜 계산
  const firstDayOfMonth = new Date(currentYear, currentMonth, 1).getDay(); // 0 (일) ~ 6 (토)
  const daysInMonth = new Date(currentYear, currentMonth + 1, 0).getDate();

  // 이전 달 일자들
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

  // 다음 달 일자들
  const totalCells = Math.ceil((firstDayOfMonth + daysInMonth) / 7) * 7;
  const nextMonthDaysCount = totalCells - (firstDayOfMonth + daysInMonth);
  const nextMonthDays = [];
  for (let i = 1; i <= nextMonthDaysCount; i++) {
    nextMonthDays.push(i);
  }

  // 중요도 테두리 스타일
  const getPriorityStyle = (priority: PriorityColor) => {
    switch (priority) {
      case 'red':
        return 'border-2 border-red-500 bg-red-50/90 text-red-900 dark:bg-red-950/50 dark:border-red-500 dark:text-red-200';
      case 'blue':
        return 'border-2 border-blue-500 bg-blue-50/90 text-blue-900 dark:bg-blue-950/50 dark:border-blue-500 dark:text-blue-200';
      case 'green':
        return 'border-2 border-emerald-500 bg-emerald-50/90 text-emerald-900 dark:bg-emerald-950/50 dark:border-emerald-500 dark:text-emerald-200';
      default:
        return 'border-2 border-slate-400 bg-slate-50 text-slate-800';
    }
  };

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
          개인 일정은 보호를 위해{' '}
          <strong className="text-blue-600 dark:text-blue-400">최우혁 본인 계정</strong>으로 인증 후 열람 및 관리할 수 있습니다.
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

  return (
    <div className="bg-white dark:bg-[#131B2E] rounded-3xl p-5 sm:p-7 shadow-sm border border-slate-200/80 dark:border-slate-800/80 transition-colors duration-300 space-y-5">
      {/* 캘린더 헤더 & 컨트롤 */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-3 border-b border-slate-100 dark:border-slate-800">
        <div>
          <h2 className="text-base font-bold text-slate-900 dark:text-white flex items-center gap-2">
            <span className="p-1.5 bg-blue-100 dark:bg-blue-950/60 text-blue-600 dark:text-blue-400 rounded-lg">
              <CalendarDays className="w-4 h-4" />
            </span>
            일정
          </h2>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
            날짜 클릭 또는 아래 목록에서 일정을 드래그하여 달력에 배치하세요.
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

          {/* 새 일정 직접 추가 버튼 */}
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

        {/* 날짜 셀 그리드 (드롭 타겟) */}
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

          {/* 이번 달 일자들 (드래그 앤 드롭 지원) */}
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
            const isHovered = dragOverDate === dateStr;

            return (
              <div
                key={`current-${d}`}
                onClick={() => handleDayClick(dateStr)}
                onDragOver={(e) => {
                  e.preventDefault();
                  e.dataTransfer.dropEffect = 'copy';
                }}
                onDragEnter={() => setDragOverDate(dateStr)}
                onDragLeave={(e) => {
                  if (e.currentTarget.contains(e.relatedTarget as Node)) return;
                  setDragOverDate(null);
                }}
                onDrop={(e) => handleDropOnDate(e, dateStr)}
                className={`min-h-[90px] sm:min-h-[105px] p-1.5 cursor-pointer transition-all flex flex-col justify-between group relative ${
                  isHovered
                    ? 'bg-blue-100 dark:bg-blue-950/80 ring-2 ring-blue-500 z-10 scale-[1.02]'
                    : 'bg-white dark:bg-[#131B2E] hover:bg-blue-50/40 dark:hover:bg-slate-800/60'
                }`}
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
                  {isHovered ? (
                    <span className="text-[10px] text-blue-600 dark:text-blue-400 font-bold animate-pulse">
                      드롭 추가
                    </span>
                  ) : (
                    <span className="opacity-0 group-hover:opacity-100 transition-opacity text-[10px] text-blue-500 font-bold p-0.5">
                      +
                    </span>
                  )}
                </div>

                {/* 해당 날짜의 일정 칩 표시 (클릭 수정 & 달력 간 드래그도 지원) */}
                <div className="space-y-1 mt-1 overflow-y-auto max-h-[64px] scrollbar-none">
                  {dayEvents.map((ev) => (
                    <div
                      key={ev.id}
                      draggable
                      onDragStart={(e) => handleDragStart(e, ev)}
                      onClick={(e) => handleEventClick(e, ev)}
                      className={`text-[10px] font-bold px-1.5 py-0.5 rounded-md truncate transition-transform hover:scale-[1.02] shadow-sm cursor-grab active:cursor-grabbing ${getPriorityStyle(
                        ev.priority
                      )}`}
                      title={`${ev.title}${ev.description ? ` - ${ev.description}` : ''} (클릭하여 수정 / 드래그하여 다른 날짜 복사)`}
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

      {/* 하단: "목록" 섹션 (드래그하여 달력으로 복사/중복 추가 가능) */}
      <div className="pt-2">
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-2">
            <h3 className="text-sm font-bold text-slate-900 dark:text-white flex items-center gap-1.5">
              <span>목록</span>
            </h3>
            <span className="text-[11px] text-slate-500 dark:text-slate-400">
              (항목을 마우스로 잡고 달력 날짜 칸으로 드래그하면 원하는 날짜에 중복 추가됩니다)
            </span>
          </div>

          <button
            onClick={() => setIsPoolModalOpen(true)}
            className="inline-flex items-center gap-1 px-2.5 py-1 text-xs font-bold text-blue-600 dark:text-blue-400 bg-blue-50 dark:bg-blue-950/60 hover:bg-blue-100 dark:hover:bg-blue-900/60 rounded-xl transition-colors border border-blue-200/60 dark:border-blue-800/60"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>목록 추가</span>
          </button>
        </div>

        {poolItems.length === 0 ? (
          <div className="p-4 text-center text-xs text-slate-400 dark:text-slate-500 bg-slate-50/60 dark:bg-slate-900/40 rounded-2xl border border-dashed border-slate-200 dark:border-slate-800">
            목록이 비어 있습니다. [목록 추가] 버튼을 눌러 자주 쓰는 일정을 등록해보세요!
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-2.5">
            {poolItems.map((item) => (
              <div
                key={item.id}
                draggable
                onDragStart={(e) => handleDragStart(e, item)}
                className={`p-3 rounded-2xl cursor-grab active:cursor-grabbing hover:shadow-md transition-all flex items-center justify-between gap-2.5 select-none ${getPriorityStyle(
                  item.priority
                )}`}
                title="마우스로 드래그하여 달력의 날짜 칸에 놓으세요!"
              >
                <div className="flex items-center gap-2 min-w-0 flex-1">
                  <GripVertical className="w-4 h-4 opacity-40 shrink-0" />
                  <div className="min-w-0">
                    <div className="text-xs font-bold truncate">{item.title}</div>
                    {item.description && (
                      <div className="text-[10px] opacity-75 truncate mt-0.5">
                        {item.description}
                      </div>
                    )}
                  </div>
                </div>

                <div className="flex items-center gap-1 shrink-0">
                  <span className="text-[9px] px-1.5 py-0.5 rounded bg-black/5 dark:bg-white/10 font-bold opacity-70">
                    드래그
                  </span>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      handleDeletePoolItem(item.id);
                    }}
                    className="p-1 hover:text-red-600 opacity-60 hover:opacity-100 transition-opacity"
                    title="목록에서 삭제"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* 일정 추가 / 수정 모달 (날짜 직접 클릭 시) */}
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

              {/* 세부 내용 (선택) */}
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

              {/* 중요도 테두리 선택 */}
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
                    <span>빨강</span>
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
                    <span>파랑</span>
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
                    <span>초록</span>
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
                  {editingEventId ? '수정 완료' : '일정 저장'}
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

      {/* 목록에 새 항목 등록 모달 */}
      {isPoolModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fadeIn">
          <div className="relative w-full max-w-sm bg-white dark:bg-[#131B2E] rounded-3xl p-6 shadow-2xl border border-slate-200 dark:border-slate-700">
            <button
              onClick={() => setIsPoolModalOpen(false)}
              className="absolute top-4 right-4 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 p-1 rounded-xl hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>

            <h3 className="text-base font-bold text-slate-900 dark:text-white mb-4 flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-blue-500" />
              <span>목록에 새 일정 추가</span>
            </h3>

            <p className="text-xs text-slate-500 dark:text-slate-400 mb-3.5">
              등록된 항목은 아래 목록에 보관되며, 언제든 마우스로 끌어서 달력의 원하는 날짜들에 복사할 수 있습니다.
            </p>

            <form onSubmit={handleAddPoolItem} className="space-y-3.5">
              <div>
                <label className="block text-[11px] font-bold text-slate-600 dark:text-slate-300 mb-1">
                  일정 제목
                </label>
                <input
                  type="text"
                  required
                  placeholder="예: 코딩 테스트, 프로젝트 마감, 운동 등"
                  value={newPoolTitle}
                  onChange={(e) => setNewPoolTitle(e.target.value)}
                  className="w-full text-xs px-3 py-2 rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div>
                <label className="block text-[11px] font-bold text-slate-600 dark:text-slate-300 mb-1">
                  세부 메모 (선택)
                </label>
                <input
                  type="text"
                  placeholder="간단한 메모 입력"
                  value={newPoolDesc}
                  onChange={(e) => setNewPoolDesc(e.target.value)}
                  className="w-full text-xs px-3 py-2 rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div>
                <label className="block text-[11px] font-bold text-slate-600 dark:text-slate-300 mb-1.5">
                  중요도 테두리 색상
                </label>
                <div className="grid grid-cols-3 gap-2">
                  <button
                    type="button"
                    onClick={() => setNewPoolPriority('red')}
                    className={`py-2 px-2 rounded-xl text-[11px] font-bold border-2 transition-all flex items-center justify-center gap-1.5 ${
                      newPoolPriority === 'red'
                        ? 'border-red-500 bg-red-50 text-red-700 dark:bg-red-950/60 dark:text-red-300 shadow-sm ring-1 ring-red-400'
                        : 'border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-400 hover:bg-slate-50'
                    }`}
                  >
                    <span className="w-2.5 h-2.5 rounded-full bg-red-500"></span>
                    <span>빨강</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => setNewPoolPriority('blue')}
                    className={`py-2 px-2 rounded-xl text-[11px] font-bold border-2 transition-all flex items-center justify-center gap-1.5 ${
                      newPoolPriority === 'blue'
                        ? 'border-blue-500 bg-blue-50 text-blue-700 dark:bg-blue-950/60 dark:text-blue-300 shadow-sm ring-1 ring-blue-400'
                        : 'border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-400 hover:bg-slate-50'
                    }`}
                  >
                    <span className="w-2.5 h-2.5 rounded-full bg-blue-500"></span>
                    <span>파랑</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => setNewPoolPriority('green')}
                    className={`py-2 px-2 rounded-xl text-[11px] font-bold border-2 transition-all flex items-center justify-center gap-1.5 ${
                      newPoolPriority === 'green'
                        ? 'border-emerald-500 bg-emerald-50 text-emerald-700 dark:bg-emerald-950/60 dark:text-emerald-300 shadow-sm ring-1 ring-emerald-400'
                        : 'border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-400 hover:bg-slate-50'
                    }`}
                  >
                    <span className="w-2.5 h-2.5 rounded-full bg-emerald-500"></span>
                    <span>초록</span>
                  </button>
                </div>
              </div>

              <div className="flex items-center gap-2 pt-2">
                <button
                  type="submit"
                  className="flex-1 py-2.5 bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs rounded-xl shadow-md shadow-blue-500/20 transition-all"
                >
                  목록에 등록
                </button>
                <button
                  type="button"
                  onClick={() => setIsPoolModalOpen(false)}
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
