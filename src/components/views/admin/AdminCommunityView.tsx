import React, { useState } from 'react';
import {
  Calendar,
  CheckCircle2,
  Clock,
  MessageSquare,
  Plus,
  Scale,
  Search,
  Star,
  Trophy,
  Users,
  Vote,
  XCircle,
} from 'lucide-react';
import { useApp } from '../../../context/AppContext';
import { PlayerAvatar } from '../../VisualAssets';
import type { Modality, RankingCategory, SkillLevel } from '../../../types/tennis';
import { formatHour12, getLeaderboard } from '../../../utils/tennisLogic';

interface AdminCommunityViewProps {
  initialSubTab?: 'partidos' | 'planificacion' | 'resultados' | 'rankings';
}

export const AdminCommunityView: React.FC<AdminCommunityViewProps> = ({
  initialSubTab = 'partidos',
}) => {
  const {
    state,
    activeSede,
    joinConvocatoria,
    leaveConvocatoria,
    votePlanificacion,
    convertPlanificacionToBooking,
    confirmMatchResult,
    resolveDisputedMatch,
    reportMatchResult,
  } = useApp();

  const [activeTab, setActiveTab] = useState<'partidos' | 'planificacion' | 'resultados' | 'rankings'>(
    initialSubTab
  );

  const [rankingCategory, setRankingCategory] = useState<RankingCategory>('Amateur');
  const [rankingSearch, setRankingSearch] = useState('');

  // Report match modal
  const [showMatchModal, setShowMatchModal] = useState(false);
  const [matchRivalId, setMatchRivalId] = useState(state.usuarios.find((u) => u.rol === 'jugador')?.id || '');
  const [matchSets, setMatchSets] = useState('6-4, 7-5');
  const [matchWinner, setMatchWinner] = useState<'A' | 'B'>('A');

  const leaderboards = getLeaderboard(state.usuarios, rankingCategory, activeSede.id, state.reservas);
  const filteredLeaderboard = leaderboards.filter((u) =>
    u.nombre.toLowerCase().includes(rankingSearch.toLowerCase())
  );

  const handleReportMatch = (e: React.FormEvent) => {
    e.preventDefault();
    reportMatchResult({
      sedeId: activeSede.id,
      modalidad: 'Individual',
      tipo: 'Competitivo',
      categoria: rankingCategory,
      rivalId: matchRivalId,
      marcadorSets: matchSets.trim(),
      ganadorEquipo: matchWinner,
    });
    setShowMatchModal(false);
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-[#1E2B45] tracking-tight">
            Comunidad Deportiva
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 mt-0.5">
            Partidos abiertos, planificación grupal, resultados y ranking oficial de Panamá
          </p>
        </div>

        {activeTab === 'resultados' && (
          <button
            type="button"
            onClick={() => setShowMatchModal(true)}
            className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-[#ACD638] hover:bg-[#9ec82f] text-[#16223B] text-xs font-extrabold shadow-sm transition cursor-pointer self-start sm:self-auto"
          >
            <Plus className="w-4 h-4" />
            <span>Registrar Marcador</span>
          </button>
        )}
      </div>

      {/* Tabs Bar */}
      <div className="bg-white rounded-2xl p-2 border border-slate-200/80 shadow-xs flex flex-wrap gap-1">
        {[
          { id: 'partidos', label: 'Partidos Abiertos', icon: Users },
          { id: 'planificacion', label: 'Planificación Grupal', icon: Vote },
          { id: 'resultados', label: 'Resultados y Disputas', icon: Scale },
          { id: 'rankings', label: 'Rankings Oficiales', icon: Trophy },
        ].map((tab) => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              type="button"
              onClick={() => setActiveTab(tab.id as any)}
              className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition cursor-pointer ${
                isActive
                  ? 'bg-[#ACD638] text-[#16223B] shadow-xs'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
              }`}
            >
              <Icon className="w-4 h-4" />
              <span>{tab.label}</span>
            </button>
          );
        })}
      </div>

      {/* TAB 1: PARTIDOS ABIERTOS */}
      {activeTab === 'partidos' && (
        <div className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {state.convocatorias.map((conv) => {
              const cancha = state.canchas.find((c) => c.id === conv.canchaId);
              const isFull = conv.jugadoresIds.length >= conv.cupoTotal;

              return (
                <div
                  key={conv.id}
                  className="bg-white rounded-2xl p-5 border border-slate-200/80 shadow-xs flex flex-col justify-between space-y-4 hover:shadow-md transition"
                >
                  <div className="space-y-2">
                    <div className="flex items-start justify-between">
                      <span className="px-2 py-0.5 rounded-full bg-slate-100 text-slate-700 text-[10.5px] font-bold">
                        {conv.modalidad} · {conv.nivel}
                      </span>
                      <span
                        className={`px-2 py-0.5 rounded-full text-[10px] font-extrabold uppercase ${
                          isFull
                            ? 'bg-amber-100 text-amber-800'
                            : 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                        }`}
                      >
                        {isFull ? 'Completa' : 'Abierta'}
                      </span>
                    </div>

                    <h3 className="text-base font-extrabold text-[#1E2B45]">{conv.titulo}</h3>
                    <p className="text-xs text-slate-600 leading-relaxed">{conv.descripcion}</p>

                    <div className="grid grid-cols-2 gap-2 text-xs bg-slate-50 p-2.5 rounded-xl border border-slate-100">
                      <div>
                        <span className="text-slate-400 block text-[10.5px]">Horario:</span>
                        <span className="font-bold text-[#1E2B45]">
                          {conv.fecha} · {formatHour12(conv.horaInicio)}
                        </span>
                      </div>
                      <div>
                        <span className="text-slate-400 block text-[10.5px]">Cancha:</span>
                        <span className="font-bold text-[#1E2B45]">{cancha?.nombre || 'Cancha'}</span>
                      </div>
                      <div>
                        <span className="text-slate-400 block text-[10.5px]">Cupos:</span>
                        <span className="font-extrabold text-[#1E2B45]">
                          {conv.jugadoresIds.length} / {conv.cupoTotal} jugadores
                        </span>
                      </div>
                      <div>
                        <span className="text-slate-400 block text-[10.5px]">Aporte por jugador:</span>
                        <span className="font-extrabold text-[#5E8210]">
                          B/. {conv.aportePorJugador.toFixed(2)}
                        </span>
                      </div>
                    </div>

                    {/* Players Avatars */}
                    <div>
                      <span className="text-[10.5px] font-bold text-slate-400 uppercase tracking-wider block mb-1">
                        Participantes confirmados
                      </span>
                      <div className="flex items-center gap-1.5 flex-wrap">
                        {conv.jugadoresIds.map((jId) => {
                          const user = state.usuarios.find((u) => u.id === jId);
                          return (
                            <div
                              key={jId}
                              className="flex items-center gap-1 bg-white px-2 py-1 rounded-lg border border-slate-200 text-xs"
                            >
                              <PlayerAvatar
                                nombre={user?.nombre || 'Jugador'}
                                seed={user?.avatarSeed}
                                size="xs"
                              />
                              <span className="font-bold text-[#1E2B45] text-[11px]">
                                {user?.nombre?.split(' ')[0] || 'Jugador'}
                              </span>
                            </div>
                          );
                        })}
                      </div>
                    </div>
                  </div>

                  <div className="pt-3 border-t border-slate-100 flex gap-2">
                    <button
                      type="button"
                      onClick={() => joinConvocatoria(conv.id)}
                      className="flex-1 py-2 rounded-xl bg-[#ACD638] hover:bg-[#9ec82f] text-[#16223B] text-xs font-extrabold cursor-pointer transition shadow-2xs"
                    >
                      {isFull ? 'Entrar en Lista de Espera' : 'Unirse al Partido'}
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* TAB 2: PLANIFICACIÓN GRUPAL */}
      {activeTab === 'planificacion' && (
        <div className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {state.planificaciones.map((plan) => {
              const quorumReached = plan.jugadoresIds.length >= plan.quorumMinimo;

              return (
                <div
                  key={plan.id}
                  className="bg-white rounded-2xl p-5 border border-slate-200/80 shadow-xs flex flex-col justify-between space-y-4"
                >
                  <div className="space-y-3">
                    <div className="flex items-start justify-between">
                      <span className="px-2 py-0.5 rounded-full bg-slate-100 text-slate-700 text-[10.5px] font-bold">
                        {plan.modalidad} · {plan.nivel}
                      </span>
                      <span
                        className={`px-2.5 py-0.5 rounded-full text-[10px] font-extrabold uppercase ${
                          quorumReached
                            ? 'bg-emerald-100 text-emerald-800'
                            : 'bg-amber-100 text-amber-800'
                        }`}
                      >
                        {quorumReached ? 'Quórum Alcanzado' : 'En Votación'}
                      </span>
                    </div>

                    <h3 className="text-base font-extrabold text-[#1E2B45]">{plan.titulo}</h3>
                    <p className="text-xs text-slate-500">
                      Coordinación colaborativa sin reserva ni cobro anticipado. Quórum requerido:{' '}
                      <strong>{plan.quorumMinimo} jugadores</strong>.
                    </p>

                    {/* Options Voting List */}
                    <div className="space-y-2">
                      <span className="text-[10.5px] font-bold text-slate-400 uppercase tracking-wider block">
                        Opciones de fecha y horario:
                      </span>
                      {plan.opciones.map((op) => (
                        <div
                          key={op.id}
                          className="flex items-center justify-between p-2.5 rounded-xl border border-slate-200 bg-slate-50 text-xs"
                        >
                          <div>
                            <span className="font-bold text-[#1E2B45] block">
                              {op.fecha} · {formatHour12(op.horaInicio)} - {formatHour12(op.horaFin)}
                            </span>
                            <span className="text-[10.5px] text-slate-400">
                              {op.votosIds.length} votos registrados
                            </span>
                          </div>

                          <div className="flex items-center gap-2">
                            <button
                              type="button"
                              onClick={() => votePlanificacion(plan.id, op.id)}
                              className="px-3 py-1 rounded-lg bg-white hover:bg-slate-100 border border-slate-200 text-xs font-bold text-[#273758] transition cursor-pointer"
                            >
                              Votar
                            </button>
                            {quorumReached && plan.estado !== 'Reservada' && (
                              <button
                                type="button"
                                onClick={() =>
                                  convertPlanificacionToBooking(
                                    plan.id,
                                    op.id,
                                    state.canchas[0]?.id || '',
                                    'Tarjeta'
                                  )
                                }
                                className="px-3 py-1 rounded-lg bg-[#ACD638] hover:bg-[#9ec82f] text-xs font-extrabold text-[#16223B] transition cursor-pointer"
                              >
                                Reservar
                              </button>
                            )}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* TAB 3: RESULTADOS Y DISPUTAS */}
      {activeTab === 'resultados' && (
        <div className="space-y-6">
          {/* Recent Match Results Table */}
          <div className="bg-white rounded-2xl p-5 border border-slate-200/80 shadow-xs space-y-3">
            <h2 className="text-base font-extrabold text-[#1E2B45] flex items-center gap-2">
              <Trophy className="w-4 h-4 text-[#273758]" />
              <span>Resultados Recientes y Ajustes Elo</span>
            </h2>

            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead>
                  <tr className="border-b border-slate-200 text-[11px] font-bold text-slate-400 uppercase">
                    <th className="py-2.5">Fecha</th>
                    <th className="py-2.5">Categoría</th>
                    <th className="py-2.5">Ganador</th>
                    <th className="py-2.5">Rival</th>
                    <th className="py-2.5">Marcador Sets</th>
                    <th className="py-2.5">Estado Elo</th>
                    <th className="py-2.5 text-right">Acción</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 font-medium">
                  {state.partidos.map((partido) => {
                    const playerA = state.usuarios.find((u) => partido.equipoAIds.includes(u.id));
                    const playerB = state.usuarios.find((u) => partido.equipoBIds.includes(u.id));

                    return (
                      <tr key={partido.id} className="hover:bg-slate-50/70">
                        <td className="py-3 text-slate-500">{partido.fecha}</td>
                        <td className="py-3 font-semibold text-[#1E2B45]">{partido.categoria}</td>
                        <td className="py-3 font-bold text-emerald-700">
                          {partido.ganadorEquipo === 'A' ? playerA?.nombre : playerB?.nombre}
                        </td>
                        <td className="py-3 text-slate-600">
                          {partido.ganadorEquipo === 'A' ? playerB?.nombre : playerA?.nombre}
                        </td>
                        <td className="py-3 font-mono font-bold text-[#273758]">
                          {partido.marcadorSets}
                        </td>
                        <td className="py-3">
                          <span
                            className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                              partido.estado === 'Confirmado'
                                ? 'bg-emerald-100 text-emerald-800'
                                : partido.estado === 'Disputado'
                                  ? 'bg-rose-100 text-rose-800'
                                  : 'bg-amber-100 text-amber-800'
                            }`}
                          >
                            {partido.estado}
                          </span>
                        </td>
                        <td className="py-3 text-right">
                          {partido.estado === 'Pendiente' && (
                            <button
                              type="button"
                              onClick={() => confirmMatchResult(partido.id)}
                              className="px-3 py-1 rounded-lg bg-[#ACD638] text-[#16223B] font-extrabold text-[11px] cursor-pointer"
                            >
                              Confirmar Elo
                            </button>
                          )}
                          {partido.estado === 'Disputado' && (
                            <div className="flex justify-end gap-1">
                              <button
                                type="button"
                                onClick={() => resolveDisputedMatch(partido.id, 'A')}
                                className="px-2.5 py-1 rounded-lg bg-[#273758] text-white text-[10.5px] font-bold"
                              >
                                Gana A
                              </button>
                              <button
                                type="button"
                                onClick={() => resolveDisputedMatch(partido.id, 'B')}
                                className="px-2.5 py-1 rounded-lg bg-[#273758] text-white text-[10.5px] font-bold"
                              >
                                Gana B
                              </button>
                            </div>
                          )}
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* TAB 4: RANKINGS */}
      {activeTab === 'rankings' && (
        <div className="space-y-4">
          <div className="bg-white rounded-2xl p-4 border border-slate-200/80 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div className="flex items-center gap-1.5 p-1 bg-slate-100 rounded-xl">
              {(['Junior', 'Amateur', 'Profesional'] as RankingCategory[]).map((cat) => (
                <button
                  key={cat}
                  type="button"
                  onClick={() => setRankingCategory(cat)}
                  className={`px-3 py-1.5 rounded-lg text-xs font-bold transition cursor-pointer ${
                    rankingCategory === cat
                      ? 'bg-white text-[#1E2B45] shadow-xs'
                      : 'text-slate-600 hover:text-slate-900'
                  }`}
                >
                  {cat}
                </button>
              ))}
            </div>

            <div className="relative max-w-xs w-full">
              <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                value={rankingSearch}
                onChange={(e) => setRankingSearch(e.target.value)}
                placeholder="Buscar jugador en ranking..."
                className="w-full pl-9 pr-3 py-1.5 rounded-xl border border-slate-200 text-xs font-semibold focus:outline-none focus:ring-2 focus:ring-[#ACD638]"
              />
            </div>
          </div>

          {/* Leaderboard Table */}
          <div className="bg-white rounded-2xl border border-slate-200/80 shadow-xs overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead>
                  <tr className="bg-slate-50 border-b border-slate-200 text-[11px] font-extrabold text-[#273758] uppercase">
                    <th className="py-3 px-4 w-14 text-center">Pos</th>
                    <th className="py-3 px-3">Jugador</th>
                    <th className="py-3 px-3">Nivel</th>
                    <th className="py-3 px-3 text-center">Elo Oficial</th>
                    <th className="py-3 px-3 text-center">Partidos</th>
                    <th className="py-3 px-3 text-center">Victorias %</th>
                    <th className="py-3 px-3">Provincia</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 font-medium">
                  {filteredLeaderboard.map((user, idx) => {
                    const totalM = user.ganados + user.perdidos;
                    const winPct = totalM > 0 ? Math.round((user.ganados / totalM) * 100) : 0;
                    const elo = user.elo[rankingCategory] || 1500;
                    const isPodium = idx < 3;

                    return (
                      <tr key={user.id} className="hover:bg-slate-50/70">
                        <td className="py-3 px-4 text-center">
                          {idx === 0 ? (
                            <span className="w-6 h-6 rounded-full bg-amber-400 text-white font-extrabold text-xs inline-flex items-center justify-center shadow-xs">
                              1
                            </span>
                          ) : idx === 1 ? (
                            <span className="w-6 h-6 rounded-full bg-slate-300 text-slate-800 font-extrabold text-xs inline-flex items-center justify-center shadow-xs">
                              2
                            </span>
                          ) : idx === 2 ? (
                            <span className="w-6 h-6 rounded-full bg-amber-600 text-white font-extrabold text-xs inline-flex items-center justify-center shadow-xs">
                              3
                            </span>
                          ) : (
                            <span className="font-bold text-slate-400">{idx + 1}</span>
                          )}
                        </td>

                        <td className="py-3 px-3">
                          <div className="flex items-center gap-2.5">
                            <PlayerAvatar
                              nombre={user.nombre}
                              seed={user.avatarSeed}
                              size="xs"
                              ringLime={isPodium}
                            />
                            <div>
                              <span className="font-bold text-sm text-[#1E2B45] block">
                                {user.nombre}
                              </span>
                              <span className="text-[10px] text-slate-400">{user.email}</span>
                            </div>
                          </div>
                        </td>

                        <td className="py-3 px-3">
                          <span className="font-semibold text-slate-700">{user.nivel}</span>
                        </td>

                        <td className="py-3 px-3 text-center font-mono font-extrabold text-sm text-[#273758] tabular-nums">
                          {elo}
                        </td>

                        <td className="py-3 px-3 text-center font-bold text-[#1E2B45] tabular-nums">
                          {user.ganados}G - {user.perdidos}P
                        </td>

                        <td className="py-3 px-3 text-center">
                          <span className="font-bold text-emerald-700 text-xs tabular-nums">
                            {winPct}%
                          </span>
                        </td>

                        <td className="py-3 px-3 text-slate-600">{user.provincia}</td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
