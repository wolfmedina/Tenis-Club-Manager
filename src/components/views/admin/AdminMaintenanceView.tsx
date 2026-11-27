import React, { useState } from 'react';
import {
  AlertTriangle,
  CheckCircle2,
  CloudRain,
  Plus,
  ShieldAlert,
  Wrench,
  X,
} from 'lucide-react';
import { useApp } from '../../../context/AppContext';
import type { IncidenciaMantenimiento } from '../../../types/tennis';

export const AdminMaintenanceView: React.FC = () => {
  const { state, activeSede, reportMaintenance, resolveMaintenance, suspendByRain } = useApp();

  const [showModal, setShowModal] = useState(false);
  const [showRainModal, setShowRainModal] = useState(false);
  const [rainReason, setRainReason] = useState(
    'Lluvia torrencial en la zona. Canchas descubiertas suspendidas por seguridad.'
  );

  const [formCanchaId, setFormCanchaId] = useState(state.canchas[0]?.id || '');
  const [formTitulo, setFormTitulo] = useState('');
  const [formDetalle, setFormDetalle] = useState('');
  const [formPrioridad, setFormPrioridad] = useState<IncidenciaMantenimiento['prioridad']>('Alta');
  const [formBloquear, setFormBloquear] = useState(true);

  const activeIncidents = state.incidencias.filter((i) => i.estado === 'Abierta');
  const resolvedIncidents = state.incidencias.filter((i) => i.estado === 'Resuelta');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formTitulo.trim()) return;
    reportMaintenance({
      sedeId: activeSede.id,
      canchaId: formCanchaId,
      titulo: formTitulo.trim(),
      detalle: formDetalle.trim(),
      prioridad: formPrioridad,
      bloquearCancha: formBloquear,
    });
    setShowModal(false);
    setFormTitulo('');
    setFormDetalle('');
  };

  const handleTriggerRain = () => {
    suspendByRain(activeSede.id, '2026-11-27', rainReason);
    setShowRainModal(false);
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-[#1E2B45] tracking-tight">
            Mantenimiento y Alertas Operativas
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 mt-0.5">
            Control de averías, reparaciones de iluminación, redes y contingencias climáticas
          </p>
        </div>

        <div className="flex items-center gap-2.5">
          <button
            type="button"
            onClick={() => setShowRainModal(true)}
            className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-sky-50 hover:bg-sky-100 border border-sky-200 text-sky-800 text-xs font-bold transition cursor-pointer"
          >
            <CloudRain className="w-4 h-4 text-sky-600" />
            <span>Protocolo de Lluvia</span>
          </button>

          <button
            type="button"
            onClick={() => setShowModal(true)}
            className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-[#ACD638] hover:bg-[#9ec82f] text-[#16223B] text-xs font-extrabold shadow-sm transition cursor-pointer"
          >
            <Plus className="w-4 h-4" />
            <span>Reportar Incidencia</span>
          </button>
        </div>
      </div>

      {/* Incidencias Abiertas */}
      <div className="space-y-4">
        <h2 className="text-sm font-extrabold text-[#1E2B45] flex items-center gap-2">
          <AlertTriangle className="w-4 h-4 text-amber-500" />
          <span>Incidencias Activas ({activeIncidents.length})</span>
        </h2>

        {activeIncidents.length === 0 ? (
          <div className="bg-white rounded-2xl p-8 border border-slate-200/80 shadow-xs text-center space-y-2">
            <CheckCircle2 className="w-10 h-10 text-emerald-500 mx-auto" />
            <h3 className="text-sm font-bold text-[#1E2B45]">Todas las canchas operativas</h3>
            <p className="text-xs text-slate-400 max-w-sm mx-auto">
              No hay averías activas reportadas en este momento. Las canchas están en perfecto estado de juego.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {activeIncidents.map((inc) => {
              const cancha = state.canchas.find((c) => c.id === inc.canchaId);
              const sede = state.sedes.find((s) => s.id === inc.sedeId);

              const priorityBg =
                inc.prioridad === 'Alta'
                  ? 'bg-rose-100 text-rose-800'
                  : inc.prioridad === 'Media'
                    ? 'bg-amber-100 text-amber-800'
                    : 'bg-slate-100 text-slate-700';

              return (
                <div
                  key={inc.id}
                  className="bg-white rounded-2xl p-5 border border-slate-200/80 shadow-xs flex flex-col justify-between space-y-4 hover:shadow-md transition"
                >
                  <div className="space-y-2">
                    <div className="flex items-start justify-between">
                      <div>
                        <span className={`px-2 py-0.5 rounded-full text-[10px] font-extrabold uppercase ${priorityBg}`}>
                          Prioridad {inc.prioridad}
                        </span>
                        <h3 className="text-base font-extrabold text-[#1E2B45] mt-1.5">
                          {inc.titulo}
                        </h3>
                        <span className="text-xs text-slate-400 font-medium">
                          {cancha?.nombre || 'Cancha'} · {sede?.nombre || 'Sede'}
                        </span>
                      </div>
                      <div className="p-2 rounded-xl bg-amber-50 text-amber-600">
                        <Wrench className="w-5 h-5" />
                      </div>
                    </div>

                    <p className="text-xs text-slate-600 leading-relaxed bg-slate-50 p-3 rounded-xl">
                      {inc.detalle}
                    </p>
                  </div>

                  <div className="flex items-center justify-between pt-3 border-t border-slate-100">
                    <span className="text-[11px] text-slate-400 font-medium">
                      Reportada: {inc.creadaEn}
                    </span>
                    <button
                      type="button"
                      onClick={() => resolveMaintenance(inc.id)}
                      className="px-4 py-2 rounded-xl bg-[#ACD638] hover:bg-[#9ec82f] text-[#16223B] text-xs font-extrabold flex items-center gap-1.5 cursor-pointer shadow-2xs"
                    >
                      <CheckCircle2 className="w-3.5 h-3.5" />
                      <span>Marcar como Resuelta</span>
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Historial de Incidencias Resueltas */}
      {resolvedIncidents.length > 0 && (
        <div className="space-y-3 pt-4">
          <h2 className="text-sm font-extrabold text-[#1E2B45]">
            Historial de Reparaciones Resueltas
          </h2>
          <div className="bg-white rounded-2xl border border-slate-200/80 shadow-xs divide-y divide-slate-100 overflow-hidden">
            {resolvedIncidents.map((inc) => {
              const cancha = state.canchas.find((c) => c.id === inc.canchaId);
              return (
                <div key={inc.id} className="p-4 flex items-center justify-between text-xs">
                  <div>
                    <span className="font-bold text-[#1E2B45] block">{inc.titulo}</span>
                    <span className="text-slate-400 text-[11px]">
                      {cancha?.nombre} · {inc.detalle}
                    </span>
                  </div>
                  <span className="px-2.5 py-1 rounded-full bg-emerald-50 text-emerald-800 text-[10px] font-bold">
                    Resuelta
                  </span>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Modal Reportar Avería */}
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/55 p-4 animate-in fade-in">
          <div className="bg-white rounded-3xl p-6 max-w-md w-full shadow-2xl border border-slate-200 space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <h2 className="text-base font-extrabold text-[#1E2B45] flex items-center gap-2">
                <Wrench className="w-5 h-5 text-[#273758]" />
                Reportar Avería o Mantenimiento
              </h2>
              <button
                type="button"
                onClick={() => setShowModal(false)}
                className="p-1 text-slate-400 hover:text-slate-600 rounded-lg"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-3.5 text-xs">
              <div>
                <label className="font-bold text-slate-700 block mb-1">Cancha afectada</label>
                <select
                  value={formCanchaId}
                  onChange={(e) => setFormCanchaId(e.target.value)}
                  className="w-full p-2.5 rounded-xl border border-slate-200 text-xs font-semibold"
                >
                  {state.canchas
                    .filter((c) => c.sedeId === activeSede.id)
                    .map((c) => (
                      <option key={c.id} value={c.id}>
                        {c.nombre} ({c.superficie})
                      </option>
                    ))}
                </select>
              </div>

              <div>
                <label className="font-bold text-slate-700 block mb-1">Título de la incidencia</label>
                <input
                  type="text"
                  required
                  placeholder="ej. Foco LED reflector este dañado"
                  value={formTitulo}
                  onChange={(e) => setFormTitulo(e.target.value)}
                  className="w-full p-2.5 rounded-xl border border-slate-200 text-xs font-semibold focus:outline-none focus:ring-2 focus:ring-[#ACD638]"
                />
              </div>

              <div>
                <label className="font-bold text-slate-700 block mb-1">Detalle del trabajo</label>
                <textarea
                  rows={3}
                  required
                  placeholder="Describe la falla, técnico asignado o repuestos requeridos..."
                  value={formDetalle}
                  onChange={(e) => setFormDetalle(e.target.value)}
                  className="w-full p-2.5 rounded-xl border border-slate-200 text-xs font-medium focus:outline-none focus:ring-2 focus:ring-[#ACD638]"
                />
              </div>

              <div>
                <label className="font-bold text-slate-700 block mb-1">Nivel de prioridad</label>
                <select
                  value={formPrioridad}
                  onChange={(e) => setFormPrioridad(e.target.value as any)}
                  className="w-full p-2.5 rounded-xl border border-slate-200 text-xs font-semibold"
                >
                  <option value="Alta">Alta (Impide el juego)</option>
                  <option value="Media">Media (Atención programada)</option>
                  <option value="Baja">Baja (Mantenimiento preventivo)</option>
                </select>
              </div>

              <label className="flex items-center gap-2 p-3 bg-amber-50 rounded-xl border border-amber-200 cursor-pointer">
                <input
                  type="checkbox"
                  checked={formBloquear}
                  onChange={(e) => setFormBloquear(e.target.checked)}
                  className="accent-[#ACD638]"
                />
                <span className="font-bold text-amber-900 text-xs">
                  Bloquear cancha en agenda inmediatamente
                </span>
              </label>

              <div className="flex gap-2 pt-2">
                <button
                  type="submit"
                  className="flex-1 py-3 rounded-xl bg-[#273758] hover:bg-[#1f2d47] text-white font-extrabold text-xs cursor-pointer shadow-sm"
                >
                  Registrar Incidencia
                </button>
                <button
                  type="button"
                  onClick={() => setShowModal(false)}
                  className="py-3 px-4 rounded-xl border border-slate-200 text-slate-600 font-bold text-xs"
                >
                  Cancelar
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Modal Protocolo de Lluvia */}
      {showRainModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/55 p-4 animate-in fade-in">
          <div className="bg-white rounded-3xl p-6 max-w-md w-full shadow-2xl border border-slate-200 space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <h2 className="text-base font-extrabold text-[#1E2B45] flex items-center gap-2">
                <CloudRain className="w-5 h-5 text-sky-600" />
                Activar Suspensión por Lluvia
              </h2>
              <button
                type="button"
                onClick={() => setShowRainModal(false)}
                className="p-1 text-slate-400 hover:text-slate-600 rounded-lg"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <p className="text-xs text-slate-600">
              Esta acción suspenderá temporalmente las canchas descubiertas en {activeSede.nombre},{' '}
              notificará a los jugadores con reservas activas y liberará créditos de reprogramación
              automática.
            </p>

            <div>
              <label className="font-bold text-slate-700 block mb-1 text-xs">Mensaje para jugadores</label>
              <textarea
                rows={3}
                value={rainReason}
                onChange={(e) => setRainReason(e.target.value)}
                className="w-full p-2.5 rounded-xl border border-slate-200 text-xs font-medium"
              />
            </div>

            <div className="flex gap-2 pt-2">
              <button
                type="button"
                onClick={handleTriggerRain}
                className="flex-1 py-3 rounded-xl bg-sky-600 hover:bg-sky-700 text-white font-extrabold text-xs cursor-pointer shadow-sm"
              >
                Confirmar y Emitir Aviso
              </button>
              <button
                type="button"
                onClick={() => setShowRainModal(false)}
                className="py-3 px-4 rounded-xl border border-slate-200 text-slate-600 font-bold text-xs"
              >
                Cancelar
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
