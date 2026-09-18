import React from 'react';
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from 'chart.js';
import { Doughnut } from 'react-chartjs-2';

ChartJS.register(ArcElement, Tooltip, Legend);

interface CompetencyChartProps {
  darkMode: boolean;
}

export const CompetencyChart: React.FC<CompetencyChartProps> = ({ darkMode }) => {
  const borderColor = darkMode ? '#131B2E' : '#ffffff';

  const competencyData = {
    labels: ['데이터분석/해석', 'AI응용/기획', '정보시각화', '기타'],
    datasets: [
      {
        data: [40, 30, 20, 10],
        backgroundColor: ['#2563eb', '#6366f1', '#38bdf8', '#94a3b8'],
        borderWidth: 2,
        borderColor: borderColor,
      },
    ],
  };

  const personalityData = {
    labels: ['분석력/논리', '창의성/AI', '추진력/실행', '정확성'],
    datasets: [
      {
        data: [35, 30, 20, 15],
        backgroundColor: ['#4f46e5', '#38bdf8', '#f59e0b', '#10b981'],
        borderWidth: 2,
        borderColor: borderColor,
      },
    ],
  };

  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: { display: false },
      tooltip: {
        callbacks: {
          label: function (context: any) {
            return `${context.label}: ${context.raw}%`;
          },
        },
      },
    },
    cutout: '70%',
  };

  return (
    <div className="grid grid-cols-2 gap-3 items-center">
      <div className="relative flex flex-col items-center">
        <div className="w-24 h-24 relative">
          <Doughnut data={competencyData} options={chartOptions} />
        </div>
        <span className="text-[11px] font-bold text-slate-700 dark:text-slate-300 mt-2">직무 역량</span>
      </div>

      <div className="relative flex flex-col items-center">
        <div className="w-24 h-24 relative">
          <Doughnut data={personalityData} options={chartOptions} />
        </div>
        <span className="text-[11px] font-bold text-slate-700 dark:text-slate-300 mt-2">업무 성향</span>
      </div>
    </div>
  );
};
