import React, { useState } from 'react';
import { 
  TrendingUp, 
  TrendingDown, 
  Plus, 
  Search, 
  DollarSign, 
  Calendar, 
  PlusCircle, 
  Check, 
  Filter,
  CheckCircle2,
  AlertCircle
} from 'lucide-react';
import { Transaction } from '../types';

interface FinanceProps {
  transactions: Transaction[];
  onAddTransaction: (t: Omit<Transaction, 'id'>) => void;
}

export default function Finance({ transactions, onAddTransaction }: FinanceProps) {
  const [showAddForm, setShowAddForm] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedFilter, setSelectedFilter] = useState<'Todos' | 'Receita' | 'Despesa'>('Todos');
  const [selectedCategory, setSelectedCategory] = useState('Todos');

  // New transaction state
  const [type, setType] = useState<'Receita' | 'Despesa'>('Receita');
  const [amount, setAmount] = useState('');
  const [category, setCategory] = useState('Clientes');
  const [description, setDescription] = useState('');
  const [date, setDate] = useState(new Date().toISOString().split('T')[0]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!amount || !description || !category) {
      alert('Preencha os campos obrigatórios (Valor, Categoria e Descrição).');
      return;
    }

    onAddTransaction({
      type,
      amount: parseFloat(amount),
      category,
      description,
      date
    });

    setAmount('');
    setDescription('');
    setShowAddForm(false);
    alert('Lançamento financeiro registrado com sucesso!');
  };

  // Filter transactions
  const filteredTransactions = transactions.filter(t => {
    const matchesSearch = t.description.toLowerCase().includes(searchTerm.toLowerCase()) || 
                          t.category.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesType = selectedFilter === 'Todos' || t.type === selectedFilter;
    const matchesCat = selectedCategory === 'Todos' || t.category === selectedCategory;
    return matchesSearch && matchesType && matchesCat;
  });

  // Calculate totals
  const totalIncome = transactions
    .filter(t => t.type === 'Receita')
    .reduce((acc, t) => acc + t.amount, 0);
  const totalExpense = transactions
    .filter(t => t.type === 'Despesa')
    .reduce((acc, t) => acc + t.amount, 0);
  const balance = totalIncome - totalExpense;

  // Chart data extraction (categorized totals)
  const categoryTotals: { [key: string]: number } = {};
  transactions.forEach(t => {
    categoryTotals[t.category] = (categoryTotals[t.category] || 0) + t.amount;
  });

  // Unique categories for filters
  const uniqueCategories = ['Todos', ...Array.from(new Set(transactions.map(t => t.category)))];

  // Render hand-crafted gorgeous SVG Chart showing Income vs Expenses
  const maxVal = Math.max(totalIncome, totalExpense) || 1;
  const incomeHeight = (totalIncome / maxVal) * 120;
  const expenseHeight = (totalExpense / maxVal) * 120;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h2 id="finance-section-title" className="text-sm font-bold text-slate-800 uppercase tracking-wide border-l-4 border-amber-500 pl-2">
            Gestão Financeira & Fluxo de Caixa
          </h2>
          <p className="text-slate-500 text-xs mt-1">Monitore todas as entradas de medição e as saídas operacionais de campo de forma integrada.</p>
        </div>
        <button
          onClick={() => setShowAddForm(!showAddForm)}
          className="flex items-center gap-2 bg-amber-500 hover:bg-amber-600 text-white font-bold px-3 py-1.5 rounded text-[11px] uppercase tracking-wider shadow-sm transition-all cursor-pointer"
        >
          <Plus className="h-3.5 w-3.5" />
          <span>{showAddForm ? 'Voltar para Lançamentos' : 'Novo Lançamento Financeiro'}</span>
        </button>
      </div>

      {/* Cashflow Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        
        {/* Balance Card */}
        <div className="bg-white rounded-2xl p-5 border border-slate-200 shadow-sm flex items-center gap-4">
          <div className="p-3.5 bg-slate-900 rounded-xl text-amber-400">
            <DollarSign className="h-5 w-5" />
          </div>
          <div>
            <span className="text-[10px] uppercase font-bold tracking-wider text-slate-400 font-sans block">Balanço Acumulado</span>
            <p className={`text-xl font-bold font-mono tracking-tight ${balance >= 0 ? 'text-emerald-600' : 'text-red-500'}`}>
              {balance.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}
            </p>
          </div>
        </div>

        {/* Total Income */}
        <div className="bg-white rounded-2xl p-5 border border-slate-200 shadow-sm flex items-center gap-4">
          <div className="p-3.5 bg-emerald-50 rounded-xl text-emerald-600 border border-emerald-100">
            <TrendingUp className="h-5 w-5" />
          </div>
          <div>
            <span className="text-[10px] uppercase font-bold tracking-wider text-emerald-600 font-sans block">Total de Receitas (Entradas)</span>
            <p className="text-xl font-bold font-mono tracking-tight text-slate-800">
              {totalIncome.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}
            </p>
          </div>
        </div>

        {/* Total Expense */}
        <div className="bg-white rounded-2xl p-5 border border-slate-200 shadow-sm flex items-center gap-4">
          <div className="p-3.5 bg-red-50 rounded-xl text-red-500 border border-red-100">
            <TrendingDown className="h-5 w-5" />
          </div>
          <div>
            <span className="text-[10px] uppercase font-bold tracking-wider text-red-500 font-sans block">Total de Despesas (Saídas)</span>
            <p className="text-xl font-bold font-mono tracking-tight text-slate-800">
              {totalExpense.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}
            </p>
          </div>
        </div>

      </div>

      {showAddForm ? (
        /* TRANSACTION ADDING SCREEN */
        <div className="bg-white rounded-xl p-6 shadow-sm border border-slate-100 animate-fadeIn">
          <h3 className="text-sm font-bold text-slate-800 mb-4 pb-2 border-b border-slate-100 flex items-center gap-1.5">
            <PlusCircle className="h-5 w-5 text-amber-600" />
            <span>Registrar Movimentação de Caixa</span>
          </h3>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label className="block text-xs font-semibold text-slate-500 mb-1">Tipo de Lançamento</label>
                <div className="flex bg-slate-50 p-1 rounded-lg border border-slate-200">
                  <button
                    type="button"
                    onClick={() => {
                      setType('Receita');
                      setCategory('Clientes');
                    }}
                    className={`grow text-xs font-bold py-2 rounded-md transition-all ${
                      type === 'Receita' ? 'bg-emerald-600 text-white shadow-sm' : 'text-slate-500 hover:bg-slate-100'
                    }`}
                  >
                    Receita (Entrada)
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      setType('Despesa');
                      setCategory('Materiais');
                    }}
                    className={`grow text-xs font-bold py-2 rounded-md transition-all ${
                      type === 'Despesa' ? 'bg-red-600 text-white shadow-sm' : 'text-slate-500 hover:bg-slate-100'
                    }`}
                  >
                    Despesa (Saída)
                  </button>
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-500 mb-1">Valor (R$) *</label>
                <input
                  type="number"
                  step="0.01"
                  required
                  value={amount}
                  onChange={(e) => setAmount(e.target.value)}
                  placeholder="Ex: 1500.00"
                  className="w-full border border-slate-200 rounded-lg p-2.5 text-xs focus:ring-1 focus:ring-amber-500 outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-500 mb-1">Data Competência</label>
                <input
                  type="date"
                  required
                  value={date}
                  onChange={(e) => setDate(e.target.value)}
                  className="w-full border border-slate-200 rounded-lg p-2.5 text-xs focus:ring-1 focus:ring-amber-500 outline-none"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-slate-500 mb-1">Categoria Operacional</label>
                {type === 'Receita' ? (
                  <select
                    value={category}
                    onChange={(e) => setCategory(e.target.value)}
                    className="w-full border border-slate-200 rounded-lg p-2.5 text-xs bg-white focus:ring-1 focus:ring-amber-500 outline-none cursor-pointer"
                  >
                    <option value="Clientes">Medição de Clientes (Contratos)</option>
                    <option value="Condomínios">Taxas Condominiais Recebidas</option>
                    <option value="Serviços">Prestação de Serviços Externos</option>
                    <option value="Outros">Aporte ou Outras Entradas</option>
                  </select>
                ) : (
                  <select
                    value={category}
                    onChange={(e) => setCategory(e.target.value)}
                    className="w-full border border-slate-200 rounded-lg p-2.5 text-xs bg-white focus:ring-1 focus:ring-amber-500 outline-none cursor-pointer"
                  >
                    <option value="Materiais">Compra de Insumos / Materiais de Construção</option>
                    <option value="Salários">Folha de Mão de Obra / Salários</option>
                    <option value="Condomínios">Água/Luz/Impostos de Condomínio</option>
                    <option value="Serviços">Locação de Equipamentos / Empreiteiras</option>
                    <option value="Outros">Despesas Gerais de Escritório</option>
                  </select>
                )}
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-500 mb-1">Descrição / Justificativa *</label>
                <input
                  type="text"
                  required
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="Ex: Pagamento da conta de energia elétrica do bloco A"
                  className="w-full border border-slate-200 rounded-lg p-2.5 text-xs focus:ring-1 focus:ring-amber-500 outline-none"
                />
              </div>
            </div>

            <div className="flex justify-end gap-2 pt-2">
              <button
                type="button"
                onClick={() => setShowAddForm(false)}
                className="bg-slate-100 hover:bg-slate-200 text-slate-700 px-4 py-2.5 rounded-lg text-xs font-semibold transition-colors cursor-pointer"
              >
                Cancelar
              </button>
              <button
                type="submit"
                className="bg-amber-600 hover:bg-amber-700 text-white px-5 py-2.5 rounded-lg text-xs font-semibold shadow-sm transition-colors cursor-pointer"
              >
                Registrar Lançamento
              </button>
            </div>
          </form>
        </div>
      ) : (
        /* FINANCIAL CHART & HISTORY GRID */
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 animate-fadeIn">
          
          {/* Interactive Custom SVG Chart (visual ratio) */}
          <div className="bg-white rounded-2xl p-5 shadow-sm border border-slate-200 lg:col-span-4 flex flex-col justify-between">
            <div>
              <h3 className="font-bold text-slate-800 text-xs uppercase tracking-wider pb-2 border-b border-slate-100 flex items-center gap-1.5 border-l-4 border-emerald-500 pl-2">
                Gráfico de Fluxo Operacional
              </h3>
              <p className="text-slate-400 text-[10px] mt-2 font-medium">Distribuição proporcional acumulada das Receitas e Despesas.</p>
            </div>

            {/* Custom SVG Visualizer */}
            <div className="flex justify-around items-end h-44 pb-3 pt-6 border-b border-slate-100">
              {/* Receitas bar */}
              <div className="flex flex-col items-center gap-2 group cursor-pointer animate-none">
                <span className="text-[10px] font-mono font-bold text-emerald-600">
                  {totalIncome.toLocaleString('pt-BR', { maximumFractionDigits: 0 })}
                </span>
                <div 
                  style={{ height: `${incomeHeight}px` }} 
                  className="w-16 bg-gradient-to-t from-emerald-600 to-emerald-400 rounded transition-all group-hover:opacity-90 shadow-sm"
                />
                <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wide">Receitas</span>
              </div>

              {/* Despesas bar */}
              <div className="flex flex-col items-center gap-2 group cursor-pointer animate-none">
                <span className="text-[10px] font-mono font-bold text-red-500">
                  {totalExpense.toLocaleString('pt-BR', { maximumFractionDigits: 0 })}
                </span>
                <div 
                  style={{ height: `${expenseHeight}px` }} 
                  className="w-16 bg-gradient-to-t from-red-500 to-red-400 rounded transition-all group-hover:opacity-90 shadow-sm"
                />
                <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wide">Despesas</span>
              </div>
            </div>

            {/* Sub-legend / Financial notice */}
            <div className="text-[11px] text-slate-500 leading-relaxed pt-2 font-medium">
              <span className="font-bold block text-slate-800 uppercase text-[9px] tracking-wider mb-1">✓ Balanço Operacional Saudável</span>
              As receitas cobrem as despesas de campo, garantindo fluxo positivo para as próximas compras de materiais.
            </div>
          </div>

          {/* Transactions List */}
          <div className="bg-white rounded-2xl p-5 shadow-sm border border-slate-200 lg:col-span-8 space-y-4">
            
            {/* Filters panel */}
            <div className="flex flex-col sm:flex-row justify-between gap-3 bg-slate-50 p-3 rounded-lg border border-slate-150">
              <div className="flex flex-wrap items-center gap-2">
                <span className="text-[10px] font-bold uppercase text-slate-400 tracking-wider">Filtro:</span>
                
                {/* Type buttons */}
                <div className="flex bg-white rounded border border-slate-200 p-0.5">
                  {(['Todos', 'Receita', 'Despesa'] as const).map(f => (
                    <button
                      key={f}
                      onClick={() => setSelectedFilter(f)}
                      className={`px-2.5 py-1 rounded text-[10px] font-semibold transition-all cursor-pointer ${
                        selectedFilter === f 
                          ? 'bg-slate-800 text-white' 
                          : 'text-slate-500 hover:bg-slate-50'
                      }`}
                    >
                      {f}
                    </button>
                  ))}
                </div>

                {/* Category select */}
                <select
                  value={selectedCategory}
                  onChange={(e) => setSelectedCategory(e.target.value)}
                  className="bg-white border border-slate-200 rounded text-[10px] font-semibold p-1 outline-none text-slate-700 cursor-pointer"
                >
                  <option value="Todos">Todas Categorias</option>
                  <option value="Clientes">Clientes (Receitas)</option>
                  <option value="Materiais">Materiais (Despesas)</option>
                  <option value="Salários">Salários (Despesas)</option>
                  <option value="Condomínios">Condomínios</option>
                  <option value="Serviços">Serviços / Locações</option>
                  <option value="Outros">Outros</option>
                </select>
              </div>

              {/* Text search */}
              <div className="flex items-center gap-1.5 bg-white border border-slate-200 rounded px-2.5 py-1 shrink-0">
                <Search className="h-3 w-3 text-slate-400" />
                <input
                  type="text"
                  placeholder="Procurar lancamento..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="bg-transparent border-none outline-none text-[10px] text-slate-600 placeholder-slate-400"
                />
              </div>
            </div>

            {/* List Table */}
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse text-xs">
                <thead>
                  <tr className="border-b border-slate-100 text-slate-400 text-[10px] font-bold uppercase tracking-wider">
                    <th className="py-2">Data</th>
                    <th className="py-2">Descrição</th>
                    <th className="py-2">Categoria</th>
                    <th className="py-2 text-right">Valor</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-50">
                  {filteredTransactions.map(t => (
                    <tr key={t.id} className="hover:bg-slate-50/40 transition-colors">
                      <td className="py-3 font-mono text-[10px] text-slate-500 shrink-0">
                        {new Date(t.date).toLocaleDateString('pt-BR')}
                      </td>
                      <td className="py-3 font-semibold text-slate-800">
                        <p>{t.description}</p>
                      </td>
                      <td className="py-3">
                        <span className="px-2 py-0.5 rounded-full text-[9px] font-semibold bg-slate-100 text-slate-600">
                          {t.category}
                        </span>
                      </td>
                      <td className={`py-3 text-right font-mono font-bold text-xs ${
                        t.type === 'Receita' ? 'text-emerald-600' : 'text-red-500'
                      }`}>
                        {t.type === 'Receita' ? '+' : '-'} {t.amount.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}
                      </td>
                    </tr>
                  ))}
                  {filteredTransactions.length === 0 && (
                    <tr>
                      <td colSpan={4} className="py-10 text-center text-slate-400">
                        Nenhum lançamento financeiro corresponde aos filtros.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>

        </div>
      )}
    </div>
  );
}
