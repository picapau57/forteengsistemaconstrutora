import { Employee, Attendance, Client, Material, Budget, Transaction, Condo, CondoBill, Project } from '../types';

export const INITIAL_EMPLOYEES: Employee[] = [
  {
    id: 'emp-1',
    name: 'Carlos Roberto Silva',
    role: 'Mestre de Obras',
    status: 'Ativo',
    hireDate: '2024-01-15',
    salary: 4500,
    cpf: '123.456.789-00',
    phone: '(11) 98765-4321',
    email: 'carlos.roberto@construtora.com',
    address: 'Rua das Flores, 123 - Centro, São Paulo - SP',
    notes: [
      'Funcionário exemplar, excelente liderança de equipe.',
      'Solicitou folga para o dia 10/07 para consulta médica.'
    ],
    pointPin: '1234'
  },
  {
    id: 'emp-2',
    name: 'José de Souza Santos',
    role: 'Pedreiro',
    status: 'Ativo',
    hireDate: '2024-03-10',
    salary: 2800,
    cpf: '234.567.890-11',
    phone: '(11) 97654-3210',
    email: 'jose.santos@gmail.com',
    address: 'Av. Paulista, 1500 - Bela Vista, São Paulo - SP',
    notes: [
      'Ótimo acabamento em alvenaria e assentamento de pisos.'
    ],
    pointPin: '4321'
  },
  {
    id: 'emp-3',
    name: 'Marcos Oliveira Lima',
    role: 'Servente',
    status: 'Ativo',
    hireDate: '2025-02-01',
    salary: 1900,
    cpf: '345.678.901-22',
    phone: '(11) 96543-2109',
    email: 'marcos.oliveira@outlook.com',
    address: 'Rua Bahia, 45 - Vila Mariana, São Paulo - SP',
    notes: [
      'Dedicado e pontual.',
      'Recebeu EPI novo (botas e óculos) em 05/02/2025.'
    ],
    pointPin: '5678'
  },
  {
    id: 'emp-4',
    name: 'Ana Beatris Souza',
    role: 'Engenheira Civil',
    status: 'Ativo',
    hireDate: '2023-08-20',
    salary: 8200,
    cpf: '456.789.012-33',
    phone: '(11) 95432-1098',
    email: 'ana.souza@construtora.com',
    address: 'Rua Pamplona, 800 - Jardins, São Paulo - SP',
    notes: [
      'Responsável técnica pelas obras Alvorada e Vista Alegre.',
      'Aprovou as fundações da Fase 2 da obra Alvorada.'
    ],
    pointPin: '8888'
  },
  {
    id: 'emp-5',
    name: 'Ricardo Mendes Gomes',
    role: 'Eletricista de Obra',
    status: 'Ativo',
    hireDate: '2024-11-05',
    salary: 3100,
    cpf: '567.890.123-44',
    phone: '(11) 94321-0987',
    email: 'ricardo.mendes@gmail.com',
    address: 'Av. do Estado, 4500 - Mooca, São Paulo - SP',
    notes: [
      'Especialista em fiação predial trifásica e quadros de força.'
    ],
    pointPin: '9911'
  },
  {
    id: 'emp-6',
    name: 'Paulo Cezar Antunes',
    role: 'Pedreiro de Acabamento',
    status: 'Demitido',
    hireDate: '2023-05-12',
    terminationDate: '2025-01-10',
    salary: 3000,
    cpf: '678.901.234-55',
    phone: '(11) 93210-9876',
    email: 'paulo.antunes@gmail.com',
    address: 'Rua Augusta, 2200 - Consolação, São Paulo - SP',
    notes: [
      'Desligamento por motivos de mudança de estado.',
      'Deixou as portas abertas para recontratação futura.'
    ],
    pointPin: '1122'
  }
];

