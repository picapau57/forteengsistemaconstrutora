import React, { useState } from 'react';
import { 
  Package, 
  Plus, 
  Search, 
  AlertTriangle, 
  CheckCircle, 
  Coins, 
  TrendingUp, 
  Sparkles,
  RefreshCw,
  PlusCircle,
  FolderOpen
} from 'lucide-react';
import { Material } from '../types';

interface MaterialsProps {
  materials: Material[];
  onAddMaterial: (mat: Omit<Material, 'id'>) => void;
  onUpdateMaterial: (mat: Material) => void;
}

export default function Materials({ materials, onAddMaterial, onUpdateMaterial }: MaterialsProps) {
  const [searchTerm, setSearchTerm] = useState('');
  const [showAddForm, setShowAddForm] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState('Todos');

  // Form states
  const [name, setName] = useState('');
  const [category, setCategory] = useState('Básicos');
  const [unit, setUnit] = useState('Saco');
  const [stock, setStock] = useState('');
  const [minStock, setMinStock] = useState('');
  const [unitPrice, setUnitPrice] = useState('');

  // Quick restocking state
  const [restockId, setRestockId] = useState('');
  const [restockQty, setRestockQty] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !stock || !minStock || !unitPrice) {
      alert('Por favor, preencha todos os campos obrigatórios.');
      return;
    }

    onAddMaterial({
      name,
      category,
      unit,
      stock: parseFloat(stock),
      minStock: parseFloat(minStock),
      unitPrice: parseFloat(unitPrice)
    });

    setName('');
    setStock('');
    setMinStock('');
    setUnitPrice('');
    setShowAddForm(false);
  };

  const handleRestock = (e: React.FormEvent) => {
    e.preventDefault();
    if (!restockId || !restockQty || parseFloat(restockQty) <= 0) {
      alert('Por favor, informe a quantidade para reabastecimento.');
      return;
    }

    const material = materials.find(m => m.id === restockId);
    if (material) {
      const updated = {
        ...material,
        stock: material.stock + parseFloat(restockQty)
      };
      onUpdateMaterial(updated);
      setRestockId('');
      setRestockQty('');
      alert(`Estoque de ${material.name} reabastecido com sucesso!`);
    }
  };

  const categories = ['Todos', 'Básicos', 'Acabamento', 'Ferragem', 'Hidráulica', 'Elétrica', 'Pintura'];

  // Filter materials
  const filteredMaterials = materials.filter(mat => {
    const matchesSearch = mat.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
                          mat.category.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCat = selectedCategory === 'Todos' || mat.category === selectedCategory;
    return matchesSearch && matchesCat;
  });

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h2 id="materials-section-title" className="text-sm font-bold text-slate-800 uppercase tracking-wide border-l-4 border-amber-500 pl-2">
            Cadastro & Gestão de Materiais
          </h2>
          <p className="text-slate-500 text-xs mt-1">Monitore os níveis de estoque de canteiro, configure alertas críticos e gerencie valores de custo.</p>
        </div>
        <button
          onClick={() => {
            setShowAddForm(!showAddForm);
            setRestockId('');
          }}
          className="flex items-center gap-2 bg-amber-500 hover:bg-amber-600 text-white font-bold px-3 py-1.5 rounded text-[11px] uppercase tracking-wider shadow-sm transition-all cursor-pointer"
        >
          <Plus className="h-3.5 w-3.5" />
          <span>{showAddForm ? 'Voltar para Estoque' : 'Cadastrar Novo Insumo'}</span>
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        
        {/* LEFT COLUMN: Controls / Restock / Add form */}
        <div className="lg:col-span-1 space-y-5">
          {showAddForm ? (
            /* ADD FORM */
            <div className="bg-white rounded-2xl p-5 shadow-sm border border-slate-200 space-y-4 animate-fadeIn">
              <h3 className="font-bold text-slate-800 text-xs flex items-center gap-1.5 uppercase tracking-wider border-l-4 border-amber-500 pl-2">
                Novo Insumo
              </h3>
              
              <form onSubmit={handleSubmit} className="space-y-3.5">
                <div>
                  <label className="block text-[11px] font-semibold text-slate-500 mb-1">Nome do Material *</label>
                  <input
                    type="text"
                    required
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="Ex: Cimento CP IV 50kg"
                    className="w-full border border-slate-200 rounded-lg p-2 text-xs focus:ring-1 focus:ring-amber-500 outline-none"
                  />
                </div>

                <div>
                  <label className="block text-[11px] font-semibold text-slate-500 mb-1">Categoria</label>
                  <select
                    value={category}
                    onChange={(e) => setCategory(e.target.value)}
                    className="w-full border border-slate-200 rounded-lg p-2 text-xs bg-white outline-none focus:ring-1 focus:ring-amber-500"
                  >
                    <option value="Básicos">Básicos (Areia, cimento, tijolo)</option>
                    <option value="Acabamento">Acabamento (Pisos, argamassa)</option>
                    <option value="Ferragem">Ferragem (Vergalhões, pregos)</option>
                    <option value="Hidráulica">Hidráulica (Tubos, conexões)</option>
                    <option value="Elétrica">Elétrica (Fiação, disjuntores)</option>
                    <option value="Pintura">Pintura (Tintas, massas)</option>
                  </select>
                </div>

                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <label className="block text-[11px] font-semibold text-slate-500 mb-1">Unidade *</label>
                    <input
                      type="text"
                      required
                      value={unit}
                      onChange={(e) => setUnit(e.target.value)}
                      placeholder="Saco, m³, Barra"
                      className="w-full border border-slate-200 rounded-lg p-2 text-xs focus:ring-1 focus:ring-amber-500 outline-none"
                    />
                  </div>
                  <div>
                    <label className="block text-[11px] font-semibold text-slate-500 mb-1">Preço Un. (R$) *</label>
                    <input
                      type="number"
                      step="0.01"
                      required
                      value={unitPrice}
                      onChange={(e) => setUnitPrice(e.target.value)}
                      placeholder="Ex: 45.90"
                      className="w-full border border-slate-200 rounded-lg p-2 text-xs focus:ring-1 focus:ring-amber-500 outline-none"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <label className="block text-[11px] font-semibold text-slate-500 mb-1">Estoque Inicial *</label>
                    <input
                      type="number"
                      required
                      value={stock}
                      onChange={(e) => setStock(e.target.value)}
                      placeholder="Ex: 100"
                      className="w-full border border-slate-200 rounded-lg p-2 text-xs focus:ring-1 focus:ring-amber-500 outline-none"
                    />
                  </div>
                  <div>
                    <label className="block text-[11px] font-semibold text-slate-500 mb-1">Estoque Mín. *</label>
                    <input
                      type="number"
                      required
                      value={minStock}
                      onChange={(e) => setMinStock(e.target.value)}
                      placeholder="Ex: 15"
                      className="w-full border border-slate-200 rounded-lg p-2 text-xs focus:ring-1 focus:ring-amber-500 outline-none"
                    />
                  </div>
                </div>

                <button
                  type="submit"
                  className="w-full bg-amber-600 hover:bg-amber-700 text-white font-semibold py-2.5 rounded-lg text-xs transition-colors cursor-pointer"
                >
                  Confirmar Cadastro
                </button>
              </form>
            </div>
          ) : (
            /* QUICK RESTOCK FORM */
            <div className="bg-white rounded-2xl p-5 shadow-sm border border-slate-200 space-y-4 animate-fadeIn">
              <h3 className="font-bold text-slate-800 text-xs flex items-center gap-1.5 uppercase tracking-wider border-l-4 border-slate-900 pl-2">
                Entrada de Mercadoria / Obra
              </h3>

              <form onSubmit={handleRestock} className="space-y-3.5">
                <div>
                  <label className="block text-[11px] font-semibold text-slate-500 mb-1">Selecione o Insumo</label>
                  <select
                    value={restockId}
                    onChange={(e) => setRestockId(e.target.value)}
                    required
                    className="w-full border border-slate-200 rounded-lg p-2 text-xs bg-white outline-none focus:ring-1 focus:ring-amber-500 cursor-pointer"
                  >
                    <option value="">-- Escolher material --</option>
                    {materials.map(m => (
                      <option key={m.id} value={m.id}>{m.name} ({m.unit})</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-[11px] font-semibold text-slate-500 mb-1">Quantidade Adicionada</label>
                  <input
                    type="number"
                    step="0.1"
                    required
                    placeholder="Ex: 50"
                    value={restockQty}
                    onChange={(e) => setRestockQty(e.target.value)}
                    className="w-full border border-slate-200 rounded-lg p-2 text-xs focus:ring-1 focus:ring-amber-500 outline-none"
                  />
                </div>

                <button
                  type="submit"
                  className="w-full bg-slate-900 hover:bg-slate-850 text-white font-bold py-2.5 rounded text-[11px] uppercase tracking-wider shadow-sm transition-all cursor-pointer"
                >
                  Lançar Entrada no Estoque
                </button>
              </form>
            </div>
          )}

          {/* Quick Metrics of Stock */}
          <div className="bg-white rounded-2xl p-5 border border-slate-200 space-y-3">
            <div className="flex items-center gap-1.5 text-slate-900 font-bold text-xs uppercase tracking-wider border-l-4 border-amber-500 pl-2">
              Custos Logísticos
            </div>
            <p className="text-xs text-slate-600 leading-normal font-medium">
              Manter o estoque alinhado reduz os fretes emergenciais em até 40%. Planeje os orçamentos relacionando estes itens diretamente.
            </p>
            <div className="flex items-center gap-1.5 text-[10px] text-amber-700 font-mono font-bold uppercase tracking-wider">
              <span>✓ Preços médios atualizados</span>
            </div>
          </div>
        </div>

        {/* RIGHT COLUMN: Materials list / categories */}
        <div className="lg:col-span-3 space-y-4">
          
          {/* Category Filters */}
          <div className="flex flex-wrap gap-1.5 overflow-x-auto pb-1">
            {categories.map(cat => (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className={`px-3 py-1 text-xs font-bold transition-all rounded cursor-pointer uppercase tracking-wider ${
                  selectedCategory === cat 
                    ? 'bg-amber-500 text-white shadow-sm' 
                    : 'bg-white border border-slate-200 text-slate-500 hover:bg-slate-50'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>

          {/* Search Box */}
          <div className="flex items-center gap-2 bg-white px-3 py-2 rounded border border-slate-250 shadow-sm">
            <Search className="h-4 w-4 text-slate-400" />
            <input
              type="text"
              placeholder="Buscar materiais por nome..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="bg-transparent border-none outline-none text-xs w-full text-slate-700 placeholder-slate-400 font-sans font-medium"
            />
          </div>

          {/* Inventory Table */}
          <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="bg-slate-50/50 border-b border-slate-200 text-slate-400 text-[10px] font-bold uppercase tracking-wider">
                    <th className="py-3 px-4">Material</th>
                    <th className="py-3 px-4">Categoria</th>
                    <th className="py-3 px-4">Preço Unitário</th>
                    <th className="py-3 px-4">Estoque Atual</th>
                    <th className="py-3 px-4">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-50 text-xs">
                  {filteredMaterials.map(mat => {
                    const isLow = mat.stock <= mat.minStock;
                    return (
                      <tr key={mat.id} className="hover:bg-slate-50/40 transition-colors">
                        <td className="py-3.5 px-4">
                          <p className="font-semibold text-slate-800">{mat.name}</p>
                          <p className="text-[10px] text-slate-400 font-mono">Unidade: {mat.unit}</p>
                        </td>
                        <td className="py-3.5 px-4 text-slate-500">
                          <span className="flex items-center gap-1 text-[11px] font-medium">
                            <FolderOpen className="h-3.5 w-3.5 text-slate-400" />
                            {mat.category}
                          </span>
                        </td>
                        <td className="py-3.5 px-4 font-mono font-medium text-slate-700">
                          {mat.unitPrice.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}
                        </td>
                        <td className="py-3.5 px-4 font-mono font-medium">
                          <span className={isLow ? 'text-red-600 font-bold' : 'text-slate-800'}>
                            {mat.stock} {mat.unit}
                          </span>
                          <span className="text-[10px] text-slate-400 block font-sans">Mínimo: {mat.minStock}</span>
                        </td>
                        <td className="py-3.5 px-4">
                          {isLow ? (
                            <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded bg-red-50 text-red-700 text-[10px] font-bold animate-pulse">
                              <AlertTriangle className="h-3 w-3" />
                              Abastecer urgente
                            </span>
                          ) : (
                            <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded bg-emerald-50 text-emerald-700 text-[10px] font-semibold">
                              <CheckCircle className="h-3 w-3" />
                              Normal
                            </span>
                          )}
                        </td>
                      </tr>
                    );
                  })}
                  {filteredMaterials.length === 0 && (
                    <tr>
                      <td colSpan={5} className="py-12 text-center text-slate-400">
                        Nenhum material encontrado na consulta.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>

        </div>

      </div>
    </div>
  );
}
