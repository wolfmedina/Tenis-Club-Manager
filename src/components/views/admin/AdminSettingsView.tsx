import React, { useState } from 'react';
import {
  Bell,
  CheckCircle2,
  Globe,
  Lock,
  RotateCcw,
  Send,
  Settings,
  Shield,
  Sliders,
  UserCheck,
  Users,
} from 'lucide-react';
import { useApp } from '../../../context/AppContext';

export const AdminSettingsView: React.FC = () => {
  const { state, resetDemoData, sendAdminNotification, showToast, updateServiceFee } = useApp();

  const [activeTab, setActiveTab] = useState<
    'usuarios' | 'roles' | 'provincias' | 'notificaciones' | 'general'
  >('usuarios');

  // Broadcast Notification Form
  const [notifTitulo, setNotifTitulo] = useState('');
  const [notifMensaje, setNotifMensaje] = useState('');

  const adminUsers = state.usuarios.filter((u) => u.rol === 'admin' || u.rol === 'superadmin');

  const handleSendBroadcast = (e: React.FormEvent) => {
    e.preventDefault();
    if (!notifTitulo.trim() || !notifMensaje.trim()) return;
    sendAdminNotification(notifTitulo.trim(), notifMensaje.trim());
    setNotifTitulo('');
    setNotifMensaje('');
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      {/* Header */}
      <div>
        <h1 className="text-2xl sm:text-3xl font-extrabold text-[#1E2B45] tracking-tight">
          Configuración del Sistema
        </h1>
        <p className="text-xs sm:text-sm text-slate-500 mt-0.5">
          Gestión de accesos, roles, divisiones territoriales en Panamá y parámetros generales
        </p>
      </div>

      {/* Tabs */}
      <div className="bg-white rounded-2xl p-2 border border-slate-200/80 shadow-xs flex flex-wrap gap-1">
        {[
          { id: 'usuarios', label: 'Usuarios Administrativos', icon: Users },
          { id: 'roles', label: 'Roles y Permisos', icon: Shield },
          { id: 'provincias', label: 'Provincias y Ciudades', icon: Globe },
          { id: 'notificaciones', label: 'Emisión de Avisos', icon: Bell },
          { id: 'general', label: 'Configuración General', icon: Settings },
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

      {/* TAB 1: USUARIOS ADMIN */}
      {activeTab === 'usuarios' && (
        <div className="bg-white rounded-2xl p-5 border border-slate-200/80 shadow-xs space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-slate-100">
            <div>
              <h2 className="text-base font-extrabold text-[#1E2B45]">
                Usuarios con Privilegios Administrativos
              </h2>
              <span className="text-xs text-slate-400">
                Operadores de sistema, administradores de club y coordinadores de recepción
              </span>
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead>
                <tr className="border-b border-slate-200 text-[11px] font-bold text-slate-400 uppercase">
                  <th className="py-2.5">Nombre</th>
                  <th className="py-2.5">Correo Electrónico</th>
                  <th className="py-2.5">Rol de Acceso</th>
                  <th className="py-2.5">Sub-Rol Especializado</th>
                  <th className="py-2.5">Sedes Asignadas</th>
                  <th className="py-2.5 text-center">Estado</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 font-medium">
                {adminUsers.map((u) => (
                  <tr key={u.id} className="hover:bg-slate-50">
                    <td className="py-3 font-bold text-[#1E2B45]">{u.nombre}</td>
                    <td className="py-3 text-slate-600">{u.email}</td>
                    <td className="py-3">
                      <span className="px-2 py-0.5 rounded-full bg-[#273758] text-white text-[10px] font-extrabold uppercase">
                        {u.rol}
                      </span>
                    </td>
                    <td className="py-3 text-slate-600">{u.adminSubRol || 'Control total'}</td>
                    <td className="py-3 text-slate-500">
                      {u.rol === 'superadmin' ? 'Todas las sedes del país' : 'Sedes asignadas autorizadas'}
                    </td>
                    <td className="py-3 text-center">
                      <span className="px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800 text-[10px] font-bold">
                        Activo
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* TAB 2: ROLES Y PERMISOS */}
      {activeTab === 'roles' && (
        <div className="bg-white rounded-2xl p-5 border border-slate-200/80 shadow-xs space-y-4">
          <h2 className="text-base font-extrabold text-[#1E2B45]">
            Matriz de Permisos por Rol
          </h2>
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs border border-slate-200">
              <thead>
                <tr className="bg-slate-50 border-b border-slate-200 text-[11px] font-extrabold text-[#273758]">
                  <th className="p-3">Módulo / Capacidad</th>
                  <th className="p-3 text-center">Superadmin Nacional</th>
                  <th className="p-3 text-center">Admin de Instalación</th>
                  <th className="p-3 text-center">Instructor Coach</th>
                  <th className="p-3 text-center">Jugador / Cliente</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-200 font-medium">
                {[
                  ['Crear y editar instalaciones en Panamá', 'Sí', 'No', 'No', 'No'],
                  ['Administrar tarifas de canchas', 'Sí', 'Sí', 'No', 'No'],
                  ['Bloqueo de canchas por mantenimiento', 'Sí', 'Sí', 'No', 'No'],
                  ['Aprobación de resultados y disputas Elo', 'Sí', 'Sí', 'No', 'No'],
                  ['Programar clases y clínicas deportivas', 'Sí', 'Sí', 'Sí', 'No'],
                  ['Validar check-in de jugadores', 'Sí', 'Sí', 'Sí', 'No'],
                  ['Reservar canchas y pagar online', 'Sí', 'Sí', 'Sí', 'Sí'],
                  ['Configurar comisiones de plataforma', 'Sí', 'No', 'No', 'No'],
                  ['Auditoría financiera nacional', 'Sí', 'No', 'No', 'No'],
                ].map(([perm, s, a, i, j], idx) => (
                  <tr key={idx} className="hover:bg-slate-50">
                    <td className="p-3 font-semibold text-[#1E2B45]">{perm}</td>
                    <td className="p-3 text-center font-bold text-emerald-700">{s}</td>
                    <td className="p-3 text-center font-bold text-slate-700">{a}</td>
                    <td className="p-3 text-center font-bold text-slate-700">{i}</td>
                    <td className="p-3 text-center font-bold text-slate-700">{j}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* TAB 3: PROVINCIAS Y CIUDADES */}
      {activeTab === 'provincias' && (
        <div className="bg-white rounded-2xl p-5 border border-slate-200/80 shadow-xs space-y-4">
          <h2 className="text-base font-extrabold text-[#1E2B45]">
            División Territorial Deportiva en Panamá
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200 space-y-2">
              <span className="font-extrabold text-sm text-[#1E2B45] block">Provincia de Panamá</span>
              <p className="text-xs text-slate-500">
                Sedes activas: Tenis Club Panamá (Costa del Este), Club Pacífico (Punta Pacífica), Cinta Costera (Ave. Balboa), Parque Omar (San Francisco).
              </p>
              <span className="inline-block px-2 py-0.5 rounded bg-emerald-100 text-emerald-800 text-[10px] font-bold">
                4 instalaciones · 8 canchas
              </span>
            </div>

            <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200 space-y-2">
              <span className="font-extrabold text-sm text-[#1E2B45] block">Provincia de Panamá Oeste</span>
              <p className="text-xs text-slate-500">
                Sedes activas: Club Demo Costa Verde (La Chorrera). Canchas de arcilla y dura con iluminación LED.
              </p>
              <span className="inline-block px-2 py-0.5 rounded bg-emerald-100 text-emerald-800 text-[10px] font-bold">
                1 instalación · 1 cancha
              </span>
            </div>

            <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200 space-y-2">
              <span className="font-extrabold text-sm text-[#1E2B45] block">Provincia de Chiriquí</span>
              <p className="text-xs text-slate-500">
                Sedes activas: Club Demo David (David). Canchas de superficie dura y programas juveniles.
              </p>
              <span className="inline-block px-2 py-0.5 rounded bg-emerald-100 text-emerald-800 text-[10px] font-bold">
                1 instalación · 1 cancha
              </span>
            </div>
          </div>
        </div>
      )}

      {/* TAB 4: EMISION DE AVISOS */}
      {activeTab === 'notificaciones' && (
        <div className="bg-white rounded-2xl p-6 border border-slate-200/80 shadow-xs max-w-xl space-y-4">
          <h2 className="text-base font-extrabold text-[#1E2B45]">
            Emisión de Avisos y Notificaciones Masivas
          </h2>
          <p className="text-xs text-slate-500">
            Envía avisos de torneo, cierres por mantenimiento, alertas de lluvia o comunicados oficiales a todos los usuarios del club.
          </p>

          <form onSubmit={handleSendBroadcast} className="space-y-3.5 text-xs">
            <div>
              <label className="font-bold text-slate-700 block mb-1">Título del comunicado</label>
              <input
                type="text"
                required
                placeholder="ej. Torneo de Dobles Aniversario"
                value={notifTitulo}
                onChange={(e) => setNotifTitulo(e.target.value)}
                className="w-full p-2.5 rounded-xl border border-slate-200 text-xs font-semibold focus:outline-none focus:ring-2 focus:ring-[#ACD638]"
              />
            </div>

            <div>
              <label className="font-bold text-slate-700 block mb-1">Mensaje completo</label>
              <textarea
                rows={4}
                required
                placeholder="Escribe el aviso que recibirán los miembros..."
                value={notifMensaje}
                onChange={(e) => setNotifMensaje(e.target.value)}
                className="w-full p-2.5 rounded-xl border border-slate-200 text-xs font-medium focus:outline-none focus:ring-2 focus:ring-[#ACD638]"
              />
            </div>

            <button
              type="submit"
              className="w-full py-3 rounded-xl bg-[#ACD638] hover:bg-[#9ec82f] text-[#16223B] font-extrabold text-xs cursor-pointer shadow-sm flex items-center justify-center gap-1.5"
            >
              <Send className="w-4 h-4" />
              <span>Enviar Comunicado a Toda la Red</span>
            </button>
          </form>
        </div>
      )}

      {/* TAB 5: GENERAL */}
      {activeTab === 'general' && (
        <div className="bg-white rounded-2xl p-6 border border-slate-200/80 shadow-xs max-w-xl space-y-6">
          <div>
            <h2 className="text-base font-extrabold text-[#1E2B45]">
              Parámetros Generales de Tenis Club Manager
            </h2>
            <p className="text-xs text-slate-500 mt-0.5">
              Dominio de producción: <strong>manager.tenisclub.net</strong>
            </p>
          </div>

          <div className="space-y-3 text-xs">
            <div className="flex items-center justify-between p-3 bg-slate-50 rounded-xl">
              <div>
                <span className="font-bold text-[#1E2B45] block">Nombre de Plataforma</span>
                <span className="text-slate-400 text-[11px]">Tenis Club Manager Panamá</span>
              </div>
              <span className="px-2 py-0.5 rounded bg-slate-200 text-[10px] font-extrabold">v3.5 PRO</span>
            </div>

            <div className="flex items-center justify-between p-3 bg-slate-50 rounded-xl">
              <div>
                <span className="font-bold text-[#1E2B45] block">Moneda de Facturación</span>
                <span className="text-slate-400 text-[11px]">Balboas (B/.) a la par con USD ($)</span>
              </div>
              <span className="px-2 py-0.5 rounded bg-slate-200 text-[10px] font-extrabold">PAB / USD</span>
            </div>

            <div className="flex items-center justify-between p-3 bg-slate-50 rounded-xl">
              <div>
                <span className="font-bold text-[#1E2B45] block">Regla de Tarifas</span>
                <span className="text-slate-400 text-[11px]">Todas las canchas &gt; B/. 0.00 obligatorio</span>
              </div>
              <span className="px-2 py-0.5 rounded bg-emerald-100 text-emerald-800 text-[10px] font-extrabold">
                Activa
              </span>
            </div>
          </div>

          <div className="pt-4 border-t border-slate-100 space-y-2">
            <span className="text-xs font-bold text-slate-700 block">Restaurar Demostración</span>
            <p className="text-xs text-slate-400">
              Restablece los datos de reservas, canchas, jugadores e incidencias al estado inicial demo sin alterar el código fuente.
            </p>
            <button
              type="button"
              onClick={resetDemoData}
              className="py-2.5 px-4 rounded-xl bg-slate-100 hover:bg-rose-50 text-rose-700 text-xs font-bold transition flex items-center gap-2 cursor-pointer"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>Reiniciar Datos de Demostración</span>
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
