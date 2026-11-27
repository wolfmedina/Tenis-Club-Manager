import React, { useState } from 'react';
import {
  CheckCircle2,
  Clock,
  QrCode,
  Search,
  ShieldCheck,
  UserCheck,
  XCircle,
} from 'lucide-react';
import { useApp } from '../../../context/AppContext';
import { formatHour12 } from '../../../utils/tennisLogic';

export const AdminCheckInView: React.FC = () => {
  const { state, activeSede, validateCheckInCode, directCheckIn } = useApp();

  const [codeInput, setCodeInput] = useState('');
  const [validationResult, setValidationResult] = useState<{
    ok: boolean;
    message: string;
  } | null>(null);

  const todayReservas = state.reservas.filter(
    (r) => r.sedeId === activeSede.id && r.fecha === '2026-11-27'
  );

  const handleValidate = (e: React.FormEvent) => {
    e.preventDefault();
    if (!codeInput.trim()) return;
    const res = validateCheckInCode(codeInput.trim());
    setValidationResult(res);
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      {/* Header */}
      <div>
        <h1 className="text-2xl sm:text-3xl font-extrabold text-[#1E2B45] tracking-tight">
          Control de Acceso y Check-in
        </h1>
        <p className="text-xs sm:text-sm text-slate-500 mt-0.5">
          Recepción y validación de jugadores en garita o counter de {activeSede.nombre}
        </p>
      </div>

      {/* Terminal Barcode / Code Scanner Card */}
      <div className="bg-white rounded-3xl p-6 border border-slate-200/80 shadow-md">
        <div className="max-w-xl mx-auto space-y-4 text-center">
          <div className="w-12 h-12 rounded-2xl bg-[#ACD638]/20 text-[#3d5d08] flex items-center justify-center mx-auto">
            <QrCode className="w-6 h-6" />
          </div>

          <div>
            <h2 className="text-lg font-extrabold text-[#1E2B45]">
              Terminal de Ingreso Rápido
            </h2>
            <p className="text-xs text-slate-400 mt-0.5">
              Ingresa el código alfanumérico (ej. TCP-2401) o escanea el código QR del pase del jugador
            </p>
          </div>

          <form onSubmit={handleValidate} className="flex gap-2">
            <input
              type="text"
              value={codeInput}
              onChange={(e) => setCodeInput(e.target.value.toUpperCase())}
              placeholder="Código de Reserva (TCP-XXXX)"
              className="flex-1 px-4 py-3 rounded-2xl border-2 border-slate-200 font-mono text-base font-extrabold tracking-wider uppercase text-[#1E2B45] placeholder:text-slate-300 focus:outline-none focus:border-[#ACD638]"
            />
            <button
              type="submit"
              className="px-6 py-3 rounded-2xl bg-[#ACD638] hover:bg-[#9ec82f] text-[#16223B] font-extrabold text-xs sm:text-sm shadow-sm transition cursor-pointer flex items-center gap-2"
            >
              <UserCheck className="w-4 h-4" />
              <span>Validar</span>
            </button>
          </form>

          {validationResult && (
            <div
              className={`p-4 rounded-2xl text-xs font-bold flex items-center justify-center gap-2 ${
                validationResult.ok
                  ? 'bg-emerald-50 border border-emerald-200 text-emerald-800'
                  : 'bg-rose-50 border border-rose-200 text-rose-800'
              }`}
            >
              {validationResult.ok ? (
                <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
              ) : (
                <XCircle className="w-4 h-4 text-rose-600 shrink-0" />
              )}
              <span>{validationResult.message}</span>
            </div>
          )}
        </div>
      </div>

      {/* Today's Bookings Table with 1-click Check-in */}
      <div className="bg-white rounded-2xl p-5 border border-slate-200/80 shadow-xs space-y-3">
        <div className="flex items-center justify-between pb-3 border-b border-slate-100">
          <h2 className="text-base font-extrabold text-[#1E2B45] flex items-center gap-2">
            <Clock className="w-4 h-4 text-[#273758]" />
            <span>Turnos de Hoy (Vie, 27 nov)</span>
          </h2>
          <span className="text-xs text-slate-400 font-medium">
            {todayReservas.length} registros
          </span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="border-b border-slate-100 text-[11px] font-bold text-slate-400 uppercase tracking-wider">
                <th className="py-2.5">Código</th>
                <th className="py-2.5">Hora</th>
                <th className="py-2.5">Cancha</th>
                <th className="py-2.5">Titular / Jugadores</th>
                <th className="py-2.5">Pago</th>
                <th className="py-2.5">Estado Asistencia</th>
                <th className="py-2.5 text-right">Acción</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 font-medium">
              {todayReservas.map((res) => {
                const cancha = state.canchas.find((c) => c.id === res.canchaId);
                const isCheckedIn = res.asistenciaValidada;

                return (
                  <tr key={res.id} className="hover:bg-slate-50/60">
                    <td className="py-3 font-mono font-bold text-[#273758]">{res.codigo}</td>
                    <td className="py-3 font-semibold text-slate-700">
                      {formatHour12(res.horaInicio)} ({res.duracionMin} min)
                    </td>
                    <td className="py-3 text-[#1E2B45] font-bold">{cancha?.nombre || 'Cancha'}</td>
                    <td className="py-3 text-slate-700">{res.participantes.join(', ')}</td>
                    <td className="py-3">
                      <span className="px-2 py-0.5 rounded-full bg-slate-100 text-slate-700 text-[10.5px] font-bold">
                        B/. {res.totalPagado.toFixed(2)} ({res.pagoEstado})
                      </span>
                    </td>
                    <td className="py-3">
                      {isCheckedIn ? (
                        <span className="inline-flex items-center gap-1 text-[11px] font-extrabold text-emerald-700 bg-emerald-50 px-2.5 py-0.5 rounded-full border border-emerald-200">
                          <CheckCircle2 className="w-3.5 h-3.5" />
                          Ingresó
                        </span>
                      ) : (
                        <span className="text-[11px] font-semibold text-slate-400">
                          Pendiente de llegada
                        </span>
                      )}
                    </td>
                    <td className="py-3 text-right">
                      {!isCheckedIn && res.estado !== 'Cancelada' ? (
                        <button
                          type="button"
                          onClick={() => directCheckIn(res.id)}
                          className="px-3 py-1.5 rounded-xl bg-[#ACD638] hover:bg-[#9ec82f] text-[#16223B] text-[11px] font-extrabold shadow-2xs transition cursor-pointer"
                        >
                          Check-in
                        </button>
                      ) : (
                        <span className="text-xs text-slate-400 font-medium">Completado</span>
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
  );
};
