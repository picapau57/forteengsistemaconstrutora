import React, { useState } from 'react';
import { 
  Users, 
  UserPlus, 
  FileText, 
  Phone, 
  Mail, 
  DollarSign, 
  MapPin, 
  Search, 
  Trash2, 
  Calendar, 
  Lock, 
  ClipboardList, 
  AlertCircle, 
  CheckCircle,
  PlusCircle
} from 'lucide-react';
import { Employee, Attendance } from '../types';

interface EmployeesProps {
  employees: Employee[];
  attendance: Attendance[];
  onAddEmployee: (emp: Omit<Employee, 'id'>) => void;
  onUpdateEmployee: (emp: Employee) => void;
}

export default function Employees({ employees, attendance, onAddEmployee, onUpdateEmployee }: EmployeesProps) {
  const [searchTerm, setSearchTerm] = useState('');
  const [showAddForm, setShowAddForm] = useState(false);
  const [selectedEmployee, setSelectedEmployee] = useState<Employee | null>(null);
  
  // New employee form state
  const [name, setName] = useState('');
  const [role, setRole] = useState('Pedreiro');
  const [salary, setSalary] = useState('');
  const [cpf, setCpf] = useState('');
  const [phone, setPhone] = useState('');
  const [email, setEmail] = useState('');
  const [address, setAddress] = useState('');
  const [pointPin, setPointPin] = useState('');
  const [newNote, setNewNote] = useState('');

  // Filter employees
  const filteredEmployees = employees.filter(emp => 
    emp.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    emp.role.toLowerCase().includes(searchTerm.toLowerCase()) ||
    emp.cpf.includes(searchTerm)
  );

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !cpf || !salary || !pointPin) {
      alert('Por favor, preencha os campos obrigatórios (Nome, CPF, Salário, PIN).');
      return;
    }
    
    // Validate PIN: 4 digits
    if (pointPin.length !== 4 || isNaN(Number(pointPin))) {
      alert('O PIN do ponto eletrônico deve conter exatamente 4 números.');
      return;
    }

    onAddEmployee({
      name,
      role,
      status: 'Ativo',
      hireDate: new Date().toISOString().split('T')[0],
      salary: parseFloat(salary),
      cpf,
      phone,
      email,
      address,
      notes: ['Admitido no sistema de gestão de construtoras.'],
      pointPin
    });

    // Reset fields
    setName('');
    setRole('Pedreiro');
    setSalary('');
    setCpf('');
    setPhone('');
    setEmail('');
    setAddress('');
    setPointPin('');
    setShowAddForm(false);
  };

  const handleDismiss = (emp: Employee) => {
    const confirmDismiss = window.confirm(`Deseja realmente registrar a demissão de ${emp.name}?`);
    if (confirmDismiss) {
      onUpdateEmployee({
        ...emp,
        status: 'Demitido',
        terminationDate: new Date().toISOString().split('T')[0],
        notes: [...emp.notes, `Contrato encerrado em ${new Date().toLocaleDateString('pt-BR')}.`]
      });
      if (selectedEmployee?.id === emp.id) {
        setSelectedEmployee({
          ...emp,
          status: 'Demitido',
          terminationDate: new Date().toISOString().split('T')[0]
        });
      }
    }
  };

  const handleAddNote = () => {
    if (!newNote.trim() || !selectedEmployee) return;
    const updatedEmp = {
      ...selectedEmployee,
      notes: [...selectedEmployee.notes, newNote.trim()]
    };
    onUpdateEmployee(updatedEmp);
    setSelectedEmployee(updatedEmp);
    setNewNote('');
  };

  // Get attendance logs for selected employee
  const employeeAttendance = selectedEmployee 
    ? attendance.filter(a => a.employeeId === selectedEmployee.id)
    : [];

  return (
    <div className="space-y-6">
      {/* Header section */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h2 id="employees-section-title" className="text-sm font-bold text-slate-800 uppercase tracking-wide border-l-4 border-amber-500 pl-2">
            Controle de Funcionários
          </h2>
          <p className="text-slate-500 text-xs mt-1">Gerencie admissões, demissões, dados contratuais e anotações operacionais.</p>
        </div>
        <button
          onClick={() => {
            setShowAddForm(!showAddForm);
            setSelectedEmployee(null);
          }}
          className="flex items-center gap-2 bg-amber-500 hover:bg-amber-600 text-white font-bold px-3 py-1.5 rounded text-[11px] uppercase tracking-wider shadow-sm transition-all cursor-pointer"
        >
          <UserPlus className="h-3.5 w-3.5" />
          <span>{showAddForm ? 'Voltar para Lista' : 'Admitir Novo Funcionário'}</span>
        </button>
      </div>

      {showAddForm ? (
        /* ADMISSION FORM */
        <div className="bg-white rounded-2xl p-6 shadow-sm border border-slate-200 animate-fadeIn">
          <h3 className="text-xs font-bold text-slate-800 uppercase tracking-wider mb-4 pb-2 border-b border-slate-100 flex items-center gap-1.5 border-l-4 border-amber-500 pl-2">
            Ficha de Admissão de Funcionário
          </h3>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label className="block text-xs font-semibold text-slate-500 mb-1">Nome Completo *</label>
                <input
                  type="text"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Nome do trabalhador"
                  className="w-full border border-slate-200 rounded-lg p-2.5 text-xs focus:ring-1 focus:ring-amber-500 outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-500 mb-1">Cargo / Função *</label>
                <select
                  value={role}
                  onChange={(e) => setRole(e.target.value)}
                  className="w-full border border-slate-200 rounded-lg p-2.5 text-xs focus:ring-1 focus:ring-amber-500 outline-none bg-white"
                >
                  <option value="Mestre de Obras">Mestre de Obras</option>
                  <option value="Pedreiro">Pedreiro</option>
                  <option value="Pedreiro de Acabamento">Pedreiro de Acabamento</option>
                  <option value="Servente">Servente</option>
                  <option value="Carpinteiro">Carpinteiro</option>
                  <option value="Armador de Ferragem">Armador de Ferragem</option>
                  <option value="Eletricista de Obra">Eletricista de Obra</option>
                  <option value="Encanador">Encanador</option>
                  <option value="Engenheiro Civil">Engenheiro Civil</option>
                  <option value="Almoxarife">Almoxarife</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-500 mb-1">Salário Mensal (R$) *</label>
                <input
                  type="number"
                  step="0.01"
                  required
                  value={salary}
                  onChange={(e) => setSalary(e.target.value)}
                  placeholder="Ex: 2500"
                  className="w-full border border-slate-200 rounded-lg p-2.5 text-xs focus:ring-1 focus:ring-amber-500 outline-none"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label className="block text-xs font-semibold text-slate-500 mb-1">CPF *</label>
                <input
                  type="text"
                  required
                  value={cpf}
                  onChange={(e) => setCpf(e.target.value)}
                  placeholder="000.000.000-00"
                  className="w-full border border-slate-200 rounded-lg p-2.5 text-xs focus:ring-1 focus:ring-amber-500 outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-500 mb-1">Telefone / WhatsApp</label>
                <input
                  type="text"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  placeholder="(11) 99999-9999"
                  className="w-full border border-slate-200 rounded-lg p-2.5 text-xs focus:ring-1 focus:ring-amber-500 outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-500 mb-1">E-mail</label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="trabalhador@email.com"
                  className="w-full border border-slate-200 rounded-lg p-2.5 text-xs focus:ring-1 focus:ring-amber-500 outline-none"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="md:col-span-2">
                <label className="block text-xs font-semibold text-slate-500 mb-1">Endereço Residencial</label>
                <input
                  type="text"
                  value={address}
                  onChange={(e) => setAddress(e.target.value)}
                  placeholder="Rua, número, bairro, cidade - UF"
                  className="w-full border border-slate-200 rounded-lg p-2.5 text-xs focus:ring-1 focus:ring-amber-500 outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-500 mb-1 flex items-center gap-1">
                  <Lock className="h-3.5 w-3.5 text-amber-600" />
                  <span>PIN para bater Ponto (4 dígitos) *</span>
                </label>
                <input
                  type="text"
                  maxLength={4}
                  required
                  value={pointPin}
                  onChange={(e) => setPointPin(e.target.value.replace(/\D/g, ''))}
                  placeholder="Ex: 1234"
                  className="w-full border border-slate-200 rounded-lg p-2.5 text-xs font-mono tracking-widest focus:ring-1 focus:ring-amber-500 outline-none"
                />
              </div>
            </div>

            <div className="flex justify-end gap-2 pt-2">
              <button
                type="button"
                onClick={() => setShowAddForm(false)}
                className="bg-slate-100 hover:bg-slate-200 text-slate-700 px-4 py-2.5 rounded-lg text-xs font-semibold transition-colors"
              >
                Cancelar
              </button>
              <button
                type="submit"
                className="bg-amber-600 hover:bg-amber-700 text-white px-5 py-2.5 rounded-lg text-xs font-semibold shadow-sm transition-colors"
              >
                Efetivar Admissão
              </button>
            </div>
          </form>
        </div>
      ) : (
        /* MAIN LIST & DETAIL VIEW */
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          
          {/* List of Employees */}
          <div className="bg-white rounded-2xl p-5 shadow-sm border border-slate-200 lg:col-span-2 space-y-4">
            <div className="flex items-center gap-2 bg-slate-50 px-3 py-2 rounded border border-slate-200">
              <Search className="h-4 w-4 text-slate-400" />
              <input
                type="text"
                placeholder="Buscar por nome, cargo ou CPF..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="bg-transparent border-none outline-none text-xs w-full text-slate-700 placeholder-slate-400 font-sans"
              />
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="border-b border-slate-200 text-slate-400 text-[10px] font-bold uppercase tracking-wider">
                    <th className="py-2.5">Nome</th>
                    <th className="py-2.5">Cargo</th>
                    <th className="py-2.5">Status</th>
                    <th className="py-2.5 text-right">Ações</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 text-xs">
                  {filteredEmployees.map(emp => (
                    <tr 
                      key={emp.id} 
                      className={`hover:bg-slate-50 transition-colors cursor-pointer ${selectedEmployee?.id === emp.id ? 'bg-amber-50/40 font-medium' : ''}`}
                      onClick={() => setSelectedEmployee(emp)}
                    >
                      <td className="py-3">
                        <p className="font-bold text-slate-850">{emp.name}</p>
                        <p className="text-[10px] text-slate-400 font-mono">CPF: {emp.cpf}</p>
                      </td>
                      <td className="py-3 text-slate-600 font-semibold">
                        <span>{emp.role}</span>
                      </td>
                      <td className="py-3">
                        <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded text-[10px] font-bold ${
                          emp.status === 'Ativo' 
                            ? 'bg-emerald-50 text-emerald-700 border border-emerald-100' 
                            : 'bg-red-50 text-red-700 border border-red-100'
                        }`}>
                          {emp.status}
                        </span>
                      </td>
                      <td className="py-3 text-right" onClick={(e) => e.stopPropagation()}>
                        <div className="flex justify-end gap-1.5">
                          <button
                            onClick={() => setSelectedEmployee(emp)}
                            className="p-1.5 hover:bg-amber-50 text-amber-700 rounded transition-all cursor-pointer border border-transparent hover:border-amber-100"
                            title="Ver Ficha Completa"
                          >
                            <ClipboardList className="h-4 w-4" />
                          </button>
                          {emp.status === 'Ativo' && (
                            <button
                              onClick={() => handleDismiss(emp)}
                              className="p-1.5 hover:bg-red-50 text-red-600 rounded transition-all cursor-pointer border border-transparent hover:border-red-100"
                              title="Registrar Demissão"
                            >
                              <Trash2 className="h-4 w-4" />
                            </button>
                          )}
                        </div>
                      </td>
                    </tr>
                  ))}
                  {filteredEmployees.length === 0 && (
                    <tr>
                      <td colSpan={4} className="py-8 text-center text-slate-400 font-medium">
                        Nenhum funcionário encontrado.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>

          {/* Details / Ficha cadastral card */}
          <div className="bg-white rounded-2xl p-5 shadow-sm border border-slate-200 lg:col-span-1 space-y-4">
            {selectedEmployee ? (
              <div className="space-y-4 animate-fadeIn">
                <div className="border-b border-slate-100 pb-3">
                  <div className="flex justify-between items-start">
                    <div>
                      <h3 className="font-bold text-slate-800 text-sm">{selectedEmployee.name}</h3>
                      <p className="text-xs font-medium text-amber-600">{selectedEmployee.role}</p>
                    </div>
                    <span className={`text-[10px] font-bold px-2 py-0.5 rounded ${
                      selectedEmployee.status === 'Ativo' ? 'bg-emerald-50 text-emerald-700' : 'bg-red-50 text-red-700'
                    }`}>
                      {selectedEmployee.status}
                    </span>
                  </div>
                </div>

                {/* Personal & Contractual data */}
                <div className="space-y-2.5 text-xs text-slate-600">
                  <div className="flex items-center gap-2">
                    <Calendar className="h-4 w-4 text-slate-400 shrink-0" />
                    <span><strong>Admissão:</strong> {new Date(selectedEmployee.hireDate).toLocaleDateString('pt-BR')}</span>
                  </div>

                  {selectedEmployee.terminationDate && (
                    <div className="flex items-center gap-2 text-red-600">
                      <Calendar className="h-4 w-4 text-red-400 shrink-0" />
                      <span><strong>Demissão:</strong> {new Date(selectedEmployee.terminationDate).toLocaleDateString('pt-BR')}</span>
                    </div>
                  )}

                  <div className="flex items-center gap-2">
                    <DollarSign className="h-4 w-4 text-slate-400 shrink-0" />
                    <span><strong>Salário:</strong> {selectedEmployee.salary.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}</span>
                  </div>

                  <div className="flex items-center gap-2">
                    <Phone className="h-4 w-4 text-slate-400 shrink-0" />
                    <span><strong>Telefone:</strong> {selectedEmployee.phone || 'Não informado'}</span>
                  </div>

                  <div className="flex items-center gap-2">
                    <Mail className="h-4 w-4 text-slate-400 shrink-0" />
                    <span><strong>Email:</strong> {selectedEmployee.email || 'Não informado'}</span>
                  </div>

                  <div className="flex items-start gap-2">
                    <MapPin className="h-4 w-4 text-slate-400 shrink-0 mt-0.5" />
                    <span><strong>Endereço:</strong> {selectedEmployee.address || 'Não informado'}</span>
                  </div>

                  <div className="flex items-center gap-2">
                    <Lock className="h-4 w-4 text-slate-400 shrink-0" />
                    <span><strong>Código PIN de Ponto:</strong> <span className="font-mono bg-slate-100 px-1.5 py-0.5 rounded text-slate-700 font-bold">{selectedEmployee.pointPin}</span></span>
                  </div>
                </div>

                {/* Daily Attendance Logs for Employee */}
                <div className="border-t border-slate-100 pt-3 space-y-2">
                  <h4 className="text-[11px] font-bold text-slate-400 uppercase tracking-wider flex items-center gap-1">
                    <CheckCircle className="h-3.5 w-3.5 text-amber-500" />
                    <span>Histórico de Presença</span>
                  </h4>
                  <div className="max-h-[120px] overflow-y-auto space-y-1.5 pr-1 font-mono text-[11px]">
                    {employeeAttendance.length === 0 ? (
                      <p className="text-slate-400 py-1">Nenhum registro de ponto encontrado.</p>
                    ) : (
                      employeeAttendance.map(att => (
                        <div key={att.id} className="flex justify-between items-center bg-slate-50 p-1.5 rounded border border-slate-100">
                          <div>
                            <span className="font-semibold text-slate-700">{new Date(att.date).toLocaleDateString('pt-BR')}</span>
                            <span className="text-slate-400 block text-[9px] truncate max-w-[130px]">{att.location}</span>
                          </div>
                          <div className="text-right">
                            <span className="font-semibold text-slate-800">
                              {att.clockIn ? `${att.clockIn} - ${att.clockOut || 'Em serviço'}` : 'Falta'}
                            </span>
                            <span className={`block text-[9px] font-sans font-bold ${
                              att.status === 'Presente' ? 'text-emerald-600' :
                              att.status === 'Atrasado' ? 'text-amber-600' : 'text-red-500'
                            }`}>{att.status}</span>
                          </div>
                        </div>
                      ))
                    )}
                  </div>
                </div>

                {/* Notes & Annotations */}
                <div className="border-t border-slate-100 pt-3 space-y-2">
                  <h4 className="text-[11px] font-bold text-slate-400 uppercase tracking-wider flex items-center gap-1">
                    <FileText className="h-3.5 w-3.5 text-amber-500" />
                    <span>Anotações de Campo / Ocorrências</span>
                  </h4>
                  
                  <div className="space-y-1.5 max-h-[150px] overflow-y-auto pr-1">
                    {selectedEmployee.notes.map((note, index) => (
                      <div key={index} className="bg-amber-50/50 border border-amber-100 p-2 rounded text-[11px] text-slate-700 leading-relaxed">
                        {note}
                      </div>
                    ))}
                    {selectedEmployee.notes.length === 0 && (
                      <p className="text-slate-400 text-xs italic">Nenhuma anotação registrada.</p>
                    )}
                  </div>

                  {selectedEmployee.status === 'Ativo' && (
                    <div className="flex gap-1.5 pt-1.5">
                      <input
                        type="text"
                        placeholder="Adicionar nota..."
                        value={newNote}
                        onChange={(e) => setNewNote(e.target.value)}
                        onKeyDown={(e) => e.key === 'Enter' && handleAddNote()}
                        className="w-full border border-slate-200 rounded-lg px-2.5 py-1.5 text-xs outline-none focus:ring-1 focus:ring-amber-500"
                      />
                      <button
                        onClick={handleAddNote}
                        className="bg-amber-600 hover:bg-amber-700 text-white p-1.5 rounded-lg text-xs"
                      >
                        <PlusCircle className="h-4 w-4" />
                      </button>
                    </div>
                  )}
                </div>
              </div>
            ) : (
              <div className="text-center py-12 text-slate-400 text-xs space-y-2">
                <AlertCircle className="h-8 w-8 text-slate-300 mx-auto" />
                <p>Selecione um funcionário da lista para exibir seus dados contratuais, histórico de presença e anotações operacionais.</p>
              </div>
            )}
          </div>

        </div>
      )}
    </div>
  );
}
