import React, { useState } from 'react';
import { 
  FileText, 
  Plus, 
  Search, 
  Send, 
  Printer, 
  Mail, 
  MessageSquare, 
  User, 
  Package, 
  Coins, 
  Check, 
  X, 
  FileDown, 
  BookmarkCheck,
  AlertCircle
} from 'lucide-react';
import { Budget, BudgetItem, Client, Material } from '../types';

interface BudgetsProps {
  budgets: Budget[];
  clients: Client[];
  materials: Material[];
  onAddBudget: (budget: Omit<Budget, 'id'>) => void;
  onUpdateBudget: (budget: Budget) => void;
}

export default function Budgets({ budgets, clients, materials, onAddBudget, onUpdateBudget }: BudgetsProps) {
  const [searchTerm, setSearchTerm] = useState('');
  const [showAddForm, setShowAddForm] = useState(false);
  const [selectedBudget, setSelectedBudget] = useState<Budget | null>(null);
  
  // Create budget state
  const [clientId, setClientId] = useState('');
  const [projectName, setProjectName] = useState('');
  const [notes, setNotes] = useState('');
  const [budgetItems, setBudgetItems] = useState<BudgetItem[]>([]);
  
  // Item adding state
  const [selectedMatId, setSelectedMatId] = useState('');
  const [itemQty, setItemQty] = useState('');

  // Share Dialog States
  const [shareType, setShareType] = useState<'whatsapp' | 'email' | null>(null);
  const [shareTarget, setShareTarget] = useState('');

  // Filter budgets
  const filteredBudgets = budgets.filter(b => 
    b.projectName.toLowerCase().includes(searchTerm.toLowerCase()) ||
    b.clientName.toLowerCase().includes(searchTerm.toLowerCase()) ||
    b.id.includes(searchTerm)
  );

  const handleAddItem = () => {
    if (!selectedMatId || !itemQty || parseFloat(itemQty) <= 0) {
      alert('Selecione um material e insira uma quantidade válida.');
      return;
    }

    const mat = materials.find(m => m.id === selectedMatId);
    if (!mat) return;

    // Check if already exists in current list
    const existingIndex = budgetItems.findIndex(item => item.materialId === selectedMatId);
    if (existingIndex > -1) {
      const updated = [...budgetItems];
      const newQty = updated[existingIndex].quantity + parseFloat(itemQty);
      updated[existingIndex] = {
        ...updated[existingIndex],
        quantity: newQty,
        totalPrice: newQty * mat.unitPrice
      };
      setBudgetItems(updated);
    } else {
      setBudgetItems([
        ...budgetItems,
        {
          materialId: mat.id,
          materialName: mat.name,
          quantity: parseFloat(itemQty),
          unit: mat.unit,
          unitPrice: mat.unitPrice,
          totalPrice: parseFloat(itemQty) * mat.unitPrice
        }
      ]);
    }

    setSelectedMatId('');
    setItemQty('');
  };

  const handleRemoveItem = (index: number) => {
    setBudgetItems(budgetItems.filter((_, i) => i !== index));
  };

  const handleSaveBudget = (e: React.FormEvent) => {
    e.preventDefault();
    if (!clientId || !projectName || budgetItems.length === 0) {
      alert('Preencha os dados do cliente, nome do projeto e adicione pelo menos 1 material.');
      return;
    }

    const client = clients.find(c => c.id === clientId);
    if (!client) return;

    const totalAmount = budgetItems.reduce((acc, item) => acc + item.totalPrice, 0);

    onAddBudget({
      clientId: client.id,
      clientName: client.name,
      projectName,
      date: new Date().toISOString().split('T')[0],
      status: 'Rascunho',
      items: budgetItems,
      totalAmount,
      notes
    });

    // Reset Form
    setClientId('');
    setProjectName('');
    setNotes('');
    setBudgetItems([]);
    setShowAddForm(false);
    alert('Orçamento criado com sucesso como Rascunho!');
  };

  const handleStatusChange = (budget: Budget, newStatus: Budget['status']) => {
    const updated = { ...budget, status: newStatus };
    onUpdateBudget(updated);
    if (selectedBudget?.id === budget.id) {
      setSelectedBudget(updated);
    }
  };

  // Simulated PDF Downloader
  const handleDownloadPDF = (budget: Budget) => {
    alert(`Iniciando download do PDF do Orçamento ${budget.id}.pdf...\nDocumento estruturado e preparado para impressão com quebra de página automática.`);
    window.print();
  };

  // Share message compilers
  const getWhatsAppLink = (budget: Budget) => {
    const phoneNum = shareTarget.replace(/\D/g, '') || '5511999999999';
    const msg = encodeURIComponent(
      `*Orçamento de Construção - Construtora*\n\n` +
      `Olá, *${budget.clientName}*!\n` +
      `Segue o orçamento detalhado do seu projeto *"${budget.projectName}"*.\n\n` +
      `*Código:* ${budget.id}\n` +
      `*Data:* ${new Date(budget.date).toLocaleDateString('pt-BR')}\n` +
      `*Valor Total:* ${budget.totalAmount.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}\n\n` +
      `*Materiais Consumidos:* \n` +
      budget.items.map(i => `• ${i.quantity}x ${i.materialName} (${i.unit})`).join('\n') +
      `\n\n_Dúvidas estamos à disposição no WhatsApp. Obrigado!_`
    );
    return `https://api.whatsapp.com/send?phone=${phoneNum}&text=${msg}`;
  };

  const getEmailHref = (budget: Budget) => {
    const email = shareTarget || 'cliente@email.com';
    const subject = encodeURIComponent(`Orçamento de Construção - Código ${budget.id}`);
    const body = encodeURIComponent(
      `Olá, ${budget.clientName}.\n\n` +
      `Agradecemos a oportunidade de apresentar nossa proposta comercial para o projeto "${budget.projectName}".\n\n` +
      `Valor Estimado de Insumos: ${budget.totalAmount.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}\n` +
      `Data de Emissão: ${new Date(budget.date).toLocaleDateString('pt-BR')}\n\n` +
      `Relação detalhada de materiais de construção inclusos:\n` +
      budget.items.map(i => `- ${i.quantity} ${i.unit} de ${i.materialName} (R$ ${i.unitPrice.toFixed(2)} / un)`).join('\n') +
      `\n\nObservações: ${budget.notes}\n\n` +
      `Permanecemos à inteira disposição para eventuais esclarecimentos.\n\n` +
      `Atenciosamente,\nSetor Comercial - Construtora`
    );
    return `mailto:${email}?subject=${subject}&body=${body}`;
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h2 id="budgets-section-title" className="text-sm font-bold text-slate-800 uppercase tracking-wide border-l-4 border-amber-500 pl-2">
            Gestão & Elaboração de Orçamentos
          </h2>
          <p className="text-slate-500 text-xs mt-1">Calcule automaticamente o consumo de insumos e emita orçamentos prontos para impressão ou envio rápido.</p>
        </div>
        <button
          onClick={() => {
            setShowAddForm(!showAddForm);
            setSelectedBudget(null);
          }}
          className="flex items-center gap-2 bg-amber-500 hover:bg-amber-600 text-white font-bold px-3 py-1.5 rounded text-[11px] uppercase tracking-wider shadow-sm transition-all cursor-pointer"
        >
          <Plus className="h-3.5 w-3.5" />
          <span>{showAddForm ? 'Voltar para Propostas' : 'Gerar Novo Orçamento'}</span>
        </button>
      </div>

      {showAddForm ? (
        /* BUDGET CREATION WORKBENCH */
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 animate-fadeIn">
          
          {/* Form Side */}
          <div className="bg-white rounded-xl p-5 shadow-sm border border-slate-100 lg:col-span-7 space-y-4">
            <h3 className="font-bold text-slate-800 text-xs uppercase tracking-wider text-slate-400 pb-2 border-b border-slate-100">
              Dados do Projeto & Cliente
            </h3>

            <form onSubmit={handleSaveBudget} className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-500 mb-1">Cliente Solicitante *</label>
                  <select
                    value={clientId}
                    onChange={(e) => setClientId(e.target.value)}
                    required
                    className="w-full border border-slate-200 rounded-lg p-2.5 text-xs bg-white outline-none focus:ring-1 focus:ring-amber-500 cursor-pointer"
                  >
                    <option value="">-- Escolher Cliente --</option>
                    {clients.map(c => (
                      <option key={c.id} value={c.id}>{c.name}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-500 mb-1">Nome da Obra / Projeto *</label>
                  <input
                    type="text"
                    required
                    value={projectName}
                    onChange={(e) => setProjectName(e.target.value)}
                    placeholder="Ex: Ampliação do Muro ou Reforma Banheiro"
                    className="w-full border border-slate-200 rounded-lg p-2.5 text-xs focus:ring-1 focus:ring-amber-500 outline-none"
                  />
                </div>
              </div>

              {/* MATERIAL SELECTOR TO BUDGET */}
              <div className="p-4 bg-slate-50 rounded-xl border border-slate-200/60 space-y-3">
                <div className="flex items-center gap-1 text-slate-700 font-bold text-xs">
                  <Package className="h-4 w-4 text-amber-600" />
                  <span>Adicionar Consumo de Materiais</span>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-12 gap-3 items-end">
                  <div className="md:col-span-7">
                    <label className="block text-[10px] font-semibold text-slate-500 mb-1">Insumo do Estoque</label>
                    <select
                      value={selectedMatId}
                      onChange={(e) => setSelectedMatId(e.target.value)}
                      className="w-full border border-slate-200 rounded-lg p-2 text-xs bg-white outline-none focus:ring-1 focus:ring-amber-500 cursor-pointer"
                    >
                      <option value="">-- Escolher material para consumir --</option>
                      {materials.map(m => (
                        <option key={m.id} value={m.id}>{m.name} (R$ {m.unitPrice.toFixed(2)} / {m.unit})</option>
                      ))}
                    </select>
                  </div>

                  <div className="md:col-span-3">
                    <label className="block text-[10px] font-semibold text-slate-500 mb-1">Qtd Necessária</label>
                    <input
                      type="number"
                      step="0.1"
                      placeholder="Ex: 10"
                      value={itemQty}
                      onChange={(e) => setItemQty(e.target.value)}
                      className="w-full border border-slate-200 rounded-lg p-2 text-xs outline-none focus:ring-1 focus:ring-amber-500"
                    />
                  </div>

                  <div className="md:col-span-2">
                    <button
                      type="button"
                      onClick={handleAddItem}
                      className="w-full bg-slate-800 hover:bg-slate-700 text-white font-bold py-2 rounded-lg text-xs transition-colors cursor-pointer"
                    >
                      Inserir
                    </button>
                  </div>
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-500 mb-1">Anotações do Engenheiro / Termos de Execução</label>
                <textarea
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  rows={3}
                  placeholder="Instruções de fundações, prazos de cura do concreto, ou fretes especiais..."
                  className="w-full border border-slate-200 rounded-lg p-2.5 text-xs outline-none focus:ring-1 focus:ring-amber-500"
                />
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
                  Salvar Rascunho do Orçamento
                </button>
              </div>
            </form>
          </div>

          {/* Dynamic Budget Consuming Items List (Right Side) */}
          <div className="bg-white rounded-xl p-5 shadow-sm border border-slate-100 lg:col-span-5 space-y-4">
            <h3 className="font-bold text-slate-800 text-xs uppercase tracking-wider text-slate-400 pb-2 border-b border-slate-100 flex justify-between items-center">
              <span>Lista de Materiais Consumidos</span>
              <span className="text-amber-600 font-mono font-bold text-sm">
                {budgetItems.reduce((acc, i) => acc + i.totalPrice, 0).toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}
              </span>
            </h3>

            <div className="space-y-2 max-h-[350px] overflow-y-auto pr-1">
              {budgetItems.length === 0 ? (
                <div className="text-center py-16 text-slate-400 text-xs space-y-1">
                  <Package className="h-8 w-8 text-slate-200 mx-auto" />
                  <p>Adicione materiais de construção utilizando o seletor ao lado para compor os custos desta obra.</p>
                </div>
              ) : (
                budgetItems.map((item, index) => (
                  <div key={index} className="flex justify-between items-center p-3 bg-slate-50 rounded-lg border border-slate-150 text-xs">
                    <div>
                      <p className="font-semibold text-slate-800">{item.materialName}</p>
                      <p className="text-[10px] text-slate-400">
                        {item.quantity} x {item.unitPrice.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })} / {item.unit}
                      </p>
                    </div>
                    <div className="flex items-center gap-3">
                      <span className="font-mono font-bold text-slate-800">
                        {item.totalPrice.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}
                      </span>
                      <button
                        type="button"
                        onClick={() => handleRemoveItem(index)}
                        className="text-red-500 hover:text-red-700 p-1"
                        title="Remover Item"
                      >
                        <X className="h-3.5 w-3.5" />
                      </button>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>

        </div>
      ) : (
        /* MAIN LIST & DETAILED PROPOSAL PRINT / SHARE */
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 animate-fadeIn">
          
          {/* Proposals List */}
          <div className="bg-white rounded-xl p-5 shadow-sm border border-slate-100 lg:col-span-1.5 space-y-4">
            <div className="flex items-center gap-2 bg-slate-50 px-3 py-2 rounded-lg border border-slate-100 shadow-inner">
              <Search className="h-4 w-4 text-slate-400" />
              <input
                type="text"
                placeholder="Buscar por obra ou cliente..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="bg-transparent border-none outline-none text-xs w-full text-slate-700 placeholder-slate-400"
              />
            </div>

            <div className="space-y-3 max-h-[500px] overflow-y-auto pr-1">
              {filteredBudgets.map(b => (
                <div
                  key={b.id}
                  onClick={() => {
                    setSelectedBudget(b);
                    setShareType(null);
                  }}
                  className={`p-4 rounded-xl border transition-all cursor-pointer text-xs space-y-2.5 ${
                    selectedBudget?.id === b.id 
                      ? 'bg-amber-50/50 border-amber-400 shadow-sm' 
                      : 'bg-white border-slate-150 hover:bg-slate-50/50'
                  }`}
                >
                  <div className="flex justify-between items-start">
                    <div>
                      <p className="font-bold text-slate-800">{b.projectName}</p>
                      <p className="text-[11px] text-slate-500">{b.clientName}</p>
                    </div>
                    <span className={`px-2 py-0.5 rounded text-[9px] font-bold ${
                      b.status === 'Aprovado' ? 'bg-emerald-50 text-emerald-700' :
                      b.status === 'Enviado' ? 'bg-blue-50 text-blue-700' :
                      b.status === 'Recusado' ? 'bg-red-50 text-red-700' : 'bg-slate-100 text-slate-700'
                    }`}>
                      {b.status}
                    </span>
                  </div>

                  <div className="flex justify-between items-center pt-2 border-t border-slate-100 text-[10px] text-slate-400 font-mono">
                    <span>{new Date(b.date).toLocaleDateString('pt-BR')} • {b.items.length} itens</span>
                    <span className="font-bold text-slate-800 text-xs">
                      {b.totalAmount.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}
                    </span>
                  </div>
                </div>
              ))}
              {filteredBudgets.length === 0 && (
                <p className="text-center py-12 text-slate-400">Nenhum orçamento cadastrado.</p>
              )}
            </div>
          </div>

          {/* Detailed Printable View / Share controls */}
          <div className="bg-white rounded-xl p-5 shadow-sm border border-slate-100 lg:col-span-2">
            {selectedBudget ? (
              <div className="space-y-5 animate-fadeIn">
                
                {/* Proposal Actions Toolbar */}
                <div className="flex flex-wrap items-center justify-between gap-3 pb-3 border-b border-slate-150">
                  <div className="flex items-center gap-1.5">
                    <button
                      onClick={() => handleDownloadPDF(selectedBudget)}
                      className="flex items-center gap-1 bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold px-2.5 py-1.5 rounded-md text-[10px] transition-colors cursor-pointer"
                      title="Gerar PDF para Impressão"
                    >
                      <Printer className="h-3.5 w-3.5" />
                      <span>Gerar PDF / Imprimir</span>
                    </button>

                    <button
                      onClick={() => {
                        setShareType('whatsapp');
                        setShareTarget(clients.find(c => c.name === selectedBudget.clientName)?.phone || '');
                      }}
                      className="flex items-center gap-1 bg-emerald-50 hover:bg-emerald-100 text-emerald-700 font-semibold px-2.5 py-1.5 rounded-md text-[10px] transition-colors cursor-pointer"
                    >
                      <MessageSquare className="h-3.5 w-3.5" />
                      <span>Enviar WhatsApp</span>
                    </button>

                    <button
                      onClick={() => {
                        setShareType('email');
                        setShareTarget(clients.find(c => c.name === selectedBudget.clientName)?.email || '');
                      }}
                      className="flex items-center gap-1 bg-blue-50 hover:bg-blue-100 text-blue-700 font-semibold px-2.5 py-1.5 rounded-md text-[10px] transition-colors cursor-pointer"
                    >
                      <Mail className="h-3.5 w-3.5" />
                      <span>Enviar E-mail</span>
                    </button>
                  </div>

                  {/* Status Toggle buttons */}
                  <div className="flex gap-1">
                    {selectedBudget.status !== 'Aprovado' && (
                      <button
                        onClick={() => handleStatusChange(selectedBudget, 'Aprovado')}
                        className="bg-emerald-600 hover:bg-emerald-700 text-white font-bold p-1.5 rounded-md text-[10px]"
                        title="Aprovar Orçamento"
                      >
                        <Check className="h-3.5 w-3.5" />
                      </button>
                    )}
                    {selectedBudget.status !== 'Recusado' && (
                      <button
                        onClick={() => handleStatusChange(selectedBudget, 'Recusado')}
                        className="bg-red-600 hover:bg-red-700 text-white font-bold p-1.5 rounded-md text-[10px]"
                        title="Recusar Orçamento"
                      >
                        <X className="h-3.5 w-3.5" />
                      </button>
                    )}
                  </div>
                </div>

                {/* SHARE DRAWER OVERLAY */}
                {shareType && (
                  <div className="bg-slate-50 p-4 rounded-xl border border-slate-200 space-y-3 animate-fadeIn">
                    <div className="flex justify-between items-center">
                      <h4 className="text-xs font-bold text-slate-700 uppercase flex items-center gap-1">
                        <Send className="h-3.5 w-3.5 text-amber-600" />
                        <span>Compartilhamento Simulado</span>
                      </h4>
                      <button onClick={() => setShareType(null)}>
                        <X className="h-4 w-4 text-slate-400 hover:text-slate-600" />
                      </button>
                    </div>

                    <div className="flex gap-2">
                      <div className="grow">
                        <label className="block text-[10px] font-semibold text-slate-500 mb-1">
                          {shareType === 'whatsapp' ? 'Número WhatsApp' : 'Endereço de E-mail'}
                        </label>
                        <input
                          type="text"
                          value={shareTarget}
                          onChange={(e) => setShareTarget(e.target.value)}
                          placeholder={shareType === 'whatsapp' ? 'Ex: (11) 99999-8888' : 'Ex: cliente@email.com'}
                          className="w-full bg-white border border-slate-200 rounded-lg p-2 text-xs outline-none"
                        />
                      </div>

                      <div className="self-end">
                        {shareType === 'whatsapp' ? (
                          <a
                            href={getWhatsAppLink(selectedBudget)}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-semibold px-4 py-2.5 rounded-lg inline-flex items-center gap-1"
                          >
                            <span>WhatsApp Web ↗</span>
                          </a>
                        ) : (
                          <a
                            href={getEmailHref(selectedBudget)}
                            className="bg-blue-600 hover:bg-blue-700 text-white text-xs font-semibold px-4 py-2.5 rounded-lg inline-flex items-center gap-1"
                          >
                            <span>Disparar Mailto ↗</span>
                          </a>
                        )}
                      </div>
                    </div>
                  </div>
                )}

                {/* PRINTABLE INVOICE / PDF PREVIEW */}
                <div className="bg-white border-2 border-slate-100 rounded-2xl p-6 space-y-6 shadow-sm print:border-none print:shadow-none" id="pdf-invoice-preview">
                  
                  {/* Company Info & Budget info */}
                  <div className="flex justify-between items-start pb-4 border-b border-dashed border-slate-200">
                    <div>
                      <h2 className="text-sm font-extrabold text-amber-700 tracking-wider flex items-center gap-1 uppercase">
                        <BookmarkCheck className="h-5 w-5" />
                        <span>CONSTRUTORA S/A GESTÃO</span>
                      </h2>
                      <p className="text-[10px] text-slate-500 font-sans mt-0.5">CNPJ: 12.000.999/0001-50</p>
                      <p className="text-[10px] text-slate-500 font-sans">Av. das Nações Unidas, 1000 - São Paulo SP</p>
                    </div>

                    <div className="text-right">
                      <p className="text-xs font-bold text-slate-800">PROPOSTA ORÇAMENTÁRIA</p>
                      <p className="text-[11px] text-amber-600 font-bold font-mono">Código: #{selectedBudget.id}</p>
                      <p className="text-[10px] text-slate-400 font-mono">Emissão: {new Date(selectedBudget.date).toLocaleDateString('pt-BR')}</p>
                    </div>
                  </div>

                  {/* Client and Project Info */}
                  <div className="bg-slate-50/50 p-4 rounded-lg space-y-1.5 text-xs">
                    <p><strong>Cliente:</strong> {selectedBudget.clientName}</p>
                    <p><strong>Projeto / Obra:</strong> {selectedBudget.projectName}</p>
                    <p className="text-slate-400 text-[10px]">As fundações e acabamentos seguem o cronograma de entrega acordado com o gestor técnico.</p>
                  </div>

                  {/* Consumed Materials Breakdown */}
                  <div className="space-y-2">
                    <h4 className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Tipos de Materiais que Irá Consumir</h4>
                    
                    <div className="overflow-x-auto">
                      <table className="w-full text-left text-xs border-collapse">
                        <thead>
                          <tr className="border-b border-slate-200 font-bold text-slate-500 text-[10px] uppercase">
                            <th className="py-2">Item</th>
                            <th className="py-2 text-right">Qtd</th>
                            <th className="py-2 text-right">Valor Un.</th>
                            <th className="py-2 text-right">Valor Total</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-100">
                          {selectedBudget.items.map((item, idx) => (
                            <tr key={idx}>
                              <td className="py-2.5 text-slate-800">
                                <span className="font-semibold">{item.materialName}</span>
                                <span className="text-[10px] text-slate-400 block font-mono">Un: {item.unit}</span>
                              </td>
                              <td className="py-2.5 text-right text-slate-600 font-mono">{item.quantity}</td>
                              <td className="py-2.5 text-right text-slate-600 font-mono">
                                {item.unitPrice.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}
                              </td>
                              <td className="py-2.5 text-right font-semibold text-slate-800 font-mono">
                                {item.totalPrice.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </div>

                  {/* Total Value and Notes */}
                  <div className="border-t border-dashed border-slate-200 pt-4 flex flex-col md:flex-row justify-between items-start gap-4">
                    <div className="max-w-md text-[10px] text-slate-500 leading-normal font-sans">
                      <p className="font-bold text-slate-600">Observações contratuais:</p>
                      <p>{selectedBudget.notes || 'Nenhuma anotação extra incluída no escopo.'}</p>
                    </div>

                    <div className="text-right bg-slate-900 text-slate-100 p-4 rounded-xl min-w-[200px]">
                      <span className="text-[10px] font-mono tracking-widest text-slate-400 block uppercase">Valor Total Estimado</span>
                      <span className="text-xl font-mono font-bold text-amber-400">
                        {selectedBudget.totalAmount.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}
                      </span>
                      <span className="text-[9px] text-slate-400 block mt-1">Materiais tributados inclusos</span>
                    </div>
                  </div>

                </div>

              </div>
            ) : (
              <div className="text-center py-20 text-slate-400 text-xs space-y-2">
                <AlertCircle className="h-8 w-8 text-slate-300 mx-auto" />
                <p>Selecione um orçamento comercial da lista para visualizar a ficha de faturamento de materiais, gerar o PDF de envio ou enviar mensagens integradas ao cliente.</p>
              </div>
            )}
          </div>

        </div>
      )}
    </div>
  );
}
