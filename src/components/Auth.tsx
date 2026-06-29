import React, { useState } from 'react';
import { 
  Building2, 
  Mail, 
  Lock, 
  User, 
  UserPlus, 
  LogIn, 
  Eye, 
  EyeOff, 
  Briefcase, 
  Shield,
  ArrowRight
} from 'lucide-react';
import { motion } from 'motion/react';

interface AuthProps {
  onLoginSuccess: (user: { name: string; email: string; company: string; role: string }) => void;
}

export default function Auth({ onLoginSuccess }: AuthProps) {
  const [isLogin, setIsLogin] = useState(true);
  const [showPassword, setShowPassword] = useState(false);
  
  // Form fields
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [company, setCompany] = useState('');
  const [role, setRole] = useState('');
  
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  // Default mock account
  const defaultUser = {
    name: 'Ricardo Oliveira',
    email: 'admin@forte.com',
    password: 'admin',
    company: 'Forte Engenharia',
    role: 'Diretor de Obras'
  };

  const handleAuthSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    // Fetch existing users from localStorage
    const savedUsersStr = localStorage.getItem('const_registered_users');
    const registeredUsers = savedUsersStr ? JSON.parse(savedUsersStr) : [defaultUser];

    if (isLogin) {
      // Log In process
      const foundUser = registeredUsers.find(
        (u: any) => u.email.toLowerCase() === email.toLowerCase() && u.password === password
      );

      if (foundUser) {
        setSuccess('Login realizado com sucesso! Redirecionando...');
        setTimeout(() => {
          onLoginSuccess({
            name: foundUser.name,
            email: foundUser.email,
            company: foundUser.company,
            role: foundUser.role
          });
        }, 1000);
      } else {
        setError('E-mail ou senha incorretos. Tente admin@forte.com / admin');
      }
    } else {
      // Sign Up process
      if (!name || !email || !password || !company || !role) {
        setError('Por favor, preencha todos os campos.');
        return;
      }

      const emailExists = registeredUsers.some(
        (u: any) => u.email.toLowerCase() === email.toLowerCase()
      );

      if (emailExists) {
        setError('Este e-mail já está cadastrado no sistema.');
        return;
      }

      const newUser = { name, email, password, company, role };
      const updatedUsers = [...registeredUsers, newUser];
      localStorage.setItem('const_registered_users', JSON.stringify(updatedUsers));

      setSuccess('Cadastro realizado com sucesso!');
      setTimeout(() => {
        setIsLogin(true);
        setPassword('');
        setError('');
        setSuccess('');
      }, 1500);
    }
  };

  const handleLoadDemoUser = () => {
    setEmail('admin@forte.com');
    setPassword('admin');
    setIsLogin(true);
    setError('');
  };

  return (
    <div className="min-h-screen bg-slate-950 flex items-center justify-center p-4 relative overflow-hidden font-sans">
      {/* Abstract Background Accents */}
      <div className="absolute top-0 left-0 w-full h-full pointer-events-none z-0">
        <div className="absolute top-[-20%] left-[-10%] w-[60%] h-[60%] rounded-full bg-amber-500/10 blur-[120px]" />
        <div className="absolute bottom-[-20%] right-[-10%] w-[60%] h-[60%] rounded-full bg-slate-500/10 blur-[120px]" />
      </div>

      <div className="w-full max-w-5xl bg-slate-900 border border-slate-800 rounded-3xl overflow-hidden shadow-2xl flex flex-col md:flex-row relative z-10">
        
        {/* Left Side: Gorgeous Brand/Concept Presentation */}
        <div className="w-full md:w-1/2 bg-gradient-to-br from-slate-900 via-slate-950 to-slate-900 p-8 md:p-12 flex flex-col justify-between border-b md:border-b-0 md:border-r border-slate-800">
          <div>
            <div className="flex items-center gap-3 mb-8">
              <div className="w-10 h-10 bg-amber-500 flex items-center justify-center font-black text-slate-950 rounded-xl text-lg shadow-lg shadow-amber-500/20">F</div>
              <span className="text-xl font-black text-white tracking-wider italic">FORTE ENGENHARIA</span>
            </div>
            
            <div className="space-y-6 mt-12">
              <h2 className="text-2xl md:text-3xl font-black text-white tracking-tight leading-tight">
                O SISTEMA COMPLETO DE <span className="text-amber-400">GESTÃO DE OBRAS</span> E CONDOMÍNIOS.
              </h2>
              <p className="text-xs text-slate-400 leading-relaxed max-w-md">
                Gerencie funcionários, registre pontos por GPS, monte orçamentos inteligentes, controle o estoque de materiais, acompanhe as finanças e administre faturas de condomínio em uma única plataforma integrada e de alta performance.
              </p>
            </div>
          </div>

          <div className="mt-12 space-y-4">
            <div className="flex items-center gap-3.5 bg-slate-850/40 border border-slate-800/80 p-3.5 rounded-2xl">
              <Shield className="h-5 w-5 text-amber-500 shrink-0" />
              <div>
                <p className="text-xs font-bold text-white uppercase tracking-wider">Acesso Seguro & Criptografado</p>
                <p className="text-[10px] text-slate-500">Seus dados corporativos protegidos de ponta a ponta.</p>
              </div>
            </div>

            <div className="flex items-center justify-between text-[10px] text-slate-500 font-mono pt-4 border-t border-slate-850">
              <span>FORTE ENG SYSTEM V2.4</span>
              <span>© 2026</span>
            </div>
          </div>
        </div>

        {/* Right Side: Auth Form */}
        <div className="w-full md:w-1/2 p-8 md:p-12 flex flex-col justify-center bg-slate-900/60 backdrop-blur-sm">
          <div className="max-w-md w-full mx-auto space-y-6">
            
            <div className="space-y-1.5 text-center md:text-left">
              <h3 className="text-xl font-black text-white uppercase tracking-wider">
                {isLogin ? 'Fazer Login' : 'Criar nova conta'}
              </h3>
              <p className="text-xs text-slate-400">
                {isLogin 
                  ? 'Entre com suas credenciais para gerenciar seus projetos' 
                  : 'Cadastre-se para começar a usar a plataforma'
                }
              </p>
            </div>

            {/* Error and Success Alerts */}
            {error && (
              <div className="bg-red-500/10 border border-red-500/20 text-red-400 text-xs p-3 rounded-xl font-medium">
                {error}
              </div>
            )}
            {success && (
              <div className="bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-xs p-3 rounded-xl font-medium animate-pulse">
                {success}
              </div>
            )}

            <form onSubmit={handleAuthSubmit} className="space-y-4">
              
              {!isLogin && (
                <div className="grid grid-cols-1 gap-4">
                  <div className="space-y-1">
                    <label className="text-[10px] uppercase font-black tracking-wider text-slate-500">Nome Completo</label>
                    <div className="relative">
                      <User className="absolute left-3 top-3.5 h-4 w-4 text-slate-500" />
                      <input
                        type="text"
                        required
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        placeholder="Ex: Ricardo Oliveira"
                        className="w-full bg-slate-950 border border-slate-800 text-white rounded-xl py-2.5 pl-10 pr-4 text-xs font-semibold outline-none focus:border-amber-500 transition-colors"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-1">
                      <label className="text-[10px] uppercase font-black tracking-wider text-slate-500">Empresa / Construtora</label>
                      <div className="relative">
                        <Building2 className="absolute left-3 top-3.5 h-4 w-4 text-slate-500" />
                        <input
                          type="text"
                          required
                          value={company}
                          onChange={(e) => setCompany(e.target.value)}
                          placeholder="Forte Engenharia"
                          className="w-full bg-slate-950 border border-slate-800 text-white rounded-xl py-2.5 pl-10 pr-4 text-xs font-semibold outline-none focus:border-amber-500 transition-colors"
                        />
                      </div>
                    </div>

                    <div className="space-y-1">
                      <label className="text-[10px] uppercase font-black tracking-wider text-slate-500">Cargo / Função</label>
                      <div className="relative">
                        <Briefcase className="absolute left-3 top-3.5 h-4 w-4 text-slate-500" />
                        <input
                          type="text"
                          required
                          value={role}
                          onChange={(e) => setRole(e.target.value)}
                          placeholder="Ex: Engenheiro Civil"
                          className="w-full bg-slate-950 border border-slate-800 text-white rounded-xl py-2.5 pl-10 pr-4 text-xs font-semibold outline-none focus:border-amber-500 transition-colors"
                        />
                      </div>
                    </div>
                  </div>
                </div>
              )}

              <div className="space-y-1">
                <label className="text-[10px] uppercase font-black tracking-wider text-slate-500">Endereço de E-mail</label>
                <div className="relative">
                  <Mail className="absolute left-3 top-3.5 h-4 w-4 text-slate-500" />
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="voce@empresa.com"
                    className="w-full bg-slate-950 border border-slate-800 text-white rounded-xl py-2.5 pl-10 pr-4 text-xs font-semibold outline-none focus:border-amber-500 transition-colors"
                  />
                </div>
              </div>

              <div className="space-y-1">
                <label className="text-[10px] uppercase font-black tracking-wider text-slate-500">Senha de Acesso</label>
                <div className="relative">
                  <Lock className="absolute left-3 top-3.5 h-4 w-4 text-slate-500" />
                  <input
                    type={showPassword ? 'text' : 'password'}
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="••••••••"
                    className="w-full bg-slate-950 border border-slate-800 text-white rounded-xl py-2.5 pl-10 pr-10 text-xs font-semibold outline-none focus:border-amber-500 transition-colors"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-3.5 text-slate-500 hover:text-slate-300"
                  >
                    {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                  </button>
                </div>
              </div>

              <button
                type="submit"
                className="w-full bg-amber-500 hover:bg-amber-600 text-slate-950 font-black py-3 rounded-xl text-xs uppercase tracking-wider transition-all cursor-pointer shadow-lg shadow-amber-500/10 flex items-center justify-center gap-2 mt-2"
              >
                <span>{isLogin ? 'Entrar no Sistema' : 'Criar minha Conta'}</span>
                {isLogin ? <LogIn className="h-4 w-4" /> : <UserPlus className="h-4 w-4" />}
              </button>
            </form>

            <div className="relative my-6 text-center">
              <span className="absolute left-0 top-1/2 w-full h-[1px] bg-slate-800 z-0" />
              <span className="relative bg-slate-900 px-4 text-[10px] uppercase font-black text-slate-500 tracking-widest z-10">ou</span>
            </div>

            <div className="text-center space-y-4">
              <button
                onClick={() => {
                  setIsLogin(!isLogin);
                  setError('');
                  setSuccess('');
                }}
                className="text-xs text-amber-500 hover:text-amber-400 font-bold transition-colors cursor-pointer"
              >
                {isLogin ? 'Não tem uma conta? Cadastre-se gratuitamente' : 'Já possui uma conta? Faça login'}
              </button>

              {isLogin && (
                <div className="pt-2">
                  <button
                    onClick={handleLoadDemoUser}
                    className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-slate-850 hover:bg-slate-800 border border-slate-800 text-slate-400 hover:text-white rounded-lg text-[10px] font-bold uppercase tracking-wider transition-all cursor-pointer"
                  >
                    ⚡ Entrar com Conta de Demonstração (Admin)
                  </button>
                </div>
              )}
            </div>

          </div>
        </div>

      </div>
    </div>
  );
}
