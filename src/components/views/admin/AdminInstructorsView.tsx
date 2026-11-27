import React, { useState } from 'react';
import {
  Award,
  Calendar,
  CheckCircle2,
  Clock,
  DollarSign,
  Edit2,
  GraduationCap,
  MapPin,
  Plus,
  Search,
  Star,
  Users,
  X,
  AlertCircle,
} from 'lucide-react';
import { useApp } from '../../../context/AppContext';
import { resolveAvatarPhoto } from '../../VisualAssets';
import type { Instructor, InstructorInput } from '../../../types/tennis';
import { formatHour12, isInstructorAvailable, isSlotAvailable } from '../../../utils/tennisLogic';

export const AdminInstructorsView: React.FC = () => {
  const { state, activeSede, createInstructorFull, updateInstructorProfile, bookClass } = useApp();

  const [search, setSearch] = useState('');
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [scheduleModalInst, setScheduleModalInst] = useState<Instructor | null>(null);

  // New Instructor Form
  const [formData, setFormData] = useState<InstructorInput>({
    nombre: '',
    email: '',
    telefono: '+507 6200-0000',
    titulo: 'Coach Certificado',
    sedePrincipalId: activeSede.id,
    sedesAutorizadas: [activeSede.id],
    especialidades: ['Técnica', 'Adultos', 'Iniciación'],
    certificaciones: ['ITF Nivel 1', 'Federación Panameña de Tenis'],
    precioBase: 35,
    horariosDisponibles: ['07:30', '09:00', '16:00', '18:00'],
  });

  // Schedule class modal state
  const [schedDate, setSchedDate] = useState('2026-11-27');
  const [schedTime, setSchedTime] = useState('18:00');
  const [schedCanchaId, setSchedCanchaId] = useState(state.canchas[0]?.id || '');
  const [schedTipo, setSchedTipo] = useState<'Individual' | 'Pareja' | 'Grupal'>('Individual');
  const [schedDuracion, setSchedDuracion] = useState<60 | 90>(60);
  const [schedError, setSchedError] = useState('');

  const instructors = state.instructores.filter(
    (i) =>
      !search ||
      i.nombre.toLowerCase().includes(search.toLowerCase()) ||
      i.especialidades.some((e) => e.toLowerCase().includes(search.toLowerCase()))
  );

  const handleCreateSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.nombre.trim()) return;
    createInstructorFull(formData);
    setShowCreateModal(false);
    setFormData({
      nombre: '',
      email: '',
      telefono: '+507 6200-0000',
      titulo: 'Coach Certificado',
      sedePrincipalId: activeSede.id,
      sedesAutorizadas: [activeSede.id],
      especialidades: ['Técnica', 'Adultos', 'Iniciación'],
      certificaciones: ['ITF Nivel 1', 'Federación Panameña de Tenis'],
      precioBase: 35,
      horariosDisponibles: ['07:30', '09:00', '16:00', '18:00'],
    });
  };

  const handleScheduleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSchedError('');
    if (!scheduleModalInst) return;

    // Validate simultaneous availability: court + instructor
    const courtCheck = isSlotAvailable(state, schedCanchaId, schedDate, schedTime, schedDuracion);
    if (!courtCheck.available) {
      setSchedError(`Cancha no disponible: ${courtCheck.reason}`);
      return;
    }

    const instCheck = isInstructorAvailable(
      state,
      scheduleModalInst.id,
      schedDate,
      schedTime,
      schedDuracion
    );
    if (!instCheck.available) {
      setSchedError(`Instructor no disponible: ${instCheck.reason}`);
      return;
    }

    const res = bookClass({
      instructorId: scheduleModalInst.id,
      sedeId: activeSede.id,
      canchaId: schedCanchaId,
      tipo: schedTipo,
      fecha: schedDate,
      horaInicio: schedTime,
      duracionMin: schedDuracion,
      metodoPago: 'Tarjeta',
    });

    if (res.ok) {
      setScheduleModalInst(null);
    } else {
      setSchedError(res.error || 'Error al agendar la sesión.');
    }
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-[#1E2B45] tracking-tight">
            Gestión de Instructores
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 mt-0.5">
            Cuerpo técnico, certificaciones ITF/USPTA, disponibilidad y validación de cruce de horarios
          </p>
        </div>

        <button
          type="button"
          onClick={() => setShowCreateModal(true)}
          className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-[#ACD638] hover:bg-[#9ec82f] text-[#16223B] text-xs font-extrabold shadow-sm transition cursor-pointer self-start sm:self-auto"
        >
          <Plus className="w-4 h-4" />
          <span>Nuevo Instructor</span>
        </button>
      </div>

      {/* Search */}
      <div className="bg-white rounded-2xl p-4 border border-slate-200/80 shadow-xs flex items-center justify-between">
        <div className="relative max-w-sm w-full">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Buscar por nombre o especialidad..."
            className="w-full pl-9 pr-3 py-1.5 rounded-xl border border-slate-200 text-xs font-semibold focus:outline-none focus:ring-2 focus:ring-[#ACD638]"
          />
        </div>

        <span className="text-xs text-slate-400 font-medium">
          {instructors.length} entrenadores registrados
        </span>
      </div>

      {/* Grid of Instructors */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-2 gap-5">
        {instructors.map((inst) => {
          const photoUrl = resolveAvatarPhoto(inst.nombre, inst.avatarSeed, undefined, true);
          const activeClassesCount = state.clases.filter(
            (c) => c.instructorId === inst.id && c.estado !== 'Cancelada'
          ).length;

          return (
            <div
              key={inst.id}
              className="bg-white rounded-2xl p-5 border border-slate-200/80 shadow-xs flex flex-col justify-between hover:shadow-md transition space-y-4"
            >
              <div className="flex items-start gap-4">
                <div className="w-20 h-20 rounded-2xl overflow-hidden bg-slate-100 shrink-0 border border-slate-200 shadow-xs">
                  <img src={photoUrl} alt={inst.nombre} className="w-full h-full object-cover" />
                </div>

                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between">
                    <h3 className="text-base font-extrabold text-[#1E2B45] truncate">
                      {inst.nombre}
                    </h3>
                    <div className="flex items-center gap-1 text-amber-500 font-bold text-xs shrink-0">
                      <Star className="w-3.5 h-3.5 fill-current" />
                      <span>{inst.rating}</span>
                      <span className="text-slate-400 text-[10px]">({inst.resenasCount})</span>
                    </div>
                  </div>

                  <span className="text-xs font-bold text-[#5E8210] block">{inst.titulo}</span>

                  <div className="mt-2 flex flex-wrap gap-1">
                    {inst.especialidades.map((esp, i) => (
                      <span
                        key={i}
                        className="px-2 py-0.5 rounded-md bg-slate-100 text-slate-700 text-[10px] font-medium"
                      >
                        {esp}
                      </span>
                    ))}
                  </div>
                </div>
              </div>

              {/* Stats & Details */}
              <div className="grid grid-cols-3 gap-2 p-3 bg-slate-50 rounded-xl border border-slate-100 text-center text-xs">
                <div>
                  <span className="text-[10px] text-slate-400 font-bold block uppercase">Tarifa</span>
                  <span className="font-extrabold text-[#1E2B45] text-sm tabular-nums">
                    B/. {inst.precioBase}/h
                  </span>
                </div>
                <div>
                  <span className="text-[10px] text-slate-400 font-bold block uppercase">Clases</span>
                  <span className="font-extrabold text-[#1E2B45] text-sm tabular-nums">
                    {activeClassesCount} activas
                  </span>
                </div>
                <div>
                  <span className="text-[10px] text-slate-400 font-bold block uppercase">Estado</span>
                  <span className="font-extrabold text-emerald-700 text-xs">
                    {inst.disponibleHoy ? 'Disponible hoy' : 'Agenda llena'}
                  </span>
                </div>
              </div>

              {/* Certifications and Action */}
              <div className="space-y-2">
                <div className="flex items-center gap-1.5 text-xs text-slate-500">
                  <Award className="w-3.5 h-3.5 text-[#273758] shrink-0" />
                  <span className="truncate">Certificaciones: {inst.certificaciones.join(', ')}</span>
                </div>

                <div className="flex items-center gap-1.5 text-xs text-slate-500">
                  <Clock className="w-3.5 h-3.5 text-[#ACD638] shrink-0" />
                  <span>
                    Turnos habituales: {inst.horariosDisponibles.map(formatHour12).join(', ')}
                  </span>
                </div>
              </div>

              {/* Action buttons */}
              <div className="pt-2 border-t border-slate-100 flex gap-2">
                <button
                  type="button"
                  onClick={() => {
                    setScheduleModalInst(inst);
                    setSchedError('');
                  }}
                  className="flex-1 py-2 rounded-xl bg-[#ACD638] hover:bg-[#9ec82f] text-[#16223B] text-xs font-extrabold flex items-center justify-center gap-1.5 cursor-pointer shadow-2xs"
                >
                  <Calendar className="w-3.5 h-3.5" />
                  <span>Agendar Sesión con Validación</span>
                </button>
              </div>
            </div>
          );
        })}
      </div>

      {/* Modal Agendar Sesión con Validación Simultánea */}
      {scheduleModalInst && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/55 p-4 animate-in fade-in">
          <div className="bg-white rounded-3xl p-6 max-w-md w-full shadow-2xl border border-slate-200 space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <div>
                <h2 className="text-base font-extrabold text-[#1E2B45]">
                  Agendar Sesión con {scheduleModalInst.nombre}
                </h2>
                <span className="text-xs text-slate-400">
                  Valida simultáneamente la disponibilidad del instructor y de la cancha
                </span>
              </div>
              <button
                type="button"
                onClick={() => setScheduleModalInst(null)}
                className="p-1 text-slate-400 hover:text-slate-600 rounded-lg"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {schedError && (
              <div className="p-3 bg-rose-50 border border-rose-200 rounded-xl text-rose-800 text-xs font-bold flex items-center gap-2">
                <AlertCircle className="w-4 h-4 text-rose-600 shrink-0" />
                <span>{schedError}</span>
              </div>
            )}

            <form onSubmit={handleScheduleSubmit} className="space-y-3.5 text-xs">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="font-bold text-slate-700 block mb-1">Fecha</label>
                  <input
                    type="date"
                    value={schedDate}
                    onChange={(e) => setSchedDate(e.target.value)}
                    className="w-full p-2.5 rounded-xl border border-slate-200 text-xs font-semibold"
                  />
                </div>
                <div>
                  <label className="font-bold text-slate-700 block mb-1">Hora Inicio</label>
                  <select
                    value={schedTime}
                    onChange={(e) => setSchedTime(e.target.value)}
                    className="w-full p-2.5 rounded-xl border border-slate-200 text-xs font-semibold"
                  >
                    {['06:00', '07:30', '09:00', '10:30', '15:00', '16:30', '18:00', '19:30'].map(
                      (h) => (
                        <option key={h} value={h}>
                          {formatHour12(h)}
                        </option>
                      )
                    )}
                  </select>
                </div>
              </div>

              <div>
                <label className="font-bold text-slate-700 block mb-1">Cancha a utilizar</label>
                <select
                  value={schedCanchaId}
                  onChange={(e) => setSchedCanchaId(e.target.value)}
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

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="font-bold text-slate-700 block mb-1">Modalidad</label>
                  <select
                    value={schedTipo}
                    onChange={(e) => setSchedTipo(e.target.value as any)}
                    className="w-full p-2.5 rounded-xl border border-slate-200 text-xs font-semibold"
                  >
                    <option value="Individual">Individual (1 alumno)</option>
                    <option value="Pareja">Pareja (2 alumnos)</option>
                    <option value="Grupal">Grupal (hasta 6 alumnos)</option>
                  </select>
                </div>
                <div>
                  <label className="font-bold text-slate-700 block mb-1">Duración</label>
                  <select
                    value={schedDuracion}
                    onChange={(e) => setSchedDuracion(Number(e.target.value) as any)}
                    className="w-full p-2.5 rounded-xl border border-slate-200 text-xs font-semibold"
                  >
                    <option value={60}>60 minutos (1 hora)</option>
                    <option value={90}>90 minutos (1.5 horas)</option>
                  </select>
                </div>
              </div>

              <div className="p-3 bg-slate-50 rounded-xl text-slate-600 text-[11px] space-y-1">
                <div className="flex justify-between">
                  <span>Honorarios de Instructor:</span>
                  <span className="font-bold text-[#1E2B45]">
                    B/. {scheduleModalInst.precioBase.toFixed(2)}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span>Tarifa de Cancha:</span>
                  <span className="font-bold text-[#1E2B45]">Incluida en programación</span>
                </div>
              </div>

              <div className="flex gap-2 pt-2">
                <button
                  type="submit"
                  className="flex-1 py-3 rounded-xl bg-[#ACD638] hover:bg-[#9ec82f] text-[#16223B] font-extrabold text-xs cursor-pointer shadow-sm"
                >
                  Validar y Agendar
                </button>
                <button
                  type="button"
                  onClick={() => setScheduleModalInst(null)}
                  className="py-3 px-4 rounded-xl border border-slate-200 text-slate-600 font-bold text-xs"
                >
                  Cancelar
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Modal Nuevo Instructor */}
      {showCreateModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/55 p-4 animate-in fade-in">
          <div className="bg-white rounded-3xl p-6 max-w-md w-full shadow-2xl border border-slate-200 space-y-4 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <h2 className="text-base font-extrabold text-[#1E2B45] flex items-center gap-2">
                <GraduationCap className="w-5 h-5 text-[#273758]" />
                Registrar Nuevo Instructor
              </h2>
              <button
                type="button"
                onClick={() => setShowCreateModal(false)}
                className="p-1 text-slate-400 hover:text-slate-600 rounded-lg"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleCreateSubmit} className="space-y-3.5 text-xs">
              <div>
                <label className="font-bold text-slate-700 block mb-1">Nombre completo</label>
                <input
                  type="text"
                  required
                  placeholder="ej. Roberto Gómez"
                  value={formData.nombre}
                  onChange={(e) => setFormData({ ...formData, nombre: e.target.value })}
                  className="w-full p-2.5 rounded-xl border border-slate-200 text-xs font-semibold focus:outline-none focus:ring-2 focus:ring-[#ACD638]"
                />
              </div>

              <div>
                <label className="font-bold text-slate-700 block mb-1">Título o cargo</label>
                <input
                  type="text"
                  required
                  placeholder="ej. Head Coach Junior / ITF Pro"
                  value={formData.titulo}
                  onChange={(e) => setFormData({ ...formData, titulo: e.target.value })}
                  className="w-full p-2.5 rounded-xl border border-slate-200 text-xs font-semibold"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="font-bold text-slate-700 block mb-1">Correo electrónico</label>
                  <input
                    type="email"
                    required
                    placeholder="coach@tenisclub.pa"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    className="w-full p-2.5 rounded-xl border border-slate-200 text-xs font-semibold"
                  />
                </div>
                <div>
                  <label className="font-bold text-slate-700 block mb-1">Tarifa base por hora</label>
                  <input
                    type="number"
                    min="10"
                    step="5"
                    required
                    value={formData.precioBase}
                    onChange={(e) =>
                      setFormData({ ...formData, precioBase: Number(e.target.value) })
                    }
                    className="w-full p-2.5 rounded-xl border border-slate-200 text-xs font-semibold"
                  />
                </div>
              </div>

              <div className="flex gap-2 pt-2">
                <button
                  type="submit"
                  className="flex-1 py-3 rounded-xl bg-[#ACD638] hover:bg-[#9ec82f] text-[#16223B] font-extrabold text-xs cursor-pointer shadow-sm"
                >
                  Guardar Instructor
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
