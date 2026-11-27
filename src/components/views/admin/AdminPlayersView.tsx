import React, { useState } from 'react';
import {
  CheckCircle2,
  Edit2,
  Mail,
  Phone,
  Plus,
  Search,
  Shield,
  Star,
  Trophy,
  UserPlus,
  Users,
  X,
} from 'lucide-react';
import { useApp } from '../../../context/AppContext';
import { PlayerAvatar } from '../../VisualAssets';
import type { JugadorInput, RankingCategory, SkillLevel, Usuario } from '../../../types/tennis';

export const AdminPlayersView: React.FC = () => {
  const { state, createJugador, updateJugador, verifyProUser } = useApp();

  const [search, setSearch] = useState('');
  const [filterCat, setFilterCat] = useState<string>('ALL');
  const [filterNivel, setFilterNivel] = useState<string>('ALL');
  const [filterProvincia, setFilterProvincia] = useState<string>('ALL');

  // Modals
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [editingPlayer, setEditingPlayer] = useState<Usuario | null>(null);

  // Form state
  const [formData, setFormData] = useState<JugadorInput>({
    nombre: '',
    email: '',
    telefono: '+507 6000-0000',
    provincia: 'Panamá',
    distrito: 'Ciudad de Panamá',
    categoria: 'Amateur',
    nivel: 'Intermedio',
  });

  const players = state.usuarios.filter((u) => {
    if (u.rol !== 'jugador') return false;
    if (filterCat !== 'ALL' && u.categoria !== filterCat) return false;
    if (filterNivel !== 'ALL' && u.nivel !== filterNivel) return false;
    if (filterProvincia !== 'ALL' && u.provincia !== filterProvincia) return false;
    if (
      search &&
      !u.nombre.toLowerCase().includes(search.toLowerCase()) &&
      !u.email.toLowerCase().includes(search.toLowerCase())
    )
      return false;
    return true;
  });

  const handleCreateSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.nombre.trim() || !formData.email.trim()) return;
    createJugador(formData);
    setShowCreateModal(false);
    setFormData({
      nombre: '',
      email: '',
      telefono: '+507 6000-0000',
      provincia: 'Panamá',
      distrito: 'Ciudad de Panamá',
      categoria: 'Amateur',
      nivel: 'Intermedio',
    });
  };

  const handleUpdateSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingPlayer || !formData.nombre.trim()) return;
    updateJugador(editingPlayer.id, {
      nombre: formData.nombre,
      email: formData.email,
      telefono: formData.telefono,
      provincia: formData.provincia,
      categoria: formData.categoria,
      nivel: formData.nivel,
    });
    setEditingPlayer(null);
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-[#1E2B45] tracking-tight">
            Comunidad de Jugadores
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 mt-0.5">
            Directorio federado de miembros, ranking Elo, nivel de juego y asistencias
          </p>
        </div>

        <button
          type="button"
          onClick={() => setShowCreateModal(true)}
          className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-[#ACD638] hover:bg-[#9ec82f] text-[#16223B] text-xs font-extrabold shadow-sm transition cursor-pointer self-start sm:self-auto"
        >
          <UserPlus className="w-4 h-4" />
          <span>Registrar Jugador</span>
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
            placeholder="Buscar por nombre o correo..."
            className="w-full pl-9 pr-3 py-1.5 rounded-xl border border-slate-200 text-xs font-semibold focus:outline-none focus:ring-2 focus:ring-[#ACD638]"
          />
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <select
            value={filterCat}
            onChange={(e) => setFilterCat(e.target.value)}
            className="text-xs font-semibold bg-slate-50 border border-slate-200 rounded-xl px-2.5 py-1.5 text-slate-700"
          >
            <option value="ALL">Todas las Categorías</option>
            <option value="Junior">Junior</option>
            <option value="Amateur">Amateur</option>
            <option value="Profesional">Profesional</option>
          </select>

          <select
            value={filterNivel}
            onChange={(e) => setFilterNivel(e.target.value)}
            className="text-xs font-semibold bg-slate-50 border border-slate-200 rounded-xl px-2.5 py-1.5 text-slate-700"
          >
            <option value="ALL">Todos los Niveles</option>
            <option value="Principiante">Principiante</option>
            <option value="Intermedio">Intermedio</option>
            <option value="Avanzado">Avanzado</option>
            <option value="Pro">Pro</option>
          </select>

          <select
            value={filterProvincia}
            onChange={(e) => setFilterProvincia(e.target.value)}
            className="text-xs font-semibold bg-slate-50 border border-slate-200 rounded-xl px-2.5 py-1.5 text-slate-700"
          >
            <option value="ALL">Todas las Provincias</option>
            <option value="Panamá">Panamá</option>
            <option value="Panamá Oeste">Panamá Oeste</option>
            <option value="Chiriquí">Chiriquí</option>
          </select>
        </div>
      </div>

      {/* Players Table */}
      <div className="bg-white rounded-2xl border border-slate-200/80 shadow-xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="bg-slate-50 border-b border-slate-200 text-[11px] font-extrabold text-[#273758] uppercase tracking-wider">
                <th className="py-3 px-4">Jugador</th>
                <th className="py-3 px-3">Categoría</th>
                <th className="py-3 px-3">Nivel</th>
                <th className="py-3 px-3 text-center">Elo Ranking</th>
                <th className="py-3 px-3 text-center">Partidos (G/P)</th>
                <th className="py-3 px-3 text-center">Asistencia %</th>
                <th className="py-3 px-3">Ubicación</th>
                <th className="py-3 px-4 text-right">Acciones</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 font-medium">
              {players.map((player) => {
                const totalMatches = player.ganados + player.perdidos;
                const winRate = totalMatches > 0 ? Math.round((player.ganados / totalMatches) * 100) : 0;
                const eloValue = player.elo[player.categoria] || 1500;

                return (
                  <tr key={player.id} className="hover:bg-slate-50/70 transition">
                    <td className="py-3 px-4">
                      <div className="flex items-center gap-3">
                        <PlayerAvatar
                          nombre={player.nombre}
                          seed={player.avatarSeed}
                          size="sm"
                          ringLime={player.verificadoPro}
                        />
                        <div>
                          <div className="flex items-center gap-1.5">
                            <span className="font-bold text-sm text-[#1E2B45]">{player.nombre}</span>
                            {player.verificadoPro && (
                              <span className="px-1.5 py-0.2 rounded bg-amber-100 text-amber-800 text-[9.5px] font-extrabold">
                                PRO
                              </span>
                            )}
                            {player.esMenor && (
                              <span className="px-1.5 py-0.2 rounded bg-sky-100 text-sky-800 text-[9.5px] font-extrabold">
                                JUNIOR
                              </span>
                            )}
                          </div>
                          <span className="text-[11px] text-slate-400 block">{player.email}</span>
                        </div>
                      </div>
                    </td>

                    <td className="py-3 px-3">
                      <span className="px-2 py-0.5 rounded-full bg-slate-100 text-slate-700 text-[10.5px] font-bold">
                        {player.categoria}
                      </span>
                    </td>

                    <td className="py-3 px-3">
                      <span className="font-semibold text-[#1E2B45]">{player.nivel}</span>
                    </td>

                    <td className="py-3 px-3 text-center font-mono font-extrabold text-[#273758] text-sm tabular-nums">
                      {eloValue}
                    </td>

                    <td className="py-3 px-3 text-center">
                      <span className="font-bold text-[#1E2B45] tabular-nums">
                        {player.ganados}G / {player.perdidos}P
                      </span>
                      <span className="text-[10px] text-slate-400 block font-normal">
                        {winRate}% victorias
                      </span>
                    </td>

                    <td className="py-3 px-3 text-center">
                      <span className="inline-flex items-center gap-1 font-bold text-emerald-700 text-xs tabular-nums">
                        <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500" />
                        {player.asistenciaScore}%
                      </span>
                    </td>

                    <td className="py-3 px-3 text-slate-600">
                      <span>{player.provincia}</span>
                      <span className="block text-[10px] text-slate-400">{player.distrito}</span>
                    </td>

                    <td className="py-3 px-4 text-right">
                      <div className="flex items-center justify-end gap-1.5">
                        <button
                          type="button"
                          onClick={() => {
                            setEditingPlayer(player);
                            setFormData({
                              nombre: player.nombre,
                              email: player.email,
                              telefono: player.telefono,
                              provincia: player.provincia,
                              distrito: player.distrito,
                              categoria: player.categoria,
                              nivel: player.nivel,
                            });
                          }}
                          className="p-1.5 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-700 transition cursor-pointer"
                          title="Editar jugador"
                        >
                          <Edit2 className="w-3.5 h-3.5" />
                        </button>
                        <button
                          type="button"
                          onClick={() => verifyProUser(player.id)}
                          className={`p-1.5 rounded-lg transition cursor-pointer ${
                            player.verificadoPro
                              ? 'bg-amber-100 text-amber-800'
                              : 'bg-slate-100 text-slate-400 hover:text-amber-600'
                          }`}
                          title="Verificación Pro"
                        >
                          <Star className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* Modal Registrar Jugador */}
      {showCreateModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/55 p-4 animate-in fade-in">
          <div className="bg-white rounded-3xl p-6 max-w-md w-full shadow-2xl border border-slate-200 space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <h2 className="text-base font-extrabold text-[#1E2B45] flex items-center gap-2">
                <UserPlus className="w-5 h-5 text-[#273758]" />
                Registrar Jugador
              </h2>
              <button
                type="button"
                onClick={() => setShowCreateModal(false)}
                className="p-1 text-slate-400 hover:text-slate-600 rounded-lg"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleCreateSubmit} className="space-y-3 text-xs">
              <div>
                <label className="font-bold text-slate-700 block mb-1">Nombre completo</label>
                <input
                  type="text"
                  required
                  placeholder="ej. Mateo Morales"
                  value={formData.nombre}
                  onChange={(e) => setFormData({ ...formData, nombre: e.target.value })}
                  className="w-full p-2.5 rounded-xl border border-slate-200 text-xs font-semibold focus:outline-none focus:ring-2 focus:ring-[#ACD638]"
                />
              </div>

              <div>
                <label className="font-bold text-slate-700 block mb-1">Correo electrónico</label>
                <input
                  type="email"
                  required
                  placeholder="correo@ejemplo.com"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  className="w-full p-2.5 rounded-xl border border-slate-200 text-xs font-semibold focus:outline-none focus:ring-2 focus:ring-[#ACD638]"
                />
              </div>

              <div>
                <label className="font-bold text-slate-700 block mb-1">Teléfono</label>
                <input
                  type="text"
                  value={formData.telefono}
                  onChange={(e) => setFormData({ ...formData, telefono: e.target.value })}
                  className="w-full p-2.5 rounded-xl border border-slate-200 text-xs font-semibold"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="font-bold text-slate-700 block mb-1">Categoría Ranking</label>
                  <select
                    value={formData.categoria}
                    onChange={(e) =>
                      setFormData({ ...formData, categoria: e.target.value as RankingCategory })
                    }
                    className="w-full p-2.5 rounded-xl border border-slate-200 text-xs font-semibold"
                  >
                    <option value="Amateur">Amateur</option>
                    <option value="Junior">Junior</option>
                    <option value="Profesional">Profesional</option>
                  </select>
                </div>
                <div>
                  <label className="font-bold text-slate-700 block mb-1">Nivel deportivo</label>
                  <select
                    value={formData.nivel}
                    onChange={(e) =>
                      setFormData({ ...formData, nivel: e.target.value as SkillLevel })
                    }
                    className="w-full p-2.5 rounded-xl border border-slate-200 text-xs font-semibold"
                  >
                    <option value="Principiante">Principiante</option>
                    <option value="Intermedio">Intermedio</option>
                    <option value="Avanzado">Avanzado</option>
                    <option value="Pro">Pro</option>
                  </select>
                </div>
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

              <div className="flex gap-2 pt-2">
                <button
                  type="submit"
                  className="flex-1 py-3 rounded-xl bg-[#ACD638] hover:bg-[#9ec82f] text-[#16223B] font-extrabold text-xs cursor-pointer shadow-sm"
                >
                  Guardar Jugador
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

      {/* Modal Editar Jugador */}
      {editingPlayer && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/55 p-4 animate-in fade-in">
          <div className="bg-white rounded-3xl p-6 max-w-md w-full shadow-2xl border border-slate-200 space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <h2 className="text-base font-extrabold text-[#1E2B45] flex items-center gap-2">
                <Edit2 className="w-5 h-5 text-[#273758]" />
                Editar Jugador
              </h2>
              <button
                type="button"
                onClick={() => setEditingPlayer(null)}
                className="p-1 text-slate-400 hover:text-slate-600 rounded-lg"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleUpdateSubmit} className="space-y-3 text-xs">
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
                <label className="font-bold text-slate-700 block mb-1">Correo electrónico</label>
                <input
                  type="email"
                  required
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  className="w-full p-2.5 rounded-xl border border-slate-200 text-xs font-semibold"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="font-bold text-slate-700 block mb-1">Categoría</label>
                  <select
                    value={formData.categoria}
                    onChange={(e) =>
                      setFormData({ ...formData, categoria: e.target.value as RankingCategory })
                    }
                    className="w-full p-2.5 rounded-xl border border-slate-200 text-xs font-semibold"
                  >
                    <option value="Amateur">Amateur</option>
                    <option value="Junior">Junior</option>
                    <option value="Profesional">Profesional</option>
                  </select>
                </div>
                <div>
                  <label className="font-bold text-slate-700 block mb-1">Nivel</label>
                  <select
                    value={formData.nivel}
                    onChange={(e) =>
                      setFormData({ ...formData, nivel: e.target.value as SkillLevel })
                    }
                    className="w-full p-2.5 rounded-xl border border-slate-200 text-xs font-semibold"
                  >
                    <option value="Principiante">Principiante</option>
                    <option value="Intermedio">Intermedio</option>
                    <option value="Avanzado">Avanzado</option>
                    <option value="Pro">Pro</option>
                  </select>
                </div>
              </div>

              <div className="flex gap-2 pt-2">
                <button
                  type="submit"
                  className="flex-1 py-3 rounded-xl bg-[#273758] text-white font-extrabold text-xs cursor-pointer shadow-sm"
                >
                  Actualizar Datos
                </button>
                <button
                  type="button"
                  onClick={() => setEditingPlayer(null)}
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
