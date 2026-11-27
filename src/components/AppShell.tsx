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

  // Grouped Navigation Structure matching user requirements & 10_Administracion_Web.png
  const navSections = [
    {
      group: 'Operaciones',
      items: [
        { id: 'dashboard' as AdminModule, label: 'Dashboard', icon: LayoutDashboard },
        { id: 'calendario' as AdminModule, label: 'Reservas', icon: Calendar },
        { id: 'canchas' as AdminModule, label: 'Canchas', icon: Trophy },
        { id: 'instalaciones' as AdminModule, label: 'Instalaciones', icon: Building2 },
        { id: 'mantenimiento' as AdminModule, label: 'Mantenimiento', icon: Wrench },
        { id: 'checkin' as AdminModule, label: 'Check-in', icon: UserCheck },
      ],
    },
    {
      group: 'Comunidad deportiva',
      items: [
        { id: 'clases' as AdminModule, label: 'Clases y Entrenadores', icon: GraduationCap },
        { id: 'jugadores' as AdminModule, label: 'Miembros y Usuarios', icon: Users },
        { id: 'instructores' as AdminModule, label: 'Instructores Pro', icon: Shield },
        { id: 'partidos' as AdminModule, label: 'Partidos Abiertos', icon: Users },
        { id: 'planificacion' as AdminModule, label: 'Planificación Grupal', icon: Vote },
        { id: 'resultados' as AdminModule, label: 'Resultados y Disputas', icon: Scale },
        { id: 'rankings' as AdminModule, label: 'Rankings Oficiales', icon: Trophy },
      ],
    },
    {
      group: 'Administración financiera',
      items: [
        { id: 'transacciones' as AdminModule, label: 'Pagos y Facturación', icon: CreditCard },
        { id: 'ingresos_instalaciones' as AdminModule, label: 'Ingresos por Sede', icon: DollarSign },
        { id: 'reportes_financieros' as AdminModule, label: 'Reportes', icon: BarChart3 },
      ],
    },
    {
      group: 'Configuración',
      items: [
        { id: 'config_general' as AdminModule, label: 'Configuración', icon: Settings },
      ],
    },
  ];

  if (!state.isAuthenticated) {
    return <AdminLoginView />;
  }

  return (
    <div className="min-h-screen w-full bg-[#F4F6F9] flex flex-col md:flex-row antialiased text-[#1E2B45] overflow-x-hidden selection:bg-[#ACD638] selection:text-[#16223B]">
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
        className={`fixed md:sticky top-0 h-screen z-50 md:z-30 bg-[#121C30] text-white flex flex-col justify-between shrink-0 transition-all duration-300 border-r border-white/5 ${
          sidebarCollapsed ? 'w-20' : 'w-64'
        } ${
          mobileSidebarOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0'
        }`}
      >
        <div className="flex flex-col h-full overflow-hidden">
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

          {/* Navigation Items List */}
          <div className="flex-1 overflow-y-auto px-3 py-4 space-y-5 no-scrollbar">
            {navSections.map((sec, secIdx) => (
              <div key={secIdx} className="space-y-1">
                {!sidebarCollapsed && (
                  <p className="px-3 text-[10px] font-extrabold text-slate-400 uppercase tracking-wider mb-1.5">
                    {sec.group}
                  </p>
                )}

                {sec.items.map((item) => {
                  const Icon = item.icon;
                  const isActive = activeModule === item.id;

                  return (
                    <button
                      key={item.id}
                      type="button"
                      onClick={() => {
                        setActiveModule(item.id);
                        setMobileSidebarOpen(false);
                      }}
                      title={item.label}
                      className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-xs font-bold transition cursor-pointer ${
                        isActive
                          ? 'bg-[#ACD638] text-[#121C30] shadow-sm font-extrabold'
                          : 'text-slate-300 hover:text-white hover:bg-white/10'
                      }`}
                    >
                      <Icon className={`w-4 h-4 shrink-0 ${isActive ? 'text-[#121C30]' : 'text-slate-300'}`} />
                      {!sidebarCollapsed && (
                        <span className="truncate">{item.label}</span>
                      )}
                    </button>
                  );
                })}
              </div>
            ))}
          </div>

          {/* Atmospheric Court Photography Card at Sidebar Bottom (Exact match to 10_Administracion_Web.png) */}
          {!sidebarCollapsed ? (
            <div className="p-3 shrink-0 border-t border-white/10">
              <div className="relative rounded-2xl overflow-hidden h-28 border border-white/15 shadow-inner">
                <img
                  src="/assets/photos/fondos/fondo_02.webp"
                  alt="Tenis Club Panamá"
                  className="w-full h-full object-cover object-center"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[#121C30] via-black/35 to-transparent" />
                <div className="absolute bottom-2 left-2 right-2 text-center">
                  <span className="px-2 py-0.5 rounded bg-[#182642]/80 backdrop-blur-xs text-[10px] font-extrabold tracking-wider text-white uppercase border border-white/20 inline-block shadow-xs">
                    TENIS CLUB PANAMÁ
                  </span>
                </div>
              </div>
            </div>
          ) : (
            <div className="p-3 shrink-0 flex justify-center border-t border-white/10">
              <span className="w-2.5 h-2.5 rounded-full bg-[#ACD638]" />
            </div>
          )}
        </div>
      </aside>

      {/* Main Administrative Canvas */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Top Header Bar */}
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

        {/* Content Body Viewport (Zero 480px width limits, full enterprise wide presence) */}
        <main className="flex-1 p-4 sm:p-6 lg:p-8 max-w-[1600px] w-full mx-auto">
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

          {activeModule === 'canchas' && <AdminCourtsView />}

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
