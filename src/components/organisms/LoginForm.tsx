import React, { useState } from 'react';
import { AlertCircle } from 'lucide-react';

interface LoginFormProps {
  onLogin: (email: string, password: string) => void;
  loading?: boolean;
  error?: string;
}

const LoginForm: React.FC<LoginFormProps> = ({ onLogin, loading = false, error }) => {
  const [email, setEmail] = useState('demo@cercania.com');
  const [password, setPassword] = useState('demo1234');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onLogin(email, password);
  };

  return (
    <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
      {/* Glass Card Container */}
      <div className="glass rounded-2xl p-8 border border-white/10 shadow-[0_8px_32px_rgba(0,0,0,0.3)]">

        {/* Error Alert */}
        {error && (
          <div className="mb-6 p-4 rounded-xl bg-red-500/10 border border-red-500/30 backdrop-blur-sm">
            <div className="flex items-start gap-3">
              <AlertCircle className="h-5 w-5 text-red-400 mt-0.5 flex-shrink-0" />
              <p className="text-sm text-red-200 leading-relaxed">{error}</p>
            </div>
          </div>
        )}

        {/* Demo Mode Notice */}
        <div className="mb-6 bg-blue-500/10 border border-blue-500/20 rounded-xl p-4 text-center">
          <h3 className="text-blue-400 font-bold mb-1">Modo Demo Activo</h3>
          <p className="text-xs text-blue-300/80">Credenciales precargadas para acceso inmediato.</p>
        </div>

        <div className="space-y-4">
          <div>
            <label htmlFor="email" className="block text-sm font-medium text-gray-400 mb-1">
              Usuario Demo
            </label>
            <input
              id="email"
              type="email"
              disabled
              className="w-full px-4 py-3 rounded-xl bg-gray-800/50 border border-gray-700 text-gray-400 cursor-not-allowed"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>

          <div>
            <label htmlFor="pass" className="block text-sm font-medium text-gray-400 mb-1">
              Contraseña
            </label>
            <input
              id="pass"
              type="password"
              disabled
              className="w-full px-4 py-3 rounded-xl bg-gray-800/50 border border-gray-700 text-gray-400 cursor-not-allowed"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>
        </div>

        <div className="mt-8">
          <button
            type="submit"
            disabled={loading}
            className="w-full py-3 rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white font-bold shadow-lg shadow-blue-900/20 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed transform active:scale-[0.98]"
          >
            {loading ? (
              <span className="flex items-center justify-center gap-2">
                <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                Iniciando...
              </span>
            ) : (
              'Ingresar al Sistema'
            )}
          </button>
        </div>

        <p className="mt-4 text-center text-xs text-gray-500">
          No se requieren datos reales. El sistema se reinicia al salir.
        </p>

      </div>
    </form>
  );
};

export default LoginForm;