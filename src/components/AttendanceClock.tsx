import React, { useState, useEffect } from 'react';
import { 
  Clock, 
  MapPin, 
  Camera, 
  CheckCircle2, 
  AlertTriangle, 
  User, 
  ShieldCheck, 
  Smartphone,
  Map 
} from 'lucide-react';
import { Employee, Attendance } from '../types';

interface AttendanceClockProps {
  employees: Employee[];
  attendance: Attendance[];
  onClockEvent: (employeeId: string, location: string, eventType: 'in' | 'out') => void;
}

export default function AttendanceClock({ employees, attendance, onClockEvent }: AttendanceClockProps) {
  const [activeSite, setActiveSite] = useState('Obra Residencial Alvorada');
  const [pin, setPin] = useState('');
  const [selectedEmpId, setSelectedEmpId] = useState('');
  const [currentTime, setCurrentTime] = useState(new Date());
  const [alertMsg, setAlertMsg] = useState<{ type: 'success' | 'error'; text: string } | null>(null);
  const [simulatePhoto, setSimulatePhoto] = useState(false);
  const [gpsSimulated, setGpsSimulated] = useState({ lat: -23.55052, lng: -46.633308 });

  // Update clock
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  // Update GPS simulated coordinates based on chosen site
  useEffect(() => {
    if (activeSite === 'Obra Residencial Alvorada') {
      setGpsSimulated({ lat: -23.55052, lng: -46.633308 });
    } else if (activeSite === 'Condomínio Vista Alegre') {
      setGpsSimulated({ lat: -23.55160, lng: -46.63450 });
    } else {
      setGpsSimulated({ lat: -23.56152, lng: -46.66220 });
    }
  }, [activeSite]);

  // Handle number pad click
  const handleNumClick = (num: string) => {
    if (pin.length < 4) {
      setPin(prev => prev + num);
    }
  };

  const handleClear = () => {
    setPin('');
  };

  const handleClockAction = (type: 'in' | 'out') => {
    setAlertMsg(null);
    
    if (!selectedEmpId) {
      setAlertMsg({ type: 'error', text: 'Selecione seu nome na lista.' });
      return;
    }

    const employee = employees.find(e => e.id === selectedEmpId);
    if (!employee) {
      setAlertMsg({ type: 'error', text: 'Funcionário não encontrado.' });
      return;
    }

    if (employee.status !== 'Ativo') {
      setAlertMsg({ type: 'error', text: 'Este funcionário está inativo / demitido.' });
      return;
    }

    // Verify PIN
    if (pin !== employee.pointPin) {
      setAlertMsg({ type: 'error', text: 'PIN incorreto. Tente novamente.' });
      return;
    }

    // Process event
    onClockEvent(employee.id, activeSite, type);
    
    // Trigger selfie simulator
    setSimulatePhoto(true);
    setTimeout(() => {
      setSimulatePhoto(false);
    }, 2000);

    const timeStr = currentTime.toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' });
    setAlertMsg({ 
      type: 'success', 
      text: `Ponto de ${type === 'in' ? 'ENTRADA' : 'SAÍDA'} registrado com sucesso para ${employee.name} às ${timeStr} na ${activeSite}!` 
    });

    // Reset input
    setPin('');
    setSelectedEmpId('');
  };

  const activeEmployees = employees.filter(e => e.status === 'Ativo');

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      
      {/* Header and Explanation */}
      <div className="text-center space-y-2">
        <h2 id="attendance-clock-title" className="text-2xl font-bold text-slate-800 flex items-center justify-center gap-2">
          <Smartphone className="h-6 w-6 text-amber-600 animate-pulse" />
          <span>Marcador de Ponto Digital lá na Obra</span>
        </h2>
        <p className="text-slate-500 text-xs max-w-xl mx-auto">
          Simulador do tablet físico fixado no canteiro de obras. Os operários chegam na obra, selecionam seu nome, digitam seu PIN individual e registram a entrada ou saída.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-12 gap-6 bg-slate-900 text-slate-100 rounded-3xl p-6 shadow-xl border-4 border-slate-700">
        
        {/* LEFT COLUMN: Screen / Controls */}
        <div className="md:col-span-7 space-y-5 bg-slate-950 p-5 rounded-2xl border border-slate-800 flex flex-col justify-between min-h-[420px]">
          
          {/* Header of Device */}
          <div className="flex justify-between items-center pb-3 border-b border-slate-800/60">
            <div className="flex items-center gap-2">
              <div className="h-2 w-2 rounded-full bg-emerald-500 animate-ping"></div>
              <span className="text-[10px] text-emerald-400 font-mono tracking-widest uppercase">DISPOSITIVO DA OBRA ONLINE</span>
            </div>
            
            {/* Clock display */}
            <div className="text-right">
              <span className="font-mono text-sm font-semibold text-amber-500 block">
                {currentTime.toLocaleTimeString('pt-BR')}
              </span>
              <span className="text-[9px] text-slate-400 block font-sans">
                {currentTime.toLocaleDateString('pt-BR')}
              </span>
            </div>
          </div>

          {/* Photo/Camera and GPS simulator view */}
          <div className="relative bg-slate-900 border border-slate-800 rounded-xl p-4 overflow-hidden flex flex-col items-center justify-center h-44 text-center">
            {simulatePhoto ? (
              <div className="absolute inset-0 bg-slate-900/90 flex flex-col items-center justify-center animate-pulse">
                <Camera className="h-8 w-8 text-amber-500 mb-2 animate-bounce" />
                <span className="text-xs font-mono text-amber-400">Capturando foto de segurança...</span>
                <span className="text-[10px] text-slate-500 font-mono mt-1">Reconhecimento Facial de Campo</span>
              </div>
            ) : null}

            {alertMsg ? (
              <div className={`p-4 rounded-lg text-center max-w-md ${
                alertMsg.type === 'success' 
                  ? 'bg-emerald-950/70 border border-emerald-800 text-emerald-300' 
                  : 'bg-red-950/70 border border-red-800 text-red-300'
              }`}>
                {alertMsg.type === 'success' ? (
                  <CheckCircle2 className="h-6 w-6 text-emerald-400 mx-auto mb-2" />
                ) : (
                  <AlertTriangle className="h-6 w-6 text-red-400 mx-auto mb-2" />
                )}
                <p className="text-xs font-medium leading-relaxed">{alertMsg.text}</p>
              </div>
            ) : (
              <div className="space-y-2">
                <ShieldCheck className="h-10 w-10 text-slate-500 mx-auto" />
                <p className="text-xs font-semibold text-slate-300">Pronto para Identificação</p>
                <p className="text-[10px] text-slate-500 max-w-xs leading-normal">
                  Selecione seu nome e digite seu PIN no teclado ao lado. O sistema registra a geolocalização e foto em tempo real do canteiro.
                </p>
              </div>
            )}

            {/* Simulated coordinates at bottom of the screen */}
            <div className="absolute bottom-2 left-2 right-2 flex justify-between items-center text-[9px] text-slate-400 font-mono">
              <span className="flex items-center gap-1">
                <MapPin className="h-3 w-3 text-red-500" />
                <span>GPS Obra: {gpsSimulated.lat.toFixed(5)}, {gpsSimulated.lng.toFixed(5)}</span>
              </span>
              <span className="bg-slate-800 px-1.5 py-0.5 rounded text-emerald-400">Verificado ✓</span>
            </div>
          </div>

          {/* Site selection & Employee selection */}
          <div className="space-y-3">
            <div>
              <label className="block text-[10px] text-slate-400 uppercase tracking-wider font-semibold mb-1">Canteiro de Obras Ativo</label>
              <select
                value={activeSite}
                onChange={(e) => {
                  setActiveSite(e.target.value);
                  setAlertMsg(null);
                }}
                className="w-full bg-slate-900 border border-slate-800 rounded-lg p-2 text-xs text-slate-200 focus:outline-none focus:ring-1 focus:ring-amber-500 cursor-pointer"
              >
                <option value="Obra Residencial Alvorada">Obra Residencial Alvorada</option>
                <option value="Condomínio Vista Alegre">Condomínio Vista Alegre</option>
                <option value="Sede Administrativa / Visitas a Obras">Sede Administrativa / Escritório</option>
              </select>
            </div>

            <div>
              <label className="block text-[10px] text-slate-400 uppercase tracking-wider font-semibold mb-1">Selecione seu Nome</label>
              <select
                value={selectedEmpId}
                onChange={(e) => {
                  setSelectedEmpId(e.target.value);
                  setAlertMsg(null);
                }}
                className="w-full bg-slate-900 border border-slate-800 rounded-lg p-2 text-xs text-slate-200 focus:outline-none focus:ring-1 focus:ring-amber-500 cursor-pointer"
              >
                <option value="">-- Escolha seu nome --</option>
                {activeEmployees.map(emp => (
                  <option key={emp.id} value={emp.id}>{emp.name} ({emp.role})</option>
                ))}
              </select>
            </div>
          </div>

        </div>

        {/* RIGHT COLUMN: Keypad */}
        <div className="md:col-span-5 space-y-4 flex flex-col justify-between">
          <div className="space-y-1">
            <h3 className="text-xs font-semibold uppercase text-slate-400 tracking-wider text-center">Teclado PIN</h3>
            
            {/* Dots representing entered PIN length */}
            <div className="flex justify-center gap-2 py-3">
              {[0, 1, 2, 3].map(index => (
                <div 
                  key={index} 
                  className={`h-4.5 w-4.5 rounded-full border border-slate-600 transition-all ${
                    pin.length > index ? 'bg-amber-500 border-amber-500 scale-110 shadow-[0_0_8px_rgba(245,158,11,0.5)]' : 'bg-slate-950'
                  }`}
                />
              ))}
            </div>
          </div>

          {/* Numerical Pad Grid */}
          <div className="grid grid-cols-3 gap-3 p-1">
            {['1', '2', '3', '4', '5', '6', '7', '8', '9'].map(num => (
              <button
                key={num}
                type="button"
                onClick={() => handleNumClick(num)}
                className="h-14 bg-slate-800 hover:bg-slate-700 active:bg-amber-600 active:text-white rounded-xl text-lg font-bold font-mono transition-colors border border-slate-700 flex items-center justify-center shadow-sm cursor-pointer"
              >
                {num}
              </button>
            ))}
            <button
              type="button"
              onClick={handleClear}
              className="h-14 bg-red-950/50 hover:bg-red-900/60 text-red-400 hover:text-red-300 rounded-xl text-xs font-bold transition-colors border border-red-900/30 flex items-center justify-center cursor-pointer"
            >
              LIMPAR
            </button>
            <button
              type="button"
              onClick={() => handleNumClick('0')}
              className="h-14 bg-slate-800 hover:bg-slate-700 active:bg-amber-600 active:text-white rounded-xl text-lg font-bold font-mono transition-colors border border-slate-700 flex items-center justify-center shadow-sm cursor-pointer"
            >
              0
            </button>
            <div className="h-14 text-slate-500 text-[10px] text-center flex items-center justify-center font-mono select-none">
              PIN DE 4 DÍGITOS
            </div>
          </div>

          {/* Action Buttons: Entrar / Sair */}
          <div className="grid grid-cols-2 gap-3 pt-2">
            <button
              onClick={() => handleClockAction('in')}
              className="py-4 bg-emerald-600 hover:bg-emerald-500 active:bg-emerald-700 text-white font-bold rounded-xl text-xs shadow-md transition-all uppercase tracking-wide cursor-pointer flex flex-col items-center gap-1 border-t border-emerald-400"
            >
              <span>REGISTRAR</span>
              <span className="text-[9px] opacity-80 font-normal">ENTRADA (MANHÃ/ALMOÇO)</span>
            </button>

            <button
              onClick={() => handleClockAction('out')}
              className="py-4 bg-amber-600 hover:bg-amber-500 active:bg-amber-700 text-white font-bold rounded-xl text-xs shadow-md transition-all uppercase tracking-wide cursor-pointer flex flex-col items-center gap-1 border-t border-amber-400"
            >
              <span>REGISTRAR</span>
              <span className="text-[9px] opacity-80 font-normal">SAÍDA (ALMOÇO/FIM DO DIA)</span>
            </button>
          </div>

        </div>

      </div>

      {/* Info Notice about today's logged attendance */}
      <div className="bg-amber-50 border border-amber-200 rounded-2xl p-4 text-xs text-amber-800 space-y-1">
        <h4 className="font-bold flex items-center gap-1.5 text-amber-900">
          <Map className="h-4 w-4" />
          <span>Informação de Geocerca (Geofencing)</span>
        </h4>
        <p>
          O sistema bloqueia registros fora do raio de 200m da obra configurada. O marcador de ponto simula essa leitura e carimba os dados com data, hora do servidor, e coordenadas de localização exatas.
        </p>
      </div>

    </div>
  );
}
