import React, { useState, useEffect } from 'react';
import { 
  Building2, 
  Users, 
  Clock, 
  Package, 
  FileText, 
  DollarSign, 
  LayoutDashboard, 
  Menu, 
  X,
  Compass,
  Briefcase,
  DatabaseBackup,
  UserCheck,
  Sparkles
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

// Subcomponents
import Dashboard from './components/Dashboard';
import Employees from './components/Employees';
import AttendanceClock from './components/AttendanceClock';
import Clients from './components/Clients';
import Materials from './components/Materials';
import Budgets from './components/Budgets';
import Finance from './components/Finance';
import Condos from './components/Condos';
import Projects from './components/Projects';
import Plans from './components/Plans';

// Types and mock data
import { Employee, Attendance, Client, Material, Budget, Transaction, Condo, CondoBill, Project, Subscription } from './types';
import { 
  INITIAL_EMPLOYEES, 
  INITIAL_ATTENDANCE, 
  INITIAL_CLIENTS, 
  INITIAL_MATERIALS, 
  INITIAL_BUDGETS, 
  INITIAL_TRANSACTIONS, 
  INITIAL_CONDOS, 
  INITIAL_CONDO_BILLS,
  INITIAL_PROJECTS
} from './data/mockData';

export default function App() {
  const [activeTab, setActiveTab] = useState('dashboard');
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  // States initialized from local storage or defaults
  const [employees, setEmployees] = useState<Employee[]>(() => {
    const saved = localStorage.getItem('const_employees');
    return saved ? JSON.parse(saved) : INITIAL_EMPLOYEES;
  });

  const [attendance, setAttendance] = useState<Attendance[]>(() => {
    const saved = localStorage.getItem('const_attendance');
    return saved ? JSON.parse(saved) : INITIAL_ATTENDANCE;
  });

  const [clients, setClients] = useState<Client[]>(() => {
    const saved = localStorage.getItem('const_clients');
    return saved ? JSON.parse(saved) : INITIAL_CLIENTS;
  });

  const [materials, setMaterials] = useState<Material[]>(() => {
    const saved = localStorage.getItem('const_materials');
    return saved ? JSON.parse(saved) : INITIAL_MATERIALS;
  });

  const [budgets, setBudgets] = useState<Budget[]>(() => {
    const saved = localStorage.getItem('const_budgets');
    return saved ? JSON.parse(saved) : INITIAL_BUDGETS;
  });

  const [transactions, setTransactions] = useState<Transaction[]>(() => {
    const saved = localStorage.getItem('const_transactions');
    return saved ? JSON.parse(saved) : INITIAL_TRANSACTIONS;
  });

  const [condos, setCondos] = useState<Condo[]>(() => {
    const saved = localStorage.getItem('const_condos');
    return saved ? JSON.parse(saved) : INITIAL_CONDOS;
  });

  const [condoBills, setCondoBills] = useState<CondoBill[]>(() => {
    const saved = localStorage.getItem('const_condobills');
    return saved ? JSON.parse(saved) : INITIAL_CONDO_BILLS;
  });

  const [projects, setProjects] = useState<Project[]>(() => {
    const saved = localStorage.getItem('const_projects');
    return saved ? JSON.parse(saved) : INITIAL_PROJECTS;
  });

  const [subscription, setSubscription] = useState<Subscription>(() => {
    const saved = localStorage.getItem('const_subscription');
    if (saved) return JSON.parse(saved);
    return {
      status: 'Trial',
      trialStartDate: new Date().toISOString().split('T')[0],
      trialDaysRemaining: 7
    };
  });

  // Persist state updates to localStorage
  useEffect(() => {
    localStorage.setItem('const_employees', JSON.stringify(employees));
  }, [employees]);

  useEffect(() => {
    localStorage.setItem('const_attendance', JSON.stringify(attendance));
  }, [attendance]);

  useEffect(() => {
    localStorage.setItem('const_clients', JSON.stringify(clients));
  }, [clients]);

  useEffect(() => {
    localStorage.setItem('const_materials', JSON.stringify(materials));
  }, [materials]);

  useEffect(() => {
    localStorage.setItem('const_budgets', JSON.stringify(budgets));
  }, [budgets]);

  useEffect(() => {
    localStorage.setItem('const_transactions', JSON.stringify(transactions));
  }, [transactions]);

  useEffect(() => {
    localStorage.setItem('const_condos', JSON.stringify(condos));
  }, [condos]);

  useEffect(() => {
    localStorage.setItem('const_condobills', JSON.stringify(condoBills));
  }, [condoBills]);

  useEffect(() => {
    localStorage.setItem('const_projects', JSON.stringify(projects));
  }, [projects]);

  useEffect(() => {
    localStorage.setItem('const_subscription', JSON.stringify(subscription));
  }, [subscription]);

  // Operations handlers
  const handleAddEmployee = (emp: Omit<Employee, 'id'>) => {
    const newEmp: Employee = {
      ...emp,
      id: `emp-${Date.now()}`
    };
    setEmployees(prev => [newEmp, ...prev]);
  };

  const handleUpdateEmployee = (emp: Employee) => {
    setEmployees(prev => prev.map(e => e.id === emp.id ? emp : e));
  };

  // Punch clock event
  const handleClockEvent = (employeeId: string, location: string, eventType: 'in' | 'out') => {
    const todayStr = new Date().toISOString().split('T')[0];
    const timeStr = new Date().toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' });
    const employee = employees.find(e => e.id === employeeId);
    if (!employee) return;

    if (eventType === 'in') {
      // Check if they already have an active check in today
      const alreadyIn = attendance.find(a => a.employeeId === employeeId && a.date === todayStr);
      if (alreadyIn) {
        // Just update clockIn
        setAttendance(prev => prev.map(a => a.id === alreadyIn.id ? { ...a, clockIn: timeStr, status: 'Presente' } : a));
      } else {
        // Create new log
        const newAtt: Attendance = {
          id: `att-${Date.now()}`,
          employeeId,
          employeeName: employee.name,
          date: todayStr,
          clockIn: timeStr,
          status: parseInt(timeStr.replace(':', '')) > 800 ? 'Atrasado' : 'Presente',
          location,
          gpsCoords: location.includes('Alvorada') ? { lat: -23.55052, lng: -46.633308 } : { lat: -23.55160, lng: -46.63450 }
        };
        setAttendance(prev => [newAtt, ...prev]);
      }
    } else {
      // Clock out: find today's entry
      const todayEntry = attendance.find(a => a.employeeId === employeeId && a.date === todayStr);
      if (todayEntry) {
        setAttendance(prev => prev.map(a => a.id === todayEntry.id ? { ...a, clockOut: timeStr } : a));
      } else {
        // Create an entry that is immediately clocked out
        const newAtt: Attendance = {
          id: `att-${Date.now()}`,
          employeeId,
          employeeName: employee.name,
          date: todayStr,
          clockOut: timeStr,
          status: 'Presente',
          location,
          gpsCoords: { lat: -23.55052, lng: -46.633308 }
        };
        setAttendance(prev => [newAtt, ...prev]);
      }
    }
  };

  const handleAddClient = (cli: Omit<Client, 'id'>) => {
    const newCli: Client = {
      ...cli,
      id: `cli-${Date.now()}`
    };
    setClients(prev => [newCli, ...prev]);
  };

  const handleUpdateClient = (cli: Client) => {
    setClients(prev => prev.map(c => c.id === cli.id ? cli : c));
  };

  const handleAddMaterial = (mat: Omit<Material, 'id'>) => {
    const newMat: Material = {
      ...mat,
      id: `mat-${Date.now()}`
    };
    setMaterials(prev => [newMat, ...prev]);
  };

  const handleUpdateMaterial = (mat: Material) => {
    setMaterials(prev => prev.map(m => m.id === mat.id ? mat : m));
  };

  // Budget creating / accepting
  const handleAddBudget = (bud: Omit<Budget, 'id'>) => {
    const newBud: Budget = {
      ...bud,
      id: `orc-${100 + budgets.length + 1}`
    };
    setBudgets(prev => [newBud, ...prev]);
  };

  const handleUpdateBudget = (bud: Budget) => {
    setBudgets(prev => prev.map(b => b.id === bud.id ? bud : b));

    // If budget is newly approved, trigger material consumption & financial revenue!
    const oldBudget = budgets.find(b => b.id === bud.id);
    if (oldBudget && oldBudget.status !== 'Aprovado' && bud.status === 'Aprovado') {
      // 1. Subtract materials from stock
      setMaterials(prevMaterials => {
        return prevMaterials.map(mat => {
          const consumed = bud.items.find(item => item.materialId === mat.id);
          if (consumed) {
            return {
              ...mat,
              stock: Math.max(0, mat.stock - consumed.quantity)
            };
          }
          return mat;
        });
      });

      // 2. Post financial revenue transaction
      const newTransaction: Transaction = {
        id: `tr-${Date.now()}`,
        type: 'Receita',
        category: 'Clientes',
        amount: bud.totalAmount,
        date: new Date().toISOString().split('T')[0],
        description: `Contrato Aprovado - ${bud.projectName} (${bud.clientName})`,
        referenceId: bud.clientId
      };
      setTransactions(prev => [newTransaction, ...prev]);
    }
  };

  const handleAddTransaction = (t: Omit<Transaction, 'id'>) => {
    const newT: Transaction = {
      ...t,
      id: `tr-${Date.now()}`
    };
    setTransactions(prev => [newT, ...prev]);
  };

  const handleAddCondo = (condo: Omit<Condo, 'id'>) => {
    const newCondo: Condo = {
      ...condo,
      id: `cond-${Date.now()}`
    };
    setCondos(prev => [...prev, newCondo]);
  };

  const handleUpdateCondo = (condo: Condo) => {
    setCondos(prev => prev.map(c => c.id === condo.id ? condo : c));
  };

  const handleAddCondoBill = (bill: Omit<CondoBill, 'id'>) => {
    const newBill: CondoBill = {
      ...bill,
      id: `cb-${Date.now()}`
    };
    setCondoBills(prev => [newBill, ...prev]);
  };

  // Pay Condo Bill
  const handlePayCondoBill = (billId: string) => {
    const bill = condoBills.find(b => b.id === billId);
    if (!bill) return;

    // 1. Mark bill as Paid
    setCondoBills(prev => prev.map(b => b.id === billId ? { ...b, status: 'Pago' } : b));

    // 2. Subtract amount from condo current balance
    setCondos(prev => prev.map(c => {
      if (c.id === bill.condoId) {
        return {
          ...c,
          currentBalance: c.currentBalance - bill.amount
        };
      }
      return c;
    }));

    // 3. Log central accounting despesa
    const newTransaction: Transaction = {
      id: `tr-${Date.now()}`,
      type: 'Despesa',
      category: 'Condomínios',
      amount: bill.amount,
      date: new Date().toISOString().split('T')[0],
      description: `Liquidação Fatura ${bill.type} (${bill.billingMonth}) - ${bill.condoName}`,
      referenceId: bill.condoId
    };
    setTransactions(prev => [newTransaction, ...prev]);
  };

  const handleAddProject = (proj: Omit<Project, 'id' | 'phases' | 'allocatedEmployees' | 'allocatedMaterials'>) => {
    const newProj: Project = {
      ...proj,
      id: `proj-${Date.now()}`,
      allocatedEmployees: [],
      allocatedMaterials: [],
      phases: [
        {
          id: `phase-${Date.now()}-1`,
          name: 'Fundação',
          tasks: []
        },
        {
          id: `phase-${Date.now()}-2`,
          name: 'Estrutura',
          tasks: []
        },
        {
          id: `phase-${Date.now()}-3`,
          name: 'Acabamento',
          tasks: []
        }
      ]
    };
    setProjects(prev => [newProj, ...prev]);
  };

  const handleUpdateProject = (proj: Project) => {
    setProjects(prev => prev.map(p => p.id === proj.id ? proj : p));
  };

  const handleDeleteProject = (projectId: string) => {
    setProjects(prev => prev.filter(p => p.id !== projectId));
  };

  const handleUpdateSubscription = (sub: Subscription) => {
    setSubscription(sub);
  };

  const handleResetData = () => {
    const confirmReset = window.confirm('Tem certeza de que deseja restaurar as configurações originais de fábrica? Isso limpará todas as suas edições locais.');
    if (confirmReset) {
      localStorage.clear();
      window.location.reload();
    }
  };

  // Navigation Links
  const navigationItems = [
    { id: 'dashboard', label: 'Painel', icon: LayoutDashboard },
    { id: 'employees', label: 'Funcionários', icon: Users },
    { id: 'attendance-clock', label: 'Marcador de Ponto', icon: Clock },
    { id: 'projects', label: 'Projetos & Obras', icon: Briefcase },
    { id: 'clients', label: 'Clientes', icon: UserCheck },
    { id: 'materials', label: 'Materiais', icon: Package },
    { id: 'budgets', label: 'Orçamentos', icon: FileText },
    { id: 'finance', label: 'Financeiro', icon: DollarSign },
    { id: 'condos', label: 'Condomínios', icon: Building2 },
    { id: 'subscription', label: 'Planos & Teste', icon: Sparkles },
  ];

  return (
    <div className="min-h-screen bg-slate-100 flex flex-col md:flex-row antialiased">
      
      {/* MOBILE HEADER */}
      <header className="md:hidden bg-slate-900 text-white px-4 py-3 flex items-center justify-between border-b border-slate-800">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 bg-amber-500 flex items-center justify-center font-bold text-slate-900 rounded">F</div>
          <span className="font-bold tracking-tight text-sm uppercase italic text-white">FORTE ENGENHARIA</span>
        </div>
        <button 
          onClick={() => setIsSidebarOpen(!isSidebarOpen)}
          className="p-1 hover:bg-slate-800 rounded transition-colors"
        >
          {isSidebarOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
        </button>
      </header>

      {/* SIDEBAR NAVIGATION */}
      <aside className={`
        fixed inset-y-0 left-0 z-50 w-64 bg-slate-900 text-slate-300 flex flex-col justify-between transition-transform duration-300 ease-in-out border-r border-slate-800 shrink-0
        md:translate-x-0 md:static
        ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full'}
      `}>
        <div className="flex-1 flex flex-col min-h-0 overflow-y-auto">
          {/* Logo Brand */}
          <div className="p-6 border-b border-slate-800">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 bg-amber-500 flex items-center justify-center font-bold text-slate-900 rounded">F</div>
              <span className="text-lg font-bold text-white tracking-tight italic">FORTE ENG</span>
            </div>
          </div>

          {/* Navigation Links Grid with Categorization */}
          <nav className="p-4 space-y-4">
            <div>
              <div className="text-[10px] font-semibold text-slate-500 uppercase tracking-widest px-3 mb-2">Operacional</div>
              <div className="space-y-1">
                {navigationItems.slice(0, 3).map(item => {
                  const isActive = activeTab === item.id;
                  const Icon = item.icon;
                  return (
                    <button
                      key={item.id}
                      onClick={() => {
                        setActiveTab(item.id);
                        setIsSidebarOpen(false);
                      }}
                      className={`w-full flex items-center gap-3 px-3 py-2 rounded-md text-xs font-semibold transition-all cursor-pointer ${
                        isActive 
                          ? 'bg-slate-800 text-amber-400 shadow-sm' 
                          : 'text-slate-400 hover:text-white hover:bg-slate-800'
                      }`}
                    >
                      <Icon className={`h-4 w-4 shrink-0 ${isActive ? 'text-amber-400' : 'text-slate-500'}`} />
                      <span>{item.label}</span>
                    </button>
                  );
                })}
              </div>
            </div>

            <div>
              <div className="text-[10px] font-semibold text-slate-500 uppercase tracking-widest px-3 mb-2">Gestão</div>
              <div className="space-y-1">
                {navigationItems.slice(3, 9).map(item => {
                  const isActive = activeTab === item.id;
                  const Icon = item.icon;
                  return (
                    <button
                      key={item.id}
                      onClick={() => {
                        setActiveTab(item.id);
                        setIsSidebarOpen(false);
                      }}
                      className={`w-full flex items-center gap-3 px-3 py-2 rounded-md text-xs font-semibold transition-all cursor-pointer ${
                        isActive 
                          ? 'bg-slate-800 text-amber-400 shadow-sm' 
                          : 'text-slate-400 hover:text-white hover:bg-slate-800'
                      }`}
                    >
                      <Icon className={`h-4 w-4 shrink-0 ${isActive ? 'text-amber-400' : 'text-slate-500'}`} />
                      <span>{item.label}</span>
                    </button>
                  );
                })}
              </div>
            </div>

            <div>
              <div className="text-[10px] font-semibold text-slate-500 uppercase tracking-widest px-3 mb-2">Faturamento</div>
              <div className="space-y-1">
                {navigationItems.slice(9).map(item => {
                  const isActive = activeTab === item.id;
                  const Icon = item.icon;
                  return (
                    <button
                      key={item.id}
                      onClick={() => {
                        setActiveTab(item.id);
                        setIsSidebarOpen(false);
                      }}
                      className={`w-full flex items-center gap-3 px-3 py-2 rounded-md text-xs font-semibold transition-all cursor-pointer ${
                        isActive 
                          ? 'bg-slate-800 text-amber-400 shadow-sm' 
                          : 'text-slate-400 hover:text-white hover:bg-slate-800'
                      }`}
                    >
                      <Icon className={`h-4 w-4 shrink-0 ${isActive ? 'text-amber-400' : 'text-slate-500'}`} />
                      <span>{item.label}</span>
                    </button>
                  );
                })}
              </div>
            </div>
          </nav>
        </div>

        {/* Sidebar Footer with Executive profile card */}
        <div className="border-t border-slate-800 bg-slate-900/50">
          <div className="p-4 border-b border-slate-800/60">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-slate-800 border border-slate-700 flex items-center justify-center text-xs font-bold text-amber-500">
                ADM
              </div>
              <div>
                <p className="text-xs font-bold text-white">Ricardo Oliveira</p>
                <p className="text-[10px] text-slate-500">Diretor de Obras</p>
              </div>
            </div>
          </div>

          {/* Reset and license button */}
          <div className="p-3 bg-slate-950/20 flex flex-col gap-2">
            <div className="flex items-center gap-2 p-2 bg-slate-900/60 rounded border border-slate-800/50">
              <Sparkles className="h-3.5 w-3.5 text-amber-500 animate-pulse" />
              <div className="text-[10px] font-mono leading-normal text-slate-400">
                <span>Licença: </span>
                <span className="text-amber-400 font-bold">
                  {subscription.status === 'Trial' ? `${subscription.trialDaysRemaining} Dias de Teste` : subscription.plan}
                </span>
              </div>
            </div>

            <div className="flex items-center gap-2 p-2 bg-slate-900/60 rounded border border-slate-800/50">
              <Compass className="h-3.5 w-3.5 text-emerald-500" />
              <div className="text-[10px] font-mono leading-normal text-slate-400">
                <span>Sinal: </span>
                <span className="text-emerald-400 font-bold">Operacional</span>
              </div>
            </div>
            
            <button
              onClick={handleResetData}
              className="w-full flex items-center justify-center gap-1.5 py-1.5 hover:bg-slate-800 text-slate-500 hover:text-red-400 text-[10px] font-bold uppercase tracking-wider rounded transition-all cursor-pointer border border-dashed border-slate-800 hover:border-red-900/40"
            >
              <DatabaseBackup className="h-3.5 w-3.5" />
              <span>Restaurar Padrão</span>
            </button>
          </div>
        </div>
      </aside>

      {/* SIDEBAR BACKDROP FOR MOBILE */}
      {isSidebarOpen && (
        <div 
          onClick={() => setIsSidebarOpen(false)}
          className="fixed inset-0 bg-black/40 z-40 md:hidden animate-fadeIn"
        />
      )}

      {/* MAIN BODY AREA */}
      <main className="grow overflow-y-auto p-4 md:p-8 space-y-6">
        
        {/* Render Tab Screens with subtle animations */}
        <AnimatePresence mode="wait">
          <motion.div
            key={activeTab}
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            transition={{ duration: 0.15 }}
          >
            {activeTab === 'dashboard' && (
              <Dashboard 
                employees={employees}
                attendance={attendance}
                materials={materials}
                condos={condos}
                transactions={transactions}
                projects={projects}
                onNavigate={(tab) => setActiveTab(tab)}
              />
            )}

            {activeTab === 'employees' && (
              <Employees 
                employees={employees}
                attendance={attendance}
                onAddEmployee={handleAddEmployee}
                onUpdateEmployee={handleUpdateEmployee}
              />
            )}

            {activeTab === 'attendance-clock' && (
              <AttendanceClock 
                employees={employees}
                attendance={attendance}
                onClockEvent={handleClockEvent}
              />
            )}

            {activeTab === 'clients' && (
              <Clients 
                clients={clients}
                onAddClient={handleAddClient}
                onUpdateClient={handleUpdateClient}
              />
            )}

            {activeTab === 'materials' && (
              <Materials 
                materials={materials}
                onAddMaterial={handleAddMaterial}
                onUpdateMaterial={handleUpdateMaterial}
              />
            )}

            {activeTab === 'budgets' && (
              <Budgets 
                budgets={budgets}
                clients={clients}
                materials={materials}
                onAddBudget={handleAddBudget}
                onUpdateBudget={handleUpdateBudget}
              />
            )}

            {activeTab === 'finance' && (
              <Finance 
                transactions={transactions}
                onAddTransaction={handleAddTransaction}
              />
            )}

            {activeTab === 'condos' && (
              <Condos 
                condos={condos}
                condoBills={condoBills}
                onAddCondo={handleAddCondo}
                onUpdateCondo={handleUpdateCondo}
                onAddCondoBill={handleAddCondoBill}
                onPayCondoBill={handlePayCondoBill}
              />
            )}

            {activeTab === 'projects' && (
              <Projects 
                projects={projects}
                employees={employees}
                materials={materials}
                onAddProject={handleAddProject}
                onUpdateProject={handleUpdateProject}
                onDeleteProject={handleDeleteProject}
              />
            )}

            {activeTab === 'subscription' && (
              <Plans 
                subscription={subscription}
                onUpdateSubscription={handleUpdateSubscription}
              />
            )}
          </motion.div>
        </AnimatePresence>

      </main>

    </div>
  );
}
