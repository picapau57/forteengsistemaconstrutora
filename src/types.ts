export interface Employee {
  id: string;
  name: string;
  role: string;
  status: 'Ativo' | 'Demitido';
  hireDate: string;
  terminationDate?: string;
  salary: number;
  cpf: string;
  phone: string;
  email: string;
  address: string;
  notes: string[];
  pointPin: string; // 4 digit code for punch clock
}

export interface Attendance {
  id: string;
  employeeId: string;
  employeeName: string;
  date: string; // YYYY-MM-DD
  clockIn?: string; // HH:MM
  clockOut?: string; // HH:MM
  status: 'Presente' | 'Falta' | 'Atrasado' | 'Ausente';
  location: string;
  gpsCoords?: {
    lat: number;
    lng: number;
  };
}

export interface Client {
  id: string;
  name: string;
  cpfCnpj: string;
  email: string;
  phone: string;
  address: string;
  status: 'Ativo' | 'Inativo';
}

export interface Material {
  id: string;
  name: string;
  category: string;
  unit: string; // saco, kg, m, m³, unidade, etc.
  stock: number;
  minStock: number;
  unitPrice: number;
}

export interface BudgetItem {
  materialId: string;
  materialName: string;
  quantity: number;
  unit: string;
  unitPrice: number;
  totalPrice: number;
}

export interface Budget {
  id: string;
  clientId: string;
  clientName: string;
  projectName: string;
  date: string;
  status: 'Rascunho' | 'Enviado' | 'Aprovado' | 'Recusado';
  items: BudgetItem[];
  totalAmount: number;
  notes: string;
}

export interface Transaction {
  id: string;
  type: 'Receita' | 'Despesa';
  category: string; // Materiais, Salários, Clientes, Condomínios, Serviços, Outros
  amount: number;
  date: string;
  description: string;
  referenceId?: string; // Links to budget, condo, or employee
}

export interface Condo {
  id: string;
  name: string;
  address: string;
  totalUnits: number;
  activeUnits: number;
  monthlyFee: number;
  currentBalance: number;
}

export interface CondoBill {
  id: string;
  condoId: string;
  condoName: string;
  type: 'Água' | 'Luz' | 'Manutenção' | 'Segurança' | 'Outros';
  amount: number;
  billingMonth: string; // MM/YYYY
  dueDate: string;
  status: 'Pago' | 'Pendente';
  description?: string;
}

export interface ProjectTask {
  id: string;
  name: string;
  deadline: string;
  responsibleId: string;
  responsibleName: string;
  status: 'A Fazer' | 'Em Andamento' | 'Concluído';
}

export interface ProjectPhase {
  id: string;
  name: string;
  tasks: ProjectTask[];
}

export interface AllocatedEmployee {
  employeeId: string;
  employeeName: string;
  role: string;
}

export interface AllocatedMaterial {
  materialId: string;
  materialName: string;
  quantity: number;
  unit: string;
}

export interface Project {
  id: string;
  name: string;
  address: string;
  startDate: string;
  endDate: string;
  phases: ProjectPhase[];
  allocatedEmployees: AllocatedEmployee[];
  allocatedMaterials: AllocatedMaterial[];
  status: 'Planejado' | 'Em Andamento' | 'Atrasado' | 'Concluído';
}

export interface Subscription {
  status: 'Trial' | 'Ativo' | 'Expirado';
  plan?: 'Mensal' | 'Anual' | 'Vitalício';
  trialStartDate: string;
  trialDaysRemaining: number;
  subscribedAt?: string;
}

