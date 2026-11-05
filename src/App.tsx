import React, { useState, useEffect } from 'react';
import {
  Calendar as CalendarIcon,
  BarChart3,
  Waves,
  Dumbbell,
  Sparkles,
  Instagram,
  FileText,
  Users,
  Flag,
  Flame,
  CheckCircle2,
  Clock
} from 'lucide-react';
import { Header } from './components/Header';
import { GoalOverview } from './components/GoalOverview';
import { QuickCheckinBar } from './components/QuickCheckinBar';
import { CalendarView } from './components/CalendarView';
import { WeeklyStatsView } from './components/WeeklyStatsView';
import { InstagramStoryModal } from './components/InstagramStoryModal';
import { ExportPdfModal } from './components/ExportPdfModal';
import { CommunityChallengeModal } from './components/CommunityChallengeModal';
import { DayEditModal } from './components/DayEditModal';

import { DayLog, GoalConfig } from './types/workout';
import { loadLogs, saveLogs, loadGoal, saveGoal, resetToDefaults } from './utils/storage';
import { calculateStats, TODAY_STR, formatReadableDateBR } from './utils/statsCalculator';

export default function App() {
  const [logs, setLogs] = useState<Record<string, DayLog>>(() => loadLogs());
  const [goal, setGoal] = useState<GoalConfig>(() => loadGoal());
  const [selectedDateStr, setSelectedDateStr] = useState<string>(TODAY_STR);
  const [activeTab, setActiveTab] = useState<'calendar' | 'stats'>('calendar');

  // Modals state
  const [isStoryModalOpen, setIsStoryModalOpen] = useState<boolean>(false);
  const [isPdfModalOpen, setIsPdfModalOpen] = useState<boolean>(false);
  const [isCommunityModalOpen, setIsCommunityModalOpen] = useState<boolean>(false);
  const [isDayEditModalOpen, setIsDayEditModalOpen] = useState<boolean>(false);
  const [modalDateStr, setModalDateStr] = useState<string>(TODAY_STR);

  // Sync to localStorage
  useEffect(() => {
    saveLogs(logs);
  }, [logs]);

  useEffect(() => {
    saveGoal(goal);
  }, [goal]);

  const stats = calculateStats(logs, goal, TODAY_STR);

  // Quick 1-tap toggle handlers
  const handleToggleSwim = (date: string, distanceMeters: number = 1500) => {
    setLogs((prev) => {
      const existing = prev[date];
      const willComplete = !existing?.swimCompleted;

      const updated: DayLog = {
        date,
        swimCompleted: willComplete,
        swim: willComplete
          ? {
              distanceMeters: existing?.swim?.distanceMeters || distanceMeters,
              durationMinutes: existing?.swim?.durationMinutes || 45,
              poolType: existing?.swim?.poolType || '25m',
              style: existing?.swim?.style || 'Livre / Crawl',
            }
          : undefined,
        gymCompleted: Boolean(existing?.gymCompleted),
        gym: existing?.gym,
        feeling: existing?.feeling || '🔥 Excelente',
        updatedAt: new Date().toISOString(),
      };

      return { ...prev, [date]: updated };
    });
  };

  const handleToggleGym = (date: string, focus: string = 'Inferior / Pernas') => {
    setLogs((prev) => {
      const existing = prev[date];
      const willComplete = !existing?.gymCompleted;

      const updated: DayLog = {
        date,
        swimCompleted: Boolean(existing?.swimCompleted),
        swim: existing?.swim,
        gymCompleted: willComplete,
        gym: willComplete
          ? {
              focus: (existing?.gym?.focus || focus) as any,
              durationMinutes: existing?.gym?.durationMinutes || 55,
              intensity: existing?.gym?.intensity || 'Intenso',
            }
          : undefined,
        feeling: existing?.feeling || '💪 Firme',
        updatedAt: new Date().toISOString(),
      };

      return { ...prev, [date]: updated };
    });
  };

  const handleSaveDayLog = (newLog: DayLog) => {
    setLogs((prev) => ({
      ...prev,
      [newLog.date]: newLog,
    }));
  };

  const handleDeleteDayLog = (date: string) => {
    setLogs((prev) => {
      const copy = { ...prev };
      delete copy[date];
      return copy;
    });
  };

  const handleOpenDayDetails = (date: string) => {
    setModalDateStr(date);
    setSelectedDateStr(date);
    setIsDayEditModalOpen(true);
  };

  const handleOpenStoryForDate = (date: string) => {
    setModalDateStr(date);
    setSelectedDateStr(date);
    setIsStoryModalOpen(true);
  };

  const handleResetData = () => {
    if (window.confirm('Deseja restaurar os dados de treino de exemplo da @prof_giu?')) {
      const restored = resetToDefaults();
      setLogs(restored.logs);
      setGoal(restored.goal);
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col font-sans">
      
      {/* Top Header Navigation */}
      <Header
        stats={stats}
        goal={goal}
        onOpenStoryModal={() => {
          setModalDateStr(selectedDateStr);
          setIsStoryModalOpen(true);
        }}
        onOpenPdfModal={() => setIsPdfModalOpen(true)}
        onOpenCommunityModal={() => setIsCommunityModalOpen(true)}
        onResetData={handleResetData}
      />

      {/* Main Content Area */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-6 sm:space-y-8">
        
        {/* Banner: Countdown & Streak Motivation */}
        <div className="relative overflow-hidden rounded-2xl bg-gradient-to-r from-slate-900 via-slate-900 to-indigo-950/60 border border-slate-800 p-4 sm:p-5 flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="flex items-center gap-3.5">
            <div className="w-12 h-12 rounded-xl bg-gradient-to-tr from-cyan-500/20 to-rose-500/20 border border-cyan-500/30 flex items-center justify-center text-cyan-400 shrink-0">
              <Flag className="w-6 h-6 text-amber-400" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-xs uppercase tracking-wider font-bold text-amber-400">
                  Desafio @prof_giu até 31/12/2026
                </span>
                <span className="text-[11px] px-2 py-0.5 rounded-full bg-slate-800 text-slate-300 font-semibold border border-slate-700">
                  Meta Conjunta
                </span>
              </div>
              <h2 className="text-base sm:text-lg font-bold text-white tracking-tight mt-0.5">
                45km de Natação + Academia Mínimo 4x por Semana
              </h2>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-3 text-xs">
            <div className="px-3.5 py-2 rounded-xl bg-slate-950/80 border border-slate-800 flex items-center gap-2">
              <Flame className="w-4 h-4 text-amber-400 fill-amber-400" />
              <div>
                <span className="text-slate-400 block text-[10px]">Sequência Ativa</span>
                <span className="font-bold text-amber-300 text-xs sm:text-sm">
                  {stats.currentActiveDayStreak} {stats.currentActiveDayStreak === 1 ? 'dia' : 'dias'}
                </span>
              </div>
            </div>

            <div className="px-3.5 py-2 rounded-xl bg-slate-950/80 border border-slate-800 flex items-center gap-2">
              <Clock className="w-4 h-4 text-cyan-400" />
              <div>
                <span className="text-slate-400 block text-[10px]">Tempo Total</span>
                <span className="font-bold text-cyan-300 text-xs sm:text-sm">
                  ~{(stats.totalActiveMinutes / 60).toFixed(0)}h de treino
                </span>
              </div>
            </div>

            <button
              onClick={() => setIsCommunityModalOpen(true)}
              className="px-3.5 py-2 rounded-xl bg-indigo-500/15 hover:bg-indigo-500/25 text-indigo-300 font-semibold border border-indigo-500/30 transition-all flex items-center gap-1.5 cursor-pointer"
            >
              <Users className="w-3.5 h-3.5" />
              <span>Ver Comunidade</span>
            </button>
          </div>
        </div>

        {/* Primary Goals Dashboard: Swimming 45km + Gym 4x/week */}
        <GoalOverview
          stats={stats}
          onOpenStoryModal={() => {
            setModalDateStr(selectedDateStr);
            setIsStoryModalOpen(true);
          }}
        />

        {/* Quick Check-in Bar for Today / Selected Date */}
        <QuickCheckinBar
          currentDateStr={selectedDateStr}
          dayLog={logs[selectedDateStr]}
          onToggleSwim={handleToggleSwim}
          onToggleGym={handleToggleGym}
          onOpenDayDetails={handleOpenDayDetails}
          onOpenStoryModal={() => {
            setModalDateStr(selectedDateStr);
            setIsStoryModalOpen(true);
          }}
          streakCount={stats.currentActiveDayStreak}
        />

        {/* Tab Navigation for Calendar vs Detailed Weekly Stats */}
        <div className="flex items-center justify-between border-b border-slate-800/80 pb-1">
          <div className="flex items-center gap-2">
            <button
              onClick={() => setActiveTab('calendar')}
              className={`flex items-center gap-2 px-4 py-2.5 rounded-t-xl text-xs sm:text-sm font-bold transition-all border-b-2 cursor-pointer ${
                activeTab === 'calendar'
                  ? 'border-cyan-400 text-white bg-slate-900/60'
                  : 'border-transparent text-slate-400 hover:text-slate-200'
              }`}
            >
              <CalendarIcon className="w-4 h-4 text-cyan-400" />
              <span>Calendário & Marcação de Dias</span>
            </button>

            <button
              onClick={() => setActiveTab('stats')}
              className={`flex items-center gap-2 px-4 py-2.5 rounded-t-xl text-xs sm:text-sm font-bold transition-all border-b-2 cursor-pointer ${
                activeTab === 'stats'
                  ? 'border-rose-400 text-white bg-slate-900/60'
                  : 'border-transparent text-slate-400 hover:text-slate-200'
              }`}
            >
              <BarChart3 className="w-4 h-4 text-rose-400" />
              <span>Estatísticas Semanais de Desempenho</span>
            </button>
          </div>

          <div className="hidden sm:flex items-center gap-2 text-xs text-slate-400">
            <span className="w-2 h-2 rounded-full bg-emerald-400 inline-block animate-pulse" />
            <span>Cálculo automático ativo</span>
          </div>
        </div>

        {/* Tab Content 1: Calendar View */}
        {activeTab === 'calendar' && (
          <CalendarView
            logs={logs}
            selectedDateStr={selectedDateStr}
            onSelectDay={(dateStr) => {
              setSelectedDateStr(dateStr);
              handleOpenDayDetails(dateStr);
            }}
            onQuickToggleSwim={(dateStr) => handleToggleSwim(dateStr)}
            onQuickToggleGym={(dateStr) => handleToggleGym(dateStr)}
          />
        )}

        {/* Tab Content 2: Weekly Performance Statistics View */}
        {activeTab === 'stats' && (
          <WeeklyStatsView logs={logs} />
        )}

        {/* Engagement & Story Highlight Banner at Bottom */}
        <div className="rounded-2xl bg-gradient-to-r from-pink-950/40 via-purple-950/30 to-cyan-950/40 border border-pink-500/20 p-5 sm:p-6 flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="flex items-center gap-3.5">
            <div className="w-12 h-12 rounded-xl bg-pink-500/20 border border-pink-500/30 flex items-center justify-center text-pink-300">
              <Instagram className="w-6 h-6" />
            </div>
            <div>
              <h3 className="text-base sm:text-lg font-bold text-white">
                Compartilhe o seu check no Stories todos os dias!
              </h3>
              <p className="text-xs text-slate-400 mt-0.5">
                Gere um card 9:16 com @prof_giu, km nadados, treino de academia e motive seus seguidores a treinarem junto.
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2.5">
            <button
              onClick={() => {
                setModalDateStr(selectedDateStr);
                setIsStoryModalOpen(true);
              }}
              className="flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs sm:text-sm font-bold bg-gradient-to-r from-pink-600 to-rose-500 text-white shadow-md shadow-pink-500/20 hover:opacity-95 active:scale-95 transition-all cursor-pointer"
            >
              <Instagram className="w-4 h-4" />
              <span>Gerar Story de Hoje</span>
            </button>

            <button
              onClick={() => setIsPdfModalOpen(true)}
              className="flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs sm:text-sm font-semibold bg-slate-900 hover:bg-slate-800 text-slate-200 border border-slate-700 cursor-pointer"
            >
              <FileText className="w-4 h-4 text-cyan-400" />
              <span>Exportar PDF</span>
            </button>
          </div>
        </div>

      </main>

      {/* Footer */}
      <footer className="border-t border-slate-900 bg-slate-950 py-6 text-center text-xs text-slate-500 no-print">
        <div className="max-w-7xl mx-auto px-4 flex flex-col sm:flex-row items-center justify-between gap-3">
          <div className="flex items-center gap-2 text-slate-400 font-medium">
            <span>{goal.userName}</span>
            <span className="text-cyan-400">{goal.userHandle}</span>
            <span>• Meta 45km Natação + Academia 4x/sem até 31/12/2026</span>
          </div>
          <div>
            Desenvolvido com design minimalista & alta performance esportiva
          </div>
        </div>
      </footer>

      {/* MODALS */}
      {/* 1. Instagram Story Studio Modal */}
      <InstagramStoryModal
        isOpen={isStoryModalOpen}
        onClose={() => setIsStoryModalOpen(false)}
        stats={stats}
        goal={goal}
        currentDateStr={modalDateStr}
        dayLog={logs[modalDateStr]}
      />

      {/* 2. PDF Export Modal */}
      <ExportPdfModal
        isOpen={isPdfModalOpen}
        onClose={() => setIsPdfModalOpen(false)}
        stats={stats}
        goal={goal}
        logs={logs}
      />

      {/* 3. Community Challenge Modal */}
      <CommunityChallengeModal
        isOpen={isCommunityModalOpen}
        onClose={() => setIsCommunityModalOpen(false)}
        goal={goal}
        stats={stats}
      />

      {/* 4. Day Details / Edit Workout Modal */}
      <DayEditModal
        isOpen={isDayEditModalOpen}
        onClose={() => setIsDayEditModalOpen(false)}
        dateStr={modalDateStr}
        existingLog={logs[modalDateStr]}
        onSaveDayLog={handleSaveDayLog}
        onDeleteDayLog={handleDeleteDayLog}
        onOpenStoryForDate={handleOpenStoryForDate}
      />

    </div>
  );
}
