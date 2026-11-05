import React, { useRef, useState } from 'react';
import { X, Users, Download, Copy, Check, Sparkles, Heart, Target, Send, MessageSquare } from 'lucide-react';
import html2canvas from 'html2canvas';
import confetti from 'canvas-confetti';
import { GoalConfig } from '../types/workout';
import { CalculatedStats } from '../utils/statsCalculator';

interface CommunityChallengeModalProps {
  isOpen: boolean;
  onClose: () => void;
  goal: GoalConfig;
  stats: CalculatedStats;
}

export const CommunityChallengeModal: React.FC<CommunityChallengeModalProps> = ({
  isOpen,
  onClose,
  goal,
  stats,
}) => {
  const followerTemplateRef = useRef<HTMLDivElement>(null);
  const [copiedInvite, setCopiedInvite] = useState<boolean>(false);
  const [isDownloadingTemplate, setIsDownloadingTemplate] = useState<boolean>(false);
  const [communityPledgeCount, setCommunityPledgeCount] = useState<number>(348);
  const [hasPledged, setHasPledged] = useState<boolean>(false);

  if (!isOpen) return null;

  const invitePostScript = 
`🚀 DESAFIO FIM DE ANO COM A @prof_giu: FECHANDO 2026 NO TOPO! 🎯🔥

Faltam apenas ${stats.daysRemainingToGoal} dias até o dia 31 de Dezembro de 2026. Em vez de esperar janeiro para começar, que tal a gente construir essa vitória dia após dia juntos?

A minha meta individual já está traçada e rodando:
🏊‍♀️ 45 KM de natação acumulados até 31/12
🏋️‍♀️ Academia pelo menos 4x por semana

E você? Qual vai ser o seu compromisso até o fim do ano?
Pode ser correr, caminhar, musculação, nadar ou manter a constância nos seus treinos!

👉 Baixe o template nos meus destaques, marque a sua meta diária e me marca nos stories (@prof_giu) com a hashtag #DesafioProfGiu que eu vou repostar e vibrar com cada check seu!

Bora cometer o erro de não desistir? Quem tá comigo comenta "EU VOU!" nos comentários! 👇⚡`;

  const handleCopyInvite = async () => {
    try {
      await navigator.clipboard.writeText(invitePostScript);
      setCopiedInvite(true);
      setTimeout(() => setCopiedInvite(false), 2500);
    } catch (err) {
      console.error('Error copying invite text:', err);
    }
  };

  const handleDownloadFollowerTemplate = async () => {
    if (!followerTemplateRef.current) return;
    try {
      setIsDownloadingTemplate(true);
      const canvas = await html2canvas(followerTemplateRef.current, {
        scale: 2,
        useCORS: true,
        backgroundColor: '#030712',
      });
      const dataUrl = canvas.toDataURL('image/png');
      const link = document.createElement('a');
      link.download = `template-seguidores-desafio-prof-giu.png`;
      link.href = dataUrl;
      link.click();

      confetti({
        particleCount: 80,
        spread: 60,
        origin: { y: 0.6 },
      });
    } catch (err) {
      console.error('Error generating template:', err);
    } finally {
      setIsDownloadingTemplate(false);
    }
  };

  const handlePledge = () => {
    if (!hasPledged) {
      setCommunityPledgeCount((c) => c + 1);
      setHasPledged(true);
      confetti({
        particleCount: 60,
        spread: 50,
        origin: { y: 0.6 },
      });
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/85 backdrop-blur-md overflow-y-auto">
      <div className="relative w-full max-w-4xl bg-slate-950 border border-slate-800 rounded-2xl shadow-2xl overflow-hidden my-auto">
        
        {/* Header */}
        <div className="flex items-center justify-between p-4 sm:p-5 border-b border-slate-800 bg-slate-900/60">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-indigo-500 to-cyan-500 flex items-center justify-center text-white shadow-md shadow-indigo-500/20">
              <Users className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base sm:text-lg font-bold text-white flex items-center gap-2">
                Desafio Comunidade @prof_giu
                <span className="text-[11px] font-semibold px-2 py-0.5 rounded-full bg-indigo-500/20 text-indigo-300 border border-indigo-500/30">
                  Meta Fim de Ano 2026
                </span>
              </h3>
              <p className="text-xs text-slate-400">
                Engaje seus seguidores a construírem a meta junto com você até 31/12/2026
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

        {/* Content Body */}
        <div className="p-4 sm:p-6 max-h-[80vh] overflow-y-auto space-y-6">
          
          {/* Top Banner Counter */}
          <div className="rounded-2xl bg-gradient-to-r from-indigo-950/80 via-slate-900 to-cyan-950/80 border border-indigo-500/30 p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <span className="text-[11px] uppercase tracking-wider font-bold text-cyan-400 block">
                Comunidade Engajada
              </span>
              <h4 className="text-xl sm:text-2xl font-extrabold text-white font-display mt-0.5">
                {communityPledgeCount} seguidores treinando com a @prof_giu
              </h4>
              <p className="text-xs text-slate-400 mt-1">
                Faltam {stats.daysRemainingToGoal} dias para 31 de dezembro de 2026!
              </p>
            </div>

            <button
              onClick={handlePledge}
              disabled={hasPledged}
              className={`flex items-center gap-2 px-4 py-2.5 rounded-xl font-bold text-xs sm:text-sm transition-all cursor-pointer ${
                hasPledged
                  ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40'
                  : 'bg-indigo-600 hover:bg-indigo-500 text-white shadow-lg shadow-indigo-600/30 active:scale-95'
              }`}
            >
              <Heart className={`w-4 h-4 ${hasPledged ? 'fill-emerald-400 text-emerald-400' : 'fill-white'}`} />
              <span>{hasPledged ? 'Você confirmou a meta!' : 'Simular +1 Seguidor no Desafio'}</span>
            </button>
          </div>

          {/* Two Columns: Follower Template Preview & Copy Script */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
            
            {/* Template Card for Followers (5 Cols) */}
            <div className="lg:col-span-5 flex flex-col items-center">
              <span className="text-xs font-semibold text-slate-300 mb-2 flex items-center gap-1.5">
                <Sparkles className="w-3.5 h-3.5 text-cyan-400" />
                Template de Stories para os Seguidores
              </span>

              {/* The Follower Card (to capture with html2canvas) */}
              <div
                ref={followerTemplateRef}
                className="w-[280px] sm:w-[300px] aspect-[9/16] rounded-[24px] bg-slate-950 border-2 border-dashed border-cyan-500/50 p-5 flex flex-col justify-between relative overflow-hidden shadow-2xl"
                style={{
                  background: 'linear-gradient(180deg, #0f172a 0%, #020617 100%)',
                }}
              >
                {/* Header */}
                <div className="flex items-center justify-between border-b border-slate-800 pb-3">
                  <div className="flex items-center gap-2">
                    <div className="w-8 h-8 rounded-full bg-cyan-500/20 border border-cyan-400/50 flex items-center justify-center font-bold text-xs text-cyan-300">
                      GP
                    </div>
                    <div>
                      <span className="text-[11px] font-bold text-white block">
                        {goal.userHandle}
                      </span>
                      <span className="text-[9px] text-cyan-400">Desafio Fim de Ano 2026</span>
                    </div>
                  </div>
                  <span className="text-[10px] text-slate-400 font-bold">ATÉ 31/12</span>
                </div>

                {/* Big Badge */}
                <div className="text-center my-auto space-y-3">
                  <div className="inline-block px-3 py-1 rounded-full bg-gradient-to-r from-cyan-500 to-indigo-500 text-slate-950 font-black text-xs uppercase tracking-wider">
                    EU TÔ NO DESAFIO! 🔥
                  </div>

                  <h5 className="text-base font-extrabold text-white leading-tight font-display">
                    META FIM DE ANO 2026
                  </h5>

                  {/* Fill-in boxes for followers */}
                  <div className="space-y-2 text-left pt-2">
                    <div className="p-2.5 rounded-xl bg-slate-900 border border-slate-800">
                      <span className="text-[9px] font-bold text-cyan-400 uppercase block">
                        Minha Meta Individual:
                      </span>
                      <div className="h-6 border-b border-slate-700 border-dashed mt-1 flex items-center text-xs text-slate-500 italic">
                        (escreva sua meta aqui)
                      </div>
                    </div>

                    <div className="p-2.5 rounded-xl bg-slate-900 border border-slate-800">
                      <span className="text-[9px] font-bold text-rose-400 uppercase block">
                        Treino de Hoje:
                      </span>
                      <div className="flex items-center gap-3 mt-1 text-[11px] text-slate-300">
                        <span className="flex items-center gap-1">
                          <span className="w-3.5 h-3.5 rounded border border-slate-600 inline-block" />
                          Feito!
                        </span>
                        <span className="flex items-center gap-1">
                          <span className="w-3.5 h-3.5 rounded border border-slate-600 inline-block" />
                          Descanso
                        </span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Footer Tag Instructions */}
                <div className="pt-3 border-t border-slate-800 text-center space-y-1">
                  <span className="text-[10px] font-bold text-slate-300 block">
                    Marque a @prof_giu para ser repostado(a)!
                  </span>
                  <span className="text-[9px] text-cyan-400 font-semibold block">
                    #DesafioProfGiu • Faltam {stats.daysRemainingToGoal} dias
                  </span>
                </div>
              </div>

              {/* Download Template Button */}
              <button
                onClick={handleDownloadFollowerTemplate}
                disabled={isDownloadingTemplate}
                className="mt-3 w-full max-w-[300px] flex items-center justify-center gap-2 px-3 py-2.5 rounded-xl text-xs font-bold bg-cyan-500 hover:bg-cyan-400 text-slate-950 shadow-md shadow-cyan-500/20 transition-all cursor-pointer disabled:opacity-50"
              >
                <Download className="w-4 h-4 stroke-[2.5]" />
                <span>{isDownloadingTemplate ? 'Gerando...' : 'Baixar Template em Branco'}</span>
              </button>
            </div>

            {/* Script / Invite Copy for Followers (7 Cols) */}
            <div className="lg:col-span-7 space-y-4">
              <div>
                <label className="text-xs font-bold uppercase tracking-wider text-slate-400 block mb-1.5">
                  Texto de Convite Pronto para Postar no Instagram
                </label>
                <p className="text-xs text-slate-400 mb-2">
                  Use essa legenda no seu feed, carrossel ou stories para convocar a sua comunidade a treinar com você:
                </p>

                <div className="p-4 rounded-xl bg-slate-900 border border-slate-800 text-xs text-slate-200 leading-relaxed font-mono whitespace-pre-line max-h-[280px] overflow-y-auto">
                  {invitePostScript}
                </div>

                <div className="mt-3 flex items-center gap-2">
                  <button
                    onClick={handleCopyInvite}
                    className="flex-1 flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl text-xs font-bold bg-indigo-600 hover:bg-indigo-500 text-white shadow-md shadow-indigo-600/20 transition-all cursor-pointer"
                  >
                    {copiedInvite ? (
                      <>
                        <Check className="w-4 h-4 stroke-[3] text-emerald-300" />
                        <span>Texto Copiado para a Área de Transferência!</span>
                      </>
                    ) : (
                      <>
                        <Copy className="w-4 h-4" />
                        <span>Copiar Texto Completo do Convite</span>
                      </>
                    )}
                  </button>
                </div>
              </div>

              {/* Ideas for Instagram Stories / Reels */}
              <div className="p-4 rounded-xl bg-slate-900/60 border border-slate-800 space-y-2">
                <span className="text-xs font-bold text-white flex items-center gap-1.5">
                  <MessageSquare className="w-4 h-4 text-cyan-400" />
                  Dicas para engajar a audiência da @prof_giu:
                </span>
                <ul className="text-xs text-slate-400 space-y-1.5 list-disc pl-4">
                  <li>
                    <strong>Caixinha de perguntas nos Stories:</strong> "Qual é a sua meta de treino até 31/12/2026?"
                  </li>
                  <li>
                    <strong>Destaque no Instagram:</strong> Crie um destaque "META 2026" com cada check diário gerado no app.
                  </li>
                  <li>
                    <strong>Reposts dos seguidores:</strong> Reposte todos que usarem a hashtag <code>#DesafioProfGiu</code>.
                  </li>
                </ul>
              </div>

            </div>

          </div>

        </div>

      </div>
    </div>
  );
};