export const INITIAL_ATTENDANCE: Attendance[] = [
  {
    id: 'att-1',
    employeeId: 'emp-1',
    employeeName: 'Carlos Roberto Silva',
    date: '2026-06-28',
    clockIn: '07:55',
    clockOut: '17:02',
    status: 'Presente',
    location: 'Obra Residencial Alvorada',
    gpsCoords: { lat: -23.55052, lng: -46.633308 }
  },
  {
    id: 'att-2',
    employeeId: 'emp-2',
    employeeName: 'José de Souza Santos',
    date: '2026-06-28',
    clockIn: '08:12',
    clockOut: '17:05',
    status: 'Atrasado',
    location: 'Obra Residencial Alvorada',
    gpsCoords: { lat: -23.55061, lng: -46.63345 }
  },
  {
    id: 'att-3',
    employeeId: 'emp-3',
    employeeName: 'Marcos Oliveira Lima',
    date: '2026-06-28',
    clockIn: '07:50',
    clockOut: '17:00',
    status: 'Presente',
    location: 'Obra Residencial Alvorada',
    gpsCoords: { lat: -23.55050, lng: -46.63320 }
  },
  {
    id: 'att-4',
    employeeId: 'emp-4',
    employeeName: 'Ana Beatris Souza',
    date: '2026-06-28',
    clockIn: '08:30',
    clockOut: '18:15',
    status: 'Presente',
    location: 'Sede Administrativa / Visitas a Obras',
    gpsCoords: { lat: -23.56152, lng: -46.66220 }
  },
  {
    id: 'att-5',
    employeeId: 'emp-5',
    employeeName: 'Ricardo Mendes Gomes',
    date: '2026-06-28',
    status: 'Falta',
    location: 'Condomínio Vista Alegre',
  }
];

export const INITIAL_CLIENTS: Client[] = [
  {
    id: 'cli-1',
    name: 'Guilherme Siqueira Vasconcelos',
    cpfCnpj: '321.654.987-12',
    email: 'guilherme.sv@gmail.com',
    phone: '(11) 98111-2222',
    address: 'Rua Bela Cintra, 1400 - Consolação, São Paulo - SP',
    status: 'Ativo'
  },
  {
    id: 'cli-2',
    name: 'Incorporadora Sol da Manhã Ltda',
    cpfCnpj: '12.345.678/0001-90',
    email: 'contato@soldamanha.com.br',
    phone: '(11) 3322-1100',
    address: 'Av. Brigadeiro Faria Lima, 2000 - Pinheiros, São Paulo - SP',
    status: 'Ativo'
  },
  {
    id: 'cli-3',
    name: 'Clara Maria de Jesus',
    cpfCnpj: '987.654.321-09',
    email: 'clara.jesus@uol.com.br',
    phone: '(11) 97111-3333',
    address: 'Rua Itapeva, 450 - Bela Vista, São Paulo - SP',
    status: 'Ativo'
  }
];

export const INITIAL_MATERIALS: Material[] = [
  {
    id: 'mat-1',
    name: 'Cimento CP II 50kg',
    category: 'Básicos',
    unit: 'Saco',
    stock: 120,
    minStock: 30,
    unitPrice: 42.50
  },
  {
    id: 'mat-2',
    name: 'Argamassa AC-III 20kg',
    category: 'Acabamento',
    unit: 'Saco',
    stock: 85,
    minStock: 25,
    unitPrice: 31.90
  },
  {
    id: 'mat-3',
    name: 'Vergalhão de Aço CA-50 10mm (3/8)',
    category: 'Ferragem',
    unit: 'Barra (12m)',
    stock: 45,
    minStock: 15,
    unitPrice: 68.00
  },
  {
    id: 'mat-4',
    name: 'Areia Lavada Fina',
    category: 'Básicos',
    unit: 'm³',
    stock: 12,
    minStock: 5,
    unitPrice: 135.00
  },
  {
    id: 'mat-5',
    name: 'Brita nº 1',
    category: 'Básicos',
    unit: 'm³',
    stock: 8,
    minStock: 4,
    unitPrice: 145.00
  },
  {
    id: 'mat-6',
    name: 'Tijolo Baiano 8 Furos 9x19x19',
    category: 'Básicos',
    unit: 'Milheiro',
    stock: 3,
    minStock: 2,
    unitPrice: 850.00
  },
  {
    id: 'mat-7',
    name: 'Tinta Acrílica Fosca Branca Premium 18L',
    category: 'Pintura',
    unit: 'Lata',
    stock: 14,
    minStock: 5,
    unitPrice: 349.90
  },
  {
    id: 'mat-8',
    name: 'Tubo de PVC Esgoto 100mm x 6m',
    category: 'Hidráulica',
    unit: 'Vara',
    stock: 22,
    minStock: 8,
    unitPrice: 72.30
  },
  {
    id: 'mat-9',
    name: 'Cabo Elétrico Flexível 2,5mm² - Rolo 100m',
    category: 'Elétrica',
    unit: 'Rolo',
    stock: 18,
    minStock: 6,
    unitPrice: 189.00
  }
];

