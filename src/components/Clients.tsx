import React, { useState } from 'react';
import { 
  Users, 
  UserPlus, 
  Search, 
  Phone, 
  Mail, 
  MapPin, 
  Building2, 
  UserCheck, 
  Check, 
  X,
  FileCheck2
} from 'lucide-react';
import { Client } from '../types';

interface ClientsProps {
  clients: Client[];
  onAddClient: (client: Omit<Client, 'id'>) => void;
  onUpdateClient: (client: Client) => void;
}

export default function Clients({ clients, onAddClient, onUpdateClient }: ClientsProps) {
  const [searchTerm, setSearchTerm] = useState('');
  const [showAddForm, setShowAddForm] = useState(false);
  const [selectedClient, setSelectedClient] = useState<Client | null>(null);

  // Form states
  const [name, setName] = useState('');
  const [cpfCnpj, setCpfCnpj] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [address, setAddress] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !cpfCnpj) {
      alert('Por favor, preencha o Nome e o CPF/CNPJ.');
      return;
    }

    onAddClient({
      name,
      cpfCnpj,
      email,
      phone,
      address,
      status: 'Ativo'
    });

    // Reset states
    setName('');
    setCpfCnpj('');
    setEmail('');
    setPhone('');
    setAddress('');
    setShowAddForm(false);
  };

  const handleToggleStatus = (client: Client) => {
    onUpdateClient({
      ...client,
      status: client.status === 'Ativo' ? 'Inativo' : 'Ativo'
    });
  };

  const filteredClients = clients.filter(c => 
    c.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    c.cpfCnpj.includes(searchTerm) ||
    c.email.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h2 id="clients-section-title" className="text-sm font-bold text-slate-800 uppercase tracking-wide border-l-4 border-amber-500 pl-2">
            Controle de Clientes
          </h2>
          <p className="text-slate-500 text-xs mt-1">Acompanhe parceiros comerciais, incorporadoras e clientes residenciais.</p>
        </div>
        <button
          onClick={() => setShowAddForm(!showAddForm)}
          className="flex items-center gap-2 bg-amber-500 hover:bg-amber-600 text-white font-bold px-3 py-1.5 rounded text-[11px] uppercase tracking-wider shadow-sm transition-all cursor-pointer"
        >
          <UserPlus className="h-3.5 w-3.5" />
          <span>{showAddForm ? 'Voltar para Lista' : 'Cadastrar Novo Cliente'}</span>
        </button>
      </div>

      {showAddForm ? (
        /* ADD CLIENT FORM */
        <div className="bg-white rounded-2xl p-6 shadow-sm border border-slate-200 animate-fadeIn">
          <h3 className="text-sm font-bold text-slate-800 mb-4 pb-2 border-b border-slate-100 flex items-center gap-1.5 border-l-4 border-amber-500 pl-2">
            Ficha de Cadastro de Cliente
          </h3>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-slate-500 mb-1">Nome Completo ou Razão Social *</label>
                <input
                  type="text"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Nome do cliente"
                  className="w-full border border-slate-200 rounded-lg p-2.5 text-xs focus:ring-1 focus:ring-amber-500 outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-500 mb-1">CPF ou CNPJ *</label>
                <input
                  type="text"
                  required
                  value={cpfCnpj}
                  onChange={(e) => setCpfCnpj(e.target.value)}
                  placeholder="Ex: 000.000.000-00 ou 00.000.000/0001-00"
                  className="w-full border border-slate-200 rounded-lg p-2.5 text-xs focus:ring-1 focus:ring-amber-500 outline-none"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-slate-500 mb-1">E-mail de Contato</label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="email@cliente.com"
                  className="w-full border border-slate-200 rounded-lg p-2.5 text-xs focus:ring-1 focus:ring-amber-500 outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-500 mb-1">Telefone / WhatsApp</label>
                <input
                  type="text"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  placeholder="Ex: (11) 98888-7777"
                  className="w-full border border-slate-200 rounded-lg p-2.5 text-xs focus:ring-1 focus:ring-amber-500 outline-none"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-500 mb-1">Endereço Comercial / Faturamento</label>
              <input
                type="text"
                value={address}
                onChange={(e) => setAddress(e.target.value)}
                placeholder="Rua, número, bairro, cidade - UF"
                className="w-full border border-slate-200 rounded-lg p-2.5 text-xs focus:ring-1 focus:ring-amber-500 outline-none"
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
                Cadastrar Cliente
              </button>
            </div>
          </form>
        </div>
      ) : (
        /* MAIN LIST & SIDE PROFILE */
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 animate-fadeIn">
          
          {/* Client List */}
          <div className="bg-white rounded-2xl p-5 shadow-sm border border-slate-200 lg:col-span-2 space-y-4">
            <div className="flex items-center gap-2 bg-white px-3 py-2 rounded border border-slate-250 shadow-sm">
              <Search className="h-4 w-4 text-slate-400" />
              <input
                type="text"
                placeholder="Buscar cliente por nome, CPF/CNPJ..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="bg-transparent border-none outline-none text-xs w-full text-slate-700 placeholder-slate-400"
              />
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="border-b border-slate-100 text-slate-400 text-[10px] font-bold uppercase tracking-wider">
                    <th className="py-2.5">Nome / Empresa</th>
                    <th className="py-2.5">Documento</th>
                    <th className="py-2.5">Status</th>
                    <th className="py-2.5 text-right">Ficha</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-50 text-xs">
                  {filteredClients.map(c => (
                    <tr 
                      key={c.id} 
                      className={`hover:bg-slate-50/50 transition-colors cursor-pointer ${selectedClient?.id === c.id ? 'bg-amber-50/40 font-medium' : ''}`}
                      onClick={() => setSelectedClient(c)}
                    >
                      <td className="py-3 font-semibold text-slate-800">
                        <div className="flex items-center gap-2">
                          <div className="p-1.5 bg-slate-100 rounded text-slate-500">
                            {c.cpfCnpj.length > 14 ? <Building2 className="h-3.5 w-3.5" /> : <Users className="h-3.5 w-3.5" />}
                          </div>
                          <span>{c.name}</span>
                        </div>
                      </td>
                      <td className="py-3 text-slate-500 font-mono">{c.cpfCnpj}</td>
                      <td className="py-3">
                        <span className={`px-2 py-0.5 rounded-full text-[10px] font-semibold ${
                          c.status === 'Ativo' ? 'bg-emerald-50 text-emerald-700' : 'bg-red-50 text-red-700'
                        }`}>
                          {c.status}
                        </span>
                      </td>
                      <td className="py-3 text-right" onClick={(e) => e.stopPropagation()}>
                        <button
                          onClick={() => setSelectedClient(c)}
                          className="text-xs text-amber-600 hover:text-amber-700 font-semibold"
                        >
                          Visualizar
                        </button>
                      </td>
                    </tr>
                  ))}
                  {filteredClients.length === 0 && (
                    <tr>
                      <td colSpan={4} className="py-8 text-center text-slate-400">
                        Nenhum cliente cadastrado.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>

          {/* Client Details Sidebar */}
          <div className="bg-white rounded-2xl p-5 shadow-sm border border-slate-200 lg:col-span-1">
            {selectedClient ? (
              <div className="space-y-4 animate-fadeIn">
                <div className="border-b border-slate-100 pb-3 flex justify-between items-start">
                  <div>
                    <h3 className="font-bold text-slate-800 text-sm">{selectedClient.name}</h3>
                    <p className="text-[10px] text-slate-400 font-mono mt-0.5">{selectedClient.cpfCnpj}</p>
                  </div>
                  <button
                    onClick={() => handleToggleStatus(selectedClient)}
                    className={`text-[10px] font-bold px-2 py-1 rounded transition-colors ${
                      selectedClient.status === 'Ativo' 
                        ? 'bg-red-50 hover:bg-red-100 text-red-600' 
                        : 'bg-emerald-50 hover:bg-emerald-100 text-emerald-600'
                    }`}
                  >
                    {selectedClient.status === 'Ativo' ? 'Inativar' : 'Ativar'}
                  </button>
                </div>

                <div className="space-y-3 text-xs text-slate-600">
                  <div className="flex items-center gap-2.5">
                    <Phone className="h-4 w-4 text-slate-400" />
                    <span>{selectedClient.phone || 'Nenhum telefone cadastrado'}</span>
                  </div>

                  <div className="flex items-center gap-2.5">
                    <Mail className="h-4 w-4 text-slate-400" />
                    <span>{selectedClient.email || 'Nenhum e-mail cadastrado'}</span>
                  </div>

                  <div className="flex items-start gap-2.5">
                    <MapPin className="h-4 w-4 text-slate-400 shrink-0 mt-0.5" />
                    <span>{selectedClient.address || 'Nenhum endereço cadastrado'}</span>
                  </div>
                </div>

                {/* Additional Client Context */}
                <div className="border-t border-slate-100 pt-4 space-y-2.5">
                  <h4 className="text-[10px] font-bold text-slate-400 uppercase tracking-wider flex items-center gap-1">
                    <FileCheck2 className="h-4 w-4 text-amber-500" />
                    <span>Relações de Orçamento</span>
                  </h4>
                  <div className="bg-slate-50 p-3 rounded-lg border border-slate-100 text-xs text-slate-600 space-y-1">
                    <p><strong>Situação Cadastral:</strong> Regular</p>
                    <p><strong>Projetos sob Contrato:</strong> Simulado Ativo</p>
                    <p className="text-[11px] text-slate-400">As relações com este cliente aparecem integradas à seção de orçamentos e fluxo de caixa financeiro da construtora.</p>
                  </div>
                </div>
              </div>
            ) : (
              <div className="text-center py-12 text-slate-400 text-xs space-y-2">
                <UserCheck className="h-8 w-8 text-slate-300 mx-auto" />
                <p>Selecione um cliente da lista para ver a ficha completa de contato e faturamento.</p>
              </div>
            )}
          </div>

        </div>
      )}
    </div>
  );
}
