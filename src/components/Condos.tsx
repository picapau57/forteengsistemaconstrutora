import React, { useState } from 'react';
import { 
  Building2, 
  Droplet, 
  Flame, 
  CheckCircle, 
  XCircle, 
  DollarSign, 
  Plus, 
  Calendar, 
  FileText, 
  Grid, 
  Users,
  AlertCircle,
  PlusCircle,
  PiggyBank,
  Zap
} from 'lucide-react';
import { Condo, CondoBill } from '../types';

interface CondosProps {
  condos: Condo[];
  condoBills: CondoBill[];
  onAddCondo: (condo: Omit<Condo, 'id'>) => void;
  onUpdateCondo: (condo: Condo) => void;
  onAddCondoBill: (bill: Omit<CondoBill, 'id'>) => void;
  onPayCondoBill: (billId: string) => void;
}

export default function Condos({ 
  condos, 
  condoBills, 
  onAddCondo, 
  onUpdateCondo, 
  onAddCondoBill, 
  onPayCondoBill 
}: CondosProps) {
  const [selectedCondoId, setSelectedCondoId] = useState(condos[0]?.id || '');
  const [showAddCondo, setShowAddCondo] = useState(false);
  const [showAddBill, setShowAddBill] = useState(false);

  // New Condo states
  const [condoName, setCondoName] = useState('');
  const [address, setAddress] = useState('');
  const [totalUnits, setTotalUnits] = useState('');
  const [activeUnits, setActiveUnits] = useState('');
  const [monthlyFee, setMonthlyFee] = useState('');

  // New Bill states
  const [billType, setBillType] = useState<'Água' | 'Luz' | 'Manutenção' | 'Segurança' | 'Outros'>('Água');
  const [billAmount, setBillAmount] = useState('');
  const [billMonth, setBillMonth] = useState('06/2026');
  const [billDueDate, setBillDueDate] = useState('');
  const [billDesc, setBillDesc] = useState('');

  const activeCondo = condos.find(c => c.id === selectedCondoId) || condos[0];

  const handleCreateCondo = (e: React.FormEvent) => {
    e.preventDefault();
    if (!condoName || !address || !totalUnits || !monthlyFee) {
      alert('Preencha os campos obrigatórios.');
      return;
    }

    onAddCondo({
      name: condoName,
      address,
      totalUnits: parseInt(totalUnits),
      activeUnits: parseInt(activeUnits || '0'),
      monthlyFee: parseFloat(monthlyFee),
      currentBalance: 0
    });

    setCondoName('');
    setAddress('');
    setTotalUnits('');
    setActiveUnits('');
    setMonthlyFee('');
    setShowAddCondo(false);
    alert('Novo condomínio cadastrado com sucesso!');
  };

  const handleCreateBill = (e: React.FormEvent) => {
    e.preventDefault();
    if (!billAmount || !billDueDate || !selectedCondoId) {
      alert('Preencha o valor e a data de vencimento.');
      return;
    }

    onAddCondoBill({
      condoId: selectedCondoId,
      condoName: activeCondo.name,
      type: billType,
      amount: parseFloat(billAmount),
      billingMonth: billMonth,
      dueDate: billDueDate,
      status: 'Pendente',
      description: billDesc
    });

    setBillAmount('');
    setBillDueDate('');
    setBillDesc('');
    setShowAddBill(false);
    alert('Despesa / Conta condominial registrada com sucesso!');
  };

  // Filter bills for the selected condo
  const filteredBills = condoBills.filter(b => b.condoId === selectedCondoId);

  // Calculate sum of pending bills
  const pendingSum = filteredBills
    .filter(b => b.status === 'Pendente')
    .reduce((acc, b) => acc + b.amount, 0);

  // Lot Mapping simulation for newly built condo units
  const renderUnitsGrid = () => {
    if (!activeCondo) return null;
    const items = [];
    for (let i = 1; i <= activeCondo.totalUnits; i++) {
      const isSold = i <= activeCondo.activeUnits;
      items.push(
        <div 
          key={i} 
          className={`h-11 rounded-lg border text-[10px] font-mono flex flex-col items-center justify-center font-bold transition-all ${
            isSold 
              ? 'bg-emerald-50 border-emerald-200 text-emerald-700 hover:bg-emerald-100 shadow-sm' 
              : 'bg-slate-50 border-slate-200 text-slate-400 hover:bg-amber-50 hover:border-amber-300 hover:text-amber-700 cursor-pointer'
          }`}
          title={isSold ? `Unidade ${i} - Ocupada / Adimplente` : `Unidade ${i} - Disponível para Venda`}
          onClick={() => {
            if (!isSold) {
              const sell = window.confirm(`Deseja simular a venda/entrega de chaves da Unidade ${i} do ${activeCondo.name}?`);
              if (sell) {
                onUpdateCondo({
                  ...activeCondo,
                  activeUnits: activeCondo.activeUnits + 1,
                  currentBalance: activeCondo.currentBalance + activeCondo.monthlyFee
                });
              }
            }
          }}
        >
          <span>Apt {100 + i}</span>
          <span className="text-[8px] uppercase">{isSold ? 'Vendido' : 'Vago'}</span>
        </div>
      );
    }
    return (
      <div className="grid grid-cols-4 sm:grid-cols-6 lg:grid-cols-8 gap-2 max-h-[220px] overflow-y-auto pr-1">
        {items}
      </div>
    );
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h2 id="condos-section-title" className="text-sm font-bold text-slate-800 uppercase tracking-wide border-l-4 border-amber-500 pl-2">
            Gestão de Condomínios & Obras Entregues
          </h2>
          <p className="text-slate-500 text-xs mt-1">Acompanhe as contas (água, luz, taxas) e controle de venda de lotes dos condomínios construídos sob sua administração.</p>
        </div>
        
        <div className="flex gap-2 shrink-0">
          <button
            onClick={() => {
              setShowAddCondo(!showAddCondo);
              setShowAddBill(false);
            }}
            className="flex items-center gap-1.5 bg-slate-900 hover:bg-slate-850 text-white font-bold px-3 py-1.5 rounded text-[11px] uppercase tracking-wider shadow-sm transition-all cursor-pointer"
          >
            <Building2 className="h-3.5 w-3.5" />
            <span>{showAddCondo ? 'Voltar' : 'Novo Condomínio'}</span>
          </button>

          <button
            onClick={() => {
              setShowAddBill(!showAddBill);
              setShowAddCondo(false);
            }}
            className="flex items-center gap-1.5 bg-amber-500 hover:bg-amber-600 text-white font-bold px-3 py-1.5 rounded text-[11px] uppercase tracking-wider shadow-sm transition-all cursor-pointer"
          >
            <Plus className="h-3.5 w-3.5" />
            <span>Lançar Despesa / Conta</span>
          </button>
        </div>
      </div>

      {/* Selector of Active Condominium */}
      {!showAddCondo && !showAddBill && (
        <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-sm flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <span className="text-[10px] font-bold uppercase text-slate-400 tracking-wider">Empreendimento Selecionado:</span>
            <select
              value={selectedCondoId}
              onChange={(e) => setSelectedCondoId(e.target.value)}
              className="bg-slate-50 border border-slate-200 rounded p-2 text-xs font-bold text-slate-700 outline-none focus:ring-1 focus:ring-amber-500 cursor-pointer"
            >
              {condos.map(c => (
                <option key={c.id} value={c.id}>{c.name}</option>
              ))}
            </select>
          </div>
          
          {activeCondo && (
            <div className="text-xs text-slate-500 flex items-center gap-4 font-medium">
              <span><strong>Endereço:</strong> {activeCondo.address}</span>
            </div>
          )}
        </div>
      )}

      {showAddCondo && (
        /* CREATE CONDO FORM */
        <div className="bg-white rounded-xl p-6 shadow-sm border border-slate-100 animate-fadeIn">
          <h3 className="text-sm font-bold text-slate-800 mb-4 pb-2 border-b border-slate-100 flex items-center gap-1.5">
            <PlusCircle className="h-5 w-5 text-amber-600" />
            <span>Cadastrar Novo Empreendimento / Condomínio</span>
          </h3>

          <form onSubmit={handleCreateCondo} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-slate-500 mb-1">Nome do Condomínio *</label>
                <input
                  type="text"
                  required
                  value={condoName}
                  onChange={(e) => setCondoName(e.target.value)}
                  placeholder="Ex: Condomínio Residencial Bougainville"
                  className="w-full border border-slate-200 rounded-lg p-2.5 text-xs focus:ring-1 focus:ring-amber-500 outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-500 mb-1">Endereço Completo *</label>
                <input
                  type="text"
                  required
                  value={address}
                  onChange={(e) => setAddress(e.target.value)}
                  placeholder="Ex: Av. Principal, 500 - Bairro, Cidade SP"
                  className="w-full border border-slate-200 rounded-lg p-2.5 text-xs focus:ring-1 focus:ring-amber-500 outline-none"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label className="block text-xs font-semibold text-slate-500 mb-1">Total de Unidades / Aptos *</label>
                <input
                  type="number"
                  required
                  value={totalUnits}
                  onChange={(e) => setTotalUnits(e.target.value)}
                  placeholder="Ex: 32"
                  className="w-full border border-slate-200 rounded-lg p-2.5 text-xs focus:ring-1 focus:ring-amber-500 outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-500 mb-1">Unidades Vendidas / Ativas</label>
                <input
                  type="number"
                  value={activeUnits}
                  onChange={(e) => setActiveUnits(e.target.value)}
                  placeholder="Ex: 10"
                  className="w-full border border-slate-200 rounded-lg p-2.5 text-xs focus:ring-1 focus:ring-amber-500 outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-500 mb-1">Taxa Condominial Padrão (R$) *</label>
                <input
                  type="number"
                  required
                  value={monthlyFee}
                  onChange={(e) => setMonthlyFee(e.target.value)}
                  placeholder="Ex: 380"
                  className="w-full border border-slate-200 rounded-lg p-2.5 text-xs focus:ring-1 focus:ring-amber-500 outline-none"
                />
              </div>
            </div>

            <div className="flex justify-end gap-2 pt-2">
              <button
                type="button"
                onClick={() => setShowAddCondo(false)}
                className="bg-slate-100 hover:bg-slate-200 text-slate-700 px-4 py-2.5 rounded-lg text-xs font-semibold transition-colors cursor-pointer"
              >
                Cancelar
              </button>
              <button
                type="submit"
                className="bg-amber-600 hover:bg-amber-700 text-white px-5 py-2.5 rounded-lg text-xs font-semibold shadow-sm transition-colors cursor-pointer"
              >
                Salvar Condomínio
              </button>
            </div>
          </form>
        </div>
      )}

      {showAddBill && (
        /* CREATE CONDO BILL FORM */
        <div className="bg-white rounded-xl p-6 shadow-sm border border-slate-100 animate-fadeIn">
          <h3 className="text-sm font-bold text-slate-800 mb-4 pb-2 border-b border-slate-100 flex items-center gap-1.5">
            <PlusCircle className="h-5 w-5 text-amber-600" />
            <span>Lançar Nova Conta / Consumo para o Condomínio</span>
          </h3>

          <form onSubmit={handleCreateBill} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label className="block text-xs font-semibold text-slate-500 mb-1">Condomínio Devedor</label>
                <select
                  value={selectedCondoId}
                  onChange={(e) => setSelectedCondoId(e.target.value)}
                  className="w-full border border-slate-200 rounded-lg p-2.5 text-xs bg-white outline-none focus:ring-1 focus:ring-amber-500 cursor-pointer"
                >
                  {condos.map(c => (
                    <option key={c.id} value={c.id}>{c.name}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-500 mb-1">Tipo da Despesa</label>
                <select
                  value={billType}
                  onChange={(e) => setBillType(e.target.value as any)}
                  className="w-full border border-slate-200 rounded-lg p-2.5 text-xs bg-white outline-none focus:ring-1 focus:ring-amber-500 cursor-pointer"
                >
                  <option value="Água">Consumo de Água (SABESP)</option>
                  <option value="Luz">Consumo de Luz (ENEL)</option>
                  <option value="Manutenção">Manutenção Geral (Filtros, elevadores)</option>
                  <option value="Segurança">Portaria / Câmeras / Segurança</option>
                  <option value="Outros">Outras Contas</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-500 mb-1">Valor da Fatura (R$) *</label>
                <input
                  type="number"
                  step="0.01"
                  required
                  value={billAmount}
                  onChange={(e) => setBillAmount(e.target.value)}
                  placeholder="Ex: 850.30"
                  className="w-full border border-slate-200 rounded-lg p-2.5 text-xs focus:ring-1 focus:ring-amber-500 outline-none"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label className="block text-xs font-semibold text-slate-500 mb-1">Mês de Referência (MM/YYYY)</label>
                <input
                  type="text"
                  required
                  value={billMonth}
                  onChange={(e) => setBillMonth(e.target.value)}
                  placeholder="Ex: 06/2026"
                  className="w-full border border-slate-200 rounded-lg p-2.5 text-xs focus:ring-1 focus:ring-amber-500 outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-500 mb-1">Vencimento *</label>
                <input
                  type="date"
                  required
                  value={billDueDate}
                  onChange={(e) => setBillDueDate(e.target.value)}
                  className="w-full border border-slate-200 rounded-lg p-2.5 text-xs focus:ring-1 focus:ring-amber-500 outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-500 mb-1">Descrição Opcional</label>
                <input
                  type="text"
                  value={billDesc}
                  onChange={(e) => setBillDesc(e.target.value)}
                  placeholder="Ex: Conta de luz portaria bloco A"
                  className="w-full border border-slate-200 rounded-lg p-2.5 text-xs focus:ring-1 focus:ring-amber-500 outline-none"
                />
              </div>
            </div>

            <div className="flex justify-end gap-2 pt-2">
              <button
                type="button"
                onClick={() => setShowAddBill(false)}
                className="bg-slate-100 hover:bg-slate-200 text-slate-700 px-4 py-2.5 rounded-lg text-xs font-semibold transition-colors cursor-pointer"
              >
                Cancelar
              </button>
              <button
                type="submit"
                className="bg-amber-600 hover:bg-amber-700 text-white px-5 py-2.5 rounded-lg text-xs font-semibold shadow-sm transition-colors cursor-pointer"
              >
                Lançar Conta Condominial
              </button>
            </div>
          </form>
        </div>
      )}

      {!showAddCondo && !showAddBill && activeCondo && (
        /* MAIN DASHBOARD FOR THE SELECTED CONDO */
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          
          {/* Left panel: Quick Metrics for Selected Condo */}
          <div className="lg:col-span-4 space-y-4">
            
            <div className="bg-white rounded-xl p-5 shadow-sm border border-slate-100 space-y-4">
              <h3 className="font-bold text-slate-800 text-xs uppercase tracking-wider text-slate-400">
                Caixa do Empreendimento
              </h3>

              <div className="flex justify-between items-center p-3.5 bg-slate-50 rounded-xl border border-slate-250">
                <div className="flex items-center gap-2">
                  <PiggyBank className="h-5 w-5 text-amber-600" />
                  <span className="text-xs font-semibold text-slate-700">Saldo Atual</span>
                </div>
                <span className="font-mono text-sm font-bold text-slate-900">
                  {activeCondo.currentBalance.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}
                </span>
              </div>

              <div className="space-y-2.5 text-xs text-slate-600">
                <div className="flex justify-between">
                  <span>Taxa Condominial:</span>
                  <span className="font-bold text-slate-800">{activeCondo.monthlyFee.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}</span>
                </div>
                <div className="flex justify-between">
                  <span>Aptos Vendidos / Entregues:</span>
                  <span className="font-bold text-slate-800">{activeCondo.activeUnits} de {activeCondo.totalUnits}</span>
                </div>
                <div className="flex justify-between">
                  <span>Receita Estimada Mensal:</span>
                  <span className="font-bold text-emerald-600">
                    {(activeCondo.activeUnits * activeCondo.monthlyFee).toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}
                  </span>
                </div>
                <div className="flex justify-between text-red-600 font-semibold">
                  <span>Faturas Pendentes:</span>
                  <span>{pendingSum.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}</span>
                </div>
              </div>
            </div>

            {/* Quick Condo tips */}
            <div className="bg-amber-50 border border-amber-200 rounded-xl p-4 text-[11px] text-amber-800 space-y-1">
              <h4 className="font-bold text-amber-900 flex items-center gap-1">
                <AlertCircle className="h-3.5 w-3.5" />
                <span>Gestão de Obra Entregue</span>
              </h4>
              <p>
                Os condomínios construídos pela construtora contam com garantia estrutural e faturamento de cotas de rateio integradas aos gastos coletivos (Luz de obras, água e manutenção).
              </p>
            </div>
          </div>

          {/* Right panel: Condo Bills & Lot/Unit Mapping */}
          <div className="lg:col-span-8 space-y-6">
            
            {/* Lot / Apartment Unit Mapping */}
            <div className="bg-white rounded-xl p-5 shadow-sm border border-slate-100 space-y-3.5">
              <h3 className="font-bold text-slate-800 text-xs uppercase tracking-wider text-slate-400 flex items-center gap-1.5">
                <Grid className="h-4 w-4 text-amber-600" />
                <span>Mapa de Vendas & Entrega de Chaves (Unidades)</span>
              </h3>
              <p className="text-[11px] text-slate-400">Clique nas unidades vagas (<span className="text-slate-500 font-semibold">VAGO</span>) para simular a venda e o início da arrecadação da taxa condominial.</p>
              
              {renderUnitsGrid()}
            </div>

            {/* Utility Bills List */}
            <div className="bg-white rounded-xl p-5 shadow-sm border border-slate-100 space-y-4">
              <h3 className="font-bold text-slate-800 text-xs uppercase tracking-wider text-slate-400">
                Faturas Operacionais (Água, Luz, Manutenções)
              </h3>

              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs border-collapse">
                  <thead>
                    <tr className="border-b border-slate-150 text-slate-400 text-[10px] font-bold uppercase tracking-wider">
                      <th className="py-2">Fatura / Mês</th>
                      <th className="py-2">Vencimento</th>
                      <th className="py-2 text-right">Valor</th>
                      <th className="py-2 text-center">Status</th>
                      <th className="py-2 text-right">Ação</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-50">
                    {filteredBills.map(bill => (
                      <tr key={bill.id} className="hover:bg-slate-50/40 transition-colors">
                        <td className="py-3">
                          <div className="flex items-center gap-2">
                            <div className="p-1 bg-slate-50 rounded">
                              {bill.type === 'Água' && <Droplet className="h-4 w-4 text-blue-500" />}
                              {bill.type === 'Luz' && <Zap className="h-4 w-4 text-amber-500" />}
                              {bill.type === 'Manutenção' && <FileText className="h-4 w-4 text-purple-500" />}
                              {bill.type === 'Segurança' && <Users className="h-4 w-4 text-indigo-500" />}
                              {bill.type === 'Outros' && <Building2 className="h-4 w-4 text-slate-500" />}
                            </div>
                            <div>
                              <p className="font-semibold text-slate-800">{bill.type} - {bill.billingMonth}</p>
                              {bill.description && <p className="text-[10px] text-slate-400 max-w-[150px] truncate">{bill.description}</p>}
                            </div>
                          </div>
                        </td>
                        <td className="py-3 font-mono text-[11px] text-slate-500">
                          {new Date(bill.dueDate).toLocaleDateString('pt-BR')}
                        </td>
                        <td className="py-3 text-right font-mono font-bold text-slate-700">
                          {bill.amount.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}
                        </td>
                        <td className="py-3 text-center">
                          {bill.status === 'Pago' ? (
                            <span className="inline-flex items-center gap-1 text-[10px] font-bold text-emerald-600 bg-emerald-50 px-2.5 py-0.5 rounded-full">
                              <CheckCircle className="h-3 w-3" />
                              Pago
                            </span>
                          ) : (
                            <span className="inline-flex items-center gap-1 text-[10px] font-bold text-red-600 bg-red-50 px-2.5 py-0.5 rounded-full animate-pulse">
                              <XCircle className="h-3 w-3" />
                              Pendente
                            </span>
                          )}
                        </td>
                        <td className="py-3 text-right">
                          {bill.status === 'Pendente' && (
                            <button
                              onClick={() => {
                                const confirmPay = window.confirm(`Deseja liquidar esta conta de R$ ${bill.amount.toFixed(2)} utilizando o fundo de caixa deste condomínio?`);
                                if (confirmPay) {
                                  onPayCondoBill(bill.id);
                                }
                              }}
                              className="text-[10px] bg-slate-800 hover:bg-slate-700 text-white font-bold px-2 py-1 rounded transition-all cursor-pointer"
                            >
                              Baixar Pago
                            </button>
                          )}
                        </td>
                      </tr>
                    ))}
                    {filteredBills.length === 0 && (
                      <tr>
                        <td colSpan={5} className="py-8 text-center text-slate-400">
                          Nenhuma conta lançada para este condomínio.
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </div>

          </div>

        </div>
      )}
    </div>
  );
}
