import React from 'react';
import { Waves, Dumbbell, Flame, CheckCircle2, AlertCircle, ArrowUpRight, TrendingUp } from 'lucide-react';
import { CalculatedStats } from '../utils/statsCalculator';

interface GoalOverviewProps {
  stats: CalculatedStats;
  onOpenStoryModal: () => void;
}

export const GoalOverview: React.FC<GoalOverviewProps> = ({ stats, onOpenStoryModal }) => {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6">
      
      {/* CARD 1: META NATAÇÃO (45KM ATÉ 31/12/2026) */}
      <div className="relative overflow-hidden rounded-2xl bg-gradient-to-b from-slate-900/90 to-slate-900/50 border border-cyan-500/20 p-5 sm:p-6 shadow-xl shadow-cyan-950/20">
        <div className="absolute top-0 right-0 w-56 h-56 bg-cyan-500/10 rounded-full blur-3xl pointer-events-none -mr-16 -mt-16" />

        <div className="flex items-start justify-between gap-3 relative z-10">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-xl bg-cyan-500/15 border border-cyan-500/30 flex items-center justify-center text-cyan-400 shadow-inner">
              <Waves className="w-6 h-6" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-xs uppercase tracking-wider font-semibold text-cyan-400">
                  Meta Anual 2026
                </span>
                <span className="text-[11px] px-2 py-0.5 rounded-full bg-cyan-950/80 text-cyan-300 border border-cyan-800">
                  {stats.swimPaceStatus}
                </span>
              </div>
              <h3 className="text-lg sm:text-xl font-bold text-white tracking-tight mt-0.5">
                Natação • 45 km até 31/12
              </h3>
            </div>
          </div>

          <div className="text-right">
            <div className="text-2xl sm:text-3xl font-extrabold text-cyan-300 font-display">
              {stats.swimProgressPercent}%
            </div>
            <span className="text-[11px] text-slate-400">concluído</span>
          </div>
        </div>

        {/* Big Progress Bar */}
        <div className="mt-5 space-y-2 relative z-10">
          <div className="h-3.5 w-full bg-slate-800/80 rounded-full overflow-hidden p-0.5 border border-slate-700/50">
            <div
              className="h-full bg-gradient-to-r from-cyan-500 via-teal-400 to-cyan-300 rounded-full transition-all duration-700 ease-out shadow-sm shadow-cyan-500/50"
              style={{ width: `${Math.min(100, Math.max(4, stats.swimProgressPercent))}%` }}
            />
          </div>

          <div className="flex items-center justify-between text-xs text-slate-400 pt-0.5 font-medium">
            <span className="text-cyan-300 font-semibold text-sm">
              {stats.totalSwimKm.toFixed(1)} km <span className="text-slate-500 font-normal">nadados</span>
            </span>
            <span>
              Meta: <strong className="text-white">{stats.swimTargetKm} km</strong>
            </span>
          </div>
        </div>

        {/* Sub-metrics Grid */}
        <div className="mt-5 pt-4 border-t border-slate-800/80 grid grid-cols-3 gap-2.5 sm:gap-3 text-center relative z-10">
          <div className="bg-slate-950/50 rounded-xl p-2.5 border border-slate-800/60">
            <span className="text-[11px] text-slate-400 block">Restam</span>
            <span className="text-sm sm:text-base font-bold text-white mt-0.5 block">
              {stats.swimRemainingKm.toFixed(1)} km
            </span>
            <span className="text-[10px] text-slate-500">para 45km</span>
          </div>

          <div className="bg-slate-950/50 rounded-xl p-2.5 border border-slate-800/60">
            <span className="text-[11px] text-slate-400 block">Ritmo Semanal</span>
            <span className="text-sm sm:text-base font-bold text-cyan-400 mt-0.5 block">
              ~{stats.swimRequiredWeeklyKm.toFixed(1)} km/sem
            </span>
            <span className="text-[10px] text-slate-500">em {stats.weeksRemainingToGoal} sem</span>
          </div>

          <div className="bg-slate-950/50 rounded-xl p-2.5 border border-slate-800/60">
            <span className="text-[11px] text-slate-400 block">Sessões</span>
            <span className="text-sm sm:text-base font-bold text-teal-300 mt-0.5 block">
              {stats.totalSwimSessions} treinos
            </span>
            <span className="text-[10px] text-slate-500">méd. {stats.swimAvgKmPerSession.toFixed(1)}km</span>
          </div>
        </div>
      </div>

      {/* CARD 2: META ACADEMIA (4X POR SEMANA) */}
      <div className="relative overflow-hidden rounded-2xl bg-gradient-to-b from-slate-900/90 to-slate-900/50 border border-rose-500/20 p-5 sm:p-6 shadow-xl shadow-rose-950/20">
        <div className="absolute top-0 right-0 w-56 h-56 bg-rose-500/10 rounded-full blur-3xl pointer-events-none -mr-16 -mt-16" />

        <div className="flex items-start justify-between gap-3 relative z-10">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-xl bg-rose-500/15 border border-rose-500/30 flex items-center justify-center text-rose-400 shadow-inner">
              <Dumbbell className="w-6 h-6" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-xs uppercase tracking-wider font-semibold text-rose-400">
                  Meta Semanal
                </span>
                <span className="text-[11px] px-2 py-0.5 rounded-full bg-rose-950/80 text-rose-300 border border-rose-800">
                  Mínimo 4x/semana
                </span>
              </div>
              <h3 className="text-lg sm:text-xl font-bold text-white tracking-tight mt-0.5">
                Academia • Frequência Semanal
              </h3>
            </div>
          </div>

          <div className="text-right">
            <div className="text-2xl sm:text-3xl font-extrabold text-rose-300 font-display">
              {stats.currentWeekGymCount}/{stats.currentWeekGymTarget}
            </div>
            <span className="text-[11px] text-slate-400">nesta semana</span>
          </div>
        </div>

        {/* 4 Pips Target Tracker for Current Week */}
        <div className="mt-5 space-y-2 relative z-10">
          <div className="grid grid-cols-4 gap-2">
            {[1, 2, 3, 4].map((step) => {
              const isDone = stats.currentWeekGymCount >= step;
              return (
                <div
                  key={step}
                  className={`h-3.5 rounded-full transition-all duration-500 border ${
                    isDone
                      ? 'bg-gradient-to-r from-rose-500 to-amber-500 border-rose-400 shadow-sm shadow-rose-500/40'
                      : 'bg-slate-800/80 border-slate-700/60'
                  }`}
                />
              );
            })}
          </div>

          <div className="flex items-center justify-between text-xs text-slate-400 pt-0.5 font-medium">
            <span className="flex items-center gap-1.5 text-rose-300 font-semibold text-sm">
              {stats.currentWeekGymCount >= 4 ? (
                <>
                  <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                  Meta da semana batida! 🎉
                </>
              ) : (
                <>
                  <AlertCircle className="w-4 h-4 text-amber-400" />
                  Falta {4 - stats.currentWeekGymCount} {4 - stats.currentWeekGymCount === 1 ? 'treino' : 'treinos'} para os 4x
                </>
              )}
            </span>
            <span className="text-slate-400 text-xs">
              Consistência: <strong className="text-white">{stats.gymConsistencyRate}%</strong>
            </span>
          </div>
        </div>

        {/* Sub-metrics Grid */}
        <div className="mt-5 pt-4 border-t border-slate-800/80 grid grid-cols-3 gap-2.5 sm:gap-3 text-center relative z-10">
          <div className="bg-slate-950/50 rounded-xl p-2.5 border border-slate-800/60">
            <span className="text-[11px] text-slate-400 block">Total Geral</span>
            <span className="text-sm sm:text-base font-bold text-white mt-0.5 block">
              {stats.totalGymSessions} treinos
            </span>
            <span className="text-[10px] text-slate-500">registrados</span>
          </div>

          <div className="bg-slate-950/50 rounded-xl p-2.5 border border-slate-800/60">
            <span className="text-[11px] text-slate-400 block">Sequência Semanal</span>
            <span className="text-sm sm:text-base font-bold text-amber-400 mt-0.5 flex items-center justify-center gap-1">
              <Flame className="w-4 h-4 text-amber-500 fill-amber-500" />
              {stats.currentGymWeekStreak} sem
            </span>
            <span className="text-[10px] text-slate-500">recorde: {stats.longestGymWeekStreak} sem</span>
          </div>

          <div className="bg-slate-950/50 rounded-xl p-2.5 border border-slate-800/60">
            <span className="text-[11px] text-slate-400 block">Semanas na Meta</span>
            <span className="text-sm sm:text-base font-bold text-emerald-400 mt-0.5 block">
              {stats.gymWeeksMetCount}/{stats.totalWeeksEvaluated}
            </span>
            <span className="text-[10px] text-slate-500">bateram 4x+</span>
          </div>
        </div>
      </div>

    </div>
  );
};
