import React, { useState } from 'react';
import { 
  Briefcase, 
  MapPin, 
  Calendar, 
  Plus, 
  Trash2, 
  CheckCircle, 
  Clock, 
  Users, 
  Package, 
  AlertTriangle, 
  ChevronRight, 
  PlusCircle, 
  UserPlus, 
  Activity, 
  UserMinus, 
  FolderPlus,
  Check,
  Building2
} from 'lucide-react';
import { Project, ProjectPhase, ProjectTask, AllocatedEmployee, AllocatedMaterial, Employee, Material } from '../types';

interface ProjectsProps {
  projects: Project[];
  employees: Employee[];
  materials: Material[];
  onAddProject: (proj: Omit<Project, 'id' | 'phases' | 'allocatedEmployees' | 'allocatedMaterials'>) => void;
  onUpdateProject: (proj: Project) => void;
  onDeleteProject: (projectId: string) => void;
}

export default function Projects({ 
  projects, 
  employees, 
  materials, 
  onAddProject, 
  onUpdateProject, 
  onDeleteProject 
}: ProjectsProps) {
  const [selectedProjectId, setSelectedProjectId] = useState<string | null>(
    projects.length > 0 ? projects[0].id : null
  );
  const [showAddForm, setShowAddForm] = useState(false);
  
  // Create Project Form fields
  const [newProjName, setNewProjName] = useState('');
  const [newProjAddress, setNewProjAddress] = useState('');
  const [newProjStartDate, setNewProjStartDate] = useState('');
  const [newProjEndDate, setNewProjEndDate] = useState('');

  // Active project details context
  const activeProject = projects.find(p => p.id === selectedProjectId);

  // New Phase fields
  const [newPhaseName, setNewPhaseName] = useState('');

  // New Task fields
  const [activePhaseForNewTask, setActivePhaseForNewTask] = useState<string | null>(null);
  const [newTaskName, setNewTaskName] = useState('');
  const [newTaskDeadline, setNewTaskDeadline] = useState('');
  const [newTaskResponsibleId, setNewTaskResponsibleId] = useState('');

  // Allocations fields
  const [selectedEmployeeToAllocate, setSelectedEmployeeToAllocate] = useState('');
  const [selectedMaterialToAllocate, setSelectedMaterialToAllocate] = useState('');
  const [materialAllocateQty, setMaterialAllocateQty] = useState<number>(1);

  // Create project submission
  const handleCreateProjectSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newProjName || !newProjAddress || !newProjStartDate || !newProjEndDate) {
      alert('Por favor, preencha todos os campos do projeto.');
      return;
    }

    onAddProject({
      name: newProjName,
      address: newProjAddress,
      startDate: newProjStartDate,
      endDate: newProjEndDate,
      status: 'Planejado'
    });

    // Reset fields & transition back
    setNewProjName('');
    setNewProjAddress('');
    setNewProjStartDate('');
    setNewProjEndDate('');
    setShowAddForm(false);
  };

  // Add a phase to active project
  const handleAddPhase = (e: React.FormEvent) => {
    e.preventDefault();
    if (!activeProject || !newPhaseName.trim()) return;

    const newPhase: ProjectPhase = {
      id: `phase-${Date.now()}`,
      name: newPhaseName.trim(),
      tasks: []
    };

    const updatedProject: Project = {
      ...activeProject,
      phases: [...activeProject.phases, newPhase]
    };

    onUpdateProject(updatedProject);
    setNewPhaseName('');
  };

  // Delete a phase
  const handleDeletePhase = (phaseId: string) => {
    if (!activeProject) return;
    if (!window.confirm('Tem certeza de que deseja remover esta fase e todas as suas tarefas associadas?')) return;

    const updatedProject: Project = {
      ...activeProject,
      phases: activeProject.phases.filter(ph => ph.id !== phaseId)
    };
    onUpdateProject(updatedProject);
  };

  // Add a task to a phase
  const handleAddTaskSubmit = (e: React.FormEvent, phaseId: string) => {
    e.preventDefault();
    if (!activeProject || !newTaskName.trim() || !newTaskDeadline || !newTaskResponsibleId) {
      alert('Preencha todos os dados da tarefa.');
      return;
    }

    const respEmployee = employees.find(emp => emp.id === newTaskResponsibleId);
    if (!respEmployee) return;

    const newTask: ProjectTask = {
      id: `task-${Date.now()}`,
      name: newTaskName.trim(),
      deadline: newTaskDeadline,
      responsibleId: newTaskResponsibleId,
      responsibleName: respEmployee.name,
      status: 'A Fazer'
    };

    const updatedPhases = activeProject.phases.map(phase => {
      if (phase.id === phaseId) {
        return {
          ...phase,
          tasks: [...phase.tasks, newTask]
        };
      }
      return phase;
    });

    const updatedProject: Project = {
      ...activeProject,
      phases: updatedPhases
    };

    onUpdateProject(updatedProject);

    // Reset task form fields
    setNewTaskName('');
    setNewTaskDeadline('');
    setNewTaskResponsibleId('');
    setActivePhaseForNewTask(null);
  };

  // Update a task status
  const handleUpdateTaskStatus = (phaseId: string, taskId: string, newStatus: 'A Fazer' | 'Em Andamento' | 'Concluído') => {
    if (!activeProject) return;

    const updatedPhases = activeProject.phases.map(phase => {
      if (phase.id === phaseId) {
        const updatedTasks = phase.tasks.map(task => {
          if (task.id === taskId) {
            return { ...task, status: newStatus };
          }
          return task;
        });
        return { ...phase, tasks: updatedTasks };
      }
      return phase;
    });

    const updatedProject: Project = {
      ...activeProject,
      phases: updatedPhases
    };

    onUpdateProject(updatedProject);
  };

  // Delete a task
  const handleDeleteTask = (phaseId: string, taskId: string) => {
    if (!activeProject) return;

    const updatedPhases = activeProject.phases.map(phase => {
      if (phase.id === phaseId) {
        return {
          ...phase,
          tasks: phase.tasks.filter(t => t.id !== taskId)
        };
      }
      return phase;
    });

    const updatedProject: Project = {
      ...activeProject,
      phases: updatedPhases
    };

    onUpdateProject(updatedProject);
  };

  // Allocate employee
  const handleAllocateEmployee = () => {
    if (!activeProject || !selectedEmployeeToAllocate) return;

    // Check if already allocated
    if (activeProject.allocatedEmployees.some(emp => emp.employeeId === selectedEmployeeToAllocate)) {
      alert('Este funcionário já está alocado neste projeto.');
      return;
    }

    const empObj = employees.find(emp => emp.id === selectedEmployeeToAllocate);
    if (!empObj) return;

    const newAlloc: AllocatedEmployee = {
      employeeId: empObj.id,
      employeeName: empObj.name,
      role: empObj.role
    };

    const updatedProject: Project = {
      ...activeProject,
      allocatedEmployees: [...activeProject.allocatedEmployees, newAlloc]
    };

    onUpdateProject(updatedProject);
    setSelectedEmployeeToAllocate('');
  };

  // Deallocate employee
  const handleDeallocateEmployee = (employeeId: string) => {
    if (!activeProject) return;

    const updatedProject: Project = {
      ...activeProject,
      allocatedEmployees: activeProject.allocatedEmployees.filter(emp => emp.employeeId !== employeeId)
    };

    onUpdateProject(updatedProject);
  };

  // Allocate material
  const handleAllocateMaterial = () => {
    if (!activeProject || !selectedMaterialToAllocate || materialAllocateQty <= 0) return;

    const matObj = materials.find(m => m.id === selectedMaterialToAllocate);
    if (!matObj) return;

    // Check if already allocated
    const existingIndex = activeProject.allocatedMaterials.findIndex(m => m.materialId === selectedMaterialToAllocate);
    let updatedMaterialsList = [...activeProject.allocatedMaterials];

    if (existingIndex >= 0) {
      // Update quantity
      updatedMaterialsList[existingIndex] = {
        ...updatedMaterialsList[existingIndex],
        quantity: updatedMaterialsList[existingIndex].quantity + materialAllocateQty
      };
    } else {
      // Add new
      const newAlloc: AllocatedMaterial = {
        materialId: matObj.id,
        materialName: matObj.name,
        quantity: materialAllocateQty,
        unit: matObj.unit
      };
      updatedMaterialsList.push(newAlloc);
    }

    const updatedProject: Project = {
      ...activeProject,
      allocatedMaterials: updatedMaterialsList
    };

    onUpdateProject(updatedProject);
    setSelectedMaterialToAllocate('');
    setMaterialAllocateQty(1);
  };

  // Deallocate material
  const handleDeallocateMaterial = (materialId: string) => {
    if (!activeProject) return;

    const updatedProject: Project = {
      ...activeProject,
      allocatedMaterials: activeProject.allocatedMaterials.filter(m => m.materialId !== materialId)
    };

    onUpdateProject(updatedProject);
  };

  // Update project overall status
  const handleUpdateProjectStatus = (newStatus: 'Planejado' | 'Em Andamento' | 'Atrasado' | 'Concluído') => {
    if (!activeProject) return;

    const updatedProject: Project = {
      ...activeProject,
      status: newStatus
    };

    onUpdateProject(updatedProject);
  };

  // Calculate project progress percentage
  const calculateProgress = (proj: Project): number => {
    let totalTasks = 0;
    let completedTasks = 0;

    proj.phases.forEach(ph => {
      ph.tasks.forEach(t => {
        totalTasks++;
        if (t.status === 'Concluído') {
          completedTasks++;
        }
      });
    });

    if (totalTasks === 0) return 0;
    return Math.round((completedTasks / totalTasks) * 100);
  };

  // Get total tasks counts
  const getTaskCounts = (proj: Project) => {
    let total = 0;
    let completed = 0;
    proj.phases.forEach(ph => {
      ph.tasks.forEach(t => {
        total++;
        if (t.status === 'Concluído') completed++;
      });
    });
    return { total, completed };
  };

  return (
    <div className="space-y-6">
      
      {/* Header section */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h2 id="projects-section-title" className="text-sm font-bold text-slate-800 uppercase tracking-wide border-l-4 border-amber-500 pl-2">
            Gestão de Projetos e Acompanhamento de Obras
          </h2>
          <p className="text-slate-500 text-xs mt-1">
            Cadastre obras, defina fases e tarefas com responsáveis, aloque equipe e insumos, e visualize o status real do canteiro.
          </p>
        </div>
        <button
          onClick={() => {
            setShowAddForm(!showAddForm);
          }}
          className="flex items-center gap-2 bg-amber-500 hover:bg-amber-600 text-white font-bold px-3 py-1.5 rounded text-[11px] uppercase tracking-wider shadow-sm transition-all cursor-pointer"
        >
          <Plus className="h-3.5 w-3.5" />
          <span>{showAddForm ? 'Voltar para Projetos' : 'Cadastrar Novo Projeto / Obra'}</span>
        </button>
      </div>

      {showAddForm ? (
        /* REGISTER NEW PROJECT FORM */
        <div className="bg-white rounded-2xl p-6 shadow-sm border border-slate-200 animate-fadeIn">
          <h3 className="text-xs font-bold text-slate-800 uppercase tracking-wider mb-4 pb-2 border-b border-slate-100 flex items-center gap-1.5 border-l-4 border-amber-500 pl-2">
            Cadastro de Novo Projeto / Obra
          </h3>

          <form onSubmit={handleCreateProjectSubmit} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <label className="text-[10px] uppercase font-bold text-slate-400">Nome do Empreendimento / Obra</label>
                <input
                  type="text"
                  placeholder="Ex: Edifício Bella Vista"
                  value={newProjName}
                  onChange={(e) => setNewProjName(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-200 rounded p-2 text-xs font-medium text-slate-700 outline-none focus:ring-1 focus:ring-amber-500"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-[10px] uppercase font-bold text-slate-400">Endereço Completo</label>
                <input
                  type="text"
                  placeholder="Ex: Rua das Amendoeiras, 400 - Jardins, SP"
                  value={newProjAddress}
                  onChange={(e) => setNewProjAddress(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-200 rounded p-2 text-xs font-medium text-slate-700 outline-none focus:ring-1 focus:ring-amber-500"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-[10px] uppercase font-bold text-slate-400">Data de Início das Atividades</label>
                <input
                  type="date"
                  value={newProjStartDate}
                  onChange={(e) => setNewProjStartDate(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-200 rounded p-2 text-xs font-mono font-medium text-slate-700 outline-none focus:ring-1 focus:ring-amber-500"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-[10px] uppercase font-bold text-slate-400">Previsão de Término (Prazo de Entrega)</label>
                <input
                  type="date"
                  value={newProjEndDate}
                  onChange={(e) => setNewProjEndDate(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-200 rounded p-2 text-xs font-mono font-medium text-slate-700 outline-none focus:ring-1 focus:ring-amber-500"
                />
              </div>
            </div>

            <div className="pt-2 border-t border-slate-100 flex justify-end gap-2">
              <button
                type="button"
                onClick={() => setShowAddForm(false)}
                className="bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold px-4 py-2 rounded text-[11px] uppercase tracking-wider cursor-pointer transition-all"
              >
                Cancelar
              </button>
              <button
                type="submit"
                className="bg-amber-500 hover:bg-amber-600 text-white font-bold px-4 py-2 rounded text-[11px] uppercase tracking-wider shadow-sm transition-all cursor-pointer"
              >
                Salvar & Inicializar Fases Padrão
              </button>
            </div>
          </form>
        </div>
      ) : (
        /* MAIN PROJECT MODULE BODY */
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          
          {/* Projects Side / Main List */}
          <div className="space-y-4 lg:col-span-1">
            <h3 className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Obras Cadastradas</h3>
            
            {projects.length === 0 ? (
              <div className="bg-white rounded-2xl p-6 border border-slate-200 text-center text-slate-400 text-xs font-medium py-12">
                Nenhum projeto cadastrado no sistema.
              </div>
            ) : (
              projects.map(proj => {
                const progress = calculateProgress(proj);
                const counts = getTaskCounts(proj);
                const isSelected = proj.id === selectedProjectId;
                
                return (
                  <div
                    key={proj.id}
                    onClick={() => setSelectedProjectId(proj.id)}
                    className={`bg-white rounded-2xl p-5 border shadow-sm transition-all cursor-pointer ${
                      isSelected 
                        ? 'border-amber-500 ring-1 ring-amber-500/30 bg-amber-50/10' 
                        : 'border-slate-200 hover:border-slate-350'
                    }`}
                  >
                    <div className="flex justify-between items-start gap-2 mb-2">
                      <span className={`px-2 py-0.5 rounded text-[9px] font-extrabold uppercase tracking-wider border ${
                        proj.status === 'Concluído' ? 'bg-emerald-50 text-emerald-700 border-emerald-100' :
                        proj.status === 'Em Andamento' ? 'bg-amber-50 text-amber-700 border-amber-100' :
                        proj.status === 'Atrasado' ? 'bg-red-50 text-red-700 border-red-100' :
                        'bg-slate-50 text-slate-600 border-slate-200'
                      }`}>
                        {proj.status}
                      </span>
                      <span className="text-[10px] font-mono font-bold text-slate-400">
                        {counts.completed}/{counts.total} Tarefas
                      </span>
                    </div>

                    <h4 className="text-xs font-black text-slate-800 uppercase tracking-wide leading-tight mb-1">
                      {proj.name}
                    </h4>
                    
                    <p className="text-[10px] text-slate-500 flex items-center gap-1 font-medium mb-3">
                      <MapPin className="h-3 w-3 text-slate-400 shrink-0" />
                      <span className="truncate">{proj.address}</span>
                    </p>

                    {/* Progress Bar */}
                    <div className="space-y-1">
                      <div className="flex justify-between items-center text-[10px] font-bold font-mono text-slate-500">
                        <span>Progresso Geral</span>
                        <span className="text-amber-600">{progress}%</span>
                      </div>
                      <div className="h-1.5 w-full bg-slate-100 rounded-full overflow-hidden">
                        <div 
                          className="h-full bg-amber-500 rounded-full transition-all duration-500" 
                          style={{ width: `${progress}%` }}
                        />
                      </div>
                    </div>

                    {/* Meta summary stats */}
                    <div className="flex gap-4 mt-4 pt-3 border-t border-slate-100 text-[10px] font-bold uppercase tracking-wider text-slate-400">
                      <span className="flex items-center gap-1">
                        <Users className="h-3 w-3 text-slate-400" />
                        {proj.allocatedEmployees.length} Alocados
                      </span>
                      <span className="flex items-center gap-1">
                        <Package className="h-3 w-3 text-slate-400" />
                        {proj.allocatedMaterials.length} Insumos
                      </span>
                    </div>
                  </div>
                );
              })
            )}
          </div>

          {/* Active Project Workspace */}
          <div className="lg:col-span-2 space-y-6">
            {activeProject ? (
              <div className="bg-white rounded-2xl p-6 shadow-sm border border-slate-200 space-y-6">
                
                {/* Workspace Header Info & Status Controls */}
                <div className="pb-4 border-b border-slate-100 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                  <div>
                    <h3 className="text-sm font-black text-slate-800 uppercase tracking-wider">
                      Painel Operacional: {activeProject.name}
                    </h3>
                    <p className="text-xs text-slate-500 mt-0.5 font-medium flex items-center gap-1.5">
                      <MapPin className="h-3.5 w-3.5 text-slate-400 shrink-0" />
                      {activeProject.address}
                    </p>
                  </div>
                  
                  {/* Delete / Finish / Status selectors */}
                  <div className="flex items-center gap-2 flex-wrap shrink-0">
                    <div className="flex items-center gap-1 bg-slate-50 border border-slate-200 rounded p-1">
                      <span className="text-[9px] uppercase font-bold text-slate-400 px-1">Status:</span>
                      <select
                        value={activeProject.status}
                        onChange={(e) => handleUpdateProjectStatus(e.target.value as any)}
                        className="bg-transparent text-xs font-bold text-slate-700 outline-none cursor-pointer"
                      >
                        <option value="Planejado">Planejado</option>
                        <option value="Em Andamento">Em Andamento</option>
                        <option value="Atrasado">Atrasado</option>
                        <option value="Concluído">Concluído</option>
                      </select>
                    </div>

                    <button
                      onClick={() => {
                        if (window.confirm(`Tem certeza de que deseja remover permanentemente o projeto "${activeProject.name}"?`)) {
                          onDeleteProject(activeProject.id);
                          setSelectedProjectId(projects.length > 1 ? projects.find(p => p.id !== activeProject.id)?.id || null : null);
                        }
                      }}
                      className="p-1.5 text-red-500 hover:bg-red-50 hover:text-red-700 rounded transition-all cursor-pointer border border-transparent hover:border-red-100"
                      title="Excluir Projeto"
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </div>
                </div>

                {/* Date constraints & timeline metrics */}
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 bg-slate-50/50 p-4 rounded-xl border border-slate-150">
                  <div className="space-y-0.5">
                    <span className="text-[10px] uppercase font-bold text-slate-400">Início Estimado</span>
                    <p className="text-xs font-bold font-mono text-slate-700 flex items-center gap-1">
                      <Calendar className="h-3.5 w-3.5 text-amber-500" />
                      {new Date(activeProject.startDate).toLocaleDateString('pt-BR')}
                    </p>
                  </div>
                  
                  <div className="space-y-0.5">
                    <span className="text-[10px] uppercase font-bold text-slate-400">Previsão de Término</span>
                    <p className="text-xs font-bold font-mono text-slate-700 flex items-center gap-1">
                      <Calendar className="h-3.5 w-3.5 text-red-500" />
                      {new Date(activeProject.endDate).toLocaleDateString('pt-BR')}
                    </p>
                  </div>

                  <div className="space-y-0.5">
                    <span className="text-[10px] uppercase font-bold text-slate-400">Progresso de Atividades</span>
                    <p className="text-xs font-bold text-slate-700 flex items-center gap-1">
                      <CheckCircle className="h-3.5 w-3.5 text-emerald-500" />
                      {calculateProgress(activeProject)}% concluído
                    </p>
                  </div>

                  <div className="space-y-0.5">
                    <span className="text-[10px] uppercase font-bold text-slate-400">Membros Alocados</span>
                    <p className="text-xs font-bold text-slate-700 flex items-center gap-1">
                      <Users className="h-3.5 w-3.5 text-blue-500" />
                      {activeProject.allocatedEmployees.length} operários
                    </p>
                  </div>
                </div>

                {/* Tab Content Division */}
                <div className="space-y-6">
                  
                  {/* FASES & TAREFAS */}
                  <div className="space-y-4">
                    <div className="flex justify-between items-center">
                      <h4 className="text-xs font-black text-slate-900 uppercase tracking-wider border-l-4 border-slate-900 pl-2">
                        Fases do Projeto e Tarefas Associadas
                      </h4>
                      
                      {/* Quick Phase Form Inline */}
                      <form onSubmit={handleAddPhase} className="flex gap-1.5">
                        <input
                          type="text"
                          placeholder="Nova Fase (Ex: Alvenaria)"
                          value={newPhaseName}
                          onChange={(e) => setNewPhaseName(e.target.value)}
                          className="bg-slate-50 border border-slate-200 rounded px-2 py-1 text-[11px] font-medium outline-none focus:ring-1 focus:ring-amber-500"
                        />
                        <button
                          type="submit"
                          className="bg-slate-900 hover:bg-slate-800 text-white font-bold px-2 py-1 rounded text-[10px] uppercase tracking-wider transition-all cursor-pointer"
                        >
                          + Fase
                        </button>
                      </form>
                    </div>

                    {activeProject.phases.length === 0 ? (
                      <div className="bg-slate-50 p-6 rounded-xl border border-dashed border-slate-200 text-center text-slate-400 text-xs font-semibold">
                        Nenhuma fase configurada. Adicione uma fase no botão ao lado.
                      </div>
                    ) : (
                      activeProject.phases.map(phase => (
                        <div key={phase.id} className="bg-white border border-slate-200 rounded-xl overflow-hidden shadow-sm">
                          {/* Phase Header */}
                          <div className="bg-slate-50/70 border-b border-slate-200 px-4 py-3 flex justify-between items-center">
                            <span className="text-xs font-bold uppercase tracking-wider text-slate-700 flex items-center gap-1.5">
                              <Activity className="h-3.5 w-3.5 text-amber-500" />
                              Fase: {phase.name}
                            </span>
                            <div className="flex items-center gap-2">
                              <button
                                onClick={() => {
                                  if (activePhaseForNewTask === phase.id) {
                                    setActivePhaseForNewTask(null);
                                  } else {
                                    setActivePhaseForNewTask(phase.id);
                                  }
                                }}
                                className="bg-amber-50 border border-amber-200 text-amber-700 font-bold px-2 py-1 rounded text-[10px] uppercase tracking-widest hover:bg-amber-100 transition-all cursor-pointer"
                              >
                                {activePhaseForNewTask === phase.id ? 'Fechar Formulário' : '+ Adicionar Tarefa'}
                              </button>
                              <button
                                onClick={() => handleDeletePhase(phase.id)}
                                className="text-red-500 hover:text-red-700 p-1 rounded hover:bg-red-50 transition-all cursor-pointer"
                                title="Remover Fase"
                              >
                                <Trash2 className="h-3.5 w-3.5" />
                              </button>
                            </div>
                          </div>

                          {/* Phase Task Form */}
                          {activePhaseForNewTask === phase.id && (
                            <form onSubmit={(e) => handleAddTaskSubmit(e, phase.id)} className="bg-amber-50/20 p-4 border-b border-slate-200 grid grid-cols-1 md:grid-cols-4 gap-3 animate-fadeIn">
                              <div className="space-y-1 md:col-span-2">
                                <label className="text-[9px] uppercase font-bold text-slate-400">Nome da Atividade / Tarefa</label>
                                <input
                                  type="text"
                                  placeholder="Ex: Assentar Tijolos do 1º andar"
                                  value={newTaskName}
                                  onChange={(e) => setNewTaskName(e.target.value)}
                                  className="w-full bg-white border border-slate-200 rounded p-1.5 text-xs font-medium text-slate-700 outline-none"
                                />
                              </div>

                              <div className="space-y-1">
                                <label className="text-[9px] uppercase font-bold text-slate-400">Prazo de Entrega</label>
                                <input
                                  type="date"
                                  value={newTaskDeadline}
                                  onChange={(e) => setNewTaskDeadline(e.target.value)}
                                  className="w-full bg-white border border-slate-200 rounded p-1.5 text-xs font-mono font-medium text-slate-700 outline-none"
                                />
                              </div>

                              <div className="space-y-1 flex flex-col justify-between">
                                <label className="text-[9px] uppercase font-bold text-slate-400">Responsável Alocado</label>
                                <div className="flex gap-1.5">
                                  <select
                                    value={newTaskResponsibleId}
                                    onChange={(e) => setNewTaskResponsibleId(e.target.value)}
                                    className="w-full bg-white border border-slate-200 rounded p-1.5 text-xs font-semibold text-slate-700 outline-none cursor-pointer"
                                  >
                                    <option value="">Selecione...</option>
                                    {employees.filter(e => e.status === 'Ativo').map(emp => (
                                      <option key={emp.id} value={emp.id}>{emp.name} ({emp.role})</option>
                                    ))}
                                  </select>
                                  <button
                                    type="submit"
                                    className="bg-amber-500 hover:bg-amber-600 text-white font-bold p-1.5 rounded transition-all cursor-pointer shrink-0"
                                    title="Salvar Tarefa"
                                  >
                                    <Check className="h-4 w-4" />
                                  </button>
                                </div>
                              </div>
                            </form>
                          )}

                          {/* Phase Tasks List */}
                          <div className="divide-y divide-slate-100">
                            {phase.tasks.length === 0 ? (
                              <div className="text-center py-6 text-slate-400 text-xs font-medium">
                                Nenhuma tarefa associada a esta fase.
                              </div>
                            ) : (
                              phase.tasks.map(task => (
                                <div key={task.id} className="p-3 px-4 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 hover:bg-slate-50 transition-colors">
                                  <div className="space-y-0.5">
                                    <p className="text-xs font-bold text-slate-800">{task.name}</p>
                                    <div className="flex gap-3 text-[10px] text-slate-500 font-medium">
                                      <span className="font-mono">Prazo: {new Date(task.deadline).toLocaleDateString('pt-BR')}</span>
                                      <span>Resp: <span className="text-slate-700 font-bold">{task.responsibleName}</span></span>
                                    </div>
                                  </div>

                                  <div className="flex items-center gap-2 self-stretch sm:self-auto justify-end">
                                    <div className="flex items-center gap-1 bg-slate-50 border border-slate-150 rounded px-1.5 py-0.5">
                                      <span className="text-[9px] uppercase font-bold text-slate-400">Status:</span>
                                      <select
                                        value={task.status}
                                        onChange={(e) => handleUpdateTaskStatus(phase.id, task.id, e.target.value as any)}
                                        className="bg-transparent text-[10px] font-bold text-slate-700 outline-none cursor-pointer"
                                      >
                                        <option value="A Fazer">A Fazer</option>
                                        <option value="Em Andamento">Em Andamento</option>
                                        <option value="Concluído">Concluído</option>
                                      </select>
                                    </div>
                                    <button
                                      onClick={() => handleDeleteTask(phase.id, task.id)}
                                      className="text-red-500 hover:text-red-700 p-1 rounded hover:bg-red-50 transition-all cursor-pointer border border-transparent hover:border-red-100"
                                      title="Remover Tarefa"
                                    >
                                      <Trash2 className="h-3.5 w-3.5" />
                                    </button>
                                  </div>
                                </div>
                              ))
                            )}
                          </div>
                        </div>
                      ))
                    )}
                  </div>

                  {/* ALLOCATION MATRIX */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-2">
                    
                    {/* ALLOCATE STAFF */}
                    <div className="bg-white border border-slate-200 rounded-xl p-4 space-y-3 shadow-sm">
                      <div className="flex justify-between items-center">
                        <h4 className="text-xs font-black text-slate-800 uppercase tracking-wider flex items-center gap-1 border-l-4 border-amber-500 pl-1.5">
                          Alocação de Funcionários
                        </h4>
                      </div>

                      {/* Add Alloc Form Inline */}
                      <div className="flex gap-1.5">
                        <select
                          value={selectedEmployeeToAllocate}
                          onChange={(e) => setSelectedEmployeeToAllocate(e.target.value)}
                          className="grow bg-slate-50 border border-slate-200 rounded px-2 py-1 text-xs font-semibold text-slate-700 outline-none cursor-pointer"
                        >
                          <option value="">Selecione Operário...</option>
                          {employees
                            .filter(emp => emp.status === 'Ativo' && !activeProject.allocatedEmployees.some(ae => ae.employeeId === emp.id))
                            .map(emp => (
                              <option key={emp.id} value={emp.id}>{emp.name} ({emp.role})</option>
                            ))
                          }
                        </select>
                        <button
                          onClick={handleAllocateEmployee}
                          disabled={!selectedEmployeeToAllocate}
                          className="bg-amber-500 hover:bg-amber-600 disabled:opacity-50 text-white font-bold px-3 py-1 rounded text-[10px] uppercase tracking-wider transition-all cursor-pointer whitespace-nowrap"
                        >
                          Alocar
                        </button>
                      </div>

                      {/* Alloc List */}
                      <div className="space-y-1.5 max-h-[160px] overflow-y-auto pr-1">
                        {activeProject.allocatedEmployees.length === 0 ? (
                          <p className="text-[11px] text-slate-400 text-center py-4">Nenhum funcionário alocado a esta obra.</p>
                        ) : (
                          activeProject.allocatedEmployees.map(ae => (
                            <div key={ae.employeeId} className="flex justify-between items-center p-2 bg-slate-50 border border-slate-150 rounded text-xs">
                              <div>
                                <span className="font-bold text-slate-800">{ae.employeeName}</span>
                                <span className="text-[10px] text-slate-400 block font-medium">{ae.role}</span>
                              </div>
                              <button
                                onClick={() => handleDeallocateEmployee(ae.employeeId)}
                                className="text-red-500 hover:text-red-700 p-1 hover:bg-red-50 rounded transition-all cursor-pointer"
                                title="Desalocar"
                              >
                                <UserMinus className="h-3.5 w-3.5" />
                              </button>
                            </div>
                          ))
                        )}
                      </div>
                    </div>

                    {/* ALLOCATE MATERIALS */}
                    <div className="bg-white border border-slate-200 rounded-xl p-4 space-y-3 shadow-sm">
                      <div className="flex justify-between items-center">
                        <h4 className="text-xs font-black text-slate-800 uppercase tracking-wider flex items-center gap-1 border-l-4 border-slate-900 pl-1.5">
                          Alocação de Materiais / Insumos
                        </h4>
                      </div>

                      {/* Add Alloc Form Inline */}
                      <div className="flex gap-1.5">
                        <select
                          value={selectedMaterialToAllocate}
                          onChange={(e) => setSelectedMaterialToAllocate(e.target.value)}
                          className="grow bg-slate-50 border border-slate-200 rounded px-2 py-1 text-xs font-semibold text-slate-700 outline-none cursor-pointer max-w-[50%]"
                        >
                          <option value="">Insumo...</option>
                          {materials.map(m => (
                            <option key={m.id} value={m.id}>{m.name} ({m.stock} {m.unit})</option>
                          ))}
                        </select>
                        <input
                          type="number"
                          min="1"
                          placeholder="Qtd"
                          value={materialAllocateQty}
                          onChange={(e) => setMaterialAllocateQty(parseInt(e.target.value) || 1)}
                          className="w-16 bg-slate-50 border border-slate-200 rounded px-2 py-1 text-xs font-mono font-medium outline-none text-center"
                        />
                        <button
                          onClick={handleAllocateMaterial}
                          disabled={!selectedMaterialToAllocate || materialAllocateQty <= 0}
                          className="bg-slate-900 hover:bg-slate-850 disabled:opacity-50 text-white font-bold px-3 py-1 rounded text-[10px] uppercase tracking-wider transition-all cursor-pointer whitespace-nowrap"
                        >
                          Alocar
                        </button>
                      </div>

                      {/* Alloc List */}
                      <div className="space-y-1.5 max-h-[160px] overflow-y-auto pr-1">
                        {activeProject.allocatedMaterials.length === 0 ? (
                          <p className="text-[11px] text-slate-400 text-center py-4">Nenhum insumo alocado a esta obra.</p>
                        ) : (
                          activeProject.allocatedMaterials.map(am => (
                            <div key={am.materialId} className="flex justify-between items-center p-2 bg-slate-50 border border-slate-150 rounded text-xs font-mono">
                              <div>
                                <span className="font-sans font-bold text-slate-800">{am.materialName}</span>
                                <span className="text-[10px] text-amber-700 font-bold block">Consumo Alocado: {am.quantity} {am.unit}</span>
                              </div>
                              <button
                                onClick={() => handleDeallocateMaterial(am.materialId)}
                                className="text-red-500 hover:text-red-700 p-1 hover:bg-red-50 rounded transition-all cursor-pointer"
                                title="Desalocar"
                              >
                                <Trash2 className="h-3.5 w-3.5" />
                              </button>
                            </div>
                          ))
                        )}
                      </div>
                    </div>

                  </div>

                </div>

              </div>
            ) : (
              <div className="bg-white rounded-2xl p-8 shadow-sm border border-slate-200 text-center py-20">
                <Building2 className="h-10 w-10 text-slate-300 mx-auto mb-3 animate-pulse" />
                <h3 className="font-bold text-slate-800 uppercase tracking-wide text-xs">Selecione uma Obra</h3>
                <p className="text-xs text-slate-400 mt-1">Selecione um projeto na barra lateral para ver suas fases, cronograma e alocações.</p>
              </div>
            )}
          </div>

        </div>
      )}

    </div>
  );
}