export const INITIAL_BUDGETS: Budget[] = [
  {
    id: 'orc-101',
    clientId: 'cli-1',
    clientName: 'Guilherme Siqueira Vasconcelos',
    projectName: 'Reforma da Área de Lazer Residencial',
    date: '2026-06-25',
    status: 'Aprovado',
    items: [
      {
        materialId: 'mat-1',
        materialName: 'Cimento CP II 50kg',
        quantity: 15,
        unit: 'Saco',
        unitPrice: 42.50,
        totalPrice: 637.50
      },
      {
        materialId: 'mat-4',
        materialName: 'Areia Lavada Fina',
        quantity: 3,
        unit: 'm³',
        unitPrice: 135.00,
        totalPrice: 405.00
      },
      {
        materialId: 'mat-3',
        materialName: 'Vergalhão de Aço CA-50 10mm (3/8)',
        quantity: 5,
        unit: 'Barra (12m)',
        unitPrice: 68.00,
        totalPrice: 340.00
      },
      {
        materialId: 'mat-2',
        materialName: 'Argamassa AC-III 20kg',
        quantity: 10,
        unit: 'Saco',
        unitPrice: 31.90,
        totalPrice: 319.00
      }
    ],
    totalAmount: 1701.50,
    notes: 'Incluso estimativa de material para fundação e contrapiso da nova churrasqueira. Prazo de execução estimado de 15 dias úteis.'
  },
  {
    id: 'orc-102',
    clientId: 'cli-2',
    clientName: 'Incorporadora Sol da Manhã Ltda',
    projectName: 'Fundação da Torre B - Residencial Sol Nascente',
    date: '2026-06-27',
    status: 'Enviado',
    items: [
      {
        materialId: 'mat-1',
        materialName: 'Cimento CP II 50kg',
        quantity: 250,
        unit: 'Saco',
        unitPrice: 42.50,
        totalPrice: 10625.00
      },
      {
        materialId: 'mat-3',
        materialName: 'Vergalhão de Aço CA-50 10mm (3/8)',
        quantity: 80,
        unit: 'Barra (12m)',
        unitPrice: 68.00,
        totalPrice: 5440.00
      },
      {
        materialId: 'mat-4',
        materialName: 'Areia Lavada Fina',
        quantity: 25,
        unit: 'm³',
        unitPrice: 135.00,
        totalPrice: 3375.00
      },
      {
        materialId: 'mat-5',
        materialName: 'Brita nº 1',
        quantity: 30,
        unit: 'm³',
        unitPrice: 145.00,
        totalPrice: 4350.00
      }
    ],
    totalAmount: 23790.00,
    notes: 'Orçamento bruto de materiais estruturais fundamentais para a sapata corrida e vigas de fundação da Torre B. Mão de obra faturada à parte.'
  }
];

