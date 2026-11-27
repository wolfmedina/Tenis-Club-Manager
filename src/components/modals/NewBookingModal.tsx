import React, { useState } from 'react';
import {
  Calendar,
  CheckCircle2,
  Clock,
  CreditCard,
  DollarSign,
  Plus,
  Trophy,
  Users,
  X,
  AlertCircle,
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import type { Modality, PaymentMethod } from '../../types/tennis';
import { calculateBookingTotals, formatHour12, isSlotAvailable } from '../../utils/tennisLogic';

interface NewBookingModalProps {
  isOpen: boolean;
  onClose: () => void;
  defaultDate?: string;
  defaultTime?: string;
  defaultCanchaId?: string;
}

export const NewBookingModal: React.FC<NewBookingModalProps> = ({
  isOpen,
  onClose,
  defaultDate = '2026-11-27',
  defaultTime = '18:00',
  defaultCanchaId,
}) => {
  const { state, activeSede, createReservation, showToast } = useApp();

  const courts = state.canchas.filter((c) => c.sedeId === activeSede.id);
  const [canchaId, setCanchaId] = useState<string>(
    defaultCanchaId || courts[0]?.id || state.canchas[0]?.id || ''
  );
  const [fecha, setFecha] = useState(defaultDate);
  const [horaInicio, setHoraInicio] = useState(defaultTime);
  const [duracionMin, setDuracionMin] = useState<60 | 90 | 120>(60);
  const [modalidad, setModalidad] = useState<Modality>('Individual');
  const [clienteNombre, setClienteNombre] = useState('Julio Solórzano');
  const [metodoPago, setMetodoPago] = useState<PaymentMethod>('Tarjeta');
  const [errorMessage, setErrorMessage] = useState('');

  if (!isOpen) return null;

  const selectedCancha = state.canchas.find((c) => c.id === canchaId) || courts[0];

  const totals = selectedCancha
    ? calculateBookingTotals(
        selectedCancha,
        horaInicio,
        duracionMin,
        state.serviceFeePct,
        false,
        fecha
      )
    : { precioCancha: 0, cargoServicio: 0, totalPagado: 0, tarifaValida: false };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage('');

    if (!selectedCancha) {
      setErrorMessage('Selecciona una cancha válida.');
      return;
    }

    if (!clienteNombre.trim()) {
      setErrorMessage('Ingresa el nombre del jugador o cliente titular.');
      return;
    }

    const res = createReservation({
      sedeId: activeSede.id,
      canchaId: selectedCancha.id,
      fecha,
      horaInicio,
      duracionMin,
      modalidad,
      participantes: [clienteNombre.trim()],
      metodoPago,
      tipoOrigen: 'Manual Admin',
    });

    if (res.ok) {
      showToast(`Reserva ${res.reserva?.codigo} confirmada exitosamente`);
      onClose();
    } else {
      setErrorMessage(res.error || 'No fue posible registrar la reserva.');
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/55 p-4 animate-in fade-in">
      <div className="bg-white rounded-3xl p-6 max-w-lg w-full shadow-2xl border border-slate-200 space-y-4 max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between pb-3 border-b border-slate-100">
          <div className="flex items-center gap-2">
            <Calendar className="w-5 h-5 text-[#273758]" />
            <h2 className="text-base font-extrabold text-[#1E2B45]">
              Nueva Reserva en {activeSede.nombre}
            </h2>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="p-1 text-slate-400 hover:text-slate-600 rounded-lg cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {errorMessage && (
          <div className="p-3 bg-rose-50 border border-rose-200 text-rose-800 text-xs font-bold rounded-xl flex items-center gap-2">
            <AlertCircle className="w-4 h-4 text-rose-600 shrink-0" />
            <span>{errorMessage}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-3.5 text-xs">
          <div>
            <label className="font-bold text-slate-700 block mb-1">Cancha deportiva</label>
            <select
              value={canchaId}
              onChange={(e) => setCanchaId(e.target.value)}
              className="w-full p-2.5 rounded-xl border border-slate-200 text-xs font-semibold focus:outline-none focus:ring-2 focus:ring-[#ACD638]"
            >
              {courts.map((c) => (
                <option key={c.id} value={c.id}>
                  {c.nombre} ({c.superficie}) · B/. {c.precioHora}/h
                </option>
              ))}
            </select>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="font-bold text-slate-700 block mb-1">Fecha</label>
              <input
                type="date"
                value={fecha}
                onChange={(e) => setFecha(e.target.value)}
                className="w-full p-2.5 rounded-xl border border-slate-200 text-xs font-semibold"
              />
            </div>
            <div>
              <label className="font-bold text-slate-700 block mb-1">Hora Inicio</label>
              <select
                value={horaInicio}
                onChange={(e) => setHoraInicio(e.target.value)}
                className="w-full p-2.5 rounded-xl border border-slate-200 text-xs font-semibold"
              >
                {[
                  '06:00',
                  '07:30',
                  '09:00',
                  '10:30',
                  '12:00',
                  '13:30',
                  '15:00',
                  '16:30',
                  '18:00',
                  '19:30',
                  '21:00',
                ].map((t) => (
                  <option key={t} value={t}>
                    {formatHour12(t)}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="font-bold text-slate-700 block mb-1">Duración del turno</label>
              <select
                value={duracionMin}
                onChange={(e) => setDuracionMin(Number(e.target.value) as any)}
                className="w-full p-2.5 rounded-xl border border-slate-200 text-xs font-semibold"
              >
                <option value={60}>60 minutos (1 hora)</option>
                <option value={90}>90 minutos (1.5 horas)</option>
                <option value={120}>120 minutos (2 horas)</option>
              </select>
            </div>
            <div>
              <label className="font-bold text-slate-700 block mb-1">Modalidad</label>
              <select
                value={modalidad}
                onChange={(e) => setModalidad(e.target.value as Modality)}
                className="w-full p-2.5 rounded-xl border border-slate-200 text-xs font-semibold"
              >
                <option value="Individual">Individual (Singles)</option>
                <option value="Dobles">Dobles</option>
                <option value="Dobles mixto">Dobles mixto</option>
              </select>
            </div>
          </div>

          <div>
            <label className="font-bold text-slate-700 block mb-1">
              Nombre del cliente / Jugador titular
            </label>
            <input
              type="text"
              required
              value={clienteNombre}
              onChange={(e) => setClienteNombre(e.target.value)}
              placeholder="Nombre y apellido"
              className="w-full p-2.5 rounded-xl border border-slate-200 text-xs font-semibold focus:outline-none focus:ring-2 focus:ring-[#ACD638]"
            />
          </div>

          <div>
            <label className="font-bold text-slate-700 block mb-1">Método de pago</label>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
              {(['Tarjeta', 'Yappy', 'Apple Pay', 'PayPal'] as PaymentMethod[]).map((m) => (
                <button
                  key={m}
                  type="button"
                  onClick={() => setMetodoPago(m)}
                  className={`py-2 px-2 rounded-xl text-xs font-bold transition border cursor-pointer ${
                    metodoPago === m
                      ? 'bg-[#273758] text-white border-[#273758] shadow-xs'
                      : 'bg-slate-50 border-slate-200 text-slate-700 hover:bg-slate-100'
                  }`}
                >
                  {m}
                </button>
              ))}
            </div>
          </div>

          {/* Rate Summary Card */}
          <div className="p-3.5 bg-slate-50 rounded-2xl border border-slate-200 space-y-1.5 text-xs">
            <div className="flex justify-between text-slate-500">
              <span>Tarifa de Cancha ({duracionMin} min):</span>
              <span className="font-mono font-bold text-[#1E2B45]">
                B/. {totals.precioCancha.toFixed(2)}
              </span>
            </div>
            <div className="flex justify-between text-slate-500">
              <span>Cargo de Plataforma ({state.serviceFeePct}%):</span>
              <span className="font-mono font-bold text-[#5E8210]">
                B/. {totals.cargoServicio.toFixed(2)}
              </span>
            </div>
            <div className="flex justify-between text-sm font-extrabold text-[#1E2B45] pt-1 border-t border-slate-200">
              <span>Total a Liquidar:</span>
              <span className="font-mono text-[#5E8210] tabular-nums">
                B/. {totals.totalPagado.toFixed(2)}
              </span>
            </div>
          </div>

          <div className="flex gap-2 pt-2">
            <button
              type="submit"
              className="flex-1 py-3 rounded-xl bg-[#ACD638] hover:bg-[#9ec82f] text-[#16223B] font-extrabold text-xs cursor-pointer shadow-sm flex items-center justify-center gap-1.5"
            >
              <CheckCircle2 className="w-4 h-4" />
              <span>Confirmar y Bloquear Turno</span>
            </button>
            <button
              type="button"
              onClick={onClose}
              className="py-3 px-4 rounded-xl border border-slate-200 text-slate-600 font-bold text-xs cursor-pointer"
            >
              Cancelar
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
