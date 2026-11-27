import React, { useState } from 'react';
import {
  BarChart3,
  Building2,
  Calendar,
  CheckCircle2,
  ChevronDown,
  ChevronRight,
  Clock,
  CreditCard,
  DollarSign,
  Globe,
  GraduationCap,
  LayoutDashboard,
  LogOut,
  MapPin,
  Menu,
  RotateCcw,
  Scale,
  Settings,
  Shield,
  Trophy,
  UserCheck,
  Users,
  Vote,
  Wallet,
  Wrench,
  X,
} from 'lucide-react';
import { useApp } from '../context/AppContext';
import type { AdminModule } from '../types/tennis';
import { HeaderBar } from './HeaderBar';
import { BrandLogo } from './VisualAssets';
import { AdminLoginView } from './views/AdminLoginView';
import { AdminDashboardView } from './views/admin/AdminDashboardView';
import { AdminCalendarView } from './views/admin/AdminCalendarView';
import { AdminFacilitiesView } from './views/admin/AdminFacilitiesView';
import { AdminCourtsView } from './views/admin/AdminCourtsView';
import { AdminMaintenanceView } from './views/admin/AdminMaintenanceView';
import { AdminCheckInView } from './views/admin/AdminCheckInView';
import { AdminPlayersView } from './views/admin/AdminPlayersView';
import { AdminInstructorsView } from './views/admin/AdminInstructorsView';
import { AdminClassesView } from './views/admin/AdminClassesView';
import { AdminCommunityView } from './views/admin/AdminCommunityView';
import { AdminFinanceView } from './views/admin/AdminFinanceView';
import { AdminReportsView } from './views/admin/AdminReportsView';
import { AdminSettingsView } from './views/admin/AdminSettingsView';
import { NewBookingModal } from './modals/NewBookingModal';