export const INITIAL_TRANSACTIONS: Transaction[] = [
  {
    id: 'tr-1',
    type: 'Receita',
    category: 'Clientes',
    amount: 15400.00,
    date: '2026-06-15',
    description: 'Entrada 50% - Reforma Guilherme Vasconcelos',
    referenceId: 'cli-1'
  },
  {
    id: 'tr-2',
    type: 'Despesa',
    category: 'Materiais',
    amount: 4350.00,
    date: '2026-06-18',
    description: 'Compra de 10m³ Areia e 20m³ Brita - Depósito Central',
    referenceId: 'mat-4'
  },
  {
    id: 'tr-3',
    type: 'Despesa',
    category: 'Salários',
    amount: 12500.00,
    date: '2026-06-05',
    description: 'Folha de pagamento mensal de funcionários de campo',
  },
  {
    id: 'tr-4',
    type: 'Receita',
    category: 'Condomínios',
    amount: 4800.00,
    date: '2026-06-10',
    description: 'Aporte de taxas condominiais mensais - Condomínio Vista Alegre',
    referenceId: 'cond-1'
  },
  {
    id: 'tr-5',
    type: 'Despesa',
    category: 'Serviços',
    amount: 850.00,
    date: '2026-06-22',
    description: 'Locação de betoneira por 15 dias - Obra Alvorada',
  },
  {
    id: 'tr-6',
    type: 'Receita',
    category: 'Clientes',
    amount: 45000.00,
    date: '2026-06-27',
    description: 'Medição da fundação aprovada - Torre B Sol Nascente',
    referenceId: 'cli-2'
  }
];

export const INITIAL_CONDOS: Condo[] = [
  {
    id: 'cond-1',
    name: 'Condomínio Vista Alegre',
    address: 'Rua das Oliveiras, 1000 - Jd. Europa, São Paulo - SP',
    totalUnits: 48,
    activeUnits: 42,
    monthlyFee: 350.00,
    currentBalance: 12450.00
  },
  {
    id: 'cond-2',
    name: 'Residencial Alvorada',
    address: 'Av. dos Ipês, 450 - Jd. Botanico, São Paulo - SP',
    totalUnits: 24,
    activeUnits: 18,
    monthlyFee: 420.00,
    currentBalance: 6800.00
  }
];

export const INITIAL_CONDO_BILLS: CondoBill[] = [
  {
    id: 'cb-1',
    condoId: 'cond-1',
    condoName: 'Condomínio Vista Alegre',
    type: 'Água',
    amount: 1845.50,
    billingMonth: '06/2026',
    dueDate: '2026-07-05',
    status: 'Pendente',
    description: 'Leitura geral do bloco A e B'
  },
  {
    id: 'cb-2',
    condoId: 'cond-1',
    condoName: 'Condomínio Vista Alegre',
    type: 'Luz',
    amount: 2150.20,
    billingMonth: '06/2026',
    dueDate: '2026-07-05',
    status: 'Pago',
    description: 'Iluminação das áreas comuns, portaria e bombas d\'água'
  },
  {
    id: 'cb-3',
    condoId: 'cond-2',
    condoName: 'Residencial Alvorada',
    type: 'Manutenção',
    amount: 980.00,
    billingMonth: '06/2026',
    dueDate: '2026-07-10',
    status: 'Pendente',
    description: 'Manutenção preventiva dos portões eletrônicos e cerca elétrica'
  },
  {
    id: 'cb-4',
    condoId: 'cond-2',
    condoName: 'Residencial Alvorada',
    type: 'Luz',
    amount: 890.40,
    billingMonth: '06/2026',
    dueDate: '2026-06-25',
    status: 'Pago',
    description: 'Consumo do canteiro de obras e áreas prontas'
  }
];

