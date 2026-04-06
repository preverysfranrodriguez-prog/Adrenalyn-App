'use client';
import { useFamilyContext } from '@/context/FamilyContext';

export default function AhorroPage() {
  const { savingsGoals } = useFamilyContext();

  return (
    <div className="space-y-4 animate-in fade-in slide-in-from-bottom-2 duration-300 pb-20">
      <h3 className="text-sm font-bold text-zinc-800">Objetivos de Ahorro</h3>
      
      <div className="space-y-3">
        {savingsGoals.map(s => {
          const percent = Math.min((s.currentAmount / s.targetAmount) * 100, 100);

          return (
            <div key={s.id} className="bg-white p-5 rounded-xl shadow-sm border border-zinc-100 relative overflow-hidden">
               <div className="flex justify-between items-center mb-4">
                 <div className="flex items-center space-x-3">
                   <div 
                     className="w-10 h-10 rounded-full flex items-center justify-center text-white text-lg shadow-sm" 
                     style={{ backgroundColor: s.color }}
                   >
                     🎯
                   </div>
                   <div>
                      <h4 className="text-sm font-bold text-zinc-900">{s.name}</h4>
                      {s.deadline && (
                        <p suppressHydrationWarning className="text-[10px] text-zinc-500">Objetivo: {new Date(s.deadline).toLocaleDateString('es-ES')}</p>
                      )}
                   </div>
                 </div>
                 <span className="text-sm font-black text-zinc-700">{Math.round(percent)}%</span>
               </div>
               
               <div className="w-full bg-zinc-100 rounded-full h-2 overflow-hidden mb-3">
                 <div className="h-2 rounded-full transition-all duration-700 ease-out" style={{ width: `${percent}%`, backgroundColor: s.color }}></div>
               </div>

               <div className="flex justify-between text-xs font-medium text-zinc-500 bg-zinc-50 p-2 rounded-lg">
                 <span>{new Intl.NumberFormat('es-ES', { style: 'currency', currency: 'EUR' }).format(s.currentAmount)}</span>
                 <span>Meta: {new Intl.NumberFormat('es-ES', { style: 'currency', currency: 'EUR' }).format(s.targetAmount)}</span>
               </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
