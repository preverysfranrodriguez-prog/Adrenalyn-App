'use client';
import { useFamilyContext } from '@/context/FamilyContext';
import TransactionCard from '@/components/features/TransactionCard';
import { Plus } from 'lucide-react';
import Link from 'next/link';

export default function IngresosPage() {
  const { transactions } = useFamilyContext();
  const incomes = transactions
    .filter(t => t.type === 'income')
    .sort((a,b) => new Date(b.date).getTime() - new Date(a.date).getTime());

  const currentMonthIncomes = incomes.filter(t => {
    const d = new Date(t.date);
    const now = new Date();
    return d.getMonth() === now.getMonth() && d.getFullYear() === now.getFullYear();
  });

  const totalMonth = currentMonthIncomes.reduce((acc, t) => acc + t.amount, 0);

  return (
    <div className="space-y-4 animate-in fade-in slide-in-from-bottom-2 duration-300 pb-20">
      <div className="flex justify-between items-center bg-emerald-50 p-5 rounded-2xl border border-emerald-100 shadow-sm relative overflow-hidden">
        <div className="absolute -right-4 -top-4 w-24 h-24 bg-emerald-100 rounded-full opacity-50 pointer-events-none"></div>
        <div className="z-10 relative">
          <span className="text-sm font-semibold text-emerald-800">Total Ingresos</span>
          <p className="text-xs text-emerald-600 opacity-80">Este mes</p>
        </div>
        <span className="text-3xl font-bold text-emerald-700 z-10 relative">
           {new Intl.NumberFormat('es-ES', { style: 'currency', currency: 'EUR' }).format(totalMonth)}
        </span>
      </div>
      
      <div className="flex justify-between items-center pt-2">
        <h3 className="text-sm font-bold text-zinc-800">Historial de Ingresos</h3>
        <Link href="/finanzas/nuevo?type=income" className="text-xs flex items-center bg-blue-50 text-blue-700 font-semibold px-3 py-1.5 rounded-full hover:bg-blue-100 transition-colors">
          <Plus size={14} className="mr-1" />
          Añadir Ingreso
        </Link>
      </div>

      <div className="space-y-1">
        {incomes.length > 0 ? (
          incomes.map(t => <TransactionCard key={t.id} transaction={t} />)
        ) : (
          <div className="bg-zinc-50 border border-zinc-100 rounded-xl p-8 text-center text-zinc-500">
            <p className="text-sm">No hay ingresos registrados todavía.</p>
          </div>
        )}
      </div>
    </div>
  );
}
