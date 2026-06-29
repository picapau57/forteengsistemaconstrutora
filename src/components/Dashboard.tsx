import React from 'react';
import { 
  Users, 
  TrendingUp, 
  TrendingDown, 
  Package, 
  Building2, 
  FileSpreadsheet, 
  Calendar, 
  CloudSun, 
  Bell, 
  CheckCircle, 
  Clock,
  Briefcase,
  Eye
} from 'lucide-react';
import { Employee, Attendance, Material, Condo, Transaction, Project } from '../types';

interface DashboardProps {
  employees: Employee[];
  attendance: Attendance[];
  materials: Material[];
  condos: Condo[];
  transactions: Transaction[];
  projects: Project[];
  onNavigate: (tab: string) => void;
  visits?: number;
}

export default function Dashboard({ 
  employees, 
  attendance, 
  materials, 
  condos, 
  transactions,
  projects,
  onNavigate,
  visits = 642
}: DashboardProps) {
  // Calculations
  const activeEmployees = employees.filter(e => e.status === 'Ativo').length;
  
  // Projects calculation
  const activeProjects = projects.filter(p => p.status === 'Em Andamento').length;
  const totalProjects = projects.length;
  
  // Calculate average progress
  const averageProgress = projects.length > 0 
    ? Math.round(projects.reduce((acc, proj) => {
        let totalT = 0;
        let completedT = 0;
        proj.phases.forEach(ph => {
          ph.tasks.forEach(t => {
            totalT++;
            if (t.status === 'Concluído') completedT++;
          });
        });
        return acc + (totalT > 0 ? (completedT / totalT) * 100 : 0);
      }, 0) / projects.length)
    : 0;

  
  // Attendance today
  const todayStr = new Date().toISOString().split('T')[0];
  const presentToday = attendance.filter(a => a.status === 'Presente' || a.status === 'Atrasado').length;
  const attendanceRate = activeEmployees > 0 ? Math.round((presentToday / activeEmployees) * 100) : 0;

  // Low stock materials
  const lowStockItems = materials.filter(m => m.stock <= m.minStock);

  // Financial status
  const totalIncome = transactions
    .filter(t => t.type === 'Receita')
    .reduce((acc, t) => acc + t.amount, 0);
  const totalExpense = transactions
    .filter(t => t.type === 'Despesa')
    .reduce((acc, t) => acc + t.amount, 0);
  const balance = totalIncome - totalExpense;

  // Condos total balance
  const condosBalance = condos.reduce((acc, c) => acc + c.currentBalance, 0);

  // Recent 5 transactions
  const recentTransactions = [...transactions]
    .sort((a, b) => b.date.localeCompare(a.date))
    .slice(0, 4);

  return (
    <div className="space-y-6">
      {/* Welcome Banner */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center bg-white border border-slate-200 rounded-2xl p-6 text-slate-800 shadow-sm">
        <div>
          <h1 id="dashboard-title" className="text-2xl md:text-3xl font-black tracking-tight text-slate-900">Painel de Controle Construtora</h1>
          <p className="mt-1 text-slate-500 font-sans text-xs">Bem-vindo ao centro operacional. Veja o status das suas obras, equipes e finanças.</p>
        </div>
        <div className="mt-4 md:mt-0 flex items-center gap-2 bg-slate-50 border border-slate-200 px-4 py-2 rounded-xl text-xs font-mono font-bold text-slate-600">
          <Calendar className="h-4 w-4 text-amber-500" />
          <span>{new Date().toLocaleDateString('pt-BR', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}</span>
        </div>
      </div>

      {/* Operation KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
        {/* Finance card */}
        <div 
          onClick={() => onNavigate('finance')} 
          className="bg-white rounded-2xl p-5 border border-slate-200 shadow-sm transition-all hover:border-amber-500 hover:shadow-md cursor-pointer group"
          id="kpi-financial-balance"
        >
          <div className="flex justify-between items-start">
            <div className="p-3 bg-slate-50 border border-slate-150 rounded-lg text-emerald-600 group-hover:bg-emerald-50 transition-colors">
              <TrendingUp className="h-5 w-5" />
            </div>
            <span className="text-[10px] font-mono font-bold text-emerald-600 bg-emerald-50 border border-emerald-100 px-2 py-0.5 rounded-full">Saldo</span>
          </div>
          <div className="mt-4">
            <p className="text-[10px] font-bold uppercase text-slate-400 tracking-wider">Caixa Operacional</p>
            <p className={`text-2xl font-black tracking-tight mt-1 font-mono ${balance >= 0 ? 'text-slate-900' : 'text-red-600'}`}>
              {balance.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}
            </p>
            <div className="mt-2 flex items-center gap-2 text-[10px] font-bold text-slate-400">
              <span className="text-emerald-600 font-medium">+{totalIncome.toLocaleString('pt-BR', { maximumFractionDigits: 0 })}</span>
              <span>/</span>
              <span className="text-red-500 font-medium">-{totalExpense.toLocaleString('pt-BR', { maximumFractionDigits: 0 })}</span>
            </div>
          </div>
        </div>

        {/* Attendance card */}
        <div 
          onClick={() => onNavigate('employees')} 
          className="bg-white rounded-2xl p-5 border border-slate-200 shadow-sm transition-all hover:border-amber-500 hover:shadow-md cursor-pointer group"
          id="kpi-attendance"
        >
          <div className="flex justify-between items-start">
            <div className="p-3 bg-slate-50 border border-slate-150 rounded-lg text-blue-600 group-hover:bg-blue-50 transition-colors">
              <Users className="h-5 w-5" />
            </div>
            <span className="text-[10px] font-mono font-bold text-blue-600 bg-blue-50 border border-blue-100 px-2 py-0.5 rounded-full">Presença</span>
          </div>
          <div className="mt-4">
            <p className="text-[10px] font-bold uppercase text-slate-400 tracking-wider">Equipe em Campo</p>
            <p className="text-2xl font-black text-slate-900 tracking-tight mt-1 font-mono">
              {presentToday} / {activeEmployees}
            </p>
            <div className="mt-2 flex items-center gap-1.5 text-[10px] text-slate-500 font-bold">
              <div className="h-1.5 w-1.5 rounded-full bg-emerald-500 animate-pulse"></div>
              <span>{attendanceRate}% de presença hoje</span>
            </div>
          </div>
        </div>

        {/* Materials low stock card */}
        <div 
          onClick={() => onNavigate('materials')} 
          className="bg-white rounded-2xl p-5 border border-slate-200 shadow-sm transition-all hover:border-amber-500 hover:shadow-md cursor-pointer group"
          id="kpi-materials"
        >
          <div className="flex justify-between items-start">
            <div className="p-3 bg-slate-50 border border-slate-150 rounded-lg text-amber-600 group-hover:bg-amber-50 transition-colors">
              <Package className="h-5 w-5" />
            </div>
            <span className={`text-[10px] font-mono font-bold px-2.5 py-0.5 rounded-full ${lowStockItems.length > 0 ? 'bg-red-50 text-red-600 border border-red-150 animate-pulse' : 'bg-amber-50 text-amber-600 border border-amber-150'}`}>
              {lowStockItems.length > 0 ? 'Alerta' : 'Estável'}
            </span>
          </div>
          <div className="mt-4">
            <p className="text-[10px] font-bold uppercase text-slate-400 tracking-wider">Estoque de Materiais</p>
            <p className="text-2xl font-black text-slate-900 tracking-tight mt-1 font-mono">
              {materials.length} Itens
            </p>
            <p className="mt-2 text-[10px] font-bold">
              {lowStockItems.length > 0 ? (
                <span className="text-red-600 font-bold">{lowStockItems.length} materiais críticos</span>
              ) : (
                <span className="text-emerald-600 font-bold">Todos os níveis normais</span>
              )}
            </p>
          </div>
        </div>

        {/* Condos card */}
        <div 
          onClick={() => onNavigate('condos')} 
          className="bg-white rounded-2xl p-5 border border-slate-200 shadow-sm transition-all hover:border-amber-500 hover:shadow-md cursor-pointer group"
          id="kpi-condos"
        >
          <div className="flex justify-between items-start">
            <div className="p-3 bg-slate-50 border border-slate-150 rounded-lg text-purple-600 group-hover:bg-purple-50 transition-colors">
              <Building2 className="h-5 w-5" />
            </div>
            <span className="text-[10px] font-mono font-bold text-purple-600 bg-purple-50 border border-purple-100 px-2 py-0.5 rounded-full">Gestão</span>
          </div>
          <div className="mt-4">
            <p className="text-[10px] font-bold uppercase text-slate-400 tracking-wider">Fundo Condomínios</p>
            <p className="text-2xl font-black text-slate-900 tracking-tight mt-1 font-mono">
              {condosBalance.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL', maximumFractionDigits: 0 })}
            </p>
            <p className="mt-2 text-[10px] text-slate-500 font-bold">
              {condos.length} condomínios ativos
            </p>
          </div>
        </div>

        {/* Projects card */}
        <div 
          onClick={() => onNavigate('projects')} 
          className="bg-white rounded-2xl p-5 border border-slate-200 shadow-sm transition-all hover:border-amber-500 hover:shadow-md cursor-pointer group"
          id="kpi-projects"
        >
          <div className="flex justify-between items-start">
            <div className="p-3 bg-slate-50 border border-slate-150 rounded-lg text-amber-600 group-hover:bg-amber-50 transition-colors">
              <Briefcase className="h-5 w-5" />
            </div>
            <span className="text-[10px] font-mono font-bold text-amber-600 bg-amber-50 border border-amber-100 px-2 py-0.5 rounded-full">Obras</span>
          </div>
          <div className="mt-4">
            <p className="text-[10px] font-bold uppercase text-slate-400 tracking-wider">Projetos & Obras</p>
            <p className="text-2xl font-black text-slate-900 tracking-tight mt-1 font-mono">
              {activeProjects} / {totalProjects}
            </p>
            <p className="mt-2 text-[10px] text-slate-500 font-bold">
              Progresso Médio: <span className="text-amber-600 font-black">{averageProgress}%</span>
            </p>
          </div>
        </div>

        {/* Visits card */}
        <div 
          onClick={() => onNavigate('subscription')} 
          className="bg-white rounded-2xl p-5 border border-slate-200 shadow-sm transition-all hover:border-amber-500 hover:shadow-md cursor-pointer group"
          id="kpi-visits"
        >
          <div className="flex justify-between items-start">
            <div className="p-3 bg-slate-50 border border-slate-150 rounded-lg text-sky-600 group-hover:bg-sky-50 transition-colors">
              <Eye className="h-5 w-5" />
            </div>
            <span className="text-[10px] font-mono font-bold text-sky-600 bg-sky-50 border border-sky-100 px-2 py-0.5 rounded-full">Tráfego</span>
          </div>
          <div className="mt-4">
            <p className="text-[10px] font-bold uppercase text-slate-400 tracking-wider">Acessos Totais</p>
            <p className="text-2xl font-black text-slate-900 tracking-tight mt-1 font-mono">
              {visits}
            </p>
            <p className="mt-2 text-[10px] text-slate-500 font-bold flex items-center gap-1.5">
              <span className="h-1.5 w-1.5 rounded-full bg-emerald-500 animate-pulse"></span>
              <span>Monitoramento Ativo</span>
            </p>
          </div>
        </div>
      </div>

      {/* Weather, Alerts, and Low stock warnings */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Weather advisory widget for site works */}
        <div className="bg-white rounded-2xl p-6 shadow-sm border border-slate-200 space-y-4 lg:col-span-1">
          <div className="flex justify-between items-center pb-3 border-b border-slate-100">
            <h3 className="font-bold text-slate-800 uppercase tracking-wide border-l-4 border-amber-500 pl-2 text-xs">
              Status Meteorológico
            </h3>
            <span className="text-[10px] text-amber-700 font-bold bg-amber-50 border border-amber-100 px-2 py-0.5 rounded">São Paulo</span>
          </div>
          
          <div className="space-y-4">
            <div className="flex items-center gap-4 bg-slate-50 border border-slate-150 p-3 rounded-lg">
              <div className="text-3xl font-black font-mono text-slate-800">24°C</div>
              <div className="text-xs text-slate-500">
                <p className="font-bold text-slate-700">Parcialmente Nublado</p>
                <p>Humidade: 62% • Vento: 12km/h</p>
                <p className="text-emerald-600 font-bold mt-0.5 font-sans">✓ Condição ótima para concretagem</p>
              </div>
            </div>

            <div className="space-y-2">
              <h4 className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Alertas operacionais por obra</h4>
              
              <div className="border-l-2 border-emerald-500 pl-3 py-1">
                <p className="text-xs font-bold text-slate-700">Obra Residencial Alvorada</p>
                <p className="text-[11px] text-slate-500 font-medium">Fundação em andamento. Liberação de serviço normal para terraplanagem hoje.</p>
              </div>

              <div className="border-l-2 border-amber-500 pl-3 py-1">
                <p className="text-xs font-bold text-slate-700">Condomínio Vista Alegre (Torre C)</p>
                <p className="text-[11px] text-slate-500 font-medium">Pintura externa suspensa temporariamente devido a rajadas de vento no topo.</p>
              </div>
            </div>
          </div>
        </div>

        {/* Low inventory alert list */}
        <div className="bg-white rounded-2xl p-6 shadow-sm border border-slate-200 space-y-4 lg:col-span-1">
          <div className="flex justify-between items-center pb-3 border-b border-slate-100">
            <h3 className="font-bold text-slate-800 uppercase tracking-wide border-l-4 border-red-500 pl-2 text-xs">
              Estoque de Materiais Crítico
            </h3>
            {lowStockItems.length > 0 && (
              <span className="text-[10px] font-mono font-bold text-red-600 bg-red-50 border border-red-150 px-2 py-0.5 rounded-full animate-pulse">
                {lowStockItems.length} Alertas
              </span>
            )}
          </div>

          <div className="space-y-3 max-h-[220px] overflow-y-auto pr-1">
            {lowStockItems.length === 0 ? (
              <div className="text-center py-8 text-slate-400 text-xs font-semibold">
                <CheckCircle className="h-8 w-8 text-emerald-500 mx-auto mb-2" />
                Nenhum material abaixo do estoque mínimo.
              </div>
            ) : (
              lowStockItems.map(item => {
                const percent = Math.round((item.stock / item.minStock) * 100);
                return (
                  <div key={item.id} className="p-3 bg-red-50/40 rounded-lg border border-red-100 flex justify-between items-center animate-none">
                    <div>
                      <p className="text-xs font-bold text-slate-800">{item.name}</p>
                      <p className="text-[10px] text-slate-500">
                        Estoque: <span className="text-red-600 font-bold">{item.stock} {item.unit}</span> (Mín: {item.minStock})
                      </p>
                    </div>
                    <div className="text-right">
                      <span className="text-[10px] font-mono font-bold text-red-700 bg-red-100 border border-red-200 px-2 py-0.5 rounded">
                        {percent}%
                      </span>
                    </div>
                  </div>
                );
              })
            )}
          </div>
          {lowStockItems.length > 0 && (
            <button 
              onClick={() => onNavigate('materials')}
              className="w-full text-center text-xs font-bold text-amber-600 hover:text-amber-700 py-2 border border-dashed border-amber-200 hover:border-amber-400 rounded-lg transition-all cursor-pointer"
            >
              Comprar / Abastecer Estoque
            </button>
          )}
        </div>

        {/* Recent Transactions & Invoices overview */}
        <div className="bg-white rounded-2xl p-6 shadow-sm border border-slate-200 space-y-4 lg:col-span-1">
          <div className="flex justify-between items-center pb-3 border-b border-slate-100">
            <h3 className="font-bold text-slate-800 uppercase tracking-wide border-l-4 border-emerald-500 pl-2 text-xs">
              Lançamentos Recentes
            </h3>
            <button 
              onClick={() => onNavigate('finance')}
              className="text-[11px] text-amber-600 hover:underline font-bold uppercase tracking-wider cursor-pointer"
            >
              Ver Tudo
            </button>
          </div>

          <div className="space-y-3">
            {recentTransactions.map(trans => (
              <div key={trans.id} className="flex justify-between items-center text-xs p-2 rounded-lg border border-transparent hover:bg-slate-50 hover:border-slate-150 transition-all">
                <div className="space-y-0.5">
                  <p className="font-bold text-slate-800">{trans.description}</p>
                  <p className="text-[10px] text-slate-400 font-medium">{new Date(trans.date).toLocaleDateString('pt-BR')} • {trans.category}</p>
                </div>
                <span className={`font-mono font-bold text-xs ${trans.type === 'Receita' ? 'text-emerald-600' : 'text-red-500'}`}>
                  {trans.type === 'Receita' ? '+' : '-'} {trans.amount.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}
                </span>
              </div>
            ))}
          </div>
        </div>

      </div>

      {/* Quick Action Station */}
      <div className="bg-white rounded-2xl p-6 shadow-sm border border-slate-200">
        <h3 className="font-bold text-slate-800 mb-4 border-l-4 border-slate-900 pl-2 text-xs uppercase tracking-wide">
          Acesso Rápido às Funcionalidades
        </h3>
        <div className="grid grid-cols-2 md:grid-cols-6 gap-3">
          <button 
            onClick={() => onNavigate('attendance-clock')}
            className="p-4 bg-white hover:bg-slate-50 rounded-xl border border-slate-200 text-center transition-all group cursor-pointer"
          >
            <Clock className="h-5 w-5 text-amber-600 mx-auto mb-2 group-hover:scale-110 transition-transform animate-none" />
            <span className="text-xs font-bold text-slate-800 block">Marcador de Ponto</span>
            <span className="text-[10px] text-slate-400 block mt-0.5 font-medium">Uso dos operários</span>
          </button>

          <button 
            onClick={() => onNavigate('budgets')}
            className="p-4 bg-white hover:bg-slate-50 rounded-xl border border-slate-200 text-center transition-all group cursor-pointer"
          >
            <FileSpreadsheet className="h-5 w-5 text-indigo-600 mx-auto mb-2 group-hover:scale-110 transition-transform animate-none" />
            <span className="text-xs font-bold text-slate-800 block">Novo Orçamento</span>
            <span className="text-[10px] text-slate-400 block mt-0.5 font-medium">Gerador estruturado</span>
          </button>

          <button 
            onClick={() => onNavigate('employees')}
            className="p-4 bg-white hover:bg-slate-50 rounded-xl border border-slate-200 text-center transition-all group cursor-pointer"
          >
            <Users className="h-5 w-5 text-teal-600 mx-auto mb-2 group-hover:scale-110 transition-transform animate-none" />
            <span className="text-xs font-bold text-slate-800 block">Funcionários</span>
            <span className="text-[10px] text-slate-400 block mt-0.5 font-medium">Ficha cadastral</span>
          </button>

          <button 
            onClick={() => onNavigate('condos')}
            className="p-4 bg-white hover:bg-slate-50 rounded-xl border border-slate-200 text-center transition-all group cursor-pointer"
          >
            <Building2 className="h-5 w-5 text-purple-600 mx-auto mb-2 group-hover:scale-110 transition-transform animate-none" />
            <span className="text-xs font-bold text-slate-800 block">Condomínios</span>
            <span className="text-[10px] text-slate-400 block mt-0.5 font-medium">Contas de consumo</span>
          </button>

          <button 
            onClick={() => onNavigate('materials')}
            className="p-4 bg-white hover:bg-slate-50 rounded-xl border border-slate-200 text-center transition-all group cursor-pointer"
          >
            <Package className="h-5 w-5 text-sky-600 mx-auto mb-2 group-hover:scale-110 transition-transform animate-none" />
            <span className="text-xs font-bold text-slate-800 block">Inventário</span>
            <span className="text-[10px] text-slate-400 block mt-0.5 font-medium">Estoque e custos</span>
          </button>

          <button 
            onClick={() => onNavigate('projects')}
            className="p-4 bg-white hover:bg-slate-50 rounded-xl border border-slate-200 text-center transition-all group cursor-pointer col-span-2 md:col-span-1"
          >
            <Briefcase className="h-5 w-5 text-amber-500 mx-auto mb-2 group-hover:scale-110 transition-transform animate-none" />
            <span className="text-xs font-bold text-slate-800 block">Gestão de Obras</span>
            <span className="text-[10px] text-slate-400 block mt-0.5 font-medium">Fases e cronograma</span>
          </button>
        </div>
      </div>
    </div>
  );
}
