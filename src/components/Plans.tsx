import React, { useState } from 'react';
import { 
  CreditCard, 
  Check, 
  HelpCircle, 
  Sparkles, 
  ShieldCheck, 
  Clock, 
  QrCode, 
  Copy, 
  Info,
  Gift
} from 'lucide-react';
import { Subscription } from '../types';

interface PlansProps {
  subscription: Subscription;
  onUpdateSubscription: (sub: Subscription) => void;
}

export default function Plans({ subscription, onUpdateSubscription }: PlansProps) {
  const [selectedPlan, setSelectedPlan] = useState<'Mensal' | 'Anual' | 'Vitalício'>('Anual');
  const [showCheckout, setShowCheckout] = useState(false);
  const [paymentMethod, setPaymentMethod] = useState<'credit_card' | 'pix'>('pix');
  const [copiedPix, setCopiedPix] = useState(false);
  const [paymentDone, setPaymentDone] = useState(false);

  // Credit card mock inputs
  const [cardNumber, setCardNumber] = useState('');
  const [cardName, setCardName] = useState('');
  const [cardExpiry, setCardExpiry] = useState('');
  const [cardCvv, setCardCvv] = useState('');

  const plansDetails = {
    Mensal: {
      price: 'R$ 49,90',
      period: '/mês',
      savings: null,
      badge: 'Básico'
    },
    Anual: {
      price: 'R$ 399,00',
      period: '/ano',
      savings: 'Economize 33%',
      badge: 'Mais Popular'
    },
    Vitalício: {
      price: 'R$ 899,00',
      period: ' pagamento único',
      savings: 'Melhor Valor',
      badge: 'Sem Mensalidade'
    }
  };

  const handleCopyPix = () => {
    navigator.clipboard.writeText('00020101021126580014br.gov.bcb.pix0136forteengenhariahb8f9a0c-7b2e-4b9a-8f92-c2e3a1d94b1a5204000053039865405399.005802BR5916Forte Engenharia6009SAO PAULO62070503***6304D1A0');
    setCopiedPix(true);
    setTimeout(() => setCopiedPix(false), 2000);
  };

  const handleProcessPayment = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Simulate API delay
    setPaymentDone(true);
    setTimeout(() => {
      // Activate subscription!
      const newSub: Subscription = {
        status: 'Ativo',
        plan: selectedPlan,
        trialStartDate: subscription.trialStartDate,
        trialDaysRemaining: 0,
        subscribedAt: new Date().toISOString().split('T')[0]
      };
      
      onUpdateSubscription(newSub);
      setShowCheckout(false);
      setPaymentDone(false);
      alert(`Parabéns! Sua assinatura do Plano ${selectedPlan} foi ativada com sucesso. Obrigado por confiar na Forte Engenharia!`);
    }, 1500);
  };

  return (
    <div className="space-y-6">
      
      {/* Header section */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h2 id="plans-section-title" className="text-sm font-bold text-slate-800 uppercase tracking-wide border-l-4 border-amber-500 pl-2">
            Planos de Assinatura & Faturamento
          </h2>
          <p className="text-slate-500 text-xs mt-1">
            Escolha o plano ideal para as necessidades da sua construtora e desbloqueie controle operacional ilimitado.
          </p>
        </div>
      </div>

      {/* Trial Countdown banner */}
      {subscription.status === 'Trial' && (
        <div className="bg-gradient-to-r from-amber-500 to-amber-600 text-slate-950 p-5 rounded-2xl shadow-md border border-amber-400 flex flex-col md:flex-row justify-between items-start md:items-center gap-4 animate-fadeIn">
          <div className="flex items-center gap-3">
            <div className="p-3 bg-slate-950/20 rounded-xl text-slate-950">
              <Gift className="h-6 w-6" />
            </div>
            <div>
              <h3 className="text-sm font-black uppercase tracking-wider">Período de Demonstração Ativo (7 Dias Grátis)</h3>
              <p className="text-xs font-bold text-slate-950/80 mt-0.5">
                Você está no {8 - subscription.trialDaysRemaining}º dia de testes. Restam <span className="underline">{subscription.trialDaysRemaining} dias</span> para expirar sua licença temporária.
              </p>
            </div>
          </div>
          <button
            onClick={() => {
              setSelectedPlan('Anual');
              setShowCheckout(true);
            }}
            className="bg-slate-900 hover:bg-slate-850 text-amber-400 font-black px-4 py-2 rounded text-[11px] uppercase tracking-wider shadow-sm transition-all cursor-pointer shrink-0"
          >
            Ativar Assinatura Agora
          </button>
        </div>
      )}

      {/* Active subscription banner */}
      {subscription.status === 'Ativo' && (
        <div className="bg-gradient-to-r from-emerald-600 to-emerald-700 text-white p-5 rounded-2xl shadow-md border border-emerald-500 flex flex-col md:flex-row justify-between items-start md:items-center gap-4 animate-fadeIn">
          <div className="flex items-center gap-3">
            <div className="p-3 bg-white/15 rounded-xl text-white">
              <ShieldCheck className="h-6 w-6" />
            </div>
            <div>
              <h3 className="text-sm font-black uppercase tracking-wider">Sua Licença está Ativa e Protegida</h3>
              <p className="text-xs font-bold text-emerald-100 mt-0.5">
                Plano Assinado: <span className="underline font-black">{subscription.plan}</span> • Ativado em {subscription.subscribedAt ? new Date(subscription.subscribedAt).toLocaleDateString('pt-BR') : ''}. Obrigado por impulsionar sua construtora conosco!
              </p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <span className="bg-white/15 px-3 py-1.5 rounded text-[10px] font-black uppercase tracking-wider border border-white/20">
              Licença Vitalícia / Contrato Ativo
            </span>
          </div>
        </div>
      )}

      {/* Pricing Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        
        {/* MONTHLY PLAN */}
        <div className={`bg-white rounded-2xl p-6 border shadow-sm flex flex-col justify-between relative ${
          subscription.plan === 'Mensal' ? 'border-amber-500 ring-2 ring-amber-500/20' : 'border-slate-200'
        }`}>
          <div>
            <div className="flex justify-between items-start">
              <span className="text-[9px] uppercase font-bold text-slate-400 bg-slate-100 px-2 py-0.5 rounded-full">
                {plansDetails.Mensal.badge}
              </span>
            </div>

            <h3 className="text-md font-black uppercase tracking-wider text-slate-800 mt-3">Plano Mensal</h3>
            <p className="text-xs text-slate-400 mt-1 font-medium">Para pequenas construtoras ou projetos rápidos de curta duração.</p>
            
            <div className="my-6">
              <span className="text-2xl font-black text-slate-800 font-mono">{plansDetails.Mensal.price}</span>
              <span className="text-slate-400 text-xs font-medium">{plansDetails.Mensal.period}</span>
            </div>

            <ul className="space-y-2.5 pt-4 border-t border-slate-100 text-xs text-slate-600 font-medium">
              <li className="flex items-center gap-2">
                <Check className="h-4 w-4 text-amber-500 shrink-0" />
                <span>Cadastro ilimitado de Projetos/Obras</span>
              </li>
              <li className="flex items-center gap-2">
                <Check className="h-4 w-4 text-amber-500 shrink-0" />
                <span>Marcador de Ponto por PIN</span>
              </li>
              <li className="flex items-center gap-2">
                <Check className="h-4 w-4 text-amber-500 shrink-0" />
                <span>Controle Financeiro de Caixa</span>
              </li>
              <li className="flex items-center gap-2">
                <Check className="h-4 w-4 text-amber-500 shrink-0" />
                <span>Suporte por e-mail comercial</span>
              </li>
            </ul>
          </div>

          <button
            onClick={() => {
              setSelectedPlan('Mensal');
              setShowCheckout(true);
            }}
            disabled={subscription.plan === 'Mensal'}
            className={`w-full mt-8 py-2.5 rounded font-black text-[11px] uppercase tracking-wider text-center transition-all cursor-pointer ${
              subscription.plan === 'Mensal'
                ? 'bg-slate-100 text-slate-400 cursor-not-allowed border border-slate-200'
                : 'bg-slate-900 hover:bg-slate-800 text-white'
            }`}
          >
            {subscription.plan === 'Mensal' ? 'Plano Atual' : 'Contratar Plano'}
          </button>
        </div>

        {/* ANNUAL PLAN (Featured) */}
        <div className={`bg-white rounded-2xl p-6 border shadow-md flex flex-col justify-between relative ${
          subscription.plan === 'Anual' ? 'border-amber-500 ring-2 ring-amber-500/20' : 'border-amber-500'
        }`}>
          <div className="absolute top-0 right-6 -translate-y-1/2 bg-amber-500 text-slate-950 text-[9px] font-black uppercase tracking-wider px-3 py-1 rounded-full shadow-sm">
            {plansDetails.Anual.badge}
          </div>

          <div>
            <div className="flex justify-between items-start">
              <span className="text-[9px] uppercase font-bold text-amber-700 bg-amber-50 px-2.5 py-0.5 rounded-full border border-amber-100">
                {plansDetails.Anual.savings}
              </span>
            </div>

            <h3 className="text-md font-black uppercase tracking-wider text-slate-800 mt-3">Plano Anual</h3>
            <p className="text-xs text-slate-400 mt-1 font-medium">Ideal para médias construtoras com fluxo contínuo de projetos.</p>
            
            <div className="my-6">
              <span className="text-2xl font-black text-slate-800 font-mono">{plansDetails.Anual.price}</span>
              <span className="text-slate-400 text-xs font-medium">{plansDetails.Anual.period}</span>
            </div>

            <ul className="space-y-2.5 pt-4 border-t border-slate-100 text-xs text-slate-600 font-medium">
              <li className="flex items-center gap-2">
                <Check className="h-4 w-4 text-amber-500 shrink-0" />
                <span className="font-bold text-slate-800">Tudo do Plano Mensal</span>
              </li>
              <li className="flex items-center gap-2">
                <Check className="h-4 w-4 text-amber-500 shrink-0" />
                <span>Relatórios e Emissão de PDF de Orçamentos</span>
              </li>
              <li className="flex items-center gap-2">
                <Check className="h-4 w-4 text-amber-500 shrink-0" />
                <span>Gestão Integrada de Condomínios</span>
              </li>
              <li className="flex items-center gap-2">
                <Check className="h-4 w-4 text-amber-500 shrink-0" />
                <span>Suporte Prioritário via WhatsApp</span>
              </li>
            </ul>
          </div>

          <button
            onClick={() => {
              setSelectedPlan('Anual');
              setShowCheckout(true);
            }}
            disabled={subscription.plan === 'Anual'}
            className={`w-full mt-8 py-2.5 rounded font-black text-[11px] uppercase tracking-wider text-center transition-all cursor-pointer shadow-sm ${
              subscription.plan === 'Anual'
                ? 'bg-slate-100 text-slate-400 cursor-not-allowed border border-slate-200'
                : 'bg-amber-500 hover:bg-amber-600 text-white'
            }`}
          >
            {subscription.plan === 'Anual' ? 'Plano Atual' : 'Contratar Plano'}
          </button>
        </div>

        {/* LIFETIME PLAN */}
        <div className={`bg-slate-900 text-slate-100 rounded-2xl p-6 border shadow-sm flex flex-col justify-between relative ${
          subscription.plan === 'Vitalício' ? 'border-amber-400 ring-2 ring-amber-400/20' : 'border-slate-800'
        }`}>
          <div>
            <div className="flex justify-between items-start">
              <span className="text-[9px] uppercase font-black text-amber-400 bg-amber-500/10 px-2.5 py-0.5 rounded-full border border-amber-400/25">
                {plansDetails.Vitalício.badge}
              </span>
            </div>

            <h3 className="text-md font-black uppercase tracking-wider text-white mt-3">Plano Vitalício</h3>
            <p className="text-xs text-slate-400 mt-1 font-medium">Acesso permanente sem anuidades ou taxas recorrentes para sempre.</p>
            
            <div className="my-6">
              <span className="text-2xl font-black text-amber-400 font-mono">{plansDetails.Vitalício.price}</span>
              <span className="text-slate-400 text-xs font-medium">{plansDetails.Vitalício.period}</span>
            </div>

            <ul className="space-y-2.5 pt-4 border-t border-slate-800 text-xs text-slate-300 font-medium">
              <li className="flex items-center gap-2">
                <Check className="h-4 w-4 text-amber-400 shrink-0" />
                <span className="font-bold text-white">Acesso Vitalício Completo</span>
              </li>
              <li className="flex items-center gap-2">
                <Check className="h-4 w-4 text-amber-400 shrink-0" />
                <span>Nenhuma cobrança ou mensalidade futura</span>
              </li>
              <li className="flex items-center gap-2">
                <Check className="h-4 w-4 text-amber-400 shrink-0" />
                <span>Próximas atualizações de módulos gratuitas</span>
              </li>
              <li className="flex items-center gap-2">
                <Check className="h-4 w-4 text-amber-400 shrink-0" />
                <span>Suporte VIP direto com engenheiros</span>
              </li>
            </ul>
          </div>

          <button
            onClick={() => {
              setSelectedPlan('Vitalício');
              setShowCheckout(true);
            }}
            disabled={subscription.plan === 'Vitalício'}
            className={`w-full mt-8 py-2.5 rounded font-black text-[11px] uppercase tracking-wider text-center transition-all cursor-pointer ${
              subscription.plan === 'Vitalício'
                ? 'bg-slate-800 text-slate-500 cursor-not-allowed border border-slate-700'
                : 'bg-white hover:bg-slate-100 text-slate-900'
            }`}
          >
            {subscription.plan === 'Vitalício' ? 'Plano Atual' : 'Contratar Vitalício'}
          </button>
        </div>

      </div>

      {/* CHECKOUT SIMULATOR OVERLAY MODAL */}
      {showCheckout && (
        <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/60 flex items-center justify-center p-4 backdrop-blur-xs animate-fadeIn">
          <div className="bg-white rounded-2xl w-full max-w-md overflow-hidden shadow-2xl border border-slate-250 flex flex-col">
            
            {/* Modal Header */}
            <div className="bg-slate-900 text-white p-5 flex justify-between items-center">
              <div>
                <h4 className="text-xs font-black uppercase tracking-wider text-amber-400">Checkout Seguro</h4>
                <p className="text-[10px] text-slate-400 font-medium mt-0.5">Assinando: Plano {selectedPlan} ({plansDetails[selectedPlan].price})</p>
              </div>
              <button 
                onClick={() => setShowCheckout(false)}
                className="text-slate-400 hover:text-white text-xs font-bold cursor-pointer"
              >
                Fechar
              </button>
            </div>

            {/* Modal Body */}
            <div className="p-6 space-y-5 flex-1">
              
              {/* Payment Selector */}
              <div className="grid grid-cols-2 gap-3">
                <button
                  type="button"
                  onClick={() => setPaymentMethod('pix')}
                  className={`py-3 rounded border flex flex-col items-center gap-1 cursor-pointer transition-all ${
                    paymentMethod === 'pix' 
                      ? 'border-amber-500 bg-amber-50/25 text-amber-800 font-bold' 
                      : 'border-slate-200 text-slate-500 hover:border-slate-300 font-medium'
                  }`}
                >
                  <QrCode className="h-5 w-5" />
                  <span className="text-[10px] uppercase tracking-wider">Pagar via Pix</span>
                </button>
                <button
                  type="button"
                  onClick={() => setPaymentMethod('credit_card')}
                  className={`py-3 rounded border flex flex-col items-center gap-1 cursor-pointer transition-all ${
                    paymentMethod === 'credit_card' 
                      ? 'border-amber-500 bg-amber-50/25 text-amber-800 font-bold' 
                      : 'border-slate-200 text-slate-500 hover:border-slate-300 font-medium'
                  }`}
                >
                  <CreditCard className="h-5 w-5" />
                  <span className="text-[10px] uppercase tracking-wider">Cartão de Crédito</span>
                </button>
              </div>

              {paymentMethod === 'pix' ? (
                /* PIX INTERFACE */
                <div className="space-y-4 text-center animate-fadeIn">
                  <div className="bg-slate-50 p-4 rounded-xl border border-slate-200 flex flex-col items-center gap-2">
                    {/* Generates placeholder beautiful QR Code for premium feel */}
                    <div className="w-36 h-36 bg-white p-2.5 border border-slate-250 rounded shadow-xs flex items-center justify-center">
                      <QrCode className="h-28 w-28 text-slate-900" />
                    </div>
                    <p className="text-[10px] text-slate-400 font-medium">Escaneie o QR Code acima no aplicativo do seu banco.</p>
                  </div>

                  <div className="space-y-1.5 text-left">
                    <label className="text-[9px] uppercase font-bold text-slate-400">Pix Copia e Cola</label>
                    <div className="flex gap-1.5">
                      <input
                        type="text"
                        readOnly
                        value="00020101021126580014br.gov.bcb.pix0136forteengenhariahb8f9a0c-7b..."
                        className="grow bg-slate-50 border border-slate-200 rounded p-1.5 text-[10px] font-mono text-slate-500 outline-none"
                      />
                      <button
                        type="button"
                        onClick={handleCopyPix}
                        className="bg-slate-900 hover:bg-slate-850 text-white font-bold p-1.5 rounded transition-all cursor-pointer flex items-center justify-center shrink-0"
                        title="Copiar Pix"
                      >
                        {copiedPix ? <Check className="h-4 w-4 text-emerald-400" /> : <Copy className="h-4 w-4" />}
                      </button>
                    </div>
                  </div>

                  <button
                    type="button"
                    onClick={(e) => handleProcessPayment(e)}
                    disabled={paymentDone}
                    className="w-full bg-emerald-600 hover:bg-emerald-700 disabled:opacity-50 text-white font-bold py-2 rounded text-[11px] uppercase tracking-wider transition-all cursor-pointer shadow-sm"
                  >
                    {paymentDone ? 'Verificando Pix...' : 'Já fiz o pagamento via Pix'}
                  </button>
                </div>
              ) : (
                /* CREDIT CARD INTERFACE */
                <form onSubmit={handleProcessPayment} className="space-y-3.5 text-left animate-fadeIn">
                  <div className="space-y-1">
                    <label className="text-[9px] uppercase font-bold text-slate-400">Número do Cartão</label>
                    <input
                      type="text"
                      placeholder="4000 1234 5678 9010"
                      value={cardNumber}
                      onChange={(e) => setCardNumber(e.target.value)}
                      required
                      className="w-full bg-slate-50 border border-slate-200 rounded p-1.5 text-xs font-mono font-medium text-slate-700 outline-none"
                    />
                  </div>

                  <div className="space-y-1">
                    <label className="text-[9px] uppercase font-bold text-slate-400">Nome do Titular (como no cartão)</label>
                    <input
                      type="text"
                      placeholder="RICARDO O SILVA"
                      value={cardName}
                      onChange={(e) => setCardName(e.target.value)}
                      required
                      className="w-full bg-slate-50 border border-slate-200 rounded p-1.5 text-xs font-medium text-slate-700 uppercase outline-none"
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    <div className="space-y-1">
                      <label className="text-[9px] uppercase font-bold text-slate-400">Validade</label>
                      <input
                        type="text"
                        placeholder="MM/AA"
                        value={cardExpiry}
                        onChange={(e) => setCardExpiry(e.target.value)}
                        required
                        className="w-full bg-slate-50 border border-slate-200 rounded p-1.5 text-xs font-mono font-medium text-slate-700 outline-none"
                      />
                    </div>

                    <div className="space-y-1">
                      <label className="text-[9px] uppercase font-bold text-slate-400">CVV</label>
                      <input
                        type="password"
                        placeholder="123"
                        maxLength={3}
                        value={cardCvv}
                        onChange={(e) => setCardCvv(e.target.value)}
                        required
                        className="w-full bg-slate-50 border border-slate-200 rounded p-1.5 text-xs font-mono font-medium text-slate-700 outline-none"
                      />
                    </div>
                  </div>

                  <button
                    type="submit"
                    disabled={paymentDone}
                    className="w-full bg-amber-500 hover:bg-amber-600 disabled:opacity-50 text-white font-bold py-2 rounded.5 text-[11px] uppercase tracking-wider transition-all cursor-pointer shadow-sm mt-2"
                  >
                    {paymentDone ? 'Processando transação...' : `Confirmar e pagar ${plansDetails[selectedPlan].price}`}
                  </button>
                </form>
              )}

              <p className="text-[10px] text-slate-400 text-center font-medium flex items-center justify-center gap-1 mt-2">
                <ShieldCheck className="h-4 w-4 text-emerald-500" />
                Seus dados estão protegidos por criptografia de ponta a ponta.
              </p>
            </div>

          </div>
        </div>
      )}

    </div>
  );
}
