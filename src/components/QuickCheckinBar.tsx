import React, { useState } from 'react';
import { Waves, Dumbbell, Check, Plus, Sparkles, Instagram, Flame, Calendar } from 'lucide-react';
import confetti from 'canvas-confetti';
import { DayLog } from '../types/workout';
import { formatReadableDateBR, TODAY_STR } from '../utils/statsCalculator';

interface QuickCheckinBarProps {
  currentDateStr: string;
  dayLog?: DayLog;
  onToggleSwim: (date: string, distanceMeters?: number) => void;
  onToggleGym: (date: string, focus?: string) => void;
  onOpenDayDetails: (date: string) => void;
  onOpenStoryModal: () => void;
  streakCount: number;
}

export const QuickCheckinBar: React.FC<QuickCheckinBarProps> = ({
  currentDateStr,
  dayLog,
  onToggleSwim,
  onToggleGym,
  onOpenDayDetails,
  onOpenStoryModal,
  streakCount,
}) => {
  const isSwimDone = Boolean(dayLog?.swimCompleted);
  const isGymDone = Boolean(dayLog?.gymCompleted);
  const isToday = currentDateStr === TODAY_STR;

  const [swimMetersInput, setSwimMetersInput] = useState<number>(1500);
  const [gymFocusInput, setGymFocusInput] = useState<string>('Inferior / Pernas');

  const triggerCelebration = () => {
    confetti({
      particleCount: 80,
      spread: 70,
      origin: { y: 0.6 },
      colors: ['#06b6d4', '#f43f5e', '#10b981', '#f59e0b', '#8b5cf6'],
    });
  };

  const handleSwimClick = () => {
    if (!isSwimDone) {
      triggerCelebration();
    }
    onToggleSwim(currentDateStr, isSwimDone ? undefined : (dayLog?.swim?.distanceMeters || swimMetersInput));
  };

  const handleGymClick = () => {
    if (!isGymDone) {
      triggerCelebration();
    }
    onToggleGym(currentDateStr, isGymDone ? undefined : (dayLog?.gym?.focus || gymFocusInput));
  };

  return (
    <div className="rounded-2xl bg-slate-900/90 border border-slate-800 p-4 sm:p-5 shadow-lg backdrop-blur-md">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        
        {/* Left: Date & Status indicator */}
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-slate-800 border border-slate-700/80 flex items-center justify-center text-slate-300">
            <Calendar className="w-5 h-5 text-cyan-400" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-sm sm:text-base font-bold text-white capitalize">
                {formatReadableDateBR(currentDateStr)}
              </span>
              {isToday && (
                <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-cyan-500/20 text-cyan-300 border border-cyan-500/30">
                  HOJE
                </span>
              )}
            </div>
            <div className="flex items-center gap-2 text-xs text-slate-400 mt-0.5">
              <span>
                {isSwimDone && isGymDone
                  ? '🔥 Combo completo: Natação + Academia!'
                  : isSwimDone
                  ? '🏊 Natação feita! Academia pendente'
                  : isGymDone
                  ? '🏋️ Academia feita! Natação pendente'
                  : 'Nenhum treino marcado ainda hoje'}
              </span>
              {streakCount > 0 && (
                <span className="inline-flex items-center gap-1 text-amber-400 font-semibold bg-amber-500/10 px-2 py-0.5 rounded-full border border-amber-500/20 text-[11px]">
                  <Flame className="w-3 h-3 fill-amber-400" />
                  {streakCount} {streakCount === 1 ? 'dia seguido' : 'dias seguidos'}
                </span>
              )}
            </div>
          </div>
        </div>

        {/* Center / Right: Check Buttons */}
        <div className="flex flex-wrap items-center gap-2.5 sm:gap-3">
          
          {/* Quick Check Natação */}
          <button
            onClick={handleSwimClick}
            className={`flex items-center gap-2 px-3.5 py-2.5 rounded-xl text-xs sm:text-sm font-semibold transition-all cursor-pointer border ${
              isSwimDone
                ? 'bg-cyan-500/20 text-cyan-300 border-cyan-500/50 shadow-md shadow-cyan-500/10 hover:bg-cyan-500/30'
                : 'bg-slate-800 hover:bg-slate-750 text-slate-300 border-slate-700 hover:border-cyan-500/40 hover:text-white'
            }`}
          >
            <div
              className={`w-5 h-5 rounded-md flex items-center justify-center transition-colors ${
                isSwimDone ? 'bg-cyan-500 text-slate-950 font-bold' : 'border border-slate-500'
              }`}
            >
              {isSwimDone ? <Check className="w-3.5 h-3.5 stroke-[3]" /> : <Waves className="w-3 h-3 text-cyan-400" />}
            </div>
            <span>
              {isSwimDone
                ? `Natação: ${(dayLog?.swim?.distanceMeters || 1500) / 1000}km ✅`
                : 'Check Natação (+1.5km)'}
            </span>
          </button>

          {/* Quick Check Academia */}
          <button
            onClick={handleGymClick}
            className={`flex items-center gap-2 px-3.5 py-2.5 rounded-xl text-xs sm:text-sm font-semibold transition-all cursor-pointer border ${
              isGymDone
                ? 'bg-rose-500/20 text-rose-300 border-rose-500/50 shadow-md shadow-rose-500/10 hover:bg-rose-500/30'
                : 'bg-slate-800 hover:bg-slate-750 text-slate-300 border-slate-700 hover:border-rose-500/40 hover:text-white'
            }`}
          >
            <div
              className={`w-5 h-5 rounded-md flex items-center justify-center transition-colors ${
                isGymDone ? 'bg-rose-500 text-slate-950 font-bold' : 'border border-slate-500'
              }`}
            >
              {isGymDone ? <Check className="w-3.5 h-3.5 stroke-[3]" /> : <Dumbbell className="w-3 h-3 text-rose-400" />}
            </div>
            <span>
              {isGymDone
                ? `Academia: ${dayLog?.gym?.focus || 'Treino Feito'} ✅`
                : 'Check Academia'}
            </span>
          </button>

          {/* Edit Details Button */}
          <button
            onClick={() => onOpenDayDetails(currentDateStr)}
            className="px-3 py-2.5 rounded-xl text-xs font-medium text-slate-400 hover:text-slate-200 bg-slate-800/60 hover:bg-slate-800 border border-slate-700/60 transition-all cursor-pointer"
            title="Editar detalhes completos deste dia"
          >
            Editar detalhes
          </button>

          {/* Story shortcut */}
          <button
            onClick={onOpenStoryModal}
            className="flex items-center gap-1.5 px-3 py-2.5 rounded-xl text-xs font-semibold bg-gradient-to-r from-pink-500/20 to-rose-500/20 text-pink-300 border border-pink-500/30 hover:border-pink-500/60 transition-all cursor-pointer"
            title="Criar Story deste check para o Instagram"
          >
            <Instagram className="w-3.5 h-3.5" />
            <span>Story</span>
          </button>

        </div>

      </div>
    </div>
  );
};
