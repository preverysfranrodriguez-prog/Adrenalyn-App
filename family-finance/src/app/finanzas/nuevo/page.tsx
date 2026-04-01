'use client';

import { useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { useFamilyContext } from '@/context/FamilyContext';
import { ArrowLeft, Save } from 'lucide-react';

export default function NuevoTransaccionPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const defaultType = searchParams.get('type') === 'income' ? 'income' : 'expense';
  
  const { categories, members, accounts, addTransaction, getAccountBalance } = useFamilyContext();

  const [type, setType] = useState<'income' | 'expense'>(defaultType);
  const [amount, setAmount] = useState('');
  const [concept, setConcept] = useState('');
  const [categoryId, setCategoryId] = useState('');
  const [memberId, setMemberId] = useState(members[0]?.id || '');
  const [accountId, setAccountId] = useState(accounts[0]?.id || '');

  const filteredCategories = categories.filter(c => c.type === type);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!amount || !concept || !categoryId || !memberId || !accountId) return;

    addTransaction({
      id: Math.random().toString(36).substr(2, 9),
      date: new Date().toISOString(),
      amount: parseFloat(amount),
      concept,
      type,
      categoryId,
      memberId,
      accountId,
      method: 'tarjeta',
      isRecurrent: false,
    });

    router.back();
  };

  return (
    <div className="min-h-screen bg-zinc-50 fixed inset-0 z-[100] overflow-y-auto">
      <header className="bg-white px-4 h-14 border-b border-zinc-200 flex items-center justify-between sticky top-0 z-10">
        <button onClick={() => router.back()} className="p-2 -ml-2 text-zinc-600 hover:text-zinc-900 transition-colors">
          <ArrowLeft className="w-6 h-6" />
        </button>
        <h1 className="font-bold text-zinc-900 text-lg">Nueva Transacción</h1>
        <div className="w-10"></div>
      </header>

      <div className="p-4 max-w-md mx-auto">
        <div className="flex bg-zinc-200/50 p-1 rounded-xl mb-6 shadow-inner">
          <button 
            onClick={() => setType('expense')} 
            className={`flex-1 py-2 text-sm font-semibold rounded-lg transition-all ${type === 'expense' ? 'bg-white text-rose-600 shadow-sm' : 'text-zinc-500 hover:text-zinc-700'}`}
          >
            Gasto
          </button>
          <button 
            onClick={() => setType('income')} 
            className={`flex-1 py-2 text-sm font-semibold rounded-lg transition-all ${type === 'income' ? 'bg-white text-emerald-600 shadow-sm' : 'text-zinc-500 hover:text-zinc-700'}`}
          >
            Ingreso
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <label className="block text-xs font-semibold text-zinc-500 uppercase tracking-wider mb-1">Importe (€)</label>
            <input 
              type="number" 
              step="0.01" 
              required
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              className="w-full bg-white border border-zinc-200 rounded-xl px-4 py-3 text-2xl font-bold text-zinc-900 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-shadow"
              placeholder="0.00"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-zinc-500 uppercase tracking-wider mb-1">Concepto</label>
            <input 
              type="text" 
              required
              value={concept}
              onChange={(e) => setConcept(e.target.value)}
              className="w-full bg-white border border-zinc-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 transition-shadow"
              placeholder="Ej. Compra semanal"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-zinc-500 uppercase tracking-wider mb-1">Categoría</label>
              <select 
                required
                value={categoryId} 
                onChange={(e) => setCategoryId(e.target.value)}
                className="w-full bg-white border border-zinc-200 rounded-xl px-3 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 transition-shadow disabled:opacity-50"
              >
                <option value="" disabled>Selecciona...</option>
                {filteredCategories.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
              </select>
            </div>
            <div>
              <label className="block text-xs font-semibold text-zinc-500 uppercase tracking-wider mb-1">Miembro</label>
              <select 
                required
                value={memberId} 
                onChange={(e) => setMemberId(e.target.value)}
                className="w-full bg-white border border-zinc-200 rounded-xl px-3 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 transition-shadow"
              >
                {members.map(m => <option key={m.id} value={m.id}>{m.name}</option>)}
              </select>
            </div>
          </div>

            <div className="relative">
              <label className="block text-xs font-semibold text-zinc-500 uppercase tracking-wider mb-1">Cuenta</label>
              <select 
                required
                value={accountId} 
                onChange={(e) => setAccountId(e.target.value)}
                className="w-full bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-xl px-3 py-3 text-sm text-zinc-900 dark:text-zinc-100 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors"
              >
                {accounts.map(a => <option key={a.id} value={a.id}>{a.name} ({getAccountBalance(a.id).toFixed(2)}€)</option>)}
              </select>
            </div>

          <div className="pt-4">
            <button 
              type="submit" 
              className={`w-full py-4 rounded-xl text-white font-bold flex justify-center items-center shadow-md transition-transform active:scale-95 ${type === 'expense' ? 'bg-rose-600 hover:bg-rose-700' : 'bg-emerald-600 hover:bg-emerald-700'}`}
            >
              <Save className="w-5 h-5 mr-2" />
              Guardar {type === 'expense' ? 'Gasto' : 'Ingreso'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
