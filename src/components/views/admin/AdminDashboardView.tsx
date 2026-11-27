import React, { useState } from 'react';
import {
  AlertTriangle,
  ArrowDownRight,
  ArrowUpRight,
  Calendar,
  ChevronLeft,
  ChevronRight,
  Clock,
  CreditCard,
  DollarSign,
  GraduationCap,
  MapPin,
  TrendingUp,
  Trophy,
  Users,
  Wrench,
  CheckCircle2,
  Plus,
  ArrowRight,
} from 'lucide-react';
import { useApp } from '../../../context/AppContext';
import { resolveAvatarPhoto } from '../../VisualAssets';
import type { AdminModule } from '../../../types/tennis';

interface AdminDashboardViewProps {
  onNavigate: (module: AdminModule) => void;
  onOpenNewBookingModal: () => void;
  onSelectReservation?: (reservaId: string) => void;
}

export const AdminDashboardView: React.FC<AdminDashboardViewProps> = ({
  onNavigate,
  onOpenNewBookingModal,
  onSelectReservation,
}) => {
  const { state, activeSede } = useApp();

  const [classTab, setClassTab] = useState<'proximas' | 'entrenadores'>('proximas');
  const [occupancyRange, setOccupancyRange] = useState<'7d' | '30d' | 'hoy'>('7d');
  const [selectedScheduleDay, setSelectedScheduleDay] = useState('2026-11-27');

  // Compute live metrics from demo state
  const totalReservasCount = state.reservas.filter((r) => r.estado !== 'Cancelada').length;
  const totalActivePlayers = state.usuarios.filter((u) => u.rol === 'jugador').length;
  const totalScheduledClasses = state.clases.filter((c) => c.estado !== 'Cancelada').length;
  const totalMonthlyIncome = state.reservas
    .filter((r) => r.pagoEstado === 'Aprobado')
    .reduce((sum, r) => sum + r.totalPagado, 0) + 12480; // realistic baseline demo volume

  const availableCourtsCount = state.canchas.filter(
    (c) => c.estado === 'Disponible' && c.sedeId === activeSede.id
  ).length;

  const totalCourtsInSede = state.canchas.filter((c) => c.sedeId === activeSede.id).length;

  const publicSedesCount = state.sedes.filter((s) => s.tipo === 'Pública').length;
  const privateSedesCount = state.sedes.filter((s) => s.tipo === 'Privada').length;

  // Active maintenance alerts
  const activeIncidents = state.incidencias.filter((i) => i.estado === 'Abierta');

  // Courts for active venue
  const activeCourts = state.canchas.filter((c) => c.sedeId === activeSede.id).slice(0, 4);

  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-[#1E2B45] tracking-tight">
            Dashboard
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 mt-0.5">
            Resumen general del club y operaciones en {activeSede.nombre}
          </p>
        </div>

        <div className="flex items-center gap-2.5">
          <button
            type="button"
            onClick={onOpenNewBookingModal}
            className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-[#ACD638] hover:bg-[#9ec82f] text-[#16223B] text-xs font-extrabold shadow-sm transition cursor-pointer"
          >
            <Plus className="w-4 h-4" />
            <span>Nueva Reserva</span>
          </button>
          <button
            type="button"
            onClick={() => onNavigate('reportes_financieros')}
            className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-white hover:bg-slate-50 border border-slate-200 text-[#273758] text-xs font-bold transition shadow-xs cursor-pointer"
          >
            <TrendingUp className="w-4 h-4 text-[#5E8210]" />
            <span>Reporte Rápido</span>
          </button>
        </div>
      </div>

      {/* Top 4 Primary KPI Cards (matching 10_Administracion_Web.png) */}
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
        {/* Card 1: Ingresos del mes */}
        <div className="bg-white rounded-2xl p-5 border border-slate-200/80 shadow-xs relative overflow-hidden flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold text-slate-500">Ingresos del mes</span>
              <div className="w-8 h-8 rounded-xl bg-slate-100 flex items-center justify-center text-[#273758]">
                <DollarSign className="w-4 h-4" />
              </div>
            </div>
            <div className="mt-2 text-2xl sm:text-3xl font-extrabold text-[#1E2B45] tabular-nums tracking-tight">
              B/. 12,480.00
            </div>
            <div className="mt-2 flex items-center gap-1.5">
              <span className="inline-flex items-center text-xs font-extrabold text-[#387810] bg-[#ACD638]/20 px-2 py-0.5 rounded-full">
                <ArrowUpRight className="w-3.5 h-3.5 mr-0.5" />
                +18.6%
              </span>
              <span className="text-[11px] text-slate-400">vs. mes anterior</span>
            </div>
          </div>

          {/* Sparkline curve */}
          <div className="mt-3 h-8 w-full">
            <svg viewBox="0 0 120 30" className="w-full h-full overflow-visible">
              <path
                d="M 0,22 Q 20,24 40,16 T 80,14 T 120,4"
                fill="none"
                stroke="#ACD638"
                strokeWidth="2.5"
                strokeLinecap="round"
              />
              <path
                d="M 0,22 Q 20,24 40,16 T 80,14 T 120,4 L 120,30 L 0,30 Z"
                fill="url(#sparkline-grad)"
                opacity="0.3"
              />
              <defs>
                <linearGradient id="sparkline-grad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#ACD638" stopOpacity="0.8" />
                  <stop offset="100%" stopColor="#ACD638" stopOpacity="0.0" />
                </linearGradient>
              </defs>
            </svg>
          </div>
        </div>

        {/* Card 2: Reservas totales */}
        <div className="bg-white rounded-2xl p-5 border border-slate-200/80 shadow-xs flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold text-slate-500">Reservas totales</span>
              <div className="w-8 h-8 rounded-xl bg-slate-100 flex items-center justify-center text-[#273758]">
                <Calendar className="w-4 h-4" />
              </div>
            </div>
            <div className="mt-2 text-2xl sm:text-3xl font-extrabold text-[#1E2B45] tabular-nums tracking-tight">
              386
            </div>
            <div className="mt-2 flex items-center gap-1.5">
              <span className="inline-flex items-center text-xs font-extrabold text-[#387810] bg-[#ACD638]/20 px-2 py-0.5 rounded-full">
                <ArrowUpRight className="w-3.5 h-3.5 mr-0.5" />
                +12.1%
              </span>
              <span className="text-[11px] text-slate-400">confirmadas</span>
            </div>
          </div>
          <p className="mt-3 text-[11px] text-slate-400">
            {totalReservasCount} reservas registradas en el sistema
          </p>
        </div>

        {/* Card 3: Miembros activos */}
        <div className="bg-white rounded-2xl p-5 border border-slate-200/80 shadow-xs flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold text-slate-500">Miembros activos</span>
              <div className="w-8 h-8 rounded-xl bg-slate-100 flex items-center justify-center text-[#273758]">
                <Users className="w-4 h-4" />
              </div>
            </div>
            <div className="mt-2 text-2xl sm:text-3xl font-extrabold text-[#1E2B45] tabular-nums tracking-tight">
              1,248
            </div>
            <div className="mt-2 flex items-center gap-1.5">
              <span className="inline-flex items-center text-xs font-extrabold text-[#387810] bg-[#ACD638]/20 px-2 py-0.5 rounded-full">
                <ArrowUpRight className="w-3.5 h-3.5 mr-0.5" />
                +6.8%
              </span>
              <span className="text-[11px] text-slate-400">comunidad activa</span>
            </div>
          </div>
          <p className="mt-3 text-[11px] text-slate-400">
            {totalActivePlayers} jugadores con ranking federado
          </p>
        </div>

        {/* Card 4: Clases programadas */}
        <div className="bg-white rounded-2xl p-5 border border-slate-200/80 shadow-xs flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold text-slate-500">Clases programadas</span>
              <div className="w-8 h-8 rounded-xl bg-slate-100 flex items-center justify-center text-[#273758]">
                <GraduationCap className="w-4 h-4" />
              </div>
            </div>
            <div className="mt-2 text-2xl sm:text-3xl font-extrabold text-[#1E2B45] tabular-nums tracking-tight">
              64
            </div>
            <div className="mt-2 flex items-center gap-1.5">
              <span className="inline-flex items-center text-xs font-extrabold text-[#387810] bg-[#ACD638]/20 px-2 py-0.5 rounded-full">
                <ArrowUpRight className="w-3.5 h-3.5 mr-0.5" />
                +9.4%
              </span>
              <span className="text-[11px] text-slate-400">este mes</span>
            </div>
          </div>
          <p className="mt-3 text-[11px] text-slate-400">
            {totalScheduledClasses} sesiones grupales y particulares
          </p>
        </div>
      </div>

      {/* Secondary Quick Indicators Strip (Section 3 requirements) */}
      <div className="bg-white rounded-2xl p-4 border border-slate-200/80 shadow-xs grid grid-cols-2 md:grid-cols-6 gap-3 divide-y md:divide-y-0 md:divide-x divide-slate-100 text-center">
        <div className="px-2 pt-2 md:pt-0">
          <span className="block text-[11px] font-semibold text-slate-400 uppercase tracking-wider">
            Ingresos de Hoy
          </span>
          <span className="text-base font-extrabold text-[#1E2B45] tabular-nums mt-0.5 block">
            B/. 840.00
          </span>
          <span className="text-[10px] text-emerald-600 font-bold">14 cobros</span>
        </div>
        <div className="px-2 pt-2 md:pt-0">
          <span className="block text-[11px] font-semibold text-slate-400 uppercase tracking-wider">
            Ocupación Hoy
          </span>
          <span className="text-base font-extrabold text-[#1E2B45] tabular-nums mt-0.5 block">
            76%
          </span>
          <span className="text-[10px] text-emerald-600 font-bold">+8.2 pp</span>
        </div>
        <div className="px-2 pt-2 md:pt-0">
          <span className="block text-[11px] font-semibold text-slate-400 uppercase tracking-wider">
            Canchas Activas
          </span>
          <span className="text-base font-extrabold text-[#1E2B45] tabular-nums mt-0.5 block">
            {availableCourtsCount} / {totalCourtsInSede || 4}
          </span>
          <span className="text-[10px] text-slate-500 font-medium">Disponibles ahora</span>
        </div>
        <div className="px-2 pt-2 md:pt-0">
          <span className="block text-[11px] font-semibold text-slate-400 uppercase tracking-wider">
            Instalaciones
          </span>
          <span className="text-base font-extrabold text-[#1E2B45] tabular-nums mt-0.5 block">
            {privateSedesCount} Priv / {publicSedesCount} Púb
          </span>
          <span className="text-[10px] text-slate-500 font-medium">6 clubes Panamá</span>
        </div>
        <div className="px-2 pt-2 md:pt-0">
          <span className="block text-[11px] font-semibold text-slate-400 uppercase tracking-wider">
            Cancelaciones
          </span>
          <span className="text-base font-extrabold text-[#1E2B45] tabular-nums mt-0.5 block">
            3 este mes
          </span>
          <span className="text-[10px] text-slate-400 font-medium">Tasa baja (0.8%)</span>
        </div>
        <div className="px-2 pt-2 md:pt-0">
          <span className="block text-[11px] font-semibold text-slate-400 uppercase tracking-wider">
            Mantenimiento
          </span>
          <span className="text-base font-extrabold text-amber-600 tabular-nums mt-0.5 block">
            {activeIncidents.length} activa(s)
          </span>
          <span className="text-[10px] text-amber-700 font-bold">1 en atención</span>
        </div>
      </div>

      {/* Middle Grid: Calendario de reservas (Left) + Ocupación (Center) + Estado canchas (Right) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Column: Mini Calendario de reservas (matching 10_Administracion_Web.png) */}
        <div className="lg:col-span-12 xl:col-span-6 bg-white rounded-2xl p-5 border border-slate-200/80 shadow-xs flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <div className="flex items-center gap-2">
                <Calendar className="w-4 h-4 text-[#273758]" />
                <h2 className="text-base font-extrabold text-[#1E2B45]">
                  Calendario de reservas
                </h2>
              </div>
              <div className="flex items-center gap-1.5 bg-slate-50 border border-slate-200 rounded-xl px-2.5 py-1 text-xs font-bold text-slate-700">
                <button
                  type="button"
                  aria-label="Día anterior"
                  className="hover:text-[#273758] p-0.5"
                >
                  <ChevronLeft className="w-3.5 h-3.5" />
                </button>
                <span className="px-1 text-[11.5px] font-semibold">Vie, 24 de enero de 2025</span>
                <Calendar className="w-3.5 h-3.5 text-slate-400 ml-0.5" />
                <button
                  type="button"
                  aria-label="Día siguiente"
                  className="hover:text-[#273758] p-0.5"
                >
                  <ChevronRight className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>

            {/* Grid Table */}
            <div className="mt-3 overflow-x-auto">
              <table className="w-full text-left text-xs border-collapse">
                <thead>
                  <tr className="border-b border-slate-100 text-[11px] font-bold text-slate-400">
                    <th className="py-2 px-2 w-16">Hora</th>
                    <th className="py-2 px-2 text-center">Cancha 1</th>
                    <th className="py-2 px-2 text-center">Cancha 2</th>
                    <th className="py-2 px-2 text-center">Cancha 3</th>
                    <th className="py-2 px-2 text-center">Cancha 4</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 font-medium">
                  {/* Row 5:00 p.m. */}
                  <tr className="hover:bg-slate-50/50">
                    <td className="py-2.5 px-2 text-[11px] text-slate-400 font-mono">5:00 p. m.</td>
                    <td className="p-1" rowSpan={2}>
                      <div
                        onClick={() => onNavigate('clases')}
                        className="bg-sky-50 border border-sky-200 text-sky-800 p-2 rounded-xl text-[10.5px] leading-tight cursor-pointer hover:shadow-xs transition"
                      >
                        <div className="flex items-center gap-1 font-bold text-sky-900">
                          <Users className="w-3 h-3 text-sky-700" />
                          <span>Clase Intermedio</span>
                        </div>
                        <span className="text-[9.5px] text-sky-600">(4 jugadores)</span>
                      </div>
                    </td>
                    <td className="p-1"></td>
                    <td className="p-1"></td>
                    <td className="p-1"></td>
                  </tr>

                  {/* Row 5:30 p.m. */}
                  <tr className="hover:bg-slate-50/50">
                    <td className="py-2.5 px-2 text-[11px] text-slate-400 font-mono">5:30 p. m.</td>
                    <td className="p-1"></td>
                    <td className="p-1" rowSpan={2}>
                      <div
                        onClick={() => onNavigate('calendario')}
                        className="bg-[#ACD638]/20 border border-[#ACD638]/50 text-[#324b08] p-2 rounded-xl text-[10.5px] leading-tight cursor-pointer hover:shadow-xs transition"
                      >
                        <span className="font-bold block">Reserva</span>
                        <span className="text-[10px]">Javier Torres</span>
                      </div>
                    </td>
                    <td className="p-1"></td>
                  </tr>

                  {/* Row 6:00 p.m. */}
                  <tr className="hover:bg-slate-50/50">
                    <td className="py-2.5 px-2 text-[11px] text-slate-400 font-mono">6:00 p. m.</td>
                    <td className="p-1"></td>
                    <td className="p-1" rowSpan={2}>
                      <div
                        onClick={() => onNavigate('calendario')}
                        className="bg-[#ACD638]/20 border border-[#ACD638]/50 text-[#324b08] p-2 rounded-xl text-[10.5px] leading-tight cursor-pointer hover:shadow-xs transition"
                      >
                        <span className="font-bold block">Reserva</span>
                        <span className="text-[10px]">Ana Gómez</span>
                      </div>
                    </td>
                    <td className="p-1" rowSpan={2}>
                      <div
                        onClick={() => onNavigate('comunidad')}
                        className="bg-purple-50 border border-purple-200 text-purple-900 p-2 rounded-xl text-[10.5px] leading-tight cursor-pointer hover:shadow-xs transition"
                      >
                        <div className="flex items-center gap-1 font-bold text-purple-900">
                          <Trophy className="w-3 h-3 text-purple-600" />
                          <span>Liga del Club</span>
                        </div>
                        <span className="text-[9.5px] text-purple-600">(Partido oficial)</span>
                      </div>
                    </td>
                  </tr>

                  {/* Row 6:30 p.m. */}
                  <tr className="hover:bg-slate-50/50">
                    <td className="py-2.5 px-2 text-[11px] text-slate-400 font-mono">6:30 p. m.</td>
                    <td className="p-1" rowSpan={2}>
                      <div
                        onClick={() => onNavigate('calendario')}
                        className="bg-[#ACD638]/20 border border-[#ACD638]/50 text-[#324b08] p-2 rounded-xl text-[10.5px] leading-tight cursor-pointer hover:shadow-xs transition"
                      >
                        <span className="font-bold block">Reserva</span>
                        <span className="text-[10px]">Carlos Méndez</span>
                      </div>
                    </td>
                    <td className="p-1" rowSpan={2}>
                      <div
                        onClick={() => onNavigate('clases')}
                        className="bg-sky-50 border border-sky-200 text-sky-800 p-2 rounded-xl text-[10.5px] leading-tight cursor-pointer hover:shadow-xs transition"
                      >
                        <div className="flex items-center gap-1 font-bold text-sky-900">
                          <Users className="w-3 h-3 text-sky-700" />
                          <span>Clase Principiante</span>
                        </div>
                        <span className="text-[9.5px] text-sky-600">(4 jugadores)</span>
                      </div>
                    </td>
                  </tr>

                  {/* Row 7:00 p.m. */}
                  <tr className="hover:bg-slate-50/50">
                    <td className="py-2.5 px-2 text-[11px] text-slate-400 font-mono">7:00 p. m.</td>
                    <td className="p-1"></td>
                    <td className="p-1"></td>
                  </tr>

                  {/* Row 7:30 p.m. */}
                  <tr className="hover:bg-slate-50/50">
                    <td className="py-2.5 px-2 text-[11px] text-slate-400 font-mono">7:30 p. m.</td>
                    <td className="p-1"></td>
                    <td className="p-1" rowSpan={2}>
                      <div
                        onClick={() => onNavigate('calendario')}
                        className="bg-[#ACD638]/20 border border-[#ACD638]/50 text-[#324b08] p-2 rounded-xl text-[10.5px] leading-tight cursor-pointer hover:shadow-xs transition"
                      >
                        <span className="font-bold block">Reserva</span>
                        <span className="text-[10px]">Luis Ortega</span>
                      </div>
                    </td>
                    <td className="p-1"></td>
                    <td className="p-1" rowSpan={2}>
                      <div
                        onClick={() => onNavigate('calendario')}
                        className="bg-[#ACD638]/20 border border-[#ACD638]/50 text-[#324b08] p-2 rounded-xl text-[10.5px] leading-tight cursor-pointer hover:shadow-xs transition"
                      >
                        <span className="font-bold block">Reserva</span>
                        <span className="text-[10px]">Pablo Ruiz</span>
                      </div>
                    </td>
                  </tr>

                  {/* Row 8:00 p.m. */}
                  <tr className="hover:bg-slate-50/50">
                    <td className="py-2.5 px-2 text-[11px] text-slate-400 font-mono">8:00 p. m.</td>
                    <td className="p-1" rowSpan={2}>
                      <div
                        onClick={() => onNavigate('comunidad')}
                        className="bg-purple-50 border border-purple-200 text-purple-900 p-2 rounded-xl text-[10.5px] leading-tight cursor-pointer hover:shadow-xs transition"
                      >
                        <div className="flex items-center gap-1 font-bold text-purple-900">
                          <Users className="w-3 h-3 text-purple-600" />
                          <span>Doble Mixto</span>
                        </div>
                        <span className="text-[9.5px] text-purple-600">(Torneo Interno)</span>
                      </div>
                    </td>
                    <td className="p-1" rowSpan={2}>
                      <div
                        onClick={() => onNavigate('calendario')}
                        className="bg-[#ACD638]/20 border border-[#ACD638]/50 text-[#324b08] p-2 rounded-xl text-[10.5px] leading-tight cursor-pointer hover:shadow-xs transition"
                      >
                        <span className="font-bold block">Reserva</span>
                        <span className="text-[10px]">María Rivas</span>
                      </div>
                    </td>
                  </tr>

                  {/* Row 8:30 p.m. */}
                  <tr className="hover:bg-slate-50/50">
                    <td className="py-2.5 px-2 text-[11px] text-slate-400 font-mono">8:30 p. m.</td>
                    <td className="p-1"></td>
                    <td className="p-1"></td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>

          <div className="pt-3 mt-2 border-t border-slate-100 flex items-center justify-between">
            <span className="text-[11px] text-slate-400">
              Clic en cualquier reserva para detalles o en hueco libre para reservar
            </span>
            <button
              type="button"
              onClick={() => onNavigate('calendario')}
              className="text-xs font-bold text-[#273758] hover:text-[#ACD638] flex items-center gap-1 cursor-pointer"
            >
              <span>Ver calendario completo</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>

        {/* Center Column: Ocupación de canchas (Donut + Tendencia) */}
        <div className="lg:col-span-6 xl:col-span-3 bg-white rounded-2xl p-5 border border-slate-200/80 shadow-xs flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between pb-2 border-b border-slate-100">
              <div className="flex items-center gap-2">
                <TrendingUp className="w-4 h-4 text-[#273758]" />
                <h2 className="text-base font-extrabold text-[#1E2B45]">
                  Ocupación de canchas
                </h2>
              </div>
              <select
                value={occupancyRange}
                onChange={(e) => setOccupancyRange(e.target.value as any)}
                className="text-[11px] font-semibold bg-slate-50 border border-slate-200 rounded-lg px-2 py-1 text-slate-700"
              >
                <option value="7d">Últimos 7 días</option>
                <option value="30d">Últimos 30 días</option>
                <option value="hoy">Hoy</option>
              </select>
            </div>

            {/* Circular Donut Visual */}
            <div className="py-4 flex flex-col items-center justify-center">
              <div className="relative w-36 h-36 flex items-center justify-center">
                <svg viewBox="0 0 100 100" className="w-full h-full -rotate-90">
                  {/* Background track (Disponibles 24%) */}
                  <circle
                    cx="50"
                    cy="50"
                    r="38"
                    fill="none"
                    stroke="#E2E8F0"
                    strokeWidth="12"
                  />
                  {/* Progress track (Ocupadas 76%) */}
                  <circle
                    cx="50"
                    cy="50"
                    r="38"
                    fill="none"
                    stroke="#ACD638"
                    strokeWidth="12"
                    strokeDasharray="238.7"
                    strokeDashoffset="57.28" // 76%
                    strokeLinecap="round"
                  />
                </svg>
                <div className="absolute inset-0 flex flex-col items-center justify-center text-center">
                  <span className="text-2xl font-extrabold text-[#1E2B45] leading-none tabular-nums">
                    76%
                  </span>
                  <span className="text-[10px] text-slate-400 font-semibold mt-0.5">
                    Ocupación<br />promedio
                  </span>
                </div>
              </div>

              {/* Legend & Trend */}
              <div className="mt-3 flex items-center justify-center gap-4 text-xs">
                <div className="flex items-center gap-1.5">
                  <span className="w-2.5 h-2.5 rounded-full bg-[#ACD638]" />
                  <span className="text-slate-600 font-medium">Ocupadas</span>
                  <span className="font-bold text-[#1E2B45]">76%</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <span className="w-2.5 h-2.5 rounded-full bg-slate-200" />
                  <span className="text-slate-600 font-medium">Disponibles</span>
                  <span className="font-bold text-[#1E2B45]">24%</span>
                </div>
              </div>

              <div className="mt-2 text-center">
                <span className="inline-flex items-center text-xs font-bold text-[#387810]">
                  <ArrowUpRight className="w-3.5 h-3.5 mr-0.5" />
                  +8.2 pp vs. semana anterior (67.8%)
                </span>
              </div>
            </div>

            {/* Daily Trend Line Chart */}
            <div className="pt-2 border-t border-slate-100">
              <span className="text-[11px] font-bold text-slate-600 block mb-1">
                Tendencia de ocupación
              </span>
              <div className="h-20 w-full relative">
                <svg viewBox="0 0 140 45" className="w-full h-full overflow-visible">
                  <path
                    d="M 5,30 L 25,32 L 48,22 L 70,25 L 92,20 L 115,19 L 135,10"
                    fill="none"
                    stroke="#ACD638"
                    strokeWidth="2.5"
                    strokeLinecap="round"
                  />
                  <path
                    d="M 5,30 L 25,32 L 48,22 L 70,25 L 92,20 L 115,19 L 135,10 L 135,45 L 5,45 Z"
                    fill="url(#trend-area-grad)"
                    opacity="0.25"
                  />
                  {/* Point at Vie */}
                  <circle cx="135" cy="10" r="3.5" fill="#ACD638" stroke="#FFFFFF" strokeWidth="1.5" />
                  <defs>
                    <linearGradient id="trend-area-grad" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="0%" stopColor="#ACD638" stopOpacity="0.8" />
                      <stop offset="100%" stopColor="#ACD638" stopOpacity="0.0" />
                    </linearGradient>
                  </defs>
                </svg>
                {/* 76% Pill flag over Friday */}
                <div className="absolute right-0 top-0 bg-[#ACD638] text-[#16223B] font-extrabold text-[9px] px-1.5 py-0.5 rounded shadow-xs">
                  76%
                </div>
              </div>
              <div className="flex justify-between text-[9.5px] font-bold text-slate-400 mt-1">
                <span>Sáb</span>
                <span>Dom</span>
                <span>Lun</span>
                <span>Mar</span>
                <span>Mié</span>
                <span>Jue</span>
                <span>Vie</span>
              </div>
            </div>
          </div>
        </div>

        {/* Right Column: Estado de canchas (Cards with thumbnails) */}
        <div className="lg:col-span-6 xl:col-span-3 bg-white rounded-2xl p-5 border border-slate-200/80 shadow-xs flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <div className="flex items-center gap-2">
                <Trophy className="w-4 h-4 text-[#273758]" />
                <h2 className="text-base font-extrabold text-[#1E2B45]">
                  Estado de canchas
                </h2>
              </div>
              <button
                type="button"
                onClick={() => onNavigate('canchas')}
                className="px-2.5 py-1 text-xs font-bold text-[#273758] bg-slate-100 hover:bg-slate-200 rounded-lg transition cursor-pointer"
              >
                Gestionar
              </button>
            </div>

            <div className="space-y-3 mt-3">
              {activeCourts.map((cancha, index) => {
                const photoSrc =
                  index === 0
                    ? '/assets/photos/privadas/privada_01.webp'
                    : index === 1
                      ? '/assets/photos/privadas/privada_02.webp'
                      : index === 2
                        ? '/assets/photos/privadas/privada_03.webp'
                        : '/assets/photos/privadas/privada_04.webp';

                const isAvailable = cancha.estado === 'Disponible';
                const isMaintenance = cancha.estado === 'Mantenimiento' || cancha.estado === 'Bloqueada';
                const statusLabel = isMaintenance
                  ? 'Mantenimiento'
                  : isAvailable
                    ? 'Disponible'
                    : 'En uso';

                const badgeBg = isMaintenance
                  ? 'bg-amber-100 text-amber-800'
                  : isAvailable
                    ? 'bg-[#ACD638]/20 text-[#3d5c07]'
                    : 'bg-emerald-100 text-emerald-800';

                return (
                  <div
                    key={cancha.id}
                    onClick={() => onNavigate('canchas')}
                    className="flex items-center justify-between p-2 rounded-xl border border-slate-100 hover:bg-slate-50 transition cursor-pointer"
                  >
                    <div className="flex items-center gap-3">
                      <div className="w-12 h-9 rounded-lg overflow-hidden shrink-0 bg-slate-200">
                        <img
                          src={photoSrc}
                          alt={cancha.nombre}
                          className="w-full h-full object-cover"
                        />
                      </div>
                      <div>
                        <span className="text-xs font-bold text-[#1E2B45] block">
                          {cancha.nombre}
                        </span>
                        <span className="text-[10px] text-slate-400">
                          {cancha.superficie.split(' ')[0]} · B/. {cancha.precioHora}/h
                        </span>
                      </div>
                    </div>

                    <div className="flex items-center gap-1.5">
                      <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${badgeBg}`}>
                        ● {statusLabel}
                      </span>
                      <ChevronRight className="w-3.5 h-3.5 text-slate-400" />
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          <div className="pt-3 border-t border-slate-100 flex items-center justify-between text-xs">
            <span className="text-[11px] text-slate-400 font-medium">
              Tarifa regulada &gt; B/. 0.00
            </span>
            <button
              type="button"
              onClick={() => onNavigate('canchas')}
              className="text-xs font-bold text-[#273758] hover:underline"
            >
              Ver todas ({state.canchas.length})
            </button>
          </div>
        </div>
      </div>

      {/* Bottom Row: Clases y entrenadores + Pagos recientes + Notificaciones (Responsive & Pristine Alignment) */}
      <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
        {/* Clases y entrenadores */}
        <div className="col-span-1 bg-white rounded-2xl p-5 border border-slate-200/80 shadow-xs flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <div className="flex items-center gap-2">
                <GraduationCap className="w-4 h-4 text-[#273758]" />
                <h2 className="text-base font-extrabold text-[#1E2B45]">
                  Clases y entrenadores
                </h2>
              </div>
              <button
                type="button"
                onClick={() => onNavigate('clases')}
                className="text-xs font-bold text-[#5E8210] hover:underline flex items-center gap-0.5 cursor-pointer"
              >
                <span>Ver todas</span>
                <ChevronRight className="w-3 h-3" />
              </button>
            </div>

            {/* Segmented control tabs */}
            <div className="flex items-center gap-1 p-1 bg-slate-100 rounded-xl my-3">
              <button
                type="button"
                onClick={() => setClassTab('proximas')}
                className={`flex-1 py-1.5 text-xs font-bold rounded-lg transition ${
                  classTab === 'proximas'
                    ? 'bg-[#ACD638] text-[#16223B] shadow-xs'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                Próximas clases
              </button>
              <button
                type="button"
                onClick={() => setClassTab('entrenadores')}
                className={`flex-1 py-1.5 text-xs font-bold rounded-lg transition ${
                  classTab === 'entrenadores'
                    ? 'bg-[#ACD638] text-[#16223B] shadow-xs'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                Entrenadores
              </button>
            </div>

            {classTab === 'proximas' ? (
              <div className="space-y-2.5">
                {/* Class 1 */}
                <div className="flex items-center justify-between p-3 rounded-xl border border-slate-100 hover:border-slate-200 hover:bg-slate-50/70 transition gap-3">
                  <div className="w-11 shrink-0 text-center py-1.5 px-1 bg-slate-100 rounded-lg border border-slate-200/50">
                    <span className="block text-[9px] font-bold text-slate-500 uppercase tracking-wider leading-none">VIE</span>
                    <span className="block text-sm font-extrabold text-[#1E2B45] my-0.5 leading-none">24</span>
                    <span className="block text-[8.5px] font-bold text-slate-400 uppercase tracking-tight leading-none">ENE</span>
                  </div>

                  <div className="min-w-0 flex-1">
                    <h3 className="text-xs font-bold text-[#1E2B45] truncate">
                      Clase Intermedio
                    </h3>
                    <div className="flex flex-wrap items-center gap-x-2 gap-y-0.5 text-[11px] text-slate-500 mt-1">
                      <span className="inline-flex items-center gap-1 whitespace-nowrap">
                        <Clock className="w-3 h-3 text-slate-400 shrink-0" />
                        <span>6:00 p. m. - 7:00 p. m.</span>
                      </span>
                      <span className="text-slate-300">·</span>
                      <span className="inline-flex items-center gap-1 whitespace-nowrap">
                        <Users className="w-3 h-3 text-slate-400 shrink-0" />
                        <span>4/4</span>
                      </span>
                      <span className="text-slate-300">·</span>
                      <span className="font-semibold text-slate-700 whitespace-nowrap">
                        Cancha 1
                      </span>
                    </div>
                  </div>

                  <div className="flex items-center gap-2 shrink-0 pl-1">
                    <div className="w-8 h-8 rounded-full overflow-hidden bg-slate-200 ring-2 ring-white shadow-2xs shrink-0">
                      <img
                        src="/assets/photos/instructores/instructor_01.webp"
                        alt="Andrés Salazar"
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <div className="hidden sm:block text-right">
                      <span className="block text-[11px] font-bold text-[#1E2B45] whitespace-nowrap leading-tight">
                        Andrés Salazar
                      </span>
                      <span className="block text-[9.5px] text-slate-400 font-medium leading-tight">
                        Entrenador
                      </span>
                    </div>
                  </div>
                </div>

                {/* Class 2 */}
                <div className="flex items-center justify-between p-3 rounded-xl border border-slate-100 hover:border-slate-200 hover:bg-slate-50/70 transition gap-3">
                  <div className="w-11 shrink-0 text-center py-1.5 px-1 bg-slate-100 rounded-lg border border-slate-200/50">
                    <span className="block text-[9px] font-bold text-slate-500 uppercase tracking-wider leading-none">VIE</span>
                    <span className="block text-sm font-extrabold text-[#1E2B45] my-0.5 leading-none">24</span>
                    <span className="block text-[8.5px] font-bold text-slate-400 uppercase tracking-tight leading-none">ENE</span>
                  </div>

                  <div className="min-w-0 flex-1">
                    <h3 className="text-xs font-bold text-[#1E2B45] truncate">
                      Clase Principiante
                    </h3>
                    <div className="flex flex-wrap items-center gap-x-2 gap-y-0.5 text-[11px] text-slate-500 mt-1">
                      <span className="inline-flex items-center gap-1 whitespace-nowrap">
                        <Clock className="w-3 h-3 text-slate-400 shrink-0" />
                        <span>7:00 p. m. - 8:00 p. m.</span>
                      </span>
                      <span className="text-slate-300">·</span>
                      <span className="inline-flex items-center gap-1 whitespace-nowrap">
                        <Users className="w-3 h-3 text-slate-400 shrink-0" />
                        <span>4/4</span>
                      </span>
                      <span className="text-slate-300">·</span>
                      <span className="font-semibold text-slate-700 whitespace-nowrap">
                        Cancha 3
                      </span>
                    </div>
                  </div>

                  <div className="flex items-center gap-2 shrink-0 pl-1">
                    <div className="w-8 h-8 rounded-full overflow-hidden bg-slate-200 ring-2 ring-white shadow-2xs shrink-0">
                      <img
                        src="/assets/photos/instructores/instructor_02.webp"
                        alt="Valeria Paredes"
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <div className="hidden sm:block text-right">
                      <span className="block text-[11px] font-bold text-[#1E2B45] whitespace-nowrap leading-tight">
                        Valeria Paredes
                      </span>
                      <span className="block text-[9.5px] text-slate-400 font-medium leading-tight">
                        Entrenadora
                      </span>
                    </div>
                  </div>
                </div>

                {/* Class 3 */}
                <div className="flex items-center justify-between p-3 rounded-xl border border-slate-100 hover:border-slate-200 hover:bg-slate-50/70 transition gap-3">
                  <div className="w-11 shrink-0 text-center py-1.5 px-1 bg-slate-100 rounded-lg border border-slate-200/50">
                    <span className="block text-[9px] font-bold text-slate-500 uppercase tracking-wider leading-none">SÁB</span>
                    <span className="block text-sm font-extrabold text-[#1E2B45] my-0.5 leading-none">25</span>
                    <span className="block text-[8.5px] font-bold text-slate-400 uppercase tracking-tight leading-none">ENE</span>
                  </div>

                  <div className="min-w-0 flex-1">
                    <h3 className="text-xs font-bold text-[#1E2B45] truncate">
                      Clase Avanzado
                    </h3>
                    <div className="flex flex-wrap items-center gap-x-2 gap-y-0.5 text-[11px] text-slate-500 mt-1">
                      <span className="inline-flex items-center gap-1 whitespace-nowrap">
                        <Clock className="w-3 h-3 text-slate-400 shrink-0" />
                        <span>9:00 a. m. - 10:30 a. m.</span>
                      </span>
                      <span className="text-slate-300">·</span>
                      <span className="inline-flex items-center gap-1 whitespace-nowrap">
                        <Users className="w-3 h-3 text-slate-400 shrink-0" />
                        <span>2/4</span>
                      </span>
                      <span className="text-slate-300">·</span>
                      <span className="font-semibold text-slate-700 whitespace-nowrap">
                        Cancha 2
                      </span>
                    </div>
                  </div>

                  <div className="flex items-center gap-2 shrink-0 pl-1">
                    <div className="w-8 h-8 rounded-full overflow-hidden bg-slate-200 ring-2 ring-white shadow-2xs shrink-0">
                      <img
                        src="/assets/photos/instructores/instructor_03.webp"
                        alt="Ricardo Melo"
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <div className="hidden sm:block text-right">
                      <span className="block text-[11px] font-bold text-[#1E2B45] whitespace-nowrap leading-tight">
                        Ricardo Melo
                      </span>
                      <span className="block text-[9.5px] text-slate-400 font-medium leading-tight">
                        Entrenador
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            ) : (
              <div className="space-y-2">
                {state.instructores.slice(0, 3).map((inst) => (
                  <div
                    key={inst.id}
                    className="flex items-center justify-between p-2.5 rounded-xl border border-slate-100 hover:bg-slate-50 transition"
                  >
                    <div className="flex items-center gap-3 min-w-0">
                      <div className="w-8 h-8 rounded-full overflow-hidden bg-slate-200 ring-1 ring-slate-200 shrink-0">
                        <img
                          src={resolveAvatarPhoto(inst.nombre, inst.avatarSeed, undefined, true)}
                          alt={inst.nombre}
                          className="w-full h-full object-cover"
                        />
                      </div>
                      <div className="min-w-0">
                        <span className="text-xs font-bold text-[#1E2B45] block truncate">{inst.nombre}</span>
                        <span className="text-[10px] text-slate-400 block truncate">{inst.titulo}</span>
                      </div>
                    </div>
                    <span className="text-xs font-bold text-[#273758] tabular-nums whitespace-nowrap pl-2">
                      B/. {inst.precioBase}/h
                    </span>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Pagos recientes */}
        <div className="col-span-1 bg-white rounded-2xl p-5 border border-slate-200/80 shadow-xs flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <div className="flex items-center gap-2">
                <CreditCard className="w-4 h-4 text-[#273758]" />
                <h2 className="text-base font-extrabold text-[#1E2B45]">
                  Pagos recientes
                </h2>
              </div>
              <button
                type="button"
                onClick={() => onNavigate('transacciones')}
                className="text-xs font-bold text-[#5E8210] hover:underline flex items-center gap-0.5 cursor-pointer"
              >
                <span>Ver todas</span>
                <ChevronRight className="w-3 h-3" />
              </button>
            </div>

            <div className="mt-3 overflow-x-auto no-scrollbar">
              <table className="w-full text-left text-xs border-collapse min-w-[340px]">
                <thead>
                  <tr className="border-b border-slate-100 text-[10.5px] font-bold text-slate-400 uppercase tracking-wider">
                    <th className="pb-2.5 pr-2 whitespace-nowrap">Fecha</th>
                    <th className="pb-2.5 px-2 whitespace-nowrap">Concepto</th>
                    <th className="pb-2.5 px-2 whitespace-nowrap">Miembro / Cliente</th>
                    <th className="pb-2.5 pl-2 text-right whitespace-nowrap">Monto</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 font-medium">
                  <tr className="hover:bg-slate-50/70 transition">
                    <td className="py-2.5 pr-2 text-[11px] text-slate-400 whitespace-nowrap font-mono">
                      24 ene, 7:32 p. m.
                    </td>
                    <td className="py-2.5 px-2 text-slate-700 whitespace-nowrap font-medium">
                      Reserva de cancha
                    </td>
                    <td className="py-2.5 px-2 font-bold text-[#1E2B45] whitespace-nowrap">
                      Carlos Méndez
                    </td>
                    <td className="py-2.5 pl-2 text-right whitespace-nowrap">
                      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full bg-[#ACD638] text-[#121C30] font-extrabold text-[11px] tabular-nums whitespace-nowrap shadow-2xs">
                        B/. 18.00
                      </span>
                    </td>
                  </tr>
                  <tr className="hover:bg-slate-50/70 transition">
                    <td className="py-2.5 pr-2 text-[11px] text-slate-400 whitespace-nowrap font-mono">
                      24 ene, 6:45 p. m.
                    </td>
                    <td className="py-2.5 px-2 text-slate-700 whitespace-nowrap font-medium">
                      Clase Intermedio
                    </td>
                    <td className="py-2.5 px-2 font-bold text-[#1E2B45] whitespace-nowrap">
                      Ana Gómez
                    </td>
                    <td className="py-2.5 pl-2 text-right whitespace-nowrap">
                      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full bg-[#ACD638] text-[#121C30] font-extrabold text-[11px] tabular-nums whitespace-nowrap shadow-2xs">
                        B/. 25.00
                      </span>
                    </td>
                  </tr>
                  <tr className="hover:bg-slate-50/70 transition">
                    <td className="py-2.5 pr-2 text-[11px] text-slate-400 whitespace-nowrap font-mono">
                      24 ene, 5:10 p. m.
                    </td>
                    <td className="py-2.5 px-2 text-slate-700 whitespace-nowrap font-medium">
                      Membresía mensual
                    </td>
                    <td className="py-2.5 px-2 font-bold text-[#1E2B45] whitespace-nowrap">
                      Javier Torres
                    </td>
                    <td className="py-2.5 pl-2 text-right whitespace-nowrap">
                      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full bg-[#ACD638] text-[#121C30] font-extrabold text-[11px] tabular-nums whitespace-nowrap shadow-2xs">
                        B/. 85.00
                      </span>
                    </td>
                  </tr>
                  <tr className="hover:bg-slate-50/70 transition">
                    <td className="py-2.5 pr-2 text-[11px] text-slate-400 whitespace-nowrap font-mono">
                      24 ene, 4:28 p. m.
                    </td>
                    <td className="py-2.5 px-2 text-slate-700 whitespace-nowrap font-medium">
                      Reserva de cancha
                    </td>
                    <td className="py-2.5 px-2 font-bold text-[#1E2B45] whitespace-nowrap">
                      María Rivas
                    </td>
                    <td className="py-2.5 pl-2 text-right whitespace-nowrap">
                      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full bg-[#ACD638] text-[#121C30] font-extrabold text-[11px] tabular-nums whitespace-nowrap shadow-2xs">
                        B/. 18.00
                      </span>
                    </td>
                  </tr>
                  <tr className="hover:bg-slate-50/70 transition">
                    <td className="py-2.5 pr-2 text-[11px] text-slate-400 whitespace-nowrap font-mono">
                      24 ene, 3:57 p. m.
                    </td>
                    <td className="py-2.5 px-2 text-slate-700 whitespace-nowrap font-medium">
                      Clase Principiante
                    </td>
                    <td className="py-2.5 px-2 font-bold text-[#1E2B45] whitespace-nowrap">
                      Pablo Ruiz
                    </td>
                    <td className="py-2.5 pl-2 text-right whitespace-nowrap">
                      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full bg-[#ACD638] text-[#121C30] font-extrabold text-[11px] tabular-nums whitespace-nowrap shadow-2xs">
                        B/. 25.00
                      </span>
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </div>

        {/* Notificaciones */}
        <div className="col-span-1 lg:col-span-2 xl:col-span-1 bg-white rounded-2xl p-5 border border-slate-200/80 shadow-xs flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <div className="flex items-center gap-2">
                <AlertTriangle className="w-4 h-4 text-[#273758]" />
                <h2 className="text-base font-extrabold text-[#1E2B45]">
                  Notificaciones
                </h2>
              </div>
              <button
                type="button"
                onClick={() => onNavigate('notificaciones_admin')}
                className="text-xs font-bold text-[#5E8210] hover:underline flex items-center gap-0.5 cursor-pointer"
              >
                <span>Ver todas</span>
                <ChevronRight className="w-3 h-3" />
              </button>
            </div>

            <div className="space-y-3 mt-3">
              {/* Notif 1 */}
              <div className="flex items-start gap-3 p-3 rounded-xl bg-slate-50/80 hover:bg-slate-100/70 transition border border-slate-100/60">
                <span className="w-2 h-2 rounded-full bg-[#ACD638] mt-1.5 shrink-0" />
                <div className="w-8 h-8 rounded-lg bg-white flex items-center justify-center text-[#273758] shadow-2xs shrink-0 border border-slate-100">
                  <Calendar className="w-4 h-4" />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between gap-2">
                    <span className="text-xs font-bold text-[#1E2B45] truncate">Reserva próxima</span>
                    <span className="text-[10px] text-slate-400 whitespace-nowrap shrink-0">Hace 5 min</span>
                  </div>
                  <p className="text-[11px] text-slate-600 truncate mt-0.5">
                    Cancha 1 – Hoy, 6:00 p. m. (Clase Intermedio)
                  </p>
                </div>
              </div>

              {/* Notif 2 */}
              <div className="flex items-start gap-3 p-3 rounded-xl bg-slate-50/80 hover:bg-slate-100/70 transition border border-slate-100/60">
                <span className="w-2 h-2 rounded-full bg-[#ACD638] mt-1.5 shrink-0" />
                <div className="w-8 h-8 rounded-lg bg-white flex items-center justify-center text-[#273758] shadow-2xs shrink-0 border border-slate-100">
                  <Users className="w-4 h-4" />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between gap-2">
                    <span className="text-xs font-bold text-[#1E2B45] truncate">Nueva membresía</span>
                    <span className="text-[10px] text-slate-400 whitespace-nowrap shrink-0">Hace 28 min</span>
                  </div>
                  <p className="text-[11px] text-slate-600 truncate mt-0.5">
                    Lucía Fernández se unió al club (Plan Mensual)
                  </p>
                </div>
              </div>

              {/* Notif 3 */}
              <div className="flex items-start gap-3 p-3 rounded-xl bg-slate-50/80 hover:bg-slate-100/70 transition border border-slate-100/60">
                <span className="w-2 h-2 rounded-full bg-[#ACD638] mt-1.5 shrink-0" />
                <div className="w-8 h-8 rounded-lg bg-white flex items-center justify-center text-[#273758] shadow-2xs shrink-0 border border-slate-100">
                  <CreditCard className="w-4 h-4" />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between gap-2">
                    <span className="text-xs font-bold text-[#1E2B45] truncate">Pago recibido</span>
                    <span className="text-[10px] text-slate-400 whitespace-nowrap shrink-0">Hace 41 min</span>
                  </div>
                  <p className="text-[11px] text-slate-600 truncate mt-0.5">
                    B/. 85.00 – Membresía mensual (Javier Torres)
                  </p>
                </div>
              </div>

              {/* Notif 4 */}
              <div className="flex items-start gap-3 p-3 rounded-xl bg-slate-50/80 hover:bg-slate-100/70 transition border border-slate-100/60">
                <span className="w-2 h-2 rounded-full bg-[#ACD638] mt-1.5 shrink-0" />
                <div className="w-8 h-8 rounded-lg bg-white flex items-center justify-center text-amber-600 shadow-2xs shrink-0 border border-slate-100">
                  <Wrench className="w-4 h-4" />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between gap-2">
                    <span className="text-xs font-bold text-[#1E2B45] truncate">Mantenimiento programado</span>
                    <span className="text-[10px] text-slate-400 whitespace-nowrap shrink-0">Hace 1 h</span>
                  </div>
                  <p className="text-[11px] text-slate-600 truncate mt-0.5">
                    Cancha 4 – Mañana, 8:00 a. m. - 10:00 a. m.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
