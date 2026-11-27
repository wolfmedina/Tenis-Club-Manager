import React, { useState } from 'react';
import {
  Building2,
  Clock,
  Edit2,
  MapPin,
  Plus,
  Search,
  Shield,
  Star,
  Trash2,
  X,
  CheckCircle2,
} from 'lucide-react';
import { useApp } from '../../../context/AppContext';
import { CourtScene } from '../../VisualAssets';
import type { Sede, SedeInput } from '../../../types/tennis';

export const AdminFacilitiesView: React.FC = () => {
  const { state, createSede, updateSede, deleteSede, switchSede, activeSede } = useApp();

  const [search, setSearch] = useState('');
  const [filterTipo, setFilterTipo] = useState<'ALL' | 'Pública' | 'Privada'>('ALL');
  const [filterProvincia, setFilterProvincia] = useState<string>('ALL');

  // Modals
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [editingSede, setEditingSede] = useState<Sede | null>(null);

  // Form states
  const [formData, setFormData] = useState<SedeInput>({
    nombre: '',
    tipo: 'Privada',
    provincia: 'Panamá',
    distrito: 'Ciudad de Panamá',
    direccion: '',
    horarioApertura: '06:00',
    horarioCierre: '22:00',
    politicaCancelacionHoras: 6,
    tarifaResidentePct: 0,
    amenidades: ['Iluminación LED', 'Estacionamiento', 'Duchas y vestidores'],
    reglamento: 'Calzado deportivo obligatorio. Cancelación sin recargo hasta 6h antes.',
  });

  const filteredSedes = state.sedes.filter((s) => {
    if (filterTipo !== 'ALL' && s.tipo !== filterTipo) return false;
    if (filterProvincia !== 'ALL' && s.provincia !== filterProvincia) return false;
    if (
      search &&
      !s.nombre.toLowerCase().includes(search.toLowerCase()) &&
      !s.direccion.toLowerCase().includes(search.toLowerCase())
    )
      return false;
    return true;
  });

  const handleCreateSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.nombre.trim()) return;
    createSede(formData);
    setShowCreateModal(false);
    setFormData({
      nombre: '',
      tipo: 'Privada',
      provincia: 'Panamá',
      distrito: 'Ciudad de Panamá',
      direccion: '',
      horarioApertura: '06:00',
      horarioCierre: '22:00',
      politicaCancelacionHoras: 6,
      tarifaResidentePct: 0,
      amenidades: ['Iluminación LED', 'Estacionamiento', 'Duchas y vestidores'],
      reglamento: 'Calzado deportivo obligatorio. Cancelación sin recargo hasta 6h antes.',
    });
  };

  const handleUpdateSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingSede || !formData.nombre.trim()) return;
    updateSede(editingSede.id, {
      nombre: formData.nombre,
      tipo: formData.tipo,
      provincia: formData.provincia,
      distrito: formData.distrito,
      direccion: formData.direccion,
      horarioApertura: formData.horarioApertura,
      horarioCierre: formData.horarioCierre,
      politicaCancelacionHoras: formData.politicaCancelacionHoras,
      reglamento: formData.reglamento,
    });
    setEditingSede(null);
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      {/* Title + Action */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-[#1E2B45] tracking-tight">
            Instalaciones Deportivas
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 mt-0.5">
            Gestión de sedes, clubes y complejos de tenis públicos y privados en Panamá
          </p>
        </div>

        <button
          type="button"
          onClick={() => setShowCreateModal(true)}
          className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-[#ACD638] hover:bg-[#9ec82f] text-[#16223B] text-xs font-extrabold shadow-sm transition cursor-pointer self-start sm:self-auto"
        >
          <Plus className="w-4 h-4" />
          <span>Nueva Instalación</span>
        </button>
      </div>

      {/* Filters Toolbar */}
      <div className="bg-white rounded-2xl p-4 border border-slate-200/80 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-3">
        <div className="relative flex-1 max-w-sm">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Buscar por nombre o dirección..."
            className="w-full pl-9 pr-3 py-1.5 rounded-xl border border-slate-200 text-xs font-semibold focus:outline-none focus:ring-2 focus:ring-[#ACD638]"
          />
        </div>

        <div className="flex items-center gap-2">
          <select
            value={filterTipo}
            onChange={(e) => setFilterTipo(e.target.value as any)}
            className="text-xs font-semibold bg-slate-50 border border-slate-200 rounded-xl px-3 py-1.5 text-slate-700"
          >
            <option value="ALL">Todos los tipos</option>
            <option value="Privada">Privadas</option>
            <option value="Pública">Públicas / Municipales</option>
          </select>

          <select
            value={filterProvincia}
            onChange={(e) => setFilterProvincia(e.target.value)}
            className="text-xs font-semibold bg-slate-50 border border-slate-200 rounded-xl px-3 py-1.5 text-slate-700"
          >
            <option value="ALL">Todas las provincias</option>
            <option value="Panamá">Panamá</option>
            <option value="Panamá Oeste">Panamá Oeste</option>
            <option value="Chiriquí">Chiriquí</option>
          </select>
        </div>
      </div>

      {/* Grid of Facilities */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
        {filteredSedes.map((sede) => {
          const courtsInSede = state.canchas.filter((c) => c.sedeId === sede.id);
          const isCurrentActive = sede.id === activeSede.id;

          return (
            <div
              key={sede.id}
              className={`bg-white rounded-2xl border overflow-hidden shadow-xs flex flex-col justify-between transition ${
                isCurrentActive ? 'border-[#ACD638] ring-2 ring-[#ACD638]/30' : 'border-slate-200/80 hover:shadow-md'
              }`}
            >
              <div>
                {/* Court Photo Header */}
                <div className="h-44 w-full relative overflow-hidden bg-slate-200">
                  <CourtScene sedeId={sede.id} variant={sede.imagenVariant} eager />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/75 via-black/25 to-transparent" />
                  
                  <div className="absolute top-3 left-3 flex items-center gap-1.5">
                    <span
                      className={`px-2.5 py-0.5 rounded-full text-[10.5px] font-extrabold uppercase shadow-xs ${
                        sede.tipo === 'Privada'
                          ? 'bg-[#273758] text-white'
                          : 'bg-[#ACD638] text-[#16223B]'
                      }`}
                    >
                      {sede.tipo}
                    </span>
                    {isCurrentActive && (
                      <span className="px-2 py-0.5 rounded-full bg-emerald-500 text-white text-[10px] font-bold">
                        Sede Activa
                      </span>
                    )}
                  </div>

                  <div className="absolute top-3 right-3 flex items-center gap-1">
                    <button
                      type="button"
                      onClick={() => {
                        setEditingSede(sede);
                        setFormData({
                          nombre: sede.nombre,
                          tipo: sede.tipo,
                          provincia: sede.provincia,
                          distrito: sede.distrito,
                          direccion: sede.direccion,
                          horarioApertura: sede.horarioApertura,
                          horarioCierre: sede.horarioCierre,
                          politicaCancelacionHoras: sede.politicaCancelacionHoras,
                          reglamento: sede.reglamento,
                        });
                      }}
                      className="p-1.5 rounded-lg bg-white/80 hover:bg-white text-slate-800 shadow-xs cursor-pointer"
                      title="Editar instalación"
                    >
                      <Edit2 className="w-3.5 h-3.5" />
                    </button>
                    {state.sedes.length > 1 && (
                      <button
                        type="button"
                        onClick={() => deleteSede(sede.id)}
                        className="p-1.5 rounded-lg bg-white/80 hover:bg-rose-50 text-rose-600 shadow-xs cursor-pointer"
                        title="Eliminar instalación"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    )}
                  </div>

                  <div className="absolute bottom-3 left-3 right-3 text-white">
                    <h3 className="text-base font-extrabold drop-shadow-sm leading-snug">
                      {sede.nombre}
                    </h3>
                    <p className="text-xs text-white/90 flex items-center gap-1 drop-shadow-xs">
                      <MapPin className="w-3.5 h-3.5 text-[#ACD638]" />
                      <span className="truncate">{sede.direccion}</span>
                    </p>
                  </div>
                </div>

                {/* Body Content */}
                <div className="p-4 space-y-3 text-xs text-slate-600">
                  <div className="grid grid-cols-2 gap-2 text-center py-2 bg-slate-50 rounded-xl border border-slate-100">
                    <div>
                      <span className="text-[10.5px] text-slate-400 font-bold block uppercase">
                        Canchas
                      </span>
                      <span className="text-sm font-extrabold text-[#1E2B45] tabular-nums">
                        {courtsInSede.length} canchas
                      </span>
                    </div>
                    <div>
                      <span className="text-[10.5px] text-slate-400 font-bold block uppercase">
                        Horario
                      </span>
                      <span className="text-xs font-extrabold text-[#1E2B45]">
                        {sede.horarioApertura} - {sede.horarioCierre}
                      </span>
                    </div>
                  </div>

                  <div>
                    <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block mb-1">
                      Amenidades
                    </span>
                    <div className="flex flex-wrap gap-1">
                      {sede.amenidades.map((am, i) => (
                        <span
                          key={i}
                          className="px-2 py-0.5 rounded-md bg-slate-100 text-slate-700 text-[10.5px] font-medium"
                        >
                          {am}
                        </span>
                      ))}
                    </div>
                  </div>

                  <div>
                    <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block mb-0.5">
                      Cancelación y Reglamento
                    </span>
                    <p className="text-[11px] text-slate-500 line-clamp-2">
                      Hasta {sede.politicaCancelacionHoras}h antes sin recargo. {sede.reglamento}
                    </p>
                  </div>
                </div>
              </div>

              {/* Footer Switcher */}
              <div className="p-4 pt-0">
                {!isCurrentActive ? (
                  <button
                    type="button"
                    onClick={() => switchSede(sede.id)}
                    className="w-full py-2 rounded-xl bg-slate-100 hover:bg-[#ACD638] hover:text-[#16223B] text-xs font-bold text-[#273758] transition cursor-pointer"
                  >
                    Establecer como Sede Activa
                  </button>
                ) : (
                  <div className="w-full py-2 rounded-xl bg-[#ACD638]/20 text-[#3c5c06] text-xs font-bold text-center flex items-center justify-center gap-1.5">
                    <CheckCircle2 className="w-4 h-4 text-[#4B6B10]" />
                    <span>Instalación seleccionada</span>
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>

      {/* Modal Nueva Instalación */}
      {showCreateModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/55 p-4 animate-in fade-in">
          <div className="bg-white rounded-3xl p-6 max-w-lg w-full shadow-2xl border border-slate-200 space-y-4 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <h2 className="text-base font-extrabold text-[#1E2B45] flex items-center gap-2">
                <Building2 className="w-5 h-5 text-[#273758]" />
                Registrar Nueva Instalación
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
                <label className="font-bold text-slate-700 block mb-1">Nombre de la instalación</label>
                <input
                  type="text"
                  required
                  value={formData.nombre}
                  onChange={(e) => setFormData({ ...formData, nombre: e.target.value })}
                  placeholder="ej. Tenis Club Costa del Este"
                  className="w-full p-2.5 rounded-xl border border-slate-200 text-xs font-semibold focus:outline-none focus:ring-2 focus:ring-[#ACD638]"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="font-bold text-slate-700 block mb-1">Tipo de instalación</label>
                  <select
                    value={formData.tipo}
                    onChange={(e) => setFormData({ ...formData, tipo: e.target.value as any })}
                    className="w-full p-2.5 rounded-xl border border-slate-200 text-xs font-semibold"
                  >
                    <option value="Privada">Privada</option>
                    <option value="Pública">Pública / Municipal</option>
                  </select>
                </div>
                <div>
                  <label className="font-bold text-slate-700 block mb-1">Provincia</label>
                  <select
                    value={formData.provincia}
                    onChange={(e) => setFormData({ ...formData, provincia: e.target.value })}
                    className="w-full p-2.5 rounded-xl border border-slate-200 text-xs font-semibold"
                  >
                    <option value="Panamá">Panamá</option>
                    <option value="Panamá Oeste">Panamá Oeste</option>
                    <option value="Chiriquí">Chiriquí</option>
                    <option value="Colón">Colón</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="font-bold text-slate-700 block mb-1">Dirección completa</label>
                <input
                  type="text"
                  required
                  value={formData.direccion}
                  onChange={(e) => setFormData({ ...formData, direccion: e.target.value })}
                  placeholder="Av. Centenario, Ciudad de Panamá"
                  className="w-full p-2.5 rounded-xl border border-slate-200 text-xs font-semibold focus:outline-none focus:ring-2 focus:ring-[#ACD638]"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="font-bold text-slate-700 block mb-1">Horario Apertura</label>
                  <input
                    type="time"
                    value={formData.horarioApertura}
                    onChange={(e) => setFormData({ ...formData, horarioApertura: e.target.value })}
                    className="w-full p-2.5 rounded-xl border border-slate-200 text-xs font-semibold"
                  />
                </div>
                <div>
                  <label className="font-bold text-slate-700 block mb-1">Horario Cierre</label>
                  <input
                    type="time"
                    value={formData.horarioCierre}
                    onChange={(e) => setFormData({ ...formData, horarioCierre: e.target.value })}
                    className="w-full p-2.5 rounded-xl border border-slate-200 text-xs font-semibold"
                  />
                </div>
              </div>

              <div>
                <label className="font-bold text-slate-700 block mb-1">
                  Política de cancelación (horas mínimas previas)
                </label>
                <input
                  type="number"
                  min={1}
                  max={48}
                  value={formData.politicaCancelacionHoras}
                  onChange={(e) =>
                    setFormData({ ...formData, politicaCancelacionHoras: Number(e.target.value) })
                  }
                  className="w-full p-2.5 rounded-xl border border-slate-200 text-xs font-semibold"
                />
              </div>

              <div>
                <label className="font-bold text-slate-700 block mb-1">Reglamento interno</label>
                <textarea
                  rows={2}
                  value={formData.reglamento}
                  onChange={(e) => setFormData({ ...formData, reglamento: e.target.value })}
                  className="w-full p-2.5 rounded-xl border border-slate-200 text-xs font-medium focus:outline-none focus:ring-2 focus:ring-[#ACD638]"
                />
              </div>

              <div className="flex gap-2 pt-2">
                <button
                  type="submit"
                  className="flex-1 py-3 rounded-xl bg-[#ACD638] hover:bg-[#9ec82f] text-[#16223B] font-extrabold text-xs cursor-pointer shadow-sm"
                >
                  Guardar Instalación
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

      {/* Modal Editar Instalación */}
      {editingSede && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/55 p-4 animate-in fade-in">
          <div className="bg-white rounded-3xl p-6 max-w-lg w-full shadow-2xl border border-slate-200 space-y-4 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <h2 className="text-base font-extrabold text-[#1E2B45] flex items-center gap-2">
                <Edit2 className="w-5 h-5 text-[#273758]" />
                Editar {editingSede.nombre}
              </h2>
              <button
                type="button"
                onClick={() => setEditingSede(null)}
                className="p-1 text-slate-400 hover:text-slate-600 rounded-lg"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleUpdateSubmit} className="space-y-3.5 text-xs">
              <div>
                <label className="font-bold text-slate-700 block mb-1">Nombre</label>
                <input
                  type="text"
                  required
                  value={formData.nombre}
                  onChange={(e) => setFormData({ ...formData, nombre: e.target.value })}
                  className="w-full p-2.5 rounded-xl border border-slate-200 text-xs font-semibold"
                />
              </div>

              <div>
                <label className="font-bold text-slate-700 block mb-1">Dirección</label>
                <input
                  type="text"
                  required
                  value={formData.direccion}
                  onChange={(e) => setFormData({ ...formData, direccion: e.target.value })}
                  className="w-full p-2.5 rounded-xl border border-slate-200 text-xs font-semibold"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="font-bold text-slate-700 block mb-1">Horario Apertura</label>
                  <input
                    type="time"
                    value={formData.horarioApertura}
                    onChange={(e) => setFormData({ ...formData, horarioApertura: e.target.value })}
                    className="w-full p-2.5 rounded-xl border border-slate-200 text-xs font-semibold"
                  />
                </div>
                <div>
                  <label className="font-bold text-slate-700 block mb-1">Horario Cierre</label>
                  <input
                    type="time"
                    value={formData.horarioCierre}
                    onChange={(e) => setFormData({ ...formData, horarioCierre: e.target.value })}
                    className="w-full p-2.5 rounded-xl border border-slate-200 text-xs font-semibold"
                  />
                </div>
              </div>

              <div className="flex gap-2 pt-2">
                <button
                  type="submit"
                  className="flex-1 py-3 rounded-xl bg-[#273758] hover:bg-[#1f2d47] text-white font-extrabold text-xs cursor-pointer shadow-sm"
                >
                  Actualizar Cambios
                </button>
                <button
                  type="button"
                  onClick={() => setEditingSede(null)}
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
