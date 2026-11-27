import React, { useState } from 'react';
import {
  AlertTriangle,
  CheckCircle2,
  DollarSign,
  Edit2,
  Lightbulb,
  Plus,
  Shield,
  Trash2,
  Trophy,
  Umbrella,
  Wrench,
  X,
} from 'lucide-react';
import { useApp } from '../../../context/AppContext';
import type { AdminModule, Cancha, CanchaInput, SurfaceType } from '../../../types/tennis';

interface AdminCourtsViewProps {
  onNavigate?: (mod: AdminModule) => void;
}

export const AdminCourtsView: React.FC<AdminCourtsViewProps> = ({ onNavigate }) => {
  const {
    state,
    activeSede,
    createCancha,
    updateCancha,
    deleteCancha,
    toggleCourtStatus,
    updateCourtRates,
    reportMaintenance,
  } = useApp();

  const [selectedSedeId, setSelectedSedeId] = useState<string>(activeSede.id);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [editingCourt, setEditingCourt] = useState<Cancha | null>(null);
  const [ratesModalCourt, setRatesModalCourt] = useState<Cancha | null>(null);

  // New court form
  const [formData, setFormData] = useState<CanchaInput>({
    sedeId: activeSede.id,
    nombre: '',
    superficie: 'Dura (Hard Court)',
    iluminacion: true,
    techada: false,
    precioHora: 20,
    precioNocturno: 25,
    capacidadMax: 4,
  });

  // Rates editor state
  const [editPriceBase, setEditPriceBase] = useState(20);
  const [editPriceNight, setEditPriceNight] = useState(25);

  const courts = state.canchas.filter(
    (c) => selectedSedeId === 'ALL' || c.sedeId === selectedSedeId
  );

  const handleCreateSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.nombre.trim()) return;
    createCancha({
      ...formData,
      sedeId: selectedSedeId === 'ALL' ? activeSede.id : selectedSedeId,
    });
    setShowCreateModal(false);
    setFormData({
      sedeId: activeSede.id,
      nombre: '',
      superficie: 'Dura (Hard Court)',
      iluminacion: true,
      techada: false,
      precioHora: 20,
      precioNocturno: 25,
      capacidadMax: 4,
    });
  };

  const handleSaveRates = (e: React.FormEvent) => {
    e.preventDefault();
    if (!ratesModalCourt) return;
    updateCourtRates(ratesModalCourt.id, {
      precioHora: editPriceBase,
      precioNocturno: editPriceNight,
    });
    setRatesModalCourt(null);
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-[#1E2B45] tracking-tight">
            Administración de Canchas
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 mt-0.5">
            Superficies, iluminación LED, tarifas por hora obligatorias (&gt; B/. 0.00) y disponibilidad
          </p>
        </div>

        <button
          type="button"
          onClick={() => setShowCreateModal(true)}
          className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-[#ACD638] hover:bg-[#9ec82f] text-[#16223B] text-xs font-extrabold shadow-sm transition cursor-pointer self-start sm:self-auto"
        >
          <Plus className="w-4 h-4" />
          <span>Agregar Cancha</span>
        </button>
      </div>

      {/* Sub-Navigation Tabs */}
      {onNavigate && (
        <div className="flex items-center gap-1.5 p-1 bg-slate-200/70 rounded-2xl w-fit flex-wrap">
          <button
            type="button"
            className="px-3.5 py-1.5 rounded-xl text-xs font-extrabold bg-[#273758] text-white shadow-xs"
          >
            🎾 Canchas ({courts.length})
          </button>
          <button
            type="button"
            onClick={() => onNavigate('instalaciones')}
            className="px-3.5 py-1.5 rounded-xl text-xs font-bold text-slate-600 hover:text-[#1E2B45] hover:bg-white/80 transition cursor-pointer"
          >
            🏢 Instalaciones Deportivas
          </button>
          <button
            type="button"
            onClick={() => onNavigate('mantenimiento')}
            className="px-3.5 py-1.5 rounded-xl text-xs font-bold text-slate-600 hover:text-[#1E2B45] hover:bg-white/80 transition cursor-pointer"
          >
            🛠️ Mantenimiento & Lluvia
          </button>
          <button
            type="button"
            onClick={() => onNavigate('checkin')}
            className="px-3.5 py-1.5 rounded-xl text-xs font-bold text-slate-600 hover:text-[#1E2B45] hover:bg-white/80 transition cursor-pointer"
          >
            🎟️ Control de Check-in
          </button>
        </div>
      )}

      {/* Sede selector filter */}
      <div className="bg-white rounded-2xl p-4 border border-slate-200/80 shadow-xs flex items-center justify-between gap-4">
        <div className="flex items-center gap-2 text-xs">
          <span className="font-bold text-slate-500">Filtrar por Instalación:</span>
          <select
            value={selectedSedeId}
            onChange={(e) => setSelectedSedeId(e.target.value)}
            className="text-xs font-semibold bg-slate-50 border border-slate-200 rounded-xl px-3 py-1.5 text-slate-700"
          >
            <option value="ALL">Todas las sedes del país ({state.sedes.length})</option>
            {state.sedes.map((s) => (
              <option key={s.id} value={s.id}>
                {s.nombre} ({s.tipo})
              </option>
            ))}
          </select>
        </div>

        <span className="text-xs text-slate-400 font-medium">
          Mostrando {courts.length} canchas
        </span>
      </div>

      {/* Courts Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-5">
        {courts.map((cancha) => {
          const sede = state.sedes.find((s) => s.id === cancha.sedeId);
          const isAvailable = cancha.estado === 'Disponible';
          const isMaintenance = cancha.estado === 'Mantenimiento' || cancha.estado === 'Bloqueada';

          return (
            <div
              key={cancha.id}
              className="bg-white rounded-2xl border border-slate-200/80 p-5 shadow-xs flex flex-col justify-between hover:shadow-md transition"
            >
              <div>
                <div className="flex items-start justify-between">
                  <div>
                    <h3 className="text-base font-extrabold text-[#1E2B45]">{cancha.nombre}</h3>
                    <span className="text-xs text-slate-400 block">{sede?.nombre || 'Sede'}</span>
                  </div>

                  <span
                    className={`px-2.5 py-0.5 rounded-full text-[10px] font-extrabold uppercase ${
                      isMaintenance
                        ? 'bg-amber-100 text-amber-800'
                        : isAvailable
                          ? 'bg-[#ACD638]/20 text-[#3d5c07]'
                          : 'bg-rose-100 text-rose-800'
                    }`}
                  >
                    ● {cancha.estado}
                  </span>
                </div>

                {/* Attributes */}
                <div className="mt-4 space-y-2 text-xs text-slate-600">
                  <div className="flex items-center justify-between py-1 border-b border-slate-100">
                    <span className="text-slate-400">Superficie:</span>
                    <span className="font-bold text-[#1E2B45]">{cancha.superficie}</span>
                  </div>

                  <div className="flex items-center justify-between py-1 border-b border-slate-100">
                    <span className="text-slate-400">Iluminación LED:</span>
                    <span className="font-semibold text-slate-700 flex items-center gap-1">
                      <Lightbulb
                        className={`w-3.5 h-3.5 ${
                          cancha.iluminacion ? 'text-[#ACD638]' : 'text-slate-300'
                        }`}
                      />
                      {cancha.iluminacion ? 'Sí (Apta noche)' : 'Sin iluminación'}
                    </span>
                  </div>

                  <div className="flex items-center justify-between py-1 border-b border-slate-100">
                    <span className="text-slate-400">Cubierta:</span>
                    <span className="font-semibold text-slate-700 flex items-center gap-1">
                      <Umbrella
                        className={`w-3.5 h-3.5 ${cancha.techada ? 'text-sky-500' : 'text-slate-300'}`}
                      />
                      {cancha.techada ? 'Techada (Lluvia ok)' : 'Al aire libre'}
                    </span>
                  </div>

                  <div className="flex items-center justify-between py-1 border-b border-slate-100">
                    <span className="text-slate-400">Tarifa Diurna:</span>
                    <span className="font-extrabold text-[#1E2B45] tabular-nums text-sm">
                      B/. {cancha.precioHora.toFixed(2)}/h
                    </span>
                  </div>

                  <div className="flex items-center justify-between py-1 border-b border-slate-100">
                    <span className="text-slate-400">Tarifa Nocturna:</span>
                    <span className="font-extrabold text-[#5E8210] tabular-nums text-sm">
                      B/. {(cancha.precioNocturno || cancha.precioHora).toFixed(2)}/h
                    </span>
                  </div>

                  {cancha.motivoBloqueo && (
                    <div className="p-2 rounded-lg bg-amber-50 text-amber-800 text-[11px] font-medium">
                      Motivo: {cancha.motivoBloqueo}
                    </div>
                  )}
                </div>
              </div>

              {/* Action buttons */}
              <div className="pt-4 mt-2 border-t border-slate-100 grid grid-cols-2 gap-2">
                <button
                  type="button"
                  onClick={() => {
                    setRatesModalCourt(cancha);
                    setEditPriceBase(cancha.precioHora);
                    setEditPriceNight(cancha.precioNocturno || cancha.precioHora);
                  }}
                  className="py-2 px-3 rounded-xl bg-slate-100 hover:bg-slate-200 text-xs font-bold text-[#273758] flex items-center justify-center gap-1 cursor-pointer"
                >
                  <DollarSign className="w-3.5 h-3.5 text-[#5E8210]" />
                  <span>Tarifas</span>
                </button>

                <button
                  type="button"
                  onClick={() => toggleCourtStatus(cancha.id)}
                  className={`py-2 px-3 rounded-xl text-xs font-bold flex items-center justify-center gap-1 cursor-pointer transition ${
                    isAvailable
                      ? 'bg-amber-50 text-amber-800 hover:bg-amber-100'
                      : 'bg-emerald-50 text-emerald-800 hover:bg-emerald-100'
                  }`}
                >
                  <Wrench className="w-3.5 h-3.5" />
                  <span>{isAvailable ? 'Bloquear' : 'Habilitar'}</span>
                </button>
              </div>
            </div>
          );
        })}
      </div>

      {/* Modal Editar Tarifas */}
      {ratesModalCourt && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/55 p-4 animate-in fade-in">
          <div className="bg-white rounded-3xl p-6 max-w-md w-full shadow-2xl border border-slate-200 space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <h2 className="text-base font-extrabold text-[#1E2B45] flex items-center gap-2">
                <DollarSign className="w-5 h-5 text-[#273758]" />
                Tarifas de {ratesModalCourt.nombre}
              </h2>
              <button
                type="button"
                onClick={() => setRatesModalCourt(null)}
                className="p-1 text-slate-400 hover:text-slate-600 rounded-lg"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSaveRates} className="space-y-4 text-xs">
              <div>
                <label className="font-bold text-slate-700 block mb-1">
                  Tarifa base diurna por hora (B/. obligatoria &gt; 0)
                </label>
                <div className="relative">
                  <span className="absolute left-3 top-1/2 -translate-y-1/2 font-bold text-slate-400">
                    B/.
                  </span>
                  <input
                    type="number"
                    min="1"
                    step="0.5"
                    required
                    value={editPriceBase}
                    onChange={(e) => setEditPriceBase(Number(e.target.value))}
                    className="w-full pl-10 pr-3 py-2.5 rounded-xl border border-slate-200 text-sm font-bold text-[#1E2B45]"
                  />
                </div>
              </div>

              <div>
                <label className="font-bold text-slate-700 block mb-1">
                  Tarifa nocturna con iluminación LED (a partir de 18:00)
                </label>
                <div className="relative">
                  <span className="absolute left-3 top-1/2 -translate-y-1/2 font-bold text-slate-400">
                    B/.
                  </span>
                  <input
                    type="number"
                    min="1"
                    step="0.5"
                    required
                    value={editPriceNight}
                    onChange={(e) => setEditPriceNight(Number(e.target.value))}
                    className="w-full pl-10 pr-3 py-2.5 rounded-xl border border-slate-200 text-sm font-bold text-[#1E2B45]"
                  />
                </div>
              </div>

              <div className="p-3 bg-slate-50 rounded-xl text-slate-500 text-[11px]">
                Regla institucional: Toda cancha pública o privada debe tener un valor comercial
                válido para reservas y facturación.
              </div>

              <div className="flex gap-2 pt-2">
                <button
                  type="submit"
                  className="flex-1 py-3 rounded-xl bg-[#ACD638] hover:bg-[#9ec82f] text-[#16223B] font-extrabold text-xs cursor-pointer shadow-sm"
                >
                  Actualizar Tarifas
                </button>
                <button
                  type="button"
                  onClick={() => setRatesModalCourt(null)}
                  className="py-3 px-4 rounded-xl border border-slate-200 text-slate-600 font-bold text-xs"
                >
                  Cancelar
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Modal Agregar Cancha */}
      {showCreateModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/55 p-4 animate-in fade-in">
          <div className="bg-white rounded-3xl p-6 max-w-md w-full shadow-2xl border border-slate-200 space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <h2 className="text-base font-extrabold text-[#1E2B45] flex items-center gap-2">
                <Trophy className="w-5 h-5 text-[#273758]" />
                Agregar Cancha a {activeSede.nombre}
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
                <label className="font-bold text-slate-700 block mb-1">Nombre de la cancha</label>
                <input
                  type="text"
                  required
                  placeholder="ej. Cancha Central 5"
                  value={formData.nombre}
                  onChange={(e) => setFormData({ ...formData, nombre: e.target.value })}
                  className="w-full p-2.5 rounded-xl border border-slate-200 text-xs font-semibold focus:outline-none focus:ring-2 focus:ring-[#ACD638]"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="font-bold text-slate-700 block mb-1">Superficie</label>
                  <select
                    value={formData.superficie}
                    onChange={(e) =>
                      setFormData({ ...formData, superficie: e.target.value as SurfaceType })
                    }
                    className="w-full p-2.5 rounded-xl border border-slate-200 text-xs font-semibold"
                  >
                    <option value="Dura (Hard Court)">Dura (Hard Court)</option>
                    <option value="Arcilla">Arcilla</option>
                    <option value="Césped Sintético">Césped Sintético</option>
                  </select>
                </div>
                <div>
                  <label className="font-bold text-slate-700 block mb-1">Capacidad Máx.</label>
                  <input
                    type="number"
                    min="2"
                    max="8"
                    value={formData.capacidadMax}
                    onChange={(e) =>
                      setFormData({ ...formData, capacidadMax: Number(e.target.value) })
                    }
                    className="w-full p-2.5 rounded-xl border border-slate-200 text-xs font-semibold"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <label className="flex items-center gap-2 p-2.5 rounded-xl border border-slate-200 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={formData.iluminacion}
                    onChange={(e) => setFormData({ ...formData, iluminacion: e.target.checked })}
                    className="accent-[#ACD638]"
                  />
                  <span className="font-semibold text-slate-700">Iluminación LED</span>
                </label>
                <label className="flex items-center gap-2 p-2.5 rounded-xl border border-slate-200 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={formData.techada}
                    onChange={(e) => setFormData({ ...formData, techada: e.target.checked })}
                    className="accent-[#ACD638]"
                  />
                  <span className="font-semibold text-slate-700">Techada</span>
                </label>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="font-bold text-slate-700 block mb-1">Tarifa base diurna</label>
                  <input
                    type="number"
                    min="1"
                    step="0.5"
                    required
                    value={formData.precioHora}
                    onChange={(e) => setFormData({ ...formData, precioHora: Number(e.target.value) })}
                    className="w-full p-2.5 rounded-xl border border-slate-200 text-xs font-semibold"
                  />
                </div>
                <div>
                  <label className="font-bold text-slate-700 block mb-1">Tarifa nocturna</label>
                  <input
                    type="number"
                    min="1"
                    step="0.5"
                    value={formData.precioNocturno || 25}
                    onChange={(e) =>
                      setFormData({ ...formData, precioNocturno: Number(e.target.value) })
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
                  Crear Cancha
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
