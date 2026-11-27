import React, { useState } from 'react';
import {
  ArrowDownRight,
  ArrowUpRight,
  CheckCircle2,
  CreditCard,
  DollarSign,
  Download,
  Filter,
  PieChart,
  RefreshCw,
  Search,
  TrendingUp,
  Wallet,
  XCircle,
} from 'lucide-react';
import { useApp } from '../../../context/AppContext';
import type { PaymentMethod } from '../../../types/tennis';

interface AdminFinanceViewProps {
  initialSubTab?: 'transacciones' | 'instalaciones' | 'tarifas' | 'comisiones' | 'devoluciones' | 'conciliacion';
}

export const AdminFinanceView: React.FC<AdminFinanceViewProps> = ({
  initialSubTab = 'transacciones',
}) => {
  const { state, activeSede, updateServiceFee, showToast } = useApp();

  const [activeTab, setActiveTab] = useState(initialSubTab);
  const [search, setSearch] = useState('');
  const [filterMethod, setFilterMethod] = useState<string>('ALL');
  const [filterStatus, setFilterStatus] = useState<string>('ALL');

  // Transactions list
  const transactions = state.reservas.filter((r) => {
    if (filterMethod !== 'ALL' && r.metodoPago !== filterMethod) return false;
    if (filterStatus !== 'ALL' && r.pagoEstado !== filterStatus) return false;
    if (
      search &&
      !r.codigo.toLowerCase().includes(search.toLowerCase()) &&
      !r.participantes.some((p) => p.toLowerCase().includes(search.toLowerCase()))
    )
      return false;
    return true;
  });

  // Calculate financials
  const totalApproved = state.reservas
    .filter((r) => r.pagoEstado === 'Aprobado')
    .reduce((sum, r) => sum + r.totalPagado, 0) + 12480;

  const totalCommissions = totalApproved * (state.serviceFeePct / 100);
  const totalRefunded = state.reservas
    .filter((r) => r.pagoEstado === 'Devuelto')
    .reduce((sum, r) => sum + r.totalPagado, 0) + 145;

  // Export CSV
  const handleExportCSV = () => {
    const headers = ['Codigo', 'Fecha', 'Hora', 'Cliente', 'Cancha', 'MetodoPago', 'TotalPagado', 'Estado'];
    const rows = state.reservas.map((r) => [
      r.codigo,
      r.fecha,
      r.horaInicio,
      r.participantes[0] || 'Jugador',
      r.canchaId,
      r.metodoPago,
      r.totalPagado.toFixed(2),
      r.pagoEstado,
    ]);

    const csvContent =
      'data:text/csv;charset=utf-8,' +
      [headers.join(','), ...rows.map((e) => e.join(','))].join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `transacciones_tenis_club_${new Date().toISOString().slice(0, 10)}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    showToast('Archivo CSV generado y descargado con éxito');
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-[#1E2B45] tracking-tight">
            Administración Financiera
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 mt-0.5">
            Recaudación, comisiones de plataforma, transacciones Yappy/Tarjetas y conciliación
          </p>
        </div>

        <button
          type="button"
          onClick={handleExportCSV}
          className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-white hover:bg-slate-50 border border-slate-200 text-[#273758] text-xs font-extrabold shadow-xs transition cursor-pointer self-start sm:self-auto"
        >
          <Download className="w-4 h-4 text-[#5E8210]" />
          <span>Exportar a CSV</span>
        </button>
      </div>

      {/* KPI Financial Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="bg-white rounded-2xl p-5 border border-slate-200/80 shadow-xs">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-400">Total Recaudado (Mes)</span>
            <div className="w-8 h-8 rounded-xl bg-slate-100 flex items-center justify-center text-[#273758]">
              <DollarSign className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-2 text-2xl font-extrabold text-[#1E2B45] tabular-nums">
            B/. {totalApproved.toLocaleString('es-PA', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
          </div>
          <span className="text-[11px] text-emerald-600 font-bold mt-1 inline-block">
            +18.6% vs. mes anterior
          </span>
        </div>

        <div className="bg-white rounded-2xl p-5 border border-slate-200/80 shadow-xs">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-400">Comisiones de Plataforma ({state.serviceFeePct}%)</span>
            <div className="w-8 h-8 rounded-xl bg-slate-100 flex items-center justify-center text-[#5E8210]">
              <TrendingUp className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-2 text-2xl font-extrabold text-[#5E8210] tabular-nums">
            B/. {totalCommissions.toLocaleString('es-PA', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
          </div>
          <span className="text-[11px] text-slate-400 mt-1 inline-block">
            Retención automática por reserva
          </span>
        </div>

        <div className="bg-white rounded-2xl p-5 border border-slate-200/80 shadow-xs">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-400">Reembolsos Procesados</span>
            <div className="w-8 h-8 rounded-xl bg-slate-100 flex items-center justify-center text-rose-600">
              <RefreshCw className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-2 text-2xl font-extrabold text-[#1E2B45] tabular-nums">
            B/. {totalRefunded.toFixed(2)}
          </div>
          <span className="text-[11px] text-slate-400 mt-1 inline-block">
            Por cancelaciones y clima
          </span>
        </div>
      </div>

      {/* Financial Sub-tabs */}
      <div className="bg-white rounded-2xl p-2 border border-slate-200/80 shadow-xs flex flex-wrap gap-1">
        {[
          { id: 'transacciones', label: 'Transacciones' },
          { id: 'instalaciones', label: 'Ingresos por Sede' },
          { id: 'comisiones', label: 'Comisiones y Modelo' },
          { id: 'devoluciones', label: 'Cancelaciones y Devoluciones' },
          { id: 'conciliacion', label: 'Conciliación de Pasarelas' },
        ].map((tab) => (
          <button
            key={tab.id}
            type="button"
            onClick={() => setActiveTab(tab.id as any)}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition cursor-pointer ${
              activeTab === tab.id
                ? 'bg-[#ACD638] text-[#16223B] shadow-xs'
                : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* SUBTAB 1: TRANSACCIONES */}
      {activeTab === 'transacciones' && (
        <div className="space-y-4">
          <div className="bg-white rounded-2xl p-4 border border-slate-200/80 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div className="relative flex-1 max-w-sm">
              <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Buscar por código de reserva o cliente..."
                className="w-full pl-9 pr-3 py-1.5 rounded-xl border border-slate-200 text-xs font-semibold focus:outline-none focus:ring-2 focus:ring-[#ACD638]"
              />
            </div>

            <div className="flex items-center gap-2">
              <select
                value={filterMethod}
                onChange={(e) => setFilterMethod(e.target.value)}
                className="text-xs font-semibold bg-slate-50 border border-slate-200 rounded-xl px-2.5 py-1.5 text-slate-700"
              >
                <option value="ALL">Todos los Métodos</option>
                <option value="Yappy">Yappy (Panamá)</option>
                <option value="Tarjeta">Tarjeta de Crédito</option>
                <option value="Apple Pay">Apple Pay</option>
                <option value="PayPal">PayPal</option>
              </select>

              <select
                value={filterStatus}
                onChange={(e) => setFilterStatus(e.target.value)}
                className="text-xs font-semibold bg-slate-50 border border-slate-200 rounded-xl px-2.5 py-1.5 text-slate-700"
              >
                <option value="ALL">Todos los Estados</option>
                <option value="Aprobado">Aprobado</option>
                <option value="Rechazado">Rechazado</option>
                <option value="Devuelto">Devuelto</option>
              </select>
            </div>
          </div>

          <div className="bg-white rounded-2xl border border-slate-200/80 shadow-xs overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead>
                  <tr className="bg-slate-50 border-b border-slate-200 text-[11px] font-extrabold text-[#273758] uppercase">
                    <th className="py-3 px-4">Código / Fecha</th>
                    <th className="py-3 px-3">Cliente / Titular</th>
                    <th className="py-3 px-3">Concepto</th>
                    <th className="py-3 px-3">Pasarela de Pago</th>
                    <th className="py-3 px-3 text-right">Tarifa Cancha</th>
                    <th className="py-3 px-3 text-right">Cargo Servicio</th>
                    <th className="py-3 px-3 text-right">Total Pagado</th>
                    <th className="py-3 px-4 text-center">Estado</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 font-medium">
                  {transactions.map((r) => (
                    <tr key={r.id} className="hover:bg-slate-50/70">
                      <td className="py-3 px-4">
                        <span className="font-mono font-bold text-[#273758] block">{r.codigo}</span>
                        <span className="text-[10px] text-slate-400">{r.fecha}</span>
                      </td>

                      <td className="py-3 px-3 font-bold text-[#1E2B45]">
                        {r.participantes[0] || 'Jugador'}
                      </td>

                      <td className="py-3 px-3 text-slate-600">
                        Reserva {r.duracionMin} min ({r.modalidad})
                      </td>

                      <td className="py-3 px-3">
                        <span className="px-2 py-0.5 rounded-full bg-slate-100 text-slate-700 text-[10.5px] font-bold">
                          {r.metodoPago}
                        </span>
                      </td>

                      <td className="py-3 px-3 text-right font-mono tabular-nums text-slate-600">
                        B/. {r.precioCancha.toFixed(2)}
                      </td>

                      <td className="py-3 px-3 text-right font-mono tabular-nums text-[#5E8210]">
                        B/. {r.cargoServicio.toFixed(2)}
                      </td>

                      <td className="py-3 px-3 text-right font-mono font-extrabold text-[#1E2B45] tabular-nums text-sm">
                        B/. {r.totalPagado.toFixed(2)}
                      </td>

                      <td className="py-3 px-4 text-center">
                        <span
                          className={`px-2 py-0.5 rounded-full text-[10px] font-extrabold uppercase ${
                            r.pagoEstado === 'Aprobado'
                              ? 'bg-[#ACD638] text-[#16223B]'
                              : r.pagoEstado === 'Devuelto'
                                ? 'bg-sky-100 text-sky-800'
                                : 'bg-rose-100 text-rose-800'
                          }`}
                        >
                          {r.pagoEstado}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* SUBTAB 2: INGRESOS POR SEDE */}
      {activeTab === 'instalaciones' && (
        <div className="bg-white rounded-2xl p-5 border border-slate-200/80 shadow-xs space-y-4">
          <h2 className="text-base font-extrabold text-[#1E2B45]">
            Rendimiento Económico por Instalación Deportiva
          </h2>
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead>
                <tr className="border-b border-slate-200 text-[11px] font-extrabold text-slate-400 uppercase">
                  <th className="pb-2">Instalación</th>
                  <th className="pb-2">Tipo</th>
                  <th className="pb-2">Canchas</th>
                  <th className="pb-2 text-right">Ingresos Brutos</th>
                  <th className="pb-2 text-right">Comisión Plataforma</th>
                  <th className="pb-2 text-right">Liquidación Neta</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 font-medium">
                {state.sedes.map((s, idx) => {
                  const gross = idx === 0 ? 6420 : idx === 1 ? 3210 : idx === 3 ? 1480 : 850;
                  const fee = gross * (state.serviceFeePct / 100);
                  const net = gross - fee;

                  return (
                    <tr key={s.id} className="hover:bg-slate-50">
                      <td className="py-3 font-bold text-[#1E2B45]">
                        {s.nombre}
                        <span className="block text-[10px] text-slate-400 font-normal">{s.provincia}</span>
                      </td>
                      <td className="py-3">
                        <span className="px-2 py-0.5 rounded bg-slate-100 text-[10px] font-bold text-slate-700">
                          {s.tipo}
                        </span>
                      </td>
                      <td className="py-3 font-semibold text-slate-600">
                        {state.canchas.filter((c) => c.sedeId === s.id).length} canchas
                      </td>
                      <td className="py-3 text-right font-mono font-bold text-[#1E2B45] tabular-nums">
                        B/. {gross.toFixed(2)}
                      </td>
                      <td className="py-3 text-right font-mono font-bold text-[#5E8210] tabular-nums">
                        B/. {fee.toFixed(2)}
                      </td>
                      <td className="py-3 text-right font-mono font-extrabold text-emerald-800 tabular-nums">
                        B/. {net.toFixed(2)}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* SUBTAB 3: COMISIONES */}
      {activeTab === 'comisiones' && (
        <div className="bg-white rounded-2xl p-6 border border-slate-200/80 shadow-xs max-w-xl space-y-4">
          <h2 className="text-base font-extrabold text-[#1E2B45]">
            Comisión de Servicio de Plataforma
          </h2>
          <p className="text-xs text-slate-500">
            Porcentaje aplicado automáticamente sobre cada reserva completada para mantenimiento tecnológico y pasarela bancaria.
          </p>

          <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200 space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-[#1E2B45]">Tasa actual configurada:</span>
              <span className="text-xl font-extrabold text-[#5E8210] tabular-nums">
                {state.serviceFeePct}%
              </span>
            </div>
            <div className="flex gap-2 pt-2">
              {[3, 5, 6, 8].map((pct) => (
                <button
                  key={pct}
                  type="button"
                  onClick={() => updateServiceFee(pct)}
                  className={`flex-1 py-1.5 rounded-xl text-xs font-bold transition cursor-pointer ${
                    state.serviceFeePct === pct
                      ? 'bg-[#273758] text-white shadow-xs'
                      : 'bg-white border border-slate-200 text-slate-700 hover:bg-slate-100'
                  }`}
                >
                  {pct}%
                </button>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* SUBTAB 4: DEVOLUCIONES */}
      {activeTab === 'devoluciones' && (
        <div className="bg-white rounded-2xl p-5 border border-slate-200/80 shadow-xs space-y-3">
          <h2 className="text-base font-extrabold text-[#1E2B45]">
            Gestión de Cancelaciones y Devoluciones
          </h2>
          <p className="text-xs text-slate-500">
            Reembolsos emitidos según política de cancelación o liberaciones por contingencia de lluvia.
          </p>
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead>
                <tr className="border-b border-slate-200 text-[11px] font-bold text-slate-400 uppercase">
                  <th className="pb-2">Código</th>
                  <th className="pb-2">Cliente</th>
                  <th className="pb-2">Motivo</th>
                  <th className="pb-2 text-right">Monto Devuelto</th>
                  <th className="pb-2 text-center">Estado</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 font-medium">
                {state.reservas
                  .filter((r) => r.pagoEstado === 'Devuelto' || r.estado === 'Cancelada')
                  .map((r) => (
                    <tr key={r.id}>
                      <td className="py-2.5 font-mono font-bold text-[#273758]">{r.codigo}</td>
                      <td className="py-2.5 font-bold text-[#1E2B45]">{r.participantes[0]}</td>
                      <td className="py-2.5 text-slate-500">{r.notas || 'Cancelación según reglamento'}</td>
                      <td className="py-2.5 text-right font-mono font-extrabold text-slate-800">
                        B/. {r.totalPagado.toFixed(2)}
                      </td>
                      <td className="py-2.5 text-center">
                        <span className="px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800 text-[10px] font-extrabold">
                          Liquidado
                        </span>
                      </td>
                    </tr>
                  ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* SUBTAB 5: CONCILIACION */}
      {activeTab === 'conciliacion' && (
        <div className="bg-white rounded-2xl p-6 border border-slate-200/80 shadow-xs space-y-4">
          <h2 className="text-base font-extrabold text-[#1E2B45]">
            Conciliación de Pasarelas Bancarias en Panamá
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="p-4 bg-sky-50 rounded-2xl border border-sky-100">
              <span className="text-xs font-bold text-sky-900 block">Yappy Comercial</span>
              <span className="text-xl font-extrabold text-[#1E2B45] tabular-nums block mt-1">
                B/. 6,840.00
              </span>
              <span className="text-[10px] text-sky-700">Conciliado al día (Banco General)</span>
            </div>
            <div className="p-4 bg-purple-50 rounded-2xl border border-purple-100">
              <span className="text-xs font-bold text-purple-900 block">Tarjetas (Visa / MC)</span>
              <span className="text-xl font-extrabold text-[#1E2B45] tabular-nums block mt-1">
                B/. 4,920.00
              </span>
              <span className="text-[10px] text-purple-700">Liquidación 24h</span>
            </div>
            <div className="p-4 bg-slate-100 rounded-2xl border border-slate-200">
              <span className="text-xs font-bold text-slate-800 block">Apple Pay</span>
              <span className="text-xl font-extrabold text-[#1E2B45] tabular-nums block mt-1">
                B/. 520.00
              </span>
              <span className="text-[10px] text-slate-500">Procesado sin fricción</span>
            </div>
            <div className="p-4 bg-emerald-50 rounded-2xl border border-emerald-100">
              <span className="text-xs font-bold text-emerald-900 block">PayPal</span>
              <span className="text-xl font-extrabold text-[#1E2B45] tabular-nums block mt-1">
                B/. 200.00
              </span>
              <span className="text-[10px] text-emerald-700">Internacionales</span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
