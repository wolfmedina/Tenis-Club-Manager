import React, { useState } from 'react';
import {
  Calendar,
  CheckCircle2,
  Clock,
  GraduationCap,
  Plus,
  Search,
  UserCheck,
  Users,
  X,
} from 'lucide-react';
import { useApp } from '../../../context/AppContext';
import { PlayerAvatar } from '../../VisualAssets';
import type { ClaseProgramada } from '../../../types/tennis';
import { formatHour12 } from '../../../utils/tennisLogic';

export const AdminClassesView: React.FC = () => {
  const { state, activeSede, createInstructorClass, toggleClassAttendance } = useApp();

  const [selectedClase, setSelectedClase] = useState<ClaseProgramada | null>(null);
  const [showCreateModal, setShowCreateModal] = useState(false);

  // Form
  const [canchaId, setCanchaId] = useState(state.canchas[0]?.id || '');
  const [titulo, setTitulo] = useState('');
  const [tipo, setTipo] = useState<ClaseProgramada['tipo']>('Grupal');
  const [fecha, setFecha] = useState('2026-11-28');
  const [horaInicio, setHoraInicio] = useState('09:00');
  const [duracionMin, setDuracionMin] = useState<60 | 90>(60);
  const [precioPorCupo, setPrecioPorCupo] = useState(25);
  const [cupoMax, setCupoMax] = useState(6);
  const [errorMsg, setErrorMsg] = useState('');

  const classes = state.clases.filter((c) => c.sedeId === activeSede.id);

  const handleCreateSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg('');
    if (!titulo.trim()) return;

    const res = createInstructorClass({
      sedeId: activeSede.id,
      canchaId,
      titulo: titulo.trim(),
      tipo,
      fecha,
      horaInicio,
      duracionMin,
      precioPorCupo,
      cupoMax,
    });

    if (res.ok) {
      setShowCreateModal(false);
      setTitulo('');
    } else {
      setErrorMsg(res.error || 'No fue posible programar la clase.');
    }
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-[#1E2B45] tracking-tight">
            Clases y Entrenamientos
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 mt-0.5">
            Programación de clínicas, sesiones grupales, juveniles y control de asistencia en {activeSede.nombre}
          </p>
        </div>

        <button
          type="button"
          onClick={() => setShowCreateModal(true)}
          className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-[#ACD638] hover:bg-[#9ec82f] text-[#16223B] text-xs font-extrabold shadow-sm transition cursor-pointer self-start sm:self-auto"
        >
          <Plus className="w-4 h-4" />
          <span>Crear Nueva Clase</span>
        </button>
      </div>

      {/* Classes Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-5">
        {classes.map((clase) => {
          const instructor = state.instructores.find((i) => i.id === clase.instructorId);
          const cancha = state.canchas.find((c) => c.id === clase.canchaId);
          const isFull = clase.alumnosIds.length >= clase.cupoMax;

          return (
            <div
              key={clase.id}
              className="bg-white rounded-2xl p-5 border border-slate-200/80 shadow-xs flex flex-col justify-between hover:shadow-md transition space-y-4"
            >
              <div>
                <div className="flex items-start justify-between">
                  <span
                    className={`px-2.5 py-0.5 rounded-full text-[10px] font-extrabold uppercase ${
                      clase.tipo === 'Junior'
                        ? 'bg-sky-100 text-sky-800'
                        : clase.tipo === 'Grupal'
                          ? 'bg-purple-100 text-purple-800'
                          : 'bg-emerald-100 text-emerald-800'
                    }`}
                  >
                    {clase.tipo}
                  </span>

                  <span
                    className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                      isFull ? 'bg-amber-100 text-amber-800' : 'bg-emerald-50 text-emerald-700'
                    }`}
                  >
                    {isFull ? 'Cupo Completo' : 'Inscripciones Abiertas'}
                  </span>
                </div>

                <h3 className="text-base font-extrabold text-[#1E2B45] mt-2">{clase.titulo}</h3>
                <span className="text-xs text-[#5E8210] font-bold block">
                  Coach: {instructor?.nombre || 'Instructor Principal'}
                </span>

                <div className="mt-3 space-y-1.5 text-xs text-slate-600 bg-slate-50 p-3 rounded-xl border border-slate-100">
                  <div className="flex items-center justify-between">
                    <span className="text-slate-400">Fecha y Hora:</span>
                    <span className="font-bold text-[#1E2B45]">
                      {clase.fecha} · {formatHour12(clase.horaInicio)} ({clase.duracionMin} min)
                    </span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-slate-400">Cancha Asignada:</span>
                    <span className="font-bold text-[#1E2B45]">{cancha?.nombre || 'Cancha'}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-slate-400">Cupo y Alumnos:</span>
                    <span className="font-extrabold text-[#1E2B45] tabular-nums">
                      {clase.alumnosIds.length} / {clase.cupoMax} inscritos
                    </span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-slate-400">Precio por cupo:</span>
                    <span className="font-extrabold text-[#273758] tabular-nums">
                      B/. {clase.precioPorCupo.toFixed(2)}
                    </span>
                  </div>
                </div>
              </div>

              <div className="pt-2 border-t border-slate-100 flex gap-2">
                <button
                  type="button"
                  onClick={() => setSelectedClase(clase)}
                  className="w-full py-2 rounded-xl bg-slate-100 hover:bg-[#ACD638] hover:text-[#16223B] text-xs font-bold text-[#273758] transition flex items-center justify-center gap-1.5 cursor-pointer"
                >
                  <UserCheck className="w-3.5 h-3.5" />
                  <span>Gestionar Asistencia ({clase.alumnosIds.length})</span>
                </button>
              </div>
            </div>
          );
        })}
      </div>

      {/* Modal Control de Asistencia */}
      {selectedClase && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/55 p-4 animate-in fade-in">
          <div className="bg-white rounded-3xl p-6 max-w-md w-full shadow-2xl border border-slate-200 space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <div>
                <h2 className="text-base font-extrabold text-[#1E2B45]">
                  Lista de Asistencia
                </h2>
                <span className="text-xs text-slate-400">{selectedClase.titulo}</span>
              </div>
              <button
                type="button"
                onClick={() => setSelectedClase(null)}
                className="p-1 text-slate-400 hover:text-slate-600 rounded-lg"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <p className="text-xs text-slate-500">
              Marca a los alumnos presentes en cancha para acreditar su participación y reputación deportiva:
            </p>

            <div className="space-y-2 max-h-60 overflow-y-auto">
              {selectedClase.alumnosIds.length === 0 ? (
                <p className="py-4 text-center text-xs text-slate-400">
                  Aún no hay alumnos inscritos en esta clase.
                </p>
              ) : (
                selectedClase.alumnosIds.map((alumnoId) => {
                  const alumno = state.usuarios.find((u) => u.id === alumnoId);
                  const isPresent = selectedClase.asistenciaIds.includes(alumnoId);

                  return (
                    <div
                      key={alumnoId}
                      className="flex items-center justify-between p-2.5 rounded-xl border border-slate-100 bg-slate-50"
                    >
                      <div className="flex items-center gap-2.5">
                        <PlayerAvatar
                          nombre={alumno?.nombre || 'Alumno'}
                          seed={alumno?.avatarSeed}
                          size="xs"
                        />
                        <div>
                          <span className="text-xs font-bold text-[#1E2B45] block">
                            {alumno?.nombre || 'Alumno Registrado'}
                          </span>
                          <span className="text-[10px] text-slate-400">{alumno?.categoria}</span>
                        </div>
                      </div>

                      <button
                        type="button"
                        onClick={() => toggleClassAttendance(selectedClase.id, alumnoId)}
                        className={`px-3 py-1.5 rounded-lg text-xs font-bold transition cursor-pointer flex items-center gap-1 ${
                          isPresent
                            ? 'bg-emerald-600 text-white'
                            : 'bg-slate-200 text-slate-700 hover:bg-emerald-100 hover:text-emerald-800'
                        }`}
                      >
                        <CheckCircle2 className="w-3.5 h-3.5" />
                        <span>{isPresent ? 'Presente' : 'Marcar Presente'}</span>
                      </button>
                    </div>
                  );
                })
              )}
            </div>

            <div className="pt-2 border-t border-slate-100">
              <button
                type="button"
                onClick={() => setSelectedClase(null)}
                className="w-full py-2.5 bg-[#273758] text-white rounded-xl text-xs font-bold"
              >
                Cerrar Lista
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Modal Crear Nueva Clase */}
      {showCreateModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/55 p-4 animate-in fade-in">
          <div className="bg-white rounded-3xl p-6 max-w-md w-full shadow-2xl border border-slate-200 space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <h2 className="text-base font-extrabold text-[#1E2B45] flex items-center gap-2">
                <GraduationCap className="w-5 h-5 text-[#273758]" />
                Crear Nueva Clase
              </h2>
              <button
                type="button"
                onClick={() => setShowCreateModal(false)}
                className="p-1 text-slate-400 hover:text-slate-600 rounded-lg"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {errorMsg && (
              <div className="p-3 bg-rose-50 text-rose-800 text-xs font-bold rounded-xl border border-rose-200">
                {errorMsg}
              </div>
            )}

            <form onSubmit={handleCreateSubmit} className="space-y-3.5 text-xs">
              <div>
                <label className="font-bold text-slate-700 block mb-1">Título de la clase</label>
                <input
                  type="text"
                  required
                  placeholder="ej. Clínica de Saque y Volea"
                  value={titulo}
                  onChange={(e) => setTitulo(e.target.value)}
                  className="w-full p-2.5 rounded-xl border border-slate-200 text-xs font-semibold focus:outline-none focus:ring-2 focus:ring-[#ACD638]"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="font-bold text-slate-700 block mb-1">Tipo de clase</label>
                  <select
                    value={tipo}
                    onChange={(e) => setTipo(e.target.value as any)}
                    className="w-full p-2.5 rounded-xl border border-slate-200 text-xs font-semibold"
                  >
                    <option value="Grupal">Grupal</option>
                    <option value="Individual">Individual</option>
                    <option value="Pareja">Pareja</option>
                    <option value="Junior">Junior</option>
                  </select>
                </div>
                <div>
                  <label className="font-bold text-slate-700 block mb-1">Cancha</label>
                  <select
                    value={canchaId}
                    onChange={(e) => setCanchaId(e.target.value)}
                    className="w-full p-2.5 rounded-xl border border-slate-200 text-xs font-semibold"
                  >
                    {state.canchas
                      .filter((c) => c.sedeId === activeSede.id)
                      .map((c) => (
                        <option key={c.id} value={c.id}>
                          {c.nombre}
                        </option>
                      ))}
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="font-bold text-slate-700 block mb-1">Fecha</label>
                  <input
                    type="date"
                    value={fecha}
                    onChange={(e) => setFecha(e.target.value)}
                    className="w-full p-2.5 rounded-xl border border-slate-200 text-xs font-semibold"
                  />
                </div>
                <div>
                  <label className="font-bold text-slate-700 block mb-1">Hora inicio</label>
                  <input
                    type="time"
                    value={horaInicio}
                    onChange={(e) => setHoraInicio(e.target.value)}
                    className="w-full p-2.5 rounded-xl border border-slate-200 text-xs font-semibold"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="font-bold text-slate-700 block mb-1">Cupo Máximo</label>
                  <input
                    type="number"
                    min="1"
                    max="12"
                    value={cupoMax}
                    onChange={(e) => setCupoMax(Number(e.target.value))}
                    className="w-full p-2.5 rounded-xl border border-slate-200 text-xs font-semibold"
                  />
                </div>
                <div>
                  <label className="font-bold text-slate-700 block mb-1">Precio por cupo (B/.)</label>
                  <input
                    type="number"
                    min="5"
                    step="5"
                    value={precioPorCupo}
                    onChange={(e) => setPrecioPorCupo(Number(e.target.value))}
                    className="w-full p-2.5 rounded-xl border border-slate-200 text-xs font-semibold"
                  />
                </div>
              </div>

              <div className="flex gap-2 pt-2">
                <button
                  type="submit"
                  className="flex-1 py-3 rounded-xl bg-[#ACD638] hover:bg-[#9ec82f] text-[#16223B] font-extrabold text-xs cursor-pointer shadow-sm"
                >
                  Programar Clase
                </button>
                <button
                  type="button"
                  onClick={() => setShowCreateModal(false)}
                  className="py-3 px-4 rounded-xl border border-slate-200 text-slate-600 font-bold text-xs"
                >
                  Cancelar
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
