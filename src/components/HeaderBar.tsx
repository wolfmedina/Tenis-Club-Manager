import React, { useState, useRef, useEffect } from 'react';
import {
  Bell,
  CheckCircle2,
  ChevronDown,
  LogOut,
  MapPin,
  Menu,
  RotateCcw,
  Search,
  Shield,
  User,
  X,
} from 'lucide-react';
import { useApp } from '../context/AppContext';
import { BrandLogo, PlayerAvatar } from './VisualAssets';
import type { Role } from '../types/tennis';

interface HeaderBarProps {
  onToggleSidebar?: () => void;
  onNavigateModule?: (module: string) => void;
}

export const HeaderBar: React.FC<HeaderBarProps> = ({
  onToggleSidebar,
  onNavigateModule,
}) => {
  const {
    state,
    currentUser,
    activeSede,
    switchSede,
    switchRole,
    resetDemoData,
    markAllNotificationsRead,
    logout,
  } = useApp();

  const [searchQuery, setSearchQuery] = useState('');
  const [showSearchModal, setShowSearchModal] = useState(false);
  const [showSedeMenu, setShowSedeMenu] = useState(false);
  const [showNotifsMenu, setShowNotifsMenu] = useState(false);
  const [showUserMenu, setShowUserMenu] = useState(false);

  const sedeRef = useRef<HTMLDivElement>(null);
  const notifRef = useRef<HTMLDivElement>(null);
  const userRef = useRef<HTMLDivElement>(null);

  // Close menus when clicking outside
  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (sedeRef.current && !sedeRef.current.contains(e.target as Node)) {
        setShowSedeMenu(false);
      }
      if (notifRef.current && !notifRef.current.contains(e.target as Node)) {
        setShowNotifsMenu(false);
      }
      if (userRef.current && !userRef.current.contains(e.target as Node)) {
        setShowUserMenu(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const unreadCount = state.notificaciones.filter(
    (n) => !n.leida && (n.usuarioId === currentUser.id || n.usuarioId === 'ALL')
  ).length;

  const userNotifications = state.notificaciones.filter(
    (n) => n.usuarioId === currentUser.id || n.usuarioId === 'ALL'
  );

  // Search results calculation
  const searchResults = React.useMemo(() => {
    const q = searchQuery.trim().toLowerCase();
    if (!q) return null;

    const matchedUsers = state.usuarios
      .filter((u) => u.nombre.toLowerCase().includes(q) || u.email.toLowerCase().includes(q))
      .slice(0, 4);

    const matchedReservas = state.reservas
      .filter(
        (r) =>
          r.codigo.toLowerCase().includes(q) ||
          r.participantes.some((p) => p.toLowerCase().includes(q))
      )
      .slice(0, 4);

    const matchedCanchas = state.canchas
      .filter((c) => c.nombre.toLowerCase().includes(q) || c.superficie.toLowerCase().includes(q))
      .slice(0, 4);

    const matchedClases = state.clases
      .filter((cl) => cl.titulo.toLowerCase().includes(q))
      .slice(0, 4);

    return {
      users: matchedUsers,
      reservas: matchedReservas,
      canchas: matchedCanchas,
      clases: matchedClases,
    };
  }, [searchQuery, state]);

  const initials = currentUser.nombre
    .split(' ')
    .map((w) => w[0])
    .filter(Boolean)
    .slice(0, 2)
    .join('')
    .toUpperCase();

  const roleLabel =
    currentUser.rol === 'superadmin'
      ? 'Superadministrador'
      : currentUser.rol === 'admin'
        ? 'Administrador'
        : currentUser.rol === 'instructor'
          ? 'Instructor Head Coach'
          : 'Jugador Titular';

  return (
    <header className="sticky top-0 z-40 w-full bg-[#18243E] text-white border-b border-white/10 shadow-md">
      <div className="w-full px-4 sm:px-6 h-16 flex items-center justify-between gap-3">
        {/* Left: Brand Wordmark + Collapse Button */}
        <div className="flex items-center gap-3 shrink-0">
          <button
            type="button"
            onClick={onToggleSidebar}
            aria-label="Alternar menú lateral"
            className="p-2 -ml-2 rounded-xl text-slate-300 hover:text-white hover:bg-white/10 transition cursor-pointer"
          >
            <Menu className="w-5 h-5" />
          </button>

          <div className="flex items-center gap-2.5">
            <BrandLogo size="sm" className="h-9 w-auto drop-shadow-sm" />
            <div className="hidden lg:flex items-center gap-2">
              <span className="font-extrabold text-sm tracking-wider uppercase text-white whitespace-nowrap">
                TENIS CLUB PANAMÁ
              </span>
              <span className="text-slate-400 font-light text-sm">|</span>
              <span className="text-slate-300 text-xs font-medium whitespace-nowrap">
                Panel de Administración
              </span>
            </div>
          </div>
        </div>

        {/* Center: Global Search Input */}
        <div className="flex-1 max-w-xl mx-2 relative">
          <div className="relative">
            <Search className="w-4 h-4 text-slate-300 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => {
                setSearchQuery(e.target.value);
                setShowSearchModal(true);
              }}
              onFocus={() => setShowSearchModal(true)}
              placeholder="Buscar miembro, reserva, pago, clase..."
              className="w-full pl-10 pr-9 py-2 rounded-xl bg-white/10 hover:bg-white/15 focus:bg-white focus:text-[#18243E] text-white text-xs sm:text-sm placeholder:text-slate-300 border border-white/10 focus:outline-none focus:ring-2 focus:ring-[#ACD638] transition shadow-inner"
            />
            {searchQuery && (
              <button
                type="button"
                onClick={() => {
                  setSearchQuery('');
                  setShowSearchModal(false);
                }}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 p-0.5"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            )}
          </div>

          {/* Instant Search Results Flyout */}
          {showSearchModal && searchResults && (
            <div className="absolute left-0 right-0 top-full mt-2 bg-white rounded-2xl shadow-2xl border border-slate-200 text-[#1E2B45] p-3 max-h-96 overflow-y-auto z-50 animate-in fade-in slide-in-from-top-2">
              <div className="flex items-center justify-between pb-2 mb-2 border-b border-slate-100">
                <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">
                  Resultados para &quot;{searchQuery}&quot;
                </span>
                <button
                  type="button"
                  onClick={() => setShowSearchModal(false)}
                  className="text-xs text-slate-400 hover:text-slate-600"
                >
                  Cerrar
                </button>
              </div>

              {searchResults.users.length === 0 &&
              searchResults.reservas.length === 0 &&
              searchResults.canchas.length === 0 &&
              searchResults.clases.length === 0 ? (
                <p className="py-6 text-center text-xs text-slate-500">
                  No se encontraron coincidencias para &quot;{searchQuery}&quot;
                </p>
              ) : (
                <div className="space-y-3">
                  {searchResults.users.length > 0 && (
                    <div>
                      <p className="text-[11px] font-bold text-[#273758] mb-1">Miembros y Jugadores</p>
                      <div className="space-y-1">
                        {searchResults.users.map((u) => (
                          <div
                            key={u.id}
                            onClick={() => {
                              onNavigateModule?.('jugadores');
                              setShowSearchModal(false);
                            }}
                            className="flex items-center justify-between p-2 rounded-xl hover:bg-slate-50 cursor-pointer text-xs"
                          >
                            <div className="flex items-center gap-2">
                              <PlayerAvatar nombre={u.nombre} seed={u.avatarSeed} size="xs" />
                              <div>
                                <span className="font-bold text-[#1E2B45] block">{u.nombre}</span>
                                <span className="text-[10px] text-slate-400">{u.email}</span>
                              </div>
                            </div>
                            <span className="px-2 py-0.5 rounded bg-slate-100 text-[10px] font-semibold text-slate-600">
                              {u.categoria}
                            </span>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {searchResults.reservas.length > 0 && (
                    <div>
                      <p className="text-[11px] font-bold text-[#273758] mb-1">Reservas</p>
                      <div className="space-y-1">
                        {searchResults.reservas.map((r) => (
                          <div
                            key={r.id}
                            onClick={() => {
                              onNavigateModule?.('calendario');
                              setShowSearchModal(false);
                            }}
                            className="flex items-center justify-between p-2 rounded-xl hover:bg-slate-50 cursor-pointer text-xs"
                          >
                            <div>
                              <span className="font-mono font-bold text-[#273758]">{r.codigo}</span>
                              <span className="text-[11px] text-slate-500 ml-2">
                                {r.participantes[0]} · {r.fecha} {r.horaInicio}
                              </span>
                            </div>
                            <span className="px-2 py-0.5 rounded bg-[#ACD638]/20 text-[10px] font-bold text-[#4B6B10]">
                              {r.estado}
                            </span>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {searchResults.clases.length > 0 && (
                    <div>
                      <p className="text-[11px] font-bold text-[#273758] mb-1">Clases y Programas</p>
                      <div className="space-y-1">
                        {searchResults.clases.map((cl) => (
                          <div
                            key={cl.id}
                            onClick={() => {
                              onNavigateModule?.('clases');
                              setShowSearchModal(false);
                            }}
                            className="flex items-center justify-between p-2 rounded-xl hover:bg-slate-50 cursor-pointer text-xs"
                          >
                            <span className="font-semibold text-[#1E2B45]">{cl.titulo}</span>
                            <span className="text-[10px] text-slate-400">
                              {cl.fecha} {cl.horaInicio}
                            </span>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              )}
            </div>
          )}
        </div>

        {/* Right: Facility Switcher, Notifications, User Avatar */}
        <div className="flex items-center gap-2 sm:gap-3 shrink-0">
          {/* Facility Location Selector */}
          <div className="relative" ref={sedeRef}>
            <button
              type="button"
              onClick={() => setShowSedeMenu((v) => !v)}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-white/10 hover:bg-white/15 text-xs font-semibold transition cursor-pointer border border-white/5"
            >
              <MapPin className="w-3.5 h-3.5 text-[#ACD638] shrink-0" />
              <span className="hidden md:inline max-w-[140px] truncate">
                {activeSede.nombre}
              </span>
              <span className="md:hidden">Sede</span>
              <ChevronDown className="w-3 h-3 text-slate-300" />
            </button>

            {showSedeMenu && (
              <div className="absolute right-0 top-full mt-2 w-64 bg-white rounded-2xl shadow-xl border border-slate-200 text-[#1E2B45] p-2 z-50 animate-in fade-in slide-in-from-top-1">
                <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider px-2.5 py-1">
                  Seleccionar Instalación Deportiva
                </p>
                <div className="space-y-1 mt-1">
                  {state.sedes.map((s) => (
                    <button
                      key={s.id}
                      type="button"
                      onClick={() => {
                        switchSede(s.id);
                        setShowSedeMenu(false);
                      }}
                      className={`w-full text-left px-3 py-2 rounded-xl text-xs font-semibold flex items-center justify-between transition cursor-pointer ${
                        s.id === activeSede.id
                          ? 'bg-[#ACD638]/20 text-[#273758] font-bold'
                          : 'hover:bg-slate-50 text-slate-700'
                      }`}
                    >
                      <div className="truncate">
                        <span className="block truncate">{s.nombre}</span>
                        <span className="text-[10px] text-slate-400 block font-normal">
                          {s.provincia} · {s.tipo}
                        </span>
                      </div>
                      {s.id === activeSede.id && (
                        <CheckCircle2 className="w-4 h-4 text-[#4B6B10] shrink-0 ml-1" />
                      )}
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Notifications Dropdown */}
          <div className="relative" ref={notifRef}>
            <button
              type="button"
              onClick={() => {
                setShowNotifsMenu((v) => !v);
                if (!showNotifsMenu) markAllNotificationsRead();
              }}
              aria-label="Notificaciones"
              className="relative p-2 rounded-xl text-slate-200 hover:text-white hover:bg-white/10 transition cursor-pointer"
            >
              <Bell className="w-5 h-5" />
              {unreadCount > 0 && (
                <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-[#ACD638] ring-2 ring-[#18243E]" />
              )}
            </button>

            {showNotifsMenu && (
              <div className="absolute right-0 top-full mt-2 w-80 sm:w-96 bg-white rounded-2xl shadow-2xl border border-slate-200 text-[#1E2B45] p-3 z-50 animate-in fade-in slide-in-from-top-1">
                <div className="flex items-center justify-between pb-2 mb-2 border-b border-slate-100">
                  <div className="flex items-center gap-1.5">
                    <Bell className="w-4 h-4 text-[#273758]" />
                    <span className="text-xs font-bold text-[#1E2B45]">
                      Notificaciones ({userNotifications.length})
                    </span>
                  </div>
                  <button
                    type="button"
                    onClick={() => {
                      markAllNotificationsRead();
                      setShowNotifsMenu(false);
                    }}
                    className="text-[11px] font-semibold text-[#5E8210] hover:underline"
                  >
                    Marcar leídas
                  </button>
                </div>

                <div className="space-y-2 max-h-72 overflow-y-auto pr-1">
                  {userNotifications.slice(0, 6).map((n) => (
                    <div
                      key={n.id}
                      className="p-2.5 rounded-xl bg-slate-50 hover:bg-slate-100 transition text-xs space-y-0.5"
                    >
                      <div className="flex items-center justify-between">
                        <span className="font-bold text-[#1E2B45]">{n.titulo}</span>
                        <span className="text-[10px] text-slate-400">{n.fechaTexto}</span>
                      </div>
                      <p className="text-slate-600 text-[11px] leading-relaxed">{n.mensaje}</p>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* User Profile & Demo Switcher */}
          <div className="relative" ref={userRef}>
            <button
              type="button"
              onClick={() => setShowUserMenu((v) => !v)}
              className="flex items-center gap-2 pl-1 pr-2 py-1 rounded-xl hover:bg-white/10 transition cursor-pointer"
            >
              <div className="w-8 h-8 rounded-full bg-[#ACD638] text-[#16223B] font-extrabold text-xs flex items-center justify-center shadow-sm shrink-0">
                {initials}
              </div>
              <div className="hidden sm:block text-left leading-tight">
                <span className="block text-xs font-bold text-white truncate max-w-[120px]">
                  {currentUser.nombre}
                </span>
                <span className="block text-[10px] text-slate-300 font-medium">
                  {roleLabel}
                </span>
              </div>
              <ChevronDown className="w-3.5 h-3.5 text-slate-400 shrink-0" />
            </button>

            {showUserMenu && (
              <div className="absolute right-0 top-full mt-2 w-72 bg-white rounded-2xl shadow-2xl border border-slate-200 text-[#1E2B45] p-3 z-50 animate-in fade-in slide-in-from-top-1 space-y-3">
                <div className="pb-2 border-b border-slate-100 flex items-center gap-2.5">
                  <div className="w-10 h-10 rounded-full bg-[#ACD638] text-[#16223B] font-extrabold text-sm flex items-center justify-center shrink-0">
                    {initials}
                  </div>
                  <div className="truncate">
                    <p className="text-xs font-bold text-[#1E2B45] truncate">{currentUser.nombre}</p>
                    <p className="text-[11px] text-slate-400 truncate">{currentUser.email}</p>
                    <span className="inline-block mt-0.5 px-2 py-0.5 rounded-full bg-slate-100 text-[9.5px] font-extrabold text-[#273758]">
                      {roleLabel}
                    </span>
                  </div>
                </div>

                <div>
                  <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1.5">
                    Cambiar Perfil Demostración
                  </p>
                  <div className="space-y-1">
                    {(
                      [
                        { rol: 'superadmin', label: 'Superadministrador nacional' },
                        { rol: 'admin', label: 'Administrador de instalación' },
                        { rol: 'instructor', label: 'Instructor Head Coach' },
                      ] as { rol: Role; label: string }[]
                    ).map((item) => (
                      <button
                        key={item.rol}
                        type="button"
                        onClick={() => {
                          switchRole(item.rol);
                          setShowUserMenu(false);
                        }}
                        className={`w-full text-left px-2.5 py-1.5 rounded-xl text-xs font-semibold flex items-center justify-between transition cursor-pointer ${
                          currentUser.rol === item.rol
                            ? 'bg-[#ACD638] text-[#16223B] font-bold'
                            : 'hover:bg-slate-100 text-slate-700'
                        }`}
                      >
                        <span>{item.label}</span>
                        {currentUser.rol === item.rol && (
                          <CheckCircle2 className="w-3.5 h-3.5 text-[#16223B] shrink-0" />
                        )}
                      </button>
                    ))}
                  </div>
                </div>

                <div className="pt-2 border-t border-slate-100 space-y-1">
                  <button
                    type="button"
                    onClick={() => {
                      resetDemoData();
                      setShowUserMenu(false);
                    }}
                    className="w-full text-left px-2.5 py-1.5 rounded-xl text-xs font-semibold text-slate-700 hover:bg-slate-100 flex items-center gap-2 cursor-pointer"
                  >
                    <RotateCcw className="w-3.5 h-3.5 text-slate-400" />
                    <span>Reiniciar datos demo</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      logout();
                      setShowUserMenu(false);
                    }}
                    className="w-full text-left px-2.5 py-1.5 rounded-xl text-xs font-semibold text-rose-600 hover:bg-rose-50 flex items-center gap-2 cursor-pointer"
                  >
                    <LogOut className="w-3.5 h-3.5 text-rose-500" />
                    <span>Ir a pantalla de acceso</span>
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </header>
  );
};
