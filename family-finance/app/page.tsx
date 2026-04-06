'use client';

import { useFamilyContext } from '@/context/FamilyContext';
import DashboardChart from '@/components/features/DashboardChart';
import FAB from '@/components/ui/FAB';
import { ArrowUpRight, ArrowDownRight, Wallet, CheckSquare, CalendarDays, ShoppingCart, Plus } from 'lucide-react';
import { useMemo, useState } from 'react';
import Link from 'next/link';

export default function Home() {
  const { transactions, categories, tasks, events, shoppingItems } = useFamilyContext();
  const [timeFilter, setTimeFilter] = useState<'month'|'quarter'|'semester'|'year'>('month');

  const isDateInFilter = (dateString: string) => {
    const d = new Date(dateString);
    const now = new Date();
    if (d.getFullYear() !== now.getFullYear()) return false;
    
    const m = d.getMonth();
    const currentM = now.getMonth();
    
    if (timeFilter === 'year') return true;
    if (timeFilter === 'month') return m === currentM;
    if (timeFilter === 'quarter') return Math.floor(m / 3) === Math.floor(currentM / 3);
    if (timeFilter === 'semester') return Math.floor(m / 6) === Math.floor(currentM / 6);
    return false;
  };

  const { income, expense } = useMemo(() => {
    let inc = 0, exp = 0;
    transactions.forEach(t => {
      if (isDateInFilter(t.date)) {
        if (t.type === 'income') inc += t.amount;
        if (t.type === 'expense') exp += t.amount;
      }
    });
    return { income: inc, expense: exp };
  }, [transactions, timeFilter]);

  const balance = income - expense;

  const expensesData = useMemo(() => {
    const acc: Record<string, { value: number, color: string, name: string }> = {};
    transactions.filter(t => t.type === 'expense' && isDateInFilter(t.date)).forEach(t => {
      const cat = categories.find(c => c.id === t.categoryId);
      if (cat) {
        if (!acc[cat.id]) acc[cat.id] = { value: 0, color: cat.color, name: cat.name };
        acc[cat.id].value += t.amount;
      }
    });
    return Object.values(acc).sort((a, b) => b.value - a.value);
  }, [transactions, categories, timeFilter]);

  const incomesData = useMemo(() => {
    const acc: Record<string, { value: number, color: string, name: string }> = {};
    transactions.filter(t => t.type === 'income' && isDateInFilter(t.date)).forEach(t => {
      const cat = categories.find(c => c.id === t.categoryId);
      if (cat) {
        if (!acc[cat.id]) acc[cat.id] = { value: 0, color: cat.color, name: cat.name };
        acc[cat.id].value += t.amount;
      }
    });
    return Object.values(acc).sort((a, b) => b.value - a.value);
  }, [transactions, categories, timeFilter]);

  const priorityWeight = { high: 3, medium: 2, low: 1 };
  const pendingTasks = tasks
    .filter(t => t.status !== 'hecho')
    .sort((a, b) => {
      if (priorityWeight[a.priority] !== priorityWeight[b.priority]) {
        return priorityWeight[b.priority] - priorityWeight[a.priority];
      }
      if (a.dueDate && b.dueDate) {
        return new Date(a.dueDate).getTime() - new Date(b.dueDate).getTime();
      }
      if (a.dueDate) return -1;
      if (b.dueDate) return 1;
      return 0;
    })
    .slice(0, 3);
  const pendingShopping = shoppingItems.filter(s => !s.isBought).slice(0, 5);
  const upcomingEvents = events.filter(e => new Date(e.date) >= new Date()).sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime()).slice(0, 3);

  const formatCurrency = (val: number) => new Intl.NumberFormat('es-ES', { style: 'currency', currency: 'EUR' }).format(val);

  return (
    <div className="space-y-6 pb-24 transition-colors">
      <header className="pt-2 pb-2 flex justify-between items-end">
        <div>
          <h1 className="text-2xl font-bold text-zinc-900 dark:text-white tracking-tight">Inicio</h1>
          <p className="text-zinc-500 dark:text-zinc-400 text-sm">Resumen financiero</p>
        </div>
        <select 
          value={timeFilter} 
          onChange={(e) => setTimeFilter(e.target.value as any)}
          className="bg-zinc-100 dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 text-xs font-bold text-zinc-700 dark:text-zinc-300 rounded-xl px-3 py-2 outline-none cursor-pointer transition-colors"
        >
          <option value="month">Este Mes</option>
          <option value="quarter">Este Trimestre</option>
          <option value="semester">Este Semestre</option>
          <option value="year">Este Año</option>
        </select>
      </header>

      <section className="grid grid-cols-2 gap-3 sm:gap-4">
        <div className="col-span-2 bg-gradient-to-br from-zinc-900 to-zinc-800 dark:from-zinc-800 dark:to-zinc-700 p-5 rounded-2xl shadow-md text-white border border-transparent dark:border-zinc-600 transition-colors">
          <div className="flex justify-between items-center mb-1">
            <span className="text-zinc-300 dark:text-zinc-200 text-sm font-medium">Saldo ({timeFilter === 'month' ? 'Mes' : timeFilter === 'quarter' ? 'Trimestre' : timeFilter === 'semester' ? 'Semestre' : 'Año'})</span>
            <Wallet className="w-5 h-5 text-zinc-400" />
          </div>
          <span className="text-3xl font-bold tracking-tight">{formatCurrency(balance)}</span>
        </div>

        <div className="bg-white dark:bg-zinc-900 p-4 rounded-xl shadow-sm border border-zinc-100 dark:border-zinc-800 flex flex-col justify-between relative transition-colors">
          <Link href="/finanzas/nuevo?type=income" className="absolute top-3 right-3 text-emerald-600 dark:text-emerald-400 hover:text-emerald-700 bg-emerald-50 dark:bg-emerald-900/30 hover:bg-emerald-100 dark:hover:bg-emerald-800/50 p-1 rounded-full transition-colors"><Plus className="w-4 h-4"/></Link>
          <div className="flex items-center space-x-2 text-zinc-500 dark:text-zinc-400 mb-2">
            <ArrowUpRight className="w-4 h-4 text-emerald-500" />
            <span className="text-xs font-semibold uppercase tracking-wider">Ingresos</span>
          </div>
          <span className="text-lg font-bold text-zinc-800 dark:text-zinc-100">{formatCurrency(income)}</span>
        </div>

        <div className="bg-white dark:bg-zinc-900 p-4 rounded-xl shadow-sm border border-zinc-100 dark:border-zinc-800 flex flex-col justify-between relative transition-colors">
          <Link href="/finanzas/nuevo?type=expense" className="absolute top-3 right-3 text-rose-600 dark:text-rose-400 hover:text-rose-700 bg-rose-50 dark:bg-rose-900/30 hover:bg-rose-100 dark:hover:bg-rose-800/50 p-1 rounded-full transition-colors"><Plus className="w-4 h-4"/></Link>
          <div className="flex items-center space-x-2 text-zinc-500 dark:text-zinc-400 mb-2">
            <ArrowDownRight className="w-4 h-4 text-rose-500" />
            <span className="text-xs font-semibold uppercase tracking-wider">Gastos</span>
          </div>
          <span className="text-lg font-bold text-zinc-800 dark:text-zinc-100">{formatCurrency(expense)}</span>
        </div>
      </section>

      <section className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {incomesData.length > 0 && <DashboardChart title={`Ingresos del ${timeFilter === 'month' ? 'mes' : timeFilter === 'quarter' ? 'trimestre' : timeFilter === 'semester' ? 'semestre' : 'año'}`} data={incomesData} />}
        {expensesData.length > 0 && <DashboardChart title={`Gastos del ${timeFilter === 'month' ? 'mes' : timeFilter === 'quarter' ? 'trimestre' : timeFilter === 'semester' ? 'semestre' : 'año'}`} data={expensesData} />}
        {expensesData.length === 0 && incomesData.length === 0 && (
          <div className="col-span-full bg-white dark:bg-zinc-900 p-8 rounded-xl shadow-sm border border-zinc-100 dark:border-zinc-800 text-center transition-colors">
             <p className="text-zinc-400 dark:text-zinc-500 text-sm">No hay datos financieros en este periodo.</p>
          </div>
        )}
      </section>

      <section className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-bold text-zinc-800 dark:text-zinc-100 tracking-tight">Próximamente</h2>
        </div>

        {/* Tasks */}
        <div className="bg-white dark:bg-zinc-900 rounded-xl shadow-sm border border-zinc-100 dark:border-zinc-800 overflow-hidden transition-colors">
          <div className="px-4 py-3 bg-zinc-50/50 dark:bg-zinc-800/50 border-b border-zinc-100 dark:border-zinc-800 flex items-center justify-between">
            <div className="flex items-center space-x-2">
               <CheckSquare className="w-4 h-4 text-teal-600 dark:text-teal-400" />
               <span className="text-sm font-semibold text-zinc-700 dark:text-zinc-200">Tareas Pendientes</span>
            </div>
            <Link href="/tareas" className="text-zinc-500 dark:text-zinc-400 bg-white dark:bg-zinc-800 shadow-sm border border-zinc-200 dark:border-zinc-700 hover:text-teal-600 dark:hover:text-teal-400 transition-colors p-1 rounded-full"><Plus className="w-4 h-4" /></Link>
          </div>
          <ul className="divide-y divide-zinc-100 dark:divide-zinc-800">
            {pendingTasks.map(t => (
              <li key={t.id} className="p-4 flex flex-col hover:bg-zinc-50 dark:hover:bg-zinc-800 cursor-pointer transition-colors">
                <span className="text-sm font-medium text-zinc-800 dark:text-zinc-100">{t.title}</span>
                <span className="text-xs text-zinc-500 dark:text-zinc-400">{t.priority === 'high' ? '🔴 Alta' : 'Mínima'}</span>
              </li>
            ))}
            {pendingTasks.length === 0 && <li className="p-4 text-sm text-zinc-400 dark:text-zinc-500">Todo al día 🎉</li>}
          </ul>
        </div>

        {/* Events */}
        <div className="bg-white dark:bg-zinc-900 rounded-xl shadow-sm border border-zinc-100 dark:border-zinc-800 overflow-hidden transition-colors">
          <div className="px-4 py-3 bg-zinc-50/50 dark:bg-zinc-800/50 border-b border-zinc-100 dark:border-zinc-800 flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <CalendarDays className="w-4 h-4 text-blue-600 dark:text-blue-400" />
              <span className="text-sm font-semibold text-zinc-700 dark:text-zinc-200">Agenda Familiar</span>
            </div>
            <Link href="/calendario" className="text-zinc-500 dark:text-zinc-400 bg-white dark:bg-zinc-800 shadow-sm border border-zinc-200 dark:border-zinc-700 hover:text-blue-600 dark:hover:text-blue-400 transition-colors p-1 rounded-full"><Plus className="w-4 h-4" /></Link>
          </div>
          <ul className="divide-y divide-zinc-100 dark:divide-zinc-800">
             {upcomingEvents.map(e => (
              <li key={e.id} className="p-4 flex flex-col hover:bg-zinc-50 dark:hover:bg-zinc-800 cursor-pointer transition-colors border-l-4" style={{borderLeftColor: e.color || '#e4e4e7'}}>
                <span className="text-sm font-medium text-zinc-800 dark:text-zinc-100">{e.title}</span>
                <span suppressHydrationWarning className="text-xs text-zinc-500 dark:text-zinc-400 mt-1">{new Date(e.date).toLocaleDateString('es-ES')} {e.startTime && `- ${e.startTime}`}</span>
              </li>
            ))}
            {upcomingEvents.length === 0 && <li className="p-4 text-sm text-zinc-400 dark:text-zinc-500">Sin próximos eventos.</li>}
          </ul>
        </div>
        
        {/* Shopping list */}
        <div className="bg-white dark:bg-zinc-900 rounded-xl shadow-sm border border-zinc-100 dark:border-zinc-800 overflow-hidden transition-colors">
          <div className="px-4 py-3 bg-zinc-50/50 dark:bg-zinc-800/50 border-b border-zinc-100 dark:border-zinc-800 flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <ShoppingCart className="w-4 h-4 text-orange-500" />
              <span className="text-sm font-semibold text-zinc-700 dark:text-zinc-200">La Compra ({pendingShopping.length})</span>
            </div>
            <Link href="/compra" className="text-zinc-500 dark:text-zinc-400 bg-white dark:bg-zinc-800 shadow-sm border border-zinc-200 dark:border-zinc-700 hover:text-orange-600 dark:hover:text-orange-400 transition-colors p-1 rounded-full"><Plus className="w-4 h-4" /></Link>
          </div>
          <ul className="divide-y divide-zinc-100 dark:divide-zinc-800">
             {pendingShopping.map(s => (
              <li key={s.id} className="p-4 flex items-center justify-between hover:bg-zinc-50 dark:hover:bg-zinc-800 cursor-pointer transition-colors">
                <span className="text-sm font-medium text-zinc-800 dark:text-zinc-100">{s.name}</span>
                <span className="text-xs px-2 py-1 bg-zinc-100 dark:bg-zinc-800 rounded text-zinc-600 dark:text-zinc-400">{s.quantity} {s.unit}</span>
              </li>
            ))}
            {pendingShopping.length === 0 && <li className="p-4 text-sm text-zinc-400 dark:text-zinc-500">Lista vacía.</li>}
          </ul>
        </div>
      </section>

      <FAB />
    </div>
  );
}
