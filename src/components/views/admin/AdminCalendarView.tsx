import React, { useState } from 'react';
import {
  Calendar as CalendarIcon,
  ChevronLeft,
  ChevronRight,
  Clock,
  Filter,
  Plus,
  Search,
  Trophy,
  Users,
  CheckCircle2,
  XCircle,
  AlertTriangle,
  QrCode,
  DollarSign,
  X,
} from 'lucide-react';
import { useApp } from '../../../context/AppContext';
import { DemoQRCode } from '../../VisualAssets';
import type { Modality, PaymentMethod, Reserva, ReservaEstado } from '../../../types/tennis';
import { formatHour12, isSlotAvailable } from '../../../utils/tennisLogic';

interface AdminCalendarViewProps {
  onOpenNewBooking: () => void;
}

export const AdminCalendarView: React.FC<AdminCalendarViewProps> = ({
  onOpenNewBooking,
}) => {
  const { state, activeSede, cancelReservation, rescheduleReservation, directCheckIn } =
    useApp();

  const [viewMode, setViewMode] = useState<'diaria' | 'semanal' | 'mensual'>('diaria');
  const [selectedDate, setSelectedDate] = useState('2026-11-27');
  const [canchaFilter, setCanchaFilter] = useState<string>('ALL');
  const [estadoFilter, setEstadoFilter] = useState<string>('ALL');

  // Modal states
  const [selectedReserva, setSelectedReserva] = useState<Reserva | null>(null);
  const [rescheduleMode, setRescheduleMode] = useState(false);
  const [newDate, setNewDate] = useState(selectedDate);
  const [newTime, setNewTime] = useState('18:00');

  const courts = state.canchas.filter(
    (c) => c.sedeId === activeSede.id && (canchaFilter === 'ALL' || c.id === canchaFilter)
  );

  const hoursList = [
    '06:00',
    '07:30',
    '09:00',
    '10:30',
    '12:00',
    '13:30',
    '15:00',
    '16:30',
    '18:00',
    '19:30',
    '21:00',
  ];

  // Helper to find booking in slot
  const findReservaForSlot = (canchaId: string, timeSlot: string) => {
    return state.reservas.find((r) => {
      if (r.canchaId !== canchaId || r.fecha !== selectedDate) return false;
      if (estadoFilter !== 'ALL' && r.estado !== estadoFilter) return false;
      return r.horaInicio === timeSlot;
    });
  };

  // Helper to find class in slot
  const findClaseForSlot = (canchaId: string, timeSlot: string) => {
    return state.clases.find((c) => {
      if (c.canchaId !== canchaId || c.fecha !== selectedDate) return false;
      return c.horaInicio === timeSlot && c.estado !== 'Cancelada';
    });
  };

  // Helper to find maintenance in slot
  const findMaintenanceForCourt = (canchaId: string) => {
    const court = state.canchas.find((c) => c.id === canchaId);
    return court?.estado === 'Mantenimiento' || court?.estado === 'Bloqueada';
  };

  const handleRescheduleSubmit = () => {
    if (!selectedReserva) return;
    const res = rescheduleReservation(selectedReserva.id, newDate, newTime);
    if (res.ok) {
      setRescheduleMode(false);
      setSelectedReserva((prev) => (prev ? { ...prev, fecha: newDate, horaInicio: newTime } : null));
    }
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      {/* Header & Controls */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-[#1E2B45] tracking-tight">
            Calendario de Reservas
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 mt-0.5">
            Agenda operativa de canchas, partidos y clases en {activeSede.nombre}
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={onOpenNewBooking}
            className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-[#ACD638] hover:bg-[#9ec82f] text-[#16223B] text-xs font-extrabold shadow-sm transition cursor-pointer"
          >
            <Plus className="w-4 h-4" />
            <span>Crear Reserva</span>
          </button>
        </div>
      </div>

      {/* Toolbar: Views + Filters + Date Navigator */}
      <div className="bg-white rounded-2xl p-4 border border-slate-200/80 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4">
        {/* Left: View Switcher */}
        <div className="flex items-center gap-1 p-1 bg-slate-100 rounded-xl w-fit">
          <button
            type="button"
            onClick={() => setViewMode('diaria')}
            className={`px-3 py-1.5 text-xs font-bold rounded-lg transition ${
              viewMode === 'diaria'
                ? 'bg-white text-[#1E2B45] shadow-xs'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            Vista Diaria
          </button>
          <button
            type="button"
            onClick={() => setViewMode('semanal')}
            className={`px-3 py-1.5 text-xs font-bold rounded-lg transition ${
              viewMode === 'semanal'
                ? 'bg-white text-[#1E2B45] shadow-xs'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            Vista Semanal
          </button>
          <button
            type="button"
            onClick={() => setViewMode('mensual')}
            className={`px-3 py-1.5 text-xs font-bold rounded-lg transition ${
              viewMode === 'mensual'
                ? 'bg-white text-[#1E2B45] shadow-xs'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            Vista Mensual
          </button>
        </div>

        {/* Center: Date Picker Navigator */}
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={() => {
              const d = new Date(selectedDate);
              d.setDate(d.getDate() - 1);
              setSelectedDate(d.toISOString().slice(0, 10));
            }}
            className="p-1.5 rounded-lg border border-slate-200 hover:bg-slate-50 text-slate-600 cursor-pointer"
          >
            <ChevronLeft className="w-4 h-4" />
          </button>

          <input
            type="date"
            value={selectedDate}
            onChange={(e) => setSelectedDate(e.target.value)}
            className="px-3 py-1.5 rounded-xl border border-slate-200 text-xs font-bold text-[#1E2B45] bg-slate-50 focus:outline-none focus:ring-2 focus:ring-[#ACD638]"
          />

          <button
            type="button"
            onClick={() => {
              const d = new Date(selectedDate);
              d.setDate(d.getDate() + 1);
              setSelectedDate(d.toISOString().slice(0, 10));
            }}
            className="p-1.5 rounded-lg border border-slate-200 hover:bg-slate-50 text-slate-600 cursor-pointer"
          >
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>

        {/* Right: Court & Status Filters */}
        <div className="flex items-center gap-2">
          <select
            value={canchaFilter}
            onChange={(e) => setCanchaFilter(e.target.value)}
            className="text-xs font-semibold bg-slate-50 border border-slate-200 rounded-xl px-2.5 py-1.5 text-slate-700"
          >
            <option value="ALL">Todas las canchas</option>
            {state.canchas
              .filter((c) => c.sedeId === activeSede.id)
              .map((c) => (
                <option key={c.id} value={c.id}>
                  {c.nombre}
                </option>
              ))}
          </select>

          <select
            value={estadoFilter}
            onChange={(e) => setEstadoFilter(e.target.value)}
            className="text-xs font-semibold bg-slate-50 border border-slate-200 rounded-xl px-2.5 py-1.5 text-slate-700"
          >
            <option value="ALL">Todos los estados</option>
            <option value="Confirmada">Confirmadas</option>
            <option value="En curso">En curso</option>
            <option value="Cancelada">Canceladas</option>
          </select>
        </div>
      </div>

      {/* Color Legend Bar */}
      <div className="flex flex-wrap items-center gap-4 text-xs bg-white px-4 py-2.5 rounded-xl border border-slate-200/80">
        <span className="font-bold text-slate-500 uppercase text-[10px] tracking-wider">
          Convención de Colores:
        </span>
        <div className="flex items-center gap-1.5">
          <span className="w-3 h-3 rounded bg-[#ACD638] border border-[#91b827]" />
          <span className="text-slate-600 font-medium">Confirmada</span>
        </div>
        <div className="flex items-center gap-1.5">
          <span className="w-3 h-3 rounded bg-sky-200 border border-sky-300" />
          <span className="text-slate-600 font-medium">Clase / Entrenamiento</span>
        </div>
        <div className="flex items-center gap-1.5">
          <span className="w-3 h-3 rounded bg-purple-200 border border-purple-300" />
          <span className="text-slate-600 font-medium">Torneo / Convocatoria</span>
        </div>
        <div className="flex items-center gap-1.5">
          <span className="w-3 h-3 rounded bg-amber-200 border border-amber-300" />
          <span className="text-slate-600 font-medium">Mantenimiento / Bloqueada</span>
        </div>
        <div className="flex items-center gap-1.5">
          <span className="w-3 h-3 rounded bg-slate-100 border border-slate-200" />
          <span className="text-slate-600 font-medium">Disponible (Clic para agendar)</span>
        </div>
      </div>

      {/* Daily View: Grid of Courts vs Time Slots */}
      {viewMode === 'diaria' && (
        <div className="bg-white rounded-2xl border border-slate-200/80 shadow-xs overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse min-w-[700px]">
              <thead>
                <tr className="bg-slate-50 border-b border-slate-200 text-xs font-extrabold text-[#273758]">
                  <th className="py-3 px-3 w-24 text-center border-r border-slate-200">Hora</th>
                  {courts.map((c) => (
                    <th key={c.id} className="py-3 px-4 text-center border-r border-slate-200 last:border-r-0">
                      <div>
                        <span className="block font-extrabold text-sm text-[#1E2B45]">{c.nombre}</span>
                        <span className="block text-[10px] text-slate-400 font-normal">
                          {c.superficie.split(' ')[0]} · B/. {c.precioHora}/h
                        </span>
                      </div>
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 text-xs">
                {hoursList.map((timeSlot) => (
                  <tr key={timeSlot} className="hover:bg-slate-50/40">
                    <td className="py-3 px-3 text-center font-mono font-bold text-slate-500 bg-slate-50/70 border-r border-slate-200">
                      {formatHour12(timeSlot)}
                    </td>

                    {courts.map((court) => {
                      const res = findReservaForSlot(court.id, timeSlot);
                      const clase = findClaseForSlot(court.id, timeSlot);
                      const isMaintenance = findMaintenanceForCourt(court.id);

                      if (isMaintenance) {
                        return (
                          <td
                            key={court.id}
                            className="p-2 border-r border-slate-200 last:border-r-0 bg-amber-50/40"
                          >
                            <div className="p-2.5 rounded-xl bg-amber-100/80 border border-amber-300 text-amber-900 text-[11px] font-semibold flex items-center gap-1.5">
                              <AlertTriangle className="w-3.5 h-3.5 text-amber-600 shrink-0" />
                              <span>Mantenimiento / Fuera de servicio</span>
                            </div>
                          </td>
                        );
                      }

                      if (clase) {
                        return (
                          <td
                            key={court.id}
                            className="p-2 border-r border-slate-200 last:border-r-0"
                          >
                            <div
                              onClick={() => {
                                // show info
                              }}
                              className="p-2.5 rounded-xl bg-sky-100 border border-sky-300 text-sky-900 text-xs shadow-2xs hover:shadow-sm transition cursor-pointer"
                            >
                              <div className="flex items-center justify-between font-bold">
                                <span>{clase.titulo}</span>
                                <span className="text-[10px] bg-sky-200 px-1.5 py-0.5 rounded font-extrabold">
                                  {clase.alumnosIds.length}/{clase.cupoMax}
                                </span>
                              </div>
                              <span className="text-[10.5px] text-sky-700 block mt-0.5">
                                {clase.duracionMin} min · B/. {clase.precioPorCupo}/cupo
                              </span>
                            </div>
                          </td>
                        );
                      }

                      if (res) {
                        const isCancelled = res.estado === 'Cancelada';
                        const isEnCurso = res.estado === 'En curso';
                        const bgClass = isCancelled
                          ? 'bg-rose-50 border-rose-200 text-rose-800'
                          : isEnCurso
                            ? 'bg-emerald-100 border-emerald-300 text-emerald-900'
                            : 'bg-[#ACD638]/30 border-[#ACD638]/70 text-[#2b4105]';

                        return (
                          <td
                            key={court.id}
                            className="p-2 border-r border-slate-200 last:border-r-0"
                          >
                            <div
                              onClick={() => setSelectedReserva(res)}
                              className={`p-2.5 rounded-xl border text-xs shadow-2xs hover:shadow-sm transition cursor-pointer ${bgClass}`}
                            >
                              <div className="flex items-center justify-between">
                                <span className="font-mono font-bold text-[11px]">{res.codigo}</span>
                                <span className="text-[9.5px] font-extrabold uppercase px-1.5 py-0.5 rounded bg-white/70">
                                  {res.estado}
                                </span>
                              </div>
                              <span className="font-bold text-[#1E2B45] block mt-1 truncate">
                                {res.participantes[0] || 'Jugador'}
                              </span>
                              <div className="flex items-center justify-between text-[10px] text-slate-600 mt-1">
                                <span>{res.modalidad}</span>
                                <span className="font-extrabold">B/. {res.totalPagado.toFixed(2)}</span>
                              </div>
                            </div>
                          </td>
                        );
                      }

                      // Empty slot (available)
                      return (
                        <td
                          key={court.id}
                          className="p-2 border-r border-slate-200 last:border-r-0"
                        >
                          <button
                            type="button"
                            onClick={onOpenNewBooking}
                            className="w-full h-14 rounded-xl border border-dashed border-slate-200 hover:border-[#ACD638] hover:bg-[#ACD638]/10 text-slate-400 hover:text-[#273758] flex items-center justify-center gap-1 transition cursor-pointer text-xs font-semibold"
                          >
                            <Plus className="w-3.5 h-3.5" />
                            <span>Libre</span>
                          </button>
                        </td>
                      );
                    })}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Weekly View Placeholder with functional day matrix */}
      {viewMode === 'semanal' && (
        <div className="bg-white rounded-2xl p-6 border border-slate-200/80 shadow-xs">
          <div className="grid grid-cols-7 gap-3 text-center">
            {['Lun 23', 'Mar 24', 'Mié 25', 'Jue 26', 'Vie 27', 'Sáb 28', 'Dom 29'].map(
              (dayLabel, idx) => (
                <div key={idx} className="p-3 bg-slate-50 rounded-xl border border-slate-200">
                  <span className="text-xs font-bold text-[#273758] block">{dayLabel}</span>
                  <span className="text-xl font-extrabold text-[#1E2B45] block mt-1">
                    {idx === 4 ? '18' : idx === 5 ? '24' : '12'}
                  </span>
                  <span className="text-[10px] text-emerald-600 font-bold block mt-0.5">
                    {idx === 4 ? '85% ocup' : '70% ocup'}
                  </span>
                </div>
              )
            )}
          </div>
          <p className="mt-4 text-center text-xs text-slate-400">
            Selecciona un día para gestionar horarios específicos en vista diaria.
          </p>
        </div>
      )}

      {/* Monthly View Overview */}
      {viewMode === 'mensual' && (
        <div className="bg-white rounded-2xl p-6 border border-slate-200/80 shadow-xs text-center">
          <h3 className="text-base font-bold text-[#1E2B45] mb-2">Noviembre 2026</h3>
          <p className="text-xs text-slate-500 max-w-md mx-auto">
            386 reservas registradas en el mes con una recaudación estimada de B/. 12,480.00 en canchas públicas y privadas.
          </p>
        </div>
      )}

      {/* Reservation Details & Management Modal */}
      {selectedReserva && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/55 p-4 animate-in fade-in">
          <div className="bg-white rounded-3xl p-6 max-w-lg w-full shadow-2xl border border-slate-200 space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <div className="flex items-center gap-2">
                <span className="font-mono text-base font-extrabold text-[#273758]">
                  {selectedReserva.codigo}
                </span>
                <span
                  className={`text-[10px] font-extrabold px-2 py-0.5 rounded-full ${
                    selectedReserva.estado === 'Cancelada'
                      ? 'bg-rose-100 text-rose-800'
                      : selectedReserva.estado === 'En curso'
                        ? 'bg-emerald-100 text-emerald-800'
                        : 'bg-[#ACD638] text-[#16223B]'
                  }`}
                >
                  {selectedReserva.estado}
                </span>
              </div>
              <button
                type="button"
                onClick={() => {
                  setSelectedReserva(null);
                  setRescheduleMode(false);
                }}
                className="p-1 text-slate-400 hover:text-slate-600 rounded-lg"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* QR + Details */}
            <div className="flex flex-col sm:flex-row items-center gap-4 bg-slate-50 p-4 rounded-2xl border border-slate-100">
              <div className="shrink-0">
                <DemoQRCode code={selectedReserva.codigo} />
              </div>

              <div className="space-y-1.5 text-xs text-slate-600 flex-1">
                <div>
                  <span className="text-slate-400 font-semibold block text-[10.5px]">Titular:</span>
                  <span className="font-bold text-[#1E2B45] text-sm">
                    {selectedReserva.participantes.join(', ')}
                  </span>
                </div>
                <div>
                  <span className="text-slate-400 font-semibold block text-[10.5px]">Horario:</span>
                  <span className="font-semibold text-slate-800">
                    {selectedReserva.fecha} a las {formatHour12(selectedReserva.horaInicio)} (
                    {selectedReserva.duracionMin} min)
                  </span>
                </div>
                <div>
                  <span className="text-slate-400 font-semibold block text-[10.5px]">Pago:</span>
                  <span className="font-extrabold text-[#1E2B45]">
                    B/. {selectedReserva.totalPagado.toFixed(2)} ({selectedReserva.metodoPago} ·{' '}
                    {selectedReserva.pagoEstado})
                  </span>
                </div>
              </div>
            </div>

            {/* Reschedule Mode */}
            {rescheduleMode ? (
              <div className="p-3 bg-amber-50 border border-amber-200 rounded-xl space-y-2">
                <p className="text-xs font-bold text-amber-900">Reprogramar fecha y hora</p>
                <div className="grid grid-cols-2 gap-2">
                  <input
                    type="date"
                    value={newDate}
                    onChange={(e) => setNewDate(e.target.value)}
                    className="p-2 rounded-lg border border-slate-200 text-xs font-bold"
                  />
                  <input
                    type="time"
                    value={newTime}
                    onChange={(e) => setNewTime(e.target.value)}
                    className="p-2 rounded-lg border border-slate-200 text-xs font-bold"
                  />
                </div>
                <div className="flex gap-2 pt-1">
                  <button
                    type="button"
                    onClick={handleRescheduleSubmit}
                    className="flex-1 py-2 bg-[#273758] text-white text-xs font-bold rounded-lg cursor-pointer"
                  >
                    Confirmar cambio
                  </button>
                  <button
                    type="button"
                    onClick={() => setRescheduleMode(false)}
                    className="py-2 px-3 border border-slate-200 text-xs font-bold rounded-lg"
                  >
                    Cancelar
                  </button>
                </div>
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 pt-2">
                {!selectedReserva.asistenciaValidada && selectedReserva.estado !== 'Cancelada' && (
                  <button
                    type="button"
                    onClick={() => {
                      directCheckIn(selectedReserva.id);
                      setSelectedReserva((prev) =>
                        prev ? { ...prev, asistenciaValidada: true, estado: 'En curso' } : null
                      );
                    }}
                    className="flex items-center justify-center gap-1.5 py-2.5 px-3 rounded-xl bg-[#ACD638] hover:bg-[#9fc829] text-[#16223B] text-xs font-extrabold cursor-pointer"
                  >
                    <CheckCircle2 className="w-4 h-4" />
                    <span>Validar Check-in</span>
                  </button>
                )}

                {selectedReserva.estado !== 'Cancelada' && (
                  <button
                    type="button"
                    onClick={() => setRescheduleMode(true)}
                    className="flex items-center justify-center gap-1.5 py-2.5 px-3 rounded-xl bg-slate-100 hover:bg-slate-200 text-[#273758] text-xs font-bold cursor-pointer"
                  >
                    <Clock className="w-4 h-4" />
                    <span>Reprogramar</span>
                  </button>
                )}

                {selectedReserva.estado !== 'Cancelada' && (
                  <button
                    type="button"
                    onClick={() => {
                      cancelReservation(selectedReserva.id, true);
                      setSelectedReserva(null);
                    }}
                    className="flex items-center justify-center gap-1.5 py-2.5 px-3 rounded-xl border border-rose-200 hover:bg-rose-50 text-rose-700 text-xs font-bold cursor-pointer"
                  >
                    <XCircle className="w-4 h-4" />
                    <span>Cancelar Reserva</span>
                  </button>
                )}
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};