export const INITIAL_PROJECTS: Project[] = [
  {
    id: 'proj-1',
    name: 'Edifício Residencial Vista Bela',
    address: 'Av. das Nações, 1500 - Alto de Pinheiros, São Paulo - SP',
    startDate: '2026-05-01',
    endDate: '2026-12-15',
    status: 'Em Andamento',
    allocatedEmployees: [
      { employeeId: 'emp-1', employeeName: 'Carlos Roberto Silva', role: 'Mestre de Obras' },
      { employeeId: 'emp-4', employeeName: 'Ana Beatris Souza', role: 'Engenheira Civil' },
      { employeeId: 'emp-2', employeeName: 'José de Souza Santos', role: 'Pedreiro' }
    ],
    allocatedMaterials: [
      { materialId: 'mat-1', materialName: 'Cimento CP II 50kg', quantity: 50, unit: 'Saco' },
      { materialId: 'mat-3', materialName: 'Vergalhão de Aço CA-50 10mm (3/8)', quantity: 20, unit: 'Barra (12m)' },
      { materialId: 'mat-4', materialName: 'Areia Lavada Fina', quantity: 5, unit: 'm³' }
    ],
    phases: [
      {
        id: 'phase-1-1',
        name: 'Fundação',
        tasks: [
          {
            id: 'task-1-1',
            name: 'Terraplanagem e Marcação',
            deadline: '2026-05-15',
            responsibleId: 'emp-1',
            responsibleName: 'Carlos Roberto Silva',
            status: 'Concluído'
          },
          {
            id: 'task-1-2',
            name: 'Escavação e Concretagem de Sapatas',
            deadline: '2026-06-10',
            responsibleId: 'emp-4',
            responsibleName: 'Ana Beatris Souza',
            status: 'Concluído'
          }
        ]
      },
      {
        id: 'phase-1-2',
        name: 'Estrutura',
        tasks: [
          {
            id: 'task-1-3',
            name: 'Armação de Pilares e Colunas',
            deadline: '2026-07-20',
            responsibleId: 'emp-2',
            responsibleName: 'José de Souza Santos',
            status: 'Em Andamento'
          },
          {
            id: 'task-1-4',
            name: 'Concretagem de Lajes do 1º Pavimento',
            deadline: '2026-08-30',
            responsibleId: 'emp-1',
            responsibleName: 'Carlos Roberto Silva',
            status: 'A Fazer'
          }
        ]
      },
      {
        id: 'phase-1-3',
        name: 'Acabamento',
        tasks: [
          {
            id: 'task-1-5',
            name: 'Revestimento Cerâmico de Fachada',
            deadline: '2026-11-15',
            responsibleId: 'emp-3',
            responsibleName: 'Marcos Oliveira Lima',
            status: 'A Fazer'
          },
          {
            id: 'task-1-6',
            name: 'Instalação Elétrica e Pintura Interna',
            deadline: '2026-12-10',
            responsibleId: 'emp-5',
            responsibleName: 'Ricardo Mendes Gomes',
            status: 'A Fazer'
          }
        ]
      }
    ]
  },
  {
    id: 'proj-2',
    name: 'Condomínio Quinta dos Ipês',
    address: 'Estrada do Jaraguá, km 12 - Jaraguá, São Paulo - SP',
    startDate: '2026-06-10',
    endDate: '2027-04-20',
    status: 'Planejado',
    allocatedEmployees: [
      { employeeId: 'emp-4', employeeName: 'Ana Beatris Souza', role: 'Engenheira Civil' }
    ],
    allocatedMaterials: [
      { materialId: 'mat-1', materialName: 'Cimento CP II 50kg', quantity: 150, unit: 'Saco' }
    ],
    phases: [
      {
        id: 'phase-2-1',
        name: 'Fundação',
        tasks: [
          {
            id: 'task-2-1',
            name: 'Locação da Obra e Gabarito',
            deadline: '2026-07-10',
            responsibleId: 'emp-4',
            responsibleName: 'Ana Beatris Souza',
            status: 'A Fazer'
          },
          {
            id: 'task-2-2',
            name: 'Fundação por Estacas e Blocos',
            deadline: '2026-08-25',
            responsibleId: 'emp-1',
            responsibleName: 'Carlos Roberto Silva',
            status: 'A Fazer'
          }
        ]
      }
    ]
  }
];

