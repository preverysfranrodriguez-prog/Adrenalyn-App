'use client';
import { useState } from 'react';
import { useAuth } from '@/context/AuthContext';
import { signInWithEmailAndPassword, createUserWithEmailAndPassword } from 'firebase/auth';
import { auth } from '@/lib/firebase';
import { Wallet } from 'lucide-react';

export default function LoginOverlay() {
  const { user, loading } = useAuth();
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  if (loading) {
    return (
      <div className="fixed inset-0 z-[9999] bg-zinc-50 dark:bg-zinc-950 flex flex-col items-center justify-center p-4">
        <div className="w-10 h-10 border-4 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  if (user) return null; // Hide overlay if logged in

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setIsSubmitting(true);
    try {
      if (isLogin) {
        await signInWithEmailAndPassword(auth, email, password);
      } else {
        await createUserWithEmailAndPassword(auth, email, password);
      }
    } catch (err: any) {
      if (err.code === 'auth/invalid-credential') {
        setError('Contraseña incorrecta o usuario no encontrado');
      } else if (err.code === 'auth/email-already-in-use') {
        setError('Ese correo familiar ya está registrado');
      } else {
        setError(err.message || 'Error de autenticación');
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-[9999] bg-zinc-50 dark:bg-zinc-950 flex flex-col items-center justify-center p-4">
      <div className="w-full max-w-sm bg-white dark:bg-zinc-900 rounded-3xl shadow-xl border border-zinc-200 dark:border-zinc-800 p-8">
        <div className="flex justify-center mb-6">
          <div className="w-16 h-16 bg-blue-600 rounded-2xl flex items-center justify-center flex-shrink-0 rotate-3 shadow-inner">
            <Wallet className="w-8 h-8 text-white -rotate-3" />
          </div>
        </div>
        <h1 className="text-2xl font-bold text-center text-zinc-900 dark:text-white mb-2">Family Finance</h1>
        <p className="text-sm text-center text-zinc-500 dark:text-zinc-400 mb-8">
          {isLogin ? 'Inicia sesión con tu cuenta familiar' : 'Crea una cuenta para tu familia'}
        </p>

        {error && <div className="mb-4 p-3 bg-rose-50 dark:bg-rose-900/30 text-rose-600 dark:text-rose-400 text-xs rounded-xl border border-rose-100 dark:border-rose-900/50">{error}</div>}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-[10px] font-bold text-zinc-500 dark:text-zinc-400 uppercase tracking-wider mb-1">Email Familiar Central</label>
            <input 
              type="email" 
              required 
              value={email}
              onChange={e => setEmail(e.target.value)}
              className="w-full bg-zinc-50 dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800 rounded-xl px-4 py-3 text-sm outline-none focus:border-blue-500 dark:focus:border-blue-500 transition-colors text-zinc-900 dark:text-white placeholder:text-zinc-400"
              placeholder="familia@ejemplo.com"
            />
          </div>
          <div>
            <label className="block text-[10px] font-bold text-zinc-500 dark:text-zinc-400 uppercase tracking-wider mb-1">Contraseña Compartida</label>
            <input 
              type="password" 
              required 
              value={password}
              onChange={e => setPassword(e.target.value)}
              className="w-full bg-zinc-50 dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800 rounded-xl px-4 py-3 text-sm outline-none focus:border-blue-500 dark:focus:border-blue-500 transition-colors text-zinc-900 dark:text-white placeholder:text-zinc-400"
              placeholder="••••••••"
            />
          </div>

          <button 
            type="submit" 
            disabled={isSubmitting}
            className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 rounded-xl shadow-md transition-colors disabled:opacity-70 mt-2"
          >
            {isSubmitting ? 'Accediendo...' : (isLogin ? 'Entrar al Panel' : 'Registrar Familia')}
          </button>
        </form>

        <p className="mt-6 text-center text-xs text-zinc-500 dark:text-zinc-400">
          {isLogin ? '¿Tu familia aún no usa la app?' : '¿Ya tienes una cuenta familiar?'}
          <button 
            type="button" 
            onClick={() => { setIsLogin(!isLogin); setError(''); }}
            className="ml-1 text-blue-600 dark:text-blue-400 font-bold hover:underline"
          >
            {isLogin ? 'Crea un grupo' : 'Inicia Sesión'}
          </button>
        </p>
      </div>
    </div>
  );
}