export const AppShell: React.FC = () => {
  const { state, currentUser, activeSede, toast, switchRole } = useApp();

  const [activeModule, setActiveModule] = useState<AdminModule>('dashboard');
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false);
  const [showNewBookingModal, setShowNewBookingModal] = useState(false);

  // Primary Navigation Structure matching 10_Administracion_Web.png exactly
  const navItems = [
    {
      id: 'dashboard' as AdminModule,
      label: 'Dashboard',
      icon: LayoutDashboard,
      isActive: activeModule === 'dashboard',
    },
    {
      id: 'calendario' as AdminModule,
      label: 'Reservas',
      icon: Calendar,
      isActive: activeModule === 'calendario',
    },
    {
      id: 'canchas' as AdminModule,
      label: 'Canchas',
      icon: Trophy,
      isActive:
        activeModule === 'canchas' ||
        activeModule === 'instalaciones' ||
        activeModule === 'mantenimiento' ||
        activeModule === 'checkin',
    },
    {
      id: 'clases' as AdminModule,
      label: 'Clases y Entrenadores',
      icon: GraduationCap,
      isActive: activeModule === 'clases' || activeModule === 'instructores',
    },
    {
      id: 'jugadores' as AdminModule,
      label: 'Miembros y Usuarios',
      icon: Users,
      isActive:
        activeModule === 'jugadores' ||
        activeModule === 'comunidad' ||
        activeModule === 'partidos' ||
        activeModule === 'planificacion' ||
        activeModule === 'resultados' ||
        activeModule === 'rankings',
    },
    {
      id: 'transacciones' as AdminModule,
      label: 'Pagos y Facturación',
      icon: CreditCard,
      isActive:
        activeModule === 'transacciones' ||
        activeModule === 'ingresos_instalaciones' ||
        activeModule === 'tarifas' ||
        activeModule === 'comisiones' ||
        activeModule === 'devoluciones' ||
        activeModule === 'conciliacion',
    },
    {
      id: 'reportes_financieros' as AdminModule,
      label: 'Reportes',
      icon: BarChart3,
      isActive: activeModule === 'reportes_financieros',
    },
    {
      id: 'config_general' as AdminModule,
      label: 'Configuración',
      icon: Settings,
      isActive:
        activeModule === 'config_general' ||
        activeModule === 'usuarios_admin' ||
        activeModule === 'roles_permisos' ||
        activeModule === 'provincias' ||
        activeModule === 'notificaciones_admin',
    },
  ];

  if (!state.isAuthenticated) {
    return <AdminLoginView />;
  }

  return (
    <div className="h-screen w-full bg-[#F4F6F9] flex flex-row antialiased text-[#1E2B45] overflow-hidden selection:bg-[#ACD638] selection:text-[#16223B]">
      {/* Toast Notification */}
      {toast && (
        <div
          role="status"
          className={`fixed bottom-6 right-6 z-50 rounded-2xl px-5 py-3 text-xs font-extrabold shadow-2xl flex items-center gap-2 pointer-events-none animate-in fade-in slide-in-from-bottom-2 ${
            toast.tone === 'error'
              ? 'bg-rose-600 text-white'
              : toast.tone === 'info'
                ? 'bg-[#273758] text-white'
                : 'bg-[#ACD638] text-[#16223B]'
          }`}
        >
          <CheckCircle2 className="w-4 h-4 shrink-0" />
          <span>{toast.text}</span>
        </div>
      )}

      {/* Sidebar Overlay on Mobile */}
      {mobileSidebarOpen && (
        <div
          className="fixed inset-0 bg-black/60 z-50 md:hidden backdrop-blur-xs"
          onClick={() => setMobileSidebarOpen(false)}
        />
      )}

      {/* Left Sidebar (Faithful to 10_Administracion_Web.png) */}
      <aside
        className={`fixed md:relative top-0 h-full z-40 md:z-30 bg-[#121C30] text-white flex flex-col justify-between shrink-0 transition-all duration-300 border-r border-white/5 ${
          sidebarCollapsed ? 'w-20' : 'w-64'
        } ${
          mobileSidebarOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0'
        }`}
      >
        <div className="flex flex-col h-full justify-between overflow-hidden">
          {/* Top Brand & Navigation */}
          <div className="flex flex-col overflow-hidden">
            {/* Sidebar Header Brand Lockup */}
            <div className="p-4 pb-3 flex items-center justify-between border-b border-white/10 shrink-0">
              <div className="flex items-center gap-2.5">
                <BrandLogo size="sm" className="h-9 w-auto drop-shadow-md" />
                {!sidebarCollapsed && (
                  <div className="leading-tight">
                    <span className="block font-extrabold text-xs uppercase tracking-wider text-white">
                      TENIS CLUB PANAMÁ
                    </span>
                    <span className="block text-[9.5px] font-bold text-[#ACD638] tracking-tight uppercase">
                      ADMINISTRACIÓN DE INSTALACIONES
                    </span>
                  </div>
                )}
              </div>

              <button
                type="button"
                onClick={() => setMobileSidebarOpen(false)}
                className="p-1 rounded-lg text-slate-400 hover:text-white md:hidden"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Navigation Items List (Clean 8-item structure matching mockup) */}
            <div className="overflow-y-auto px-3 py-4 space-y-1.5 no-scrollbar">
              {navItems.map((item) => {
                const Icon = item.icon;
                const isActive = item.isActive;

                return (
                  <button
                    key={item.id}
                    type="button"
                    onClick={() => {
                      setActiveModule(item.id);
                      setMobileSidebarOpen(false);
                    }}
                    title={item.label}
                    className={`w-full flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-xs transition cursor-pointer ${
                      isActive
                        ? 'bg-[#ACD638] text-[#121C30] shadow-sm font-extrabold'
                        : 'text-slate-300 hover:text-white hover:bg-white/10 font-bold'
                    }`}
                  >
                    <Icon
                      className={`w-4 h-4 shrink-0 ${
                        isActive ? 'text-[#121C30]' : 'text-slate-300'
                      }`}
                    />
                    {!sidebarCollapsed && (
                      <span className="truncate">{item.label}</span>
                    )}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Interactive Active Facility Card at Sidebar Bottom */}
          {!sidebarCollapsed ? (
            <div className="p-3 shrink-0 border-t border-white/10">
              <div
                onClick={() => {
                  setActiveModule('instalaciones');
                  setMobileSidebarOpen(false);
                }}
                className="group relative rounded-2xl overflow-hidden border border-white/15 bg-[#182642] shadow-lg cursor-pointer transition hover:border-[#ACD638]/60 hover:shadow-xl"
              >
                {/* Background Image: High-res illuminated court */}
                <div className="h-28 w-full relative overflow-hidden">
                  <img
                    src="/assets/photos/privadas/privada_01.webp"
                    alt="Tenis Club Panamá"
                    className="w-full h-full object-cover object-center group-hover:scale-105 transition duration-500"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-[#10192A] via-[#121C30]/75 to-transparent" />

                  {/* Live Status Pill at Top Right */}
                  <div className="absolute top-2 right-2">
                    <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-black/60 backdrop-blur-xs text-[9.5px] font-bold text-[#ACD638] border border-white/10">
                      <span className="w-1.5 h-1.5 rounded-full bg-[#ACD638] animate-pulse" />
                      Operacional
                    </span>
                  </div>

                  {/* Venue Info at Bottom */}
                  <div className="absolute bottom-2 left-2.5 right-2.5 flex items-end justify-between">
                    <div className="min-w-0 pr-1">
                      <span className="block text-[9px] font-bold text-[#ACD638] uppercase tracking-wider leading-none mb-1">
                        SEDE ACTIVA
                      </span>
                      <h4 className="text-xs font-extrabold text-white truncate leading-tight drop-shadow-xs">
                        {activeSede.nombre}
                      </h4>
                      <p className="text-[10px] text-slate-300 truncate leading-tight mt-0.5">
                        {activeSede.distrito}, {activeSede.provincia}
                      </p>
                    </div>
                    <div className="w-6 h-6 rounded-lg bg-white/10 backdrop-blur-xs border border-white/20 flex items-center justify-center text-white shrink-0 group-hover:bg-[#ACD638] group-hover:text-[#121C30] transition">
                      <ChevronRight className="w-3.5 h-3.5" />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ) : (
            <div className="p-3 shrink-0 flex justify-center border-t border-white/10">
              <button
                type="button"
                onClick={() => setActiveModule('instalaciones')}
                title={`Sede Activa: ${activeSede.nombre}`}
                className="w-9 h-9 rounded-xl bg-white/10 hover:bg-[#ACD638] hover:text-[#121C30] text-slate-300 flex items-center justify-center transition border border-white/10 relative"
              >
                <Building2 className="w-4 h-4" />
                <span className="w-2 h-2 rounded-full bg-[#ACD638] absolute -top-0.5 -right-0.5 ring-2 ring-[#121C30]" />
              </button>
            </div>
          )}
        </div>
      </aside>

      {/* Main Administrative Canvas */}
      <div className="flex-1 flex flex-col h-full min-w-0 overflow-hidden">
        {/* Top Header Bar (Pinned) */}
        <HeaderBar
          onToggleSidebar={() => {
            if (window.innerWidth < 768) {
              setMobileSidebarOpen((v) => !v);
            } else {
              setSidebarCollapsed((v) => !v);
            }
          }}
          onNavigateModule={(mod) => setActiveModule(mod as AdminModule)}
        />

        {/* Content Body Viewport (Smooth vertical mouse wheel scrolling) */}
        <main className="flex-1 overflow-y-auto overflow-x-hidden p-4 sm:p-6 lg:p-8 max-w-[1600px] w-full mx-auto focus:outline-none">
          {activeModule === 'dashboard' && (
            <AdminDashboardView
              onNavigate={(mod) => setActiveModule(mod)}
              onOpenNewBookingModal={() => setShowNewBookingModal(true)}
            />
          )}

          {activeModule === 'calendario' && (
            <AdminCalendarView onOpenNewBooking={() => setShowNewBookingModal(true)} />
          )}

          {activeModule === 'instalaciones' && <AdminFacilitiesView />}

          {activeModule === 'canchas' && (
            <AdminCourtsView onNavigate={(mod) => setActiveModule(mod)} />
          )}

          {activeModule === 'mantenimiento' && <AdminMaintenanceView />}

          {activeModule === 'checkin' && <AdminCheckInView />}

          {activeModule === 'jugadores' && <AdminPlayersView />}

          {activeModule === 'instructores' && <AdminInstructorsView />}

          {activeModule === 'clases' && <AdminClassesView />}

          {(activeModule === 'comunidad' ||
            activeModule === 'partidos' ||
            activeModule === 'planificacion' ||
            activeModule === 'resultados' ||
            activeModule === 'rankings') && (
            <AdminCommunityView
              initialSubTab={
                activeModule === 'planificacion'
                  ? 'planificacion'
                  : activeModule === 'resultados'
                    ? 'resultados'
                    : activeModule === 'rankings'
                      ? 'rankings'
                      : 'partidos'
              }
            />
          )}

          {(activeModule === 'transacciones' ||
            activeModule === 'ingresos_instalaciones') && (
            <AdminFinanceView
              initialSubTab={
                activeModule === 'ingresos_instalaciones'
                  ? 'instalaciones'
                  : 'transacciones'
              }
            />
          )}

          {activeModule === 'reportes_financieros' && <AdminReportsView />}

          {(activeModule === 'config_general' ||
            activeModule === 'usuarios_admin' ||
            activeModule === 'roles_permisos' ||
            activeModule === 'provincias' ||
            activeModule === 'notificaciones_admin') && <AdminSettingsView />}
        </main>
      </div>

      {/* New Booking Modal */}
      <NewBookingModal
        isOpen={showNewBookingModal}
        onClose={() => setShowNewBookingModal(false)}
      />
    </div>
  );
};
