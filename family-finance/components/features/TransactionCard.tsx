import { Transaction, FamilyMember } from '@/lib/types';
import { useFamilyContext } from '@/context/FamilyContext';

export default function TransactionCard({ transaction }: { transaction: Transaction }) {
  const { members, categories } = useFamilyContext();
  const member = members.find(m => m.id === transaction.memberId);
  const category = categories.find(c => c.id === transaction.categoryId);

  return (
    <div className="flex justify-between items-center p-4 bg-white dark:bg-zinc-900 rounded-xl shadow-sm border border-zinc-100 dark:border-zinc-800 transition-colors">
      <div className="flex items-center space-x-3 overflow-hidden">
        <div 
          className="w-10 h-10 rounded-full flex items-center justify-center shrink-0 shadow-inner"
          style={{ backgroundColor: category?.color || '#e4e4e7' }}
        >
          <span className="text-white font-bold text-sm">
            {category?.name?.charAt(0) || '?'}
          </span>
        </div>
        <div className="truncate">
          <h4 className="text-sm font-semibold text-zinc-900 dark:text-zinc-100 truncate">{transaction.concept}</h4>
          <p suppressHydrationWarning className="text-xs text-zinc-500 dark:text-zinc-400 truncate">
            {new Date(transaction.date).toLocaleDateString('es-ES', { day: 'numeric', month: 'short' })} • {member?.name}
            {transaction.isRecurrent && ' 🔄'}
          </p>
        </div>
      </div>
      <div className={`text-sm font-bold shrink-0 ml-3 ${transaction.type === 'income' ? 'text-emerald-600 dark:text-emerald-400' : 'text-zinc-800 dark:text-zinc-200'}`}>
        {transaction.type === 'income' ? '+' : '-'}{transaction.amount.toFixed(2)} €
      </div>
    </div>
  );
}
