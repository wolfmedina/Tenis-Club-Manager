import React, { useState } from 'react';
import {
  ArrowRight,
  CheckCircle2,
  ChevronRight,
  Eye,
  EyeOff,
  Globe,
  GraduationCap,
  Lock,
  Mail,
  Shield,
  Sparkles,
  Trophy,
  Users,
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { BrandLogo } from '../VisualAssets';
import type { Role } from '../../types/tennis';

export const AdminLoginView: React.FC = () => {
  const { loginDemo } = useApp();

  const [email, setEmail] = useState('admin@tenisclub.pa');
  const [password, setPassword] = useState('TenisManager2026');
  const [showPass, setShowPass] = useState(false);
  const [remember, setRemember] = useState(true);
  const [selectedRole, setSelectedRole] = useState<Role>('admin');
  const [error, setError] = useState('');

  const handleLoginSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    if (!email.trim() || !email.includes('@')) {
      setError('Ingresa un correo corporativo válido.');
      return;
    }
    loginDemo(selectedRole);
  };

  const handleQuickAccess = (rol: Role) => {
    setSelectedRole(rol);
    loginDemo(rol);
  };

  return (
    <div className="min-h-screen w-full flex flex-col lg:flex-row bg-[#121C30] text-white">
      {/* Left Column: High-Impact Visual Hero */}
      <div className="lg:w-7/12 relative flex flex-col justify-between p-8 sm:p-12 overflow-hidden bg-gradient-to-br from-[#121C30] via-[#182642] to-[#121B2F]">
        {/* Background Tennis Photography */}
        <div
          aria-hidden="true"
          className="pointer-events-none select-none absolute inset-0 overflow-hidden"
        >
          <img
            src="/assets/photos/fondos/bienvenida.webp"
            alt=""
            aria-hidden="true"
            className="w-full h-full object-cover object-center opacity-30 scale-105"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-[#121C30]/90 via-[#16233B]/70 to-[#121C30]/90" />
          <div className="absolute inset-0 bg-radial from-transparent via-[#121C30]/30 to-[#121C30]/90" />
        </div>

        {/* Corporate Diagonal Lime Accent */}
        <div
          aria-hidden="true"
          className="pointer-events-none select-none absolute -top-16 -right-16 w-32 h-96 bg-gradient-to-b from-[#ACD638]/40 via-[#ACD638]/10 to-transparent rotate-45 blur-2xl"
        />

        {/* Top Brand Wordmark */}
        <div className="relative z-10 flex items-center gap-3">
          <BrandLogo size="md" className="h-12 w-auto drop-shadow-md" />
          <div>
            <span className="font-extrabold text-base tracking-wider uppercase text-white block">
              TENIS CLUB MANAGER
            </span>
            <span className="text-xs text-[#ACD638] font-bold block tracking-wide">
              PANAMÁ · PLATAFORMA SAAS PROFESIONAL
            </span>
          </div>
        </div>

        {/* Center Presentation */}
        <div className="relative z-10 my-auto py-12 max-w-xl space-y-6">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white/10 backdrop-blur-md border border-white/15 text-xs font-semibold text-[#ACD638]">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Sistema Centralizado de Gestión Deportiva</span>
          </div>

          <h1 className="text-3xl sm:text-5xl font-extrabold text-white tracking-tight leading-tight">
            Control operativo y financiero total de tus clubes de tenis.
          </h1>

          <p className="text-sm sm:text-base text-slate-300 leading-relaxed">
            Plataforma SaaS integral para administración de instalaciones públicas y privadas en todo Panamá. Agenda en tiempo real, control de acceso, clases, rankings y conciliación de pasarelas.
          </p>

          {/* Highlights 3-Pillars */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-4">
            <div className="p-3.5 rounded-2xl bg-white/5 backdrop-blur-sm border border-white/10">
              <span className="text-xs font-bold text-white block">Operaciones</span>
              <span className="text-[11px] text-slate-400 mt-0.5 block">
                Canchas, tarifas &gt; B/. 0.00, mantenimiento y check-in
              </span>
            </div>
            <div className="p-3.5 rounded-2xl bg-white/5 backdrop-blur-sm border border-white/10">
              <span className="text-xs font-bold text-white block">Comunidad</span>
              <span className="text-[11px] text-slate-400 mt-0.5 block">
                Ranking Elo Junior/Amateur/Pro, partidos y entrenadores
              </span>
            </div>
            <div className="p-3.5 rounded-2xl bg-white/5 backdrop-blur-sm border border-white/10">
              <span className="text-xs font-bold text-white block">Finanzas</span>
              <span className="text-[11px] text-slate-400 mt-0.5 block">
                Yappy, Tarjetas, comisiones y conciliación bancaria
              </span>
            </div>
          </div>
        </div>

        {/* Footer info */}
        <div className="relative z-10 flex items-center justify-between text-xs text-slate-400 border-t border-white/10 pt-4">
          <span>manager.tenisclub.net</span>
          <span>Panamá · Versión Empresarial</span>
        </div>
      </div>

      {/* Right Column: High-Impact Access & Profile Selector */}
      <div className="lg:w-5/12 bg-[#F4F6F9] text-[#1E2B45] p-6 sm:p-12 flex flex-col justify-center">
        <div className="max-w-md w-full mx-auto space-y-6">
          <div>
            <h2 className="text-2xl font-extrabold text-[#1E2B45] tracking-tight">
              Acceso Administrativo
            </h2>
            <p className="text-xs sm:text-sm text-slate-500 mt-1">
              Selecciona un perfil de demostración o ingresa con tus credenciales
            </p>
          </div>

          {/* Quick Demo Access Cards (Explicit user prompt requirement) */}
          <div className="space-y-2.5">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">
                EXPLORAR DEMO (Acceso Directo)
              </span>
              <span className="text-[10px] font-bold text-[#5E8210] bg-[#ACD638]/20 px-2 py-0.5 rounded-full">
                Sin contraseña requerida
              </span>
            </div>

            {/* Profile 1: Superadministrador */}
            <button
              type="button"
              onClick={() => handleQuickAccess('superadmin')}
              className="w-full text-left p-3.5 rounded-2xl bg-white border border-slate-200/80 hover:border-[#ACD638] hover:shadow-md transition cursor-pointer flex items-center justify-between group"
            >
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-[#273758] text-[#ACD638] flex items-center justify-center shrink-0">
                  <Globe className="w-5 h-5" />
                </div>
                <div>
                  <span className="text-xs font-extrabold text-[#1E2B45] block group-hover:text-[#273758]">
                    Superadministrador Nacional
                  </span>
                  <span className="text-[11px] text-slate-500 block">
                    Operador Nacional · Toda la red de Panamá y finanzas globales
                  </span>
                </div>
              </div>
              <ChevronRight className="w-4 h-4 text-slate-400 group-hover:text-[#ACD638] transition" />
            </button>

            {/* Profile 2: Administrador de Instalación */}
            <button
              type="button"
              onClick={() => handleQuickAccess('admin')}
              className="w-full text-left p-3.5 rounded-2xl bg-white border border-slate-200/80 hover:border-[#ACD638] hover:shadow-md transition cursor-pointer flex items-center justify-between group"
            >
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-[#ACD638] text-[#16223B] flex items-center justify-center shrink-0 font-extrabold">
                  <Shield className="w-5 h-5" />
                </div>
                <div>
                  <span className="text-xs font-extrabold text-[#1E2B45] block group-hover:text-[#273758]">
                    Administrador de Instalación
                  </span>
                  <span className="text-[11px] text-slate-500 block">
                    Carlos Administrador · Tenis Club Panamá (canchas, reservas y check-in)
                  </span>
                </div>
              </div>
              <ChevronRight className="w-4 h-4 text-slate-400 group-hover:text-[#ACD638] transition" />
            </button>

            {/* Profile 3: Instructor Coach */}
            <button
              type="button"
              onClick={() => handleQuickAccess('instructor')}
              className="w-full text-left p-3.5 rounded-2xl bg-white border border-slate-200/80 hover:border-[#ACD638] hover:shadow-md transition cursor-pointer flex items-center justify-between group"
            >
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-slate-100 text-[#273758] flex items-center justify-center shrink-0">
                  <GraduationCap className="w-5 h-5" />
                </div>
                <div>
                  <span className="text-xs font-extrabold text-[#1E2B45] block group-hover:text-[#273758]">
                    Instructor Head Coach
                  </span>
                  <span className="text-[11px] text-slate-500 block">
                    Carlos Méndez (Coach) · Clases, alumnos y disponibilidad
                  </span>
                </div>
              </div>
              <ChevronRight className="w-4 h-4 text-slate-400 group-hover:text-[#ACD638] transition" />
            </button>
          </div>

          <div className="relative flex items-center gap-3 text-xs text-slate-400">
            <span className="flex-1 h-px bg-slate-200" />
            <span className="uppercase text-[10.5px] font-bold tracking-wider">O inicia con credenciales</span>
            <span className="flex-1 h-px bg-slate-200" />
          </div>

          {/* Form */}
          <form onSubmit={handleLoginSubmit} className="space-y-3.5 text-xs">
            {error && (
              <div className="p-3 bg-rose-50 border border-rose-200 text-rose-700 rounded-xl text-xs font-bold">
                {error}
              </div>
            )}

            <div>
              <label className="font-bold text-slate-700 block mb-1">Correo corporativo</label>
              <div className="flex items-center bg-white rounded-xl border border-slate-200 px-3 py-2.5 focus-within:ring-2 focus-within:ring-[#ACD638]">
                <Mail className="w-4 h-4 text-slate-400 mr-2.5 shrink-0" />
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="admin@tenisclub.pa"
                  className="w-full bg-transparent text-xs font-semibold text-[#1E2B45] focus:outline-none"
                />
              </div>
            </div>

            <div>
              <label className="font-bold text-slate-700 block mb-1">Contraseña</label>
              <div className="flex items-center bg-white rounded-xl border border-slate-200 px-3 py-2.5 focus-within:ring-2 focus-within:ring-[#ACD638]">
                <Lock className="w-4 h-4 text-slate-400 mr-2.5 shrink-0" />
                <input
                  type={showPass ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full bg-transparent text-xs font-semibold text-[#1E2B45] focus:outline-none"
                />
                <button
                  type="button"
                  onClick={() => setShowPass((v) => !v)}
                  className="p-1 text-slate-400 hover:text-slate-600"
                >
                  {showPass ? <Eye className="w-3.5 h-3.5" /> : <EyeOff className="w-3.5 h-3.5" />}
                </button>
              </div>
            </div>

            <div className="flex items-center justify-between text-xs">
              <label className="flex items-center gap-2 cursor-pointer font-medium text-slate-600">
                <input
                  type="checkbox"
                  checked={remember}
                  onChange={(e) => setRemember(e.target.checked)}
                  className="accent-[#ACD638]"
                />
                <span>Recordarme en este equipo</span>
              </label>

              <span className="text-[#5E8210] font-bold cursor-pointer hover:underline">
                ¿Ayuda de acceso?
              </span>
            </div>

            <button
              type="submit"
              className="w-full py-3.5 rounded-xl bg-[#273758] hover:bg-[#1f2d47] text-white font-extrabold text-xs sm:text-sm shadow-md transition cursor-pointer flex items-center justify-center gap-2"
            >
              <span>Ingresar al Panel de Gestión</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};
