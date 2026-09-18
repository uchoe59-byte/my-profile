import React, { useState } from 'react';
import {
  Sparkles,
  Trophy,
  CheckCircle2,
  Youtube,
  Play,
  Info,
  ExternalLink,
  Award,
  TrendingUp,
  Video,
} from 'lucide-react';

export const Timeline: React.FC = () => {
  const [isPlayingVideo, setIsPlayingVideo] = useState(false);

  return (
    <div className="bg-white dark:bg-[#131B2E] rounded-3xl p-6 sm:p-7 shadow-sm border border-slate-200/80 dark:border-slate-800/80 transition-colors duration-300">
      <div className="flex items-center justify-between mb-6 pb-4 border-b border-slate-100 dark:border-slate-800">
        <div>
          <h2 className="text-base font-bold text-slate-900 dark:text-white flex items-center gap-2">
            <span className="p-1.5 bg-blue-100 dark:bg-blue-950/60 text-blue-600 dark:text-blue-400 rounded-lg">
              <Sparkles className="w-4 h-4" />
            </span>
            경험 및 활동 타임라인 (Experience &amp; Projects)
          </h2>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
            데이터 분석 및 AI 콘텐츠 기획 기반의 실전 프로젝트
          </p>
        </div>
        <span className="text-xs font-semibold text-slate-400 dark:text-slate-500">Total 3 Experiences</span>
      </div>

      <div className="space-y-7 relative before:absolute before:inset-0 before:left-4 before:w-0.5 before:bg-slate-200 dark:before:bg-slate-700">
        {/* 경험 1: 캠코 AI 활용 국유재산 공모전 대상 (2026.07) */}
        <div className="relative flex items-start gap-4">
          <div className="w-8 h-8 rounded-full bg-amber-500 text-white flex items-center justify-center font-bold text-xs ring-4 ring-white dark:ring-slate-900 shadow-md shadow-amber-500/20 shrink-0 z-10">
            <Trophy className="w-4 h-4" />
          </div>

          <div className="flex-1 bg-gradient-to-br from-amber-50/40 via-white to-slate-50 dark:from-amber-950/20 dark:via-[#131B2E] dark:to-slate-900/60 p-5 rounded-2xl border border-amber-200/70 dark:border-amber-900/40 shadow-sm">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1 mb-2">
              <div className="flex items-center gap-2 flex-wrap">
                <span className="px-2 py-0.5 text-[10px] font-black bg-amber-500 text-white rounded-md">
                  대상 수상 (1위)
                </span>
                <h3 className="font-bold text-slate-900 dark:text-white text-sm">
                  캠코 AI 활용 국유재산 공모전 - 나라 On 홍보 콘텐츠 총괄 기획
                </h3>
              </div>
              <span className="text-xs text-amber-700 dark:text-amber-300 font-bold bg-amber-100/70 dark:bg-amber-950/60 px-2.5 py-0.5 rounded-full border border-amber-200/50 dark:border-amber-800/50 self-start sm:self-auto">
                2026.07
              </span>
            </div>

            <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed mb-3">
              캠코 AI 활용 국유재산 공모전에 <b>개인 참가자</b>로 참가하여{' '}
              <b>&lt;On하다: 잠들어있던 가치의 재발견&gt;</b>을 주제로 생성형 AI 기술을 전 과정에 융합한 영상 콘텐츠를
              기획 및 제작하였습니다.
            </p>

            <div className="bg-white/90 dark:bg-slate-800/70 p-3.5 rounded-xl border border-slate-100 dark:border-slate-700/60 space-y-2 text-xs text-slate-700 dark:text-slate-200 mb-3">
              <div className="flex items-start gap-2">
                <CheckCircle2 className="w-3.5 h-3.5 text-amber-500 shrink-0 mt-0.5" />
                <span>
                  <b>생성형 AI 파이프라인 설계</b>: AI 기반 스토리보드 기획, 비주얼 에셋 생성 및 편집 툴을 결합하여
                  1인 제작의 한계를 극복하고 높은 완성도 구현
                </span>
              </div>
              <div className="flex items-start gap-2">
                <CheckCircle2 className="w-3.5 h-3.5 text-amber-500 shrink-0 mt-0.5" />
                <span>
                  <b>공공 데이터 및 정책 가치 재해석</b>: 국유재산 활용 데이터를 시각화하고 대중의 공감을 이끌어내는
                  스토리텔링 구조화
                </span>
              </div>
              <div className="flex items-start gap-2">
                <CheckCircle2 className="w-3.5 h-3.5 text-amber-500 shrink-0 mt-0.5" />
                <span>
                  <b>대상 수상 (1위)</b>: 기술 적용의 참신성과 기획의 완성도를 인정받아 공모전 대상(1위) 수상
                </span>
              </div>
            </div>

            {/* 유튜브 영상 인터랙티브 플레이어 / 프리뷰 카드 */}
            <div className="my-3.5 rounded-2xl overflow-hidden border border-slate-200 dark:border-slate-700 bg-slate-950 shadow-sm group hover:border-red-500/60 dark:hover:border-red-500/60 transition-all duration-300">
              <div className="relative w-full aspect-video bg-slate-900 overflow-hidden">
                {isPlayingVideo ? (
                  <iframe
                    className="w-full h-full"
                    src="https://www.youtube.com/embed/u0VUVDvghoE?autoplay=1&rel=0"
                    title="YouTube video player"
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                    allowFullScreen
                  />
                ) : (
                  <div
                    onClick={() => setIsPlayingVideo(true)}
                    className="relative w-full h-full cursor-pointer group"
                  >
                    <img
                      src="https://img.youtube.com/vi/u0VUVDvghoE/maxresdefault.jpg"
                      onError={(e) => {
                        (e.target as HTMLImageElement).src =
                          'https://img.youtube.com/vi/u0VUVDvghoE/hqdefault.jpg';
                      }}
                      alt="대상 수상작 영상 썸네일"
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300 opacity-90"
                    />

                    <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/30 to-black/20 flex flex-col justify-between p-3.5 sm:p-4 z-10">
                      <div className="flex items-center justify-between">
                        <span className="px-2.5 py-1 bg-amber-500 text-slate-950 text-[10px] font-black rounded-lg shadow-sm flex items-center gap-1">
                          🏆 대상 수상작 영상
                        </span>
                        <span className="px-2.5 py-1 bg-red-600/90 hover:bg-red-600 text-white text-[11px] font-bold rounded-lg flex items-center gap-1.5 shadow-md transition-colors">
                          <Youtube className="w-3.5 h-3.5 fill-white" />
                          바로 재생
                        </span>
                      </div>
                      <div>
                        <h4 className="text-xs sm:text-sm font-bold text-white group-hover:text-amber-300 transition-colors">
                          &lt;On하다: 잠들어있던 가치의 재발견&gt; 국유재산 홍보 영상
                        </h4>
                        <p className="text-[11px] text-slate-300 mt-0.5">캠코 AI 활용 국유재산 공모전 대상작</p>
                      </div>
                    </div>

                    <div className="absolute inset-0 flex items-center justify-center z-20 pointer-events-none">
                      <div className="w-12 h-12 sm:w-14 sm:h-14 rounded-full bg-red-600 text-white flex items-center justify-center shadow-2xl group-hover:scale-110 group-hover:bg-red-500 transition-all duration-200">
                        <Play className="w-6 h-6 fill-white ml-0.5" />
                      </div>
                    </div>
                  </div>
                )}
              </div>

              {/* 하단 안내 바 */}
              <div className="px-4 py-2.5 bg-slate-900 border-t border-slate-800 flex items-center justify-between text-[11px] text-slate-300">
                <span className="flex items-center gap-1.5 text-slate-400">
                  <Info className="w-3.5 h-3.5 text-blue-400" />
                  <span>화면 클릭 시 영상이 재생되며 공식 채널에서도 시청 가능합니다</span>
                </span>
                <a
                  href="https://www.youtube.com/watch?v=u0VUVDvghoE"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="font-bold text-red-400 hover:text-red-300 flex items-center gap-1 transition-colors"
                >
                  <span>YouTube에서 열기</span>
                  <ExternalLink className="w-3 h-3" />
                </a>
              </div>
            </div>

            <div className="flex flex-wrap gap-1.5">
              <span className="px-2 py-0.5 text-[10px] font-medium bg-amber-100/60 dark:bg-amber-950/60 text-amber-800 dark:text-amber-300 rounded border border-amber-200/50 dark:border-amber-800/40">
                #공모전대상
              </span>
              <span className="px-2 py-0.5 text-[10px] font-medium bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 rounded">
                #생성형AI응용
              </span>
              <span className="px-2 py-0.5 text-[10px] font-medium bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 rounded">
                #AI콘텐츠기획
              </span>
              <span className="px-2 py-0.5 text-[10px] font-medium bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 rounded">
                #창의적문제해결
              </span>
              <span className="px-2 py-0.5 text-[10px] font-medium bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 rounded">
                #추진력
              </span>
            </div>
          </div>
        </div>

        {/* 경험 2: 캠코터즈 홍보 영상 제작 (2026.09) */}
        <div className="relative flex items-start gap-4">
          <div className="w-8 h-8 rounded-full bg-blue-600 text-white flex items-center justify-center font-bold text-xs ring-4 ring-white dark:ring-slate-900 shadow-md shadow-blue-500/20 shrink-0 z-10">
            <Video className="w-4 h-4" />
          </div>

          <div className="flex-1 bg-gradient-to-br from-blue-50/40 via-white to-slate-50 dark:from-blue-950/20 dark:via-[#131B2E] dark:to-slate-900/60 p-5 rounded-2xl border border-blue-200/80 dark:border-blue-900/40 shadow-sm">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1 mb-2">
              <div className="flex items-center gap-2 flex-wrap">
                <span className="px-2 py-0.5 text-[10px] font-bold bg-blue-600 text-white rounded-md">
                  4개월 연속 최우수
                </span>
                <h3 className="font-bold text-slate-900 dark:text-white text-sm">
                  캠코터즈 - 한국자산관리공사(캠코) 공식 홍보 영상 기획 및 제작
                </h3>
              </div>
              <span className="text-xs text-blue-600 dark:text-blue-400 font-semibold bg-blue-50 dark:bg-blue-950/60 px-2.5 py-0.5 rounded-full border border-blue-100 dark:border-blue-900/60 self-start sm:self-auto">
                2026.09
              </span>
            </div>

            <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed mb-3">
              한국자산관리공사 공식 서포터즈인 <b>캠코터즈</b>로 활동하며 캠코의 주요 사업 및 자영업자 지원 정책
              데이터를 분석하고, 직관적인 영상 콘텐츠로 기획 및 제작하였습니다.
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 my-3">
              <div className="p-2.5 bg-blue-50/80 dark:bg-blue-950/40 rounded-xl border border-blue-100 dark:border-blue-900/40 flex items-center gap-2.5">
                <div className="p-1.5 bg-blue-600 text-white rounded-lg">
                  <Award className="w-4 h-4" />
                </div>
                <div>
                  <div className="text-[10px] text-blue-600 dark:text-blue-400 font-semibold">성과 지표 1</div>
                  <div className="text-xs font-bold text-slate-900 dark:text-white">4개월 연속 &apos;최우수 영상&apos; 선정</div>
                </div>
              </div>
              <div className="p-2.5 bg-red-50/80 dark:bg-red-950/40 rounded-xl border border-red-100 dark:border-red-900/40 flex items-center gap-2.5">
                <div className="p-1.5 bg-red-600 text-white rounded-lg">
                  <Youtube className="w-4 h-4" />
                </div>
                <div>
                  <div className="text-[10px] text-red-600 dark:text-red-400 font-semibold">성과 지표 2</div>
                  <div className="text-xs font-bold text-slate-900 dark:text-white">제작 4편 전작 공식 유튜브 게시</div>
                </div>
              </div>
            </div>

            <div className="bg-white/90 dark:bg-slate-800/70 p-3.5 rounded-xl border border-slate-100 dark:border-slate-700/60 space-y-2 text-xs text-slate-700 dark:text-slate-200 mb-3">
              <div className="flex items-start gap-2">
                <CheckCircle2 className="w-3.5 h-3.5 text-blue-500 shrink-0 mt-0.5" />
                <span>
                  <b>활동 기간 4개월 연속 최우수 영상 지정</b>: 매월 기획력, 스토리텔링 및 영상 완성도를 인정받아
                  4회 연속 최우수 콘텐츠로 선정
                </span>
              </div>
              <div className="flex items-start gap-2">
                <CheckCircle2 className="w-3.5 h-3.5 text-blue-500 shrink-0 mt-0.5" />
                <span>
                  <b>제작한 4작의 영상 전체 캠코 공식 유튜브 채널 업로드</b>: 서포터즈 제작물 중 대외 활용 가치를
                  인정받아 제작한 4편 모두 한국자산관리공사 공식 유튜브 채널에 정식 게시
                </span>
              </div>
              <div className="flex items-start gap-2">
                <CheckCircle2 className="w-3.5 h-3.5 text-blue-500 shrink-0 mt-0.5" />
                <span>
                  <b>복잡한 정책 정보의 구조화</b>: 코로나 시기 소상공인·자영업자 지원 정책 데이터를 대중의 눈높이에
                  맞춰 직관적인 스토리와 영상으로 시각화
                </span>
              </div>
            </div>

            <div className="flex flex-wrap gap-1.5">
              <span className="px-2 py-0.5 text-[10px] font-medium bg-blue-100 dark:bg-blue-950/60 text-blue-800 dark:text-blue-300 rounded border border-blue-200/50 dark:border-blue-900/40">
                #4개월연속최우수
              </span>
              <span className="px-2 py-0.5 text-[10px] font-medium bg-red-100 dark:bg-red-950/60 text-red-700 dark:text-red-300 rounded border border-red-200/50 dark:border-red-900/40">
                #캠코공식유튜브게시
              </span>
              <span className="px-2 py-0.5 text-[10px] font-medium bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 rounded">
                #정책홍보
              </span>
              <span className="px-2 py-0.5 text-[10px] font-medium bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 rounded">
                #데이터시각화
              </span>
              <span className="px-2 py-0.5 text-[10px] font-medium bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 rounded">
                #영상기획
              </span>
            </div>
          </div>
        </div>

        {/* 경험 3: IF-PBL 포트폴리오 분석 및 솔루션 도출 (2024.09~12) */}
        <div className="relative flex items-start gap-4">
          <div className="w-8 h-8 rounded-full bg-indigo-600 text-white flex items-center justify-center font-bold text-xs ring-4 ring-white dark:ring-slate-900 shadow-md shadow-indigo-500/20 shrink-0 z-10">
            <TrendingUp className="w-4 h-4" />
          </div>

          <div className="flex-1 bg-slate-50/80 dark:bg-slate-800/40 p-5 rounded-2xl border border-slate-200/80 dark:border-slate-800">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1 mb-2">
              <div className="flex items-center gap-2 flex-wrap">
                <span className="px-2 py-0.5 text-[10px] font-bold bg-indigo-100 dark:bg-indigo-950/60 text-indigo-700 dark:text-indigo-300 rounded-md border border-indigo-200/50 dark:border-indigo-900/40">
                  분석 프로젝트 (PBL)
                </span>
                <h3 className="font-bold text-slate-900 dark:text-white text-sm">
                  IF-PBL 과정 - 정량적 데이터 기반 포트폴리오 분석 및 솔루션 재설계
                </h3>
              </div>
              <span className="text-xs text-indigo-600 dark:text-indigo-400 font-semibold bg-indigo-50 dark:bg-indigo-950/60 px-2.5 py-0.5 rounded-full border border-indigo-100 dark:border-indigo-900/60 self-start sm:self-auto">
                2024.09 - 2024.12
              </span>
            </div>

            <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed mb-3">
              실제 사용자 데이터를 기반으로 위험 선호도 및 기대수익률 지표를 정량적으로 모델링하고, 시뮬레이션을
              통해 최적의 포트폴리오 배분 솔루션을 도출하였습니다.
            </p>

            <div className="bg-white dark:bg-slate-800/70 p-3.5 rounded-xl border border-slate-100 dark:border-slate-700/60 space-y-2 text-xs text-slate-700 dark:text-slate-200 mb-3">
              <div className="flex items-start gap-2">
                <CheckCircle2 className="w-3.5 h-3.5 text-indigo-500 shrink-0 mt-0.5" />
                <span>
                  <b>정량 데이터 마이닝 및 리스크 분석</b>: 고객의 현금 흐름 및 투자 패턴 데이터를 수집/분석하여
                  정량적 리스크 프로파일 도출
                </span>
              </div>
              <div className="flex items-start gap-2">
                <CheckCircle2 className="w-3.5 h-3.5 text-indigo-500 shrink-0 mt-0.5" />
                <span>
                  <b>데이터 기반 최적화 솔루션 제안</b>: 통계적 분석 지표를 활용하여 변동성을 최소화하는 최적 배분
                  모델 수립
                </span>
              </div>
              <div className="flex items-start gap-2">
                <CheckCircle2 className="w-3.5 h-3.5 text-indigo-500 shrink-0 mt-0.5" />
                <span>
                  <b>효과적인 데이터 시각화 &amp; 프레젠테이션</b>: 분석 결과를 한눈에 파악할 수 있는 대시보드형
                  시각화 리포트 구성
                </span>
              </div>
            </div>

            <div className="flex flex-wrap gap-1.5">
              <span className="px-2 py-0.5 text-[10px] font-medium bg-indigo-50 dark:bg-indigo-950/60 text-indigo-700 dark:text-indigo-300 rounded">
                #데이터분석
              </span>
              <span className="px-2 py-0.5 text-[10px] font-medium bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 rounded">
                #지표설계
              </span>
              <span className="px-2 py-0.5 text-[10px] font-medium bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 rounded">
                #데이터시각화
              </span>
              <span className="px-2 py-0.5 text-[10px] font-medium bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 rounded">
                #프레젠테이션
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
