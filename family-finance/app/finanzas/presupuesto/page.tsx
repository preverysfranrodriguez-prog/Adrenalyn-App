'use client';
import { useFamilyContext } from '@/context/FamilyContext';

export default function PresupuestoPage() {
  const { budgets, transactions, categories } = useFamilyContext();
  
  const currentMonth = new Date().getMonth();
  const currentYear = new Date().getFullYear();

  const currentMonthExpenses = transactions.filter(t => {
    const d = new Date(t.date);
    return t.type === 'expense' && d.getMonth() === currentMonth && d.getFullYear() === currentYear;
  });

  return (
    <div className="space-y-4 animate-in fade-in slide-in-from-bottom-2 duration-300 pb-20">
      <h3 className="text-sm font-bold text-zinc-800">Estado de Presupuestos Mensuales</h3>
      <div className="space-y-4">
        {budgets.map(b => {
          let spent = 0;
          let title = '';
          if (b.isTotalFamily) {
             spent = currentMonthExpenses.reduce((acc, t) => acc + t.amount, 0);
             title = 'Presupuesto Familiar Total';
          } else if (b.categoryId) {
             spent = currentMonthExpenses.filter(t => t.categoryId === b.categoryId).reduce((acc, t) => acc + t.amount, 0);
             const cat = categories.find(c => c.id === b.categoryId);
             title = `Presupuesto: ${cat?.name || 'Categoría'}`;
          }

          const percent = Math.min((spent / b.amount) * 100, 100);
          const isOver = spent > b.amount;
          const isWarning = percent > 80 && !isOver;

          let colorClass = 'bg-emerald-500';
          if (isWarning) colorClass = 'bg-amber-500';
          if (isOver) colorClass = 'bg-rose-500';

          return (
            <div key={b.id} className="bg-white p-5 rounded-xl shadow-sm border border-zinc-100">
              <div className="flex justify-between items-end mb-3">
                <h4 className="text-sm font-semibold text-zinc-900">{title}</h4>
                <div className="text-right">
                  <span className={`text-base font-bold tracking-tight ${isOver ? 'text-rose-600' : 'text-zinc-800'}`}>
                    {new Intl.NumberFormat('es-ES', { style: 'currency', currency: 'EUR' }).format(spent)}
                  </span>
                  <span className="text-xs text-zinc-500 font-medium"> / {b.amount}€</span>
                </div>
              </div>
              
              <div className="w-full bg-zinc-100 rounded-full h-2.5 overflow-hidden">
                <div className={`h-2.5 rounded-full ${colorClass} transition-all duration-500 ease-out`} style={{ width: `${percent}%` }}></div>
              </div>
              
              {isOver && <p className="text-xs text-rose-500 mt-2 font-medium flex items-center">⚠️ Has superado el presupuesto</p>}
              {isWarning && <p className="text-xs text-amber-600 mt-2 font-medium flex items-center">⚠️ Atención, te acercas al límite</p>}
            </div>
          );
        })}
      </div>
    </div>
  );
}
