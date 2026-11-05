import React, { useRef, useState } from 'react';
import {
  X,
  Download,
  Share2,
  Copy,
  Check,
  Instagram,
  Sparkles,
  Waves,
  Dumbbell,
  Flame,
  Target,
  Calendar,
  MessageCircleHeart
} from 'lucide-react';
import html2canvas from 'html2canvas';
import confetti from 'canvas-confetti';
import { DayLog, GoalConfig } from '../types/workout';
import { CalculatedStats, formatReadableDateBR, TODAY_STR } from '../utils/statsCalculator';

interface InstagramStoryModalProps {
  isOpen: boolean;
  onClose: () => void;
  stats: CalculatedStats;
  goal: GoalConfig;
  currentDateStr: string;
  dayLog?: DayLog;
}

type StoryTheme = 'obsidian' | 'aqua' | 'sunset' | 'titanium';

export const InstagramStoryModal: React.FC<InstagramStoryModalProps> = ({
  isOpen,
  onClose,
  stats,
  goal,
  currentDateStr,
  dayLog,
}) => {
  const storyCardRef = useRef<HTMLDivElement>(null);
  const [theme, setTheme] = useState<StoryTheme>('obsidian');
  const [headline, setHeadline] = useState<string>('CHECK DO DIA PAGO! 🔥');
  const [showStreakBadge, setShowStreakBadge] = useState<boolean>(true);
  const [customNote, setCustomNote] = useState<string>('Mais um dia de disciplina concluído rumo a 31/12/2026!');
  const [isGenerating, setIsGenerating] = useState<boolean>(false);
  const [copiedCaption, setCopiedCaption] = useState<boolean>(false);

  if (!isOpen) return null;

  const isToday = currentDateStr === TODAY_STR;
  const isSwimDone = Boolean(dayLog?.swimCompleted);
  const isGymDone = Boolean(dayLog?.gymCompleted);
  const swimDistance = dayLog?.swim?.distanceMeters || (isSwimDone ? 1500 : 0);
  const gymFocus = dayLog?.gym?.focus || 'Treino Feito';

  // Format ready caption for Instagram
  const generateCaption = () => {
    return `Check de hoje pago! ✅🔥\n\n` +
      `🏊‍♀️ Natação: ${isSwimDone ? `+${(swimDistance / 1000).toFixed(1)}km na conta! (Total: ${stats.totalSwimKm.toFixed(1)}km / ${goal.swimTargetKm}km)` : 'Descanso ativo na água'}\n` +
      `🏋️‍♀️ Academia: ${isGymDone ? `${gymFocus} concluído! (${stats.currentWeekGymCount}/${goal.gymWeeklyTargetDays} na semana)` : 'Dia sem musculação'}\n\n` +
      `🎯 Meta Individual 2026: Faltam apenas ${stats.daysRemainingToGoal} dias até 31/12/2026!\n` +
      `🔥 Sequência ativa: ${stats.currentActiveDayStreak} dias seguidos de constância.\n\n` +
      `#ProfGiu #Meta2026 #Natacao45km #Academia4x #Disciplina #TreinoIndividual #Constancia`;
  };

  const handleCopyCaption = async () => {
    try {
      await navigator.clipboard.writeText(generateCaption());
      setCopiedCaption(true);
      setTimeout(() => setCopiedCaption(false), 2500);
    } catch (err) {
      console.error('Failed to copy caption:', err);
    }
  };

  const handleDownloadStoryImage = async () => {
    if (!storyCardRef.current) return;
    try {
      setIsGenerating(true);
      const canvas = await html2canvas(storyCardRef.current, {
        scale: 2, // High resolution for crisp mobile display
        useCORS: true,
        backgroundColor: '#030712',
      });
      const dataUrl = canvas.toDataURL('image/png');
      const link = document.createElement('a');
      link.download = `story-prof-giu-${currentDateStr}.png`;
      link.href = dataUrl;
      link.click();

      confetti({
        particleCount: 100,
        spread: 80,
        origin: { y: 0.6 },
      });
    } catch (err) {
      console.error('Error generating story image:', err);
    } finally {
      setIsGenerating(false);
    }
  };

  const handleDirectShare = async () => {
    if (!storyCardRef.current) return;
    try {
      setIsGenerating(true);
      const canvas = await html2canvas(storyCardRef.current, {
        scale: 2,
        useCORS: true,
      });

      canvas.toBlob(async (blob) => {
        if (!blob) {
          handleDownloadStoryImage();
          return;
        }

        const file = new File([blob], `story-prof-giu-${currentDateStr}.png`, {
          type: 'image/png',
        });

        if (navigator.canShare && navigator.canShare({ files: [file] })) {
          await navigator.share({
            files: [file],
            title: `Check do dia @prof_giu`,
            text: generateCaption(),
          });
        } else {
          // Fallback to download + copy caption
          handleDownloadStoryImage();
          handleCopyCaption();
        }
      });
    } catch (err) {
      console.error('Share failed or was canceled:', err);
    } finally {
      setIsGenerating(false);
    }
  };

  // Theme styling configurations
  const getThemeStyles = () => {
    switch (theme) {
      case 'aqua':
        return {
          cardBg: 'bg-gradient-to-b from-cyan-950 via-slate-950 to-slate-900 border-cyan-500/40',
          accentGradient: 'from-cyan-400 to-teal-300',
          checkSwimBg: 'bg-cyan-500/20 border-cyan-400/50 text-cyan-200',
          checkGymBg: 'bg-slate-900/90 border-slate-700 text-slate-200',
          glow: 'from-cyan-500/20 via-teal-500/10 to-transparent',
        };
      case 'sunset':
        return {
          cardBg: 'bg-gradient-to-b from-rose-950 via-slate-950 to-slate-900 border-rose-500/40',
          accentGradient: 'from-rose-400 via-pink-400 to-amber-300',
          checkSwimBg: 'bg-slate-900/90 border-slate-700 text-slate-200',
          checkGymBg: 'bg-rose-500/20 border-rose-400/50 text-rose-200',
          glow: 'from-rose-500/20 via-amber-500/10 to-transparent',
        };
      case 'titanium':
        return {
          cardBg: 'bg-gradient-to-b from-slate-900 via-slate-950 to-black border-slate-700',
          accentGradient: 'from-slate-200 to-slate-400',
          checkSwimBg: 'bg-slate-900 border-slate-700 text-slate-200',
          checkGymBg: 'bg-slate-900 border-slate-700 text-slate-200',
          glow: 'from-slate-500/10 via-slate-700/10 to-transparent',
        };
      case 'obsidian':
      default:
        return {
          cardBg: 'bg-gradient-to-b from-slate-900/95 via-slate-950 to-black border-cyan-500/30',
          accentGradient: 'from-cyan-300 via-indigo-300 to-rose-300',
          checkSwimBg: 'bg-cyan-950/60 border-cyan-500/30 text-cyan-200',
          checkGymBg: 'bg-rose-950/60 border-rose-500/30 text-rose-200',
          glow: 'from-cyan-500/15 via-rose-500/10 to-transparent',
        };
    }
  };

  const themeStyles = getThemeStyles();

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/85 backdrop-blur-md overflow-y-auto">
      <div className="relative w-full max-w-4xl bg-slate-950 border border-slate-800 rounded-2xl shadow-2xl overflow-hidden my-auto">
        
        {/* Modal Header */}
        <div className="flex items-center justify-between p-4 sm:p-5 border-b border-slate-800 bg-slate-900/60">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-pink-500 to-rose-500 flex items-center justify-center text-white shadow-md shadow-pink-500/20">
              <Instagram className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base sm:text-lg font-bold text-white flex items-center gap-2">
                Instagram Story Studio
                <span className="text-[11px] font-semibold px-2 py-0.5 rounded-full bg-pink-500/20 text-pink-300 border border-pink-500/30">
                  Formato 9:16
                </span>
              </h3>
              <p className="text-xs text-slate-400">
                Gere um card visual e engajador para postar no seu Stories em segundos
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-2 rounded-xl text-slate-400 hover:text-white hover:bg-slate-800 transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Body: Two Columns (Preview 9:16 on Left, Customizer on Right) */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 p-4 sm:p-6 max-h-[80vh] overflow-y-auto">
          
          {/* LEFT: 9:16 Story Live Preview Canvas (5 Cols) */}
          <div className="lg:col-span-5 flex flex-col items-center">
            <div className="text-xs text-slate-400 mb-2 font-medium flex items-center gap-1.5">
              <Sparkles className="w-3.5 h-3.5 text-pink-400" />
              Preview do Story (9:16)
            </div>

            {/* THE STORY CARD ELEMENT (to be captured by html2canvas) */}
            <div
              ref={storyCardRef}
              className={`w-[290px] sm:w-[320px] aspect-[9/16] rounded-[28px] border-2 p-5 flex flex-col justify-between relative overflow-hidden shadow-2xl transition-all ${themeStyles.cardBg}`}
              style={{
                boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.7)',
              }}
            >
              {/* Top ambient glow */}
              <div
                className={`absolute top-0 left-0 right-0 h-40 bg-gradient-to-b ${themeStyles.glow} pointer-events-none`}
              />

              {/* CARD TOP: Profile Header & Date */}
              <div className="relative z-10 flex items-center justify-between">
                <div className="flex items-center gap-2.5">
                  <div className="w-10 h-10 rounded-full bg-gradient-to-tr from-cyan-400 via-rose-500 to-amber-400 p-[2px] shadow-md">
                    <div className="w-full h-full bg-slate-900 rounded-full flex items-center justify-center font-bold text-xs text-white">
                      GS
                    </div>
                  </div>
                  <div>
                    <div className="flex items-center gap-1">
                      <span className="text-xs font-bold text-white tracking-tight">
                        {goal.userHandle}
                      </span>
                      <span className="w-3 h-3 rounded-full bg-cyan-400 text-slate-950 flex items-center justify-center text-[8px] font-bold">
                        ✓
                      </span>
                    </div>
                    <span className="text-[10px] text-slate-300 font-medium">
                      {goal.userName}
                    </span>
                  </div>
                </div>

                <div className="px-2 py-1 rounded-full bg-black/40 border border-white/10 text-[10px] font-semibold text-slate-200 backdrop-blur-sm">
                  {formatReadableDateBR(currentDateStr, false).toUpperCase()}
                </div>
              </div>

              {/* CARD MIDDLE: Headline & Daily Checks */}
              <div className="relative z-10 my-auto py-3 space-y-3">
                {/* Headline Badge */}
                <div className="text-center">
                  <span className="inline-block px-3 py-1 rounded-full text-[11px] font-extrabold uppercase tracking-widest bg-white/10 border border-white/20 text-white backdrop-blur-md shadow-sm">
                    {headline}
                  </span>
                </div>

                {/* Swim Check Box */}
                <div className={`p-3 rounded-2xl border backdrop-blur-md transition-all ${themeStyles.checkSwimBg}`}>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <div className="w-7 h-7 rounded-lg bg-cyan-500/20 text-cyan-300 flex items-center justify-center">
                        <Waves className="w-4 h-4" />
                      </div>
                      <div>
                        <span className="text-[10px] uppercase font-bold tracking-wider text-cyan-400 block">
                          Natação • Meta 45km
                        </span>
                        <span className="text-xs font-bold text-white">
                          {isSwimDone ? `+${(swimDistance / 1000).toFixed(1)} km Hoje!` : 'Pendente hoje'}
                        </span>
                      </div>
                    </div>
                    <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-cyan-500 text-slate-950 flex items-center gap-1 shadow-sm">
                      <Check className="w-3 h-3 stroke-[3]" />
                      {stats.totalSwimKm.toFixed(1)} / 45k
                    </span>
                  </div>

                  {/* Progress bar inside story */}
                  <div className="mt-2 h-1.5 w-full bg-black/40 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-cyan-400 rounded-full"
                      style={{ width: `${stats.swimProgressPercent}%` }}
                    />
                  </div>
                </div>

                {/* Gym Check Box */}
                <div className={`p-3 rounded-2xl border backdrop-blur-md transition-all ${themeStyles.checkGymBg}`}>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <div className="w-7 h-7 rounded-lg bg-rose-500/20 text-rose-300 flex items-center justify-center">
                        <Dumbbell className="w-4 h-4" />
                      </div>
                      <div>
                        <span className="text-[10px] uppercase font-bold tracking-wider text-rose-400 block">
                          Academia • Meta 4x/sem
                        </span>
                        <span className="text-xs font-bold text-white">
                          {isGymDone ? gymFocus : 'Pendente hoje'}
                        </span>
                      </div>
                    </div>
                    <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-rose-500 text-slate-950 flex items-center gap-1 shadow-sm">
                      <Check className="w-3 h-3 stroke-[3]" />
                      {stats.currentWeekGymCount}/4 Sem
                    </span>
                  </div>

                  {/* 4 Pips in story */}
                  <div className="mt-2 grid grid-cols-4 gap-1">
                    {[1, 2, 3, 4].map((step) => (
                      <div
                        key={step}
                        className={`h-1.5 rounded-full ${
                          stats.currentWeekGymCount >= step ? 'bg-rose-400' : 'bg-black/40'
                        }`}
                      />
                    ))}
                  </div>
                </div>

                {/* Custom Note / Motivation */}
                {customNote && (
                  <div className="p-2.5 rounded-xl bg-black/30 border border-white/10 text-center">
                    <p className="text-[11px] font-medium text-slate-200 italic leading-snug">
                      "{customNote}"
                    </p>
                  </div>
                )}

                {/* Individual Streak Sticker */}
                {showStreakBadge && (
                  <div className="p-2 rounded-xl bg-gradient-to-r from-cyan-500/15 via-slate-800 to-rose-500/15 border border-white/15 text-center backdrop-blur-sm">
                    <span className="text-[10px] font-bold text-white uppercase tracking-wider flex items-center justify-center gap-1">
                      <Flame className="w-3.5 h-3.5 text-amber-400 fill-amber-400" />
                      SEQUÊNCIA: {stats.currentActiveDayStreak} DIAS CONSECUTIVOS!
                    </span>
                    <span className="text-[9px] text-slate-300 block mt-0.5">
                      Meta Individual • Foco total até 31/12
                    </span>
                  </div>
                )}
              </div>

              {/* CARD BOTTOM: Countdown & Individual Goal */}
              <div className="relative z-10 pt-2 border-t border-white/10 flex items-center justify-between text-[10px]">
                <div className="flex items-center gap-1 text-slate-300 font-semibold">
                  <Target className="w-3 h-3 text-rose-400" />
                  <span>31 DEZ 2026</span>
                  <span className="text-cyan-400 font-bold">• {stats.daysRemainingToGoal} dias restantes</span>
                </div>

                <span className="px-2 py-0.5 rounded-full bg-white/10 border border-white/20 text-white font-bold text-[9px]">
                  {goal.userHandle}
                </span>
              </div>
            </div>
          </div>

          {/* RIGHT: Story Controls & Fast Publishing (7 Cols) */}
          <div className="lg:col-span-7 flex flex-col justify-between space-y-5">
            
            <div className="space-y-4">
              {/* Theme Selector */}
              <div>
                <label className="text-xs font-bold uppercase tracking-wider text-slate-400 block mb-2">
                  1. Escolha a Paleta Visual
                </label>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                  <button
                    onClick={() => setTheme('obsidian')}
                    className={`p-2.5 rounded-xl border text-left text-xs font-semibold transition-all cursor-pointer ${
                      theme === 'obsidian'
                        ? 'bg-slate-800 border-cyan-400 text-white shadow-md'
                        : 'bg-slate-900 border-slate-800 text-slate-400 hover:text-slate-200'
                    }`}
                  >
                    <span className="w-3 h-3 rounded-full bg-cyan-400 inline-block mr-1.5 align-middle" />
                    Obsidian
                  </button>

                  <button
                    onClick={() => setTheme('aqua')}
                    className={`p-2.5 rounded-xl border text-left text-xs font-semibold transition-all cursor-pointer ${
                      theme === 'aqua'
                        ? 'bg-slate-800 border-cyan-400 text-white shadow-md'
                        : 'bg-slate-900 border-slate-800 text-slate-400 hover:text-slate-200'
                    }`}
                  >
                    <span className="w-3 h-3 rounded-full bg-teal-400 inline-block mr-1.5 align-middle" />
                    Aqua Sport
                  </button>

                  <button
                    onClick={() => setTheme('sunset')}
                    className={`p-2.5 rounded-xl border text-left text-xs font-semibold transition-all cursor-pointer ${
                      theme === 'sunset'
                        ? 'bg-slate-800 border-rose-400 text-white shadow-md'
                        : 'bg-slate-900 border-slate-800 text-slate-400 hover:text-slate-200'
                    }`}
                  >
                    <span className="w-3 h-3 rounded-full bg-rose-400 inline-block mr-1.5 align-middle" />
                    Sunset Fire
                  </button>

                  <button
                    onClick={() => setTheme('titanium')}
                    className={`p-2.5 rounded-xl border text-left text-xs font-semibold transition-all cursor-pointer ${
                      theme === 'titanium'
                        ? 'bg-slate-800 border-slate-400 text-white shadow-md'
                        : 'bg-slate-900 border-slate-800 text-slate-400 hover:text-slate-200'
                    }`}
                  >
                    <span className="w-3 h-3 rounded-full bg-slate-300 inline-block mr-1.5 align-middle" />
                    Titanium
                  </button>
                </div>
              </div>

              {/* Title / Headline Selector */}
              <div>
                <label className="text-xs font-bold uppercase tracking-wider text-slate-400 block mb-2">
                  2. Frase de Destaque
                </label>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
                  {[
                    'CHECK DO DIA PAGO! 🔥',
                    'META FIM DE ANO 2026 🎯',
                    'CONSTÂNCIA É O SEGREDO 💪',
                    'RUMO AOS 45KM DE NATAÇÃO 🏊‍♀️',
                  ].map((phrase) => (
                    <button
                      key={phrase}
                      onClick={() => setHeadline(phrase)}
                      className={`p-2 rounded-xl border text-left transition-all cursor-pointer ${
                        headline === phrase
                          ? 'bg-cyan-500/20 border-cyan-500/60 text-cyan-200 font-bold'
                          : 'bg-slate-900 border-slate-800 text-slate-300 hover:bg-slate-850'
                      }`}
                    >
                      {phrase}
                    </button>
                  ))}
                </div>
              </div>

              {/* Custom Motivational Note */}
              <div>
                <label className="text-xs font-bold uppercase tracking-wider text-slate-400 block mb-1.5">
                  3. Nota / Frase do Dia
                </label>
                <input
                  type="text"
                  value={customNote}
                  onChange={(e) => setCustomNote(e.target.value)}
                  placeholder="Escreva sua frase ou observação do dia..."
                  className="w-full px-3.5 py-2.5 rounded-xl bg-slate-900 border border-slate-800 text-white text-xs placeholder:text-slate-600 focus:outline-none focus:border-cyan-400"
                />
              </div>

              {/* Toggle badge */}
              <div className="flex flex-wrap items-center gap-4 pt-1">
                <label className="flex items-center gap-2 text-xs text-slate-300 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={showStreakBadge}
                    onChange={(e) => setShowStreakBadge(e.target.checked)}
                    className="rounded bg-slate-900 border-slate-700 text-cyan-500 focus:ring-0 cursor-pointer"
                  />
                  <span>Exibir selo de dias consecutivos de constância</span>
                </label>
              </div>
            </div>

            {/* ACTION BUTTONS */}
            <div className="pt-4 border-t border-slate-800 space-y-3">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                {/* 1. Download Story Image (1080x1920) */}
                <button
                  onClick={handleDownloadStoryImage}
                  disabled={isGenerating}
                  className="flex items-center justify-center gap-2 px-4 py-3 rounded-xl font-bold text-xs sm:text-sm bg-gradient-to-r from-pink-600 via-rose-500 to-amber-500 text-white shadow-lg shadow-pink-500/20 hover:opacity-95 active:scale-95 transition-all cursor-pointer disabled:opacity-50"
                >
                  <Download className="w-4 h-4" />
                  <span>{isGenerating ? 'Gerando Imagem...' : 'Baixar Imagem (Stories 9:16)'}</span>
                </button>

                {/* 2. Direct Share to Instagram Sheet */}
                <button
                  onClick={handleDirectShare}
                  disabled={isGenerating}
                  className="flex items-center justify-center gap-2 px-4 py-3 rounded-xl font-bold text-xs sm:text-sm bg-slate-800 hover:bg-slate-700 text-white border border-slate-700 active:scale-95 transition-all cursor-pointer disabled:opacity-50"
                >
                  <Share2 className="w-4 h-4 text-cyan-400" />
                  <span>Compartilhar no Instagram</span>
                </button>
              </div>

              {/* 3. Copy Caption for Posts/Stories */}
              <button
                onClick={handleCopyCaption}
                className="w-full flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl text-xs font-semibold bg-slate-900 hover:bg-slate-850 text-slate-300 border border-slate-800 transition-colors cursor-pointer"
              >
                {copiedCaption ? (
                  <>
                    <Check className="w-4 h-4 text-emerald-400" />
                    <span className="text-emerald-400">Legenda Copiada com Sucesso!</span>
                  </>
                ) : (
                  <>
                    <Copy className="w-4 h-4 text-slate-400" />
                    <span>Copiar Legenda Pronta com Hashtags</span>
                  </>
                )}
              </button>
            </div>

          </div>

        </div>

      </div>
    </div>
  );
};
