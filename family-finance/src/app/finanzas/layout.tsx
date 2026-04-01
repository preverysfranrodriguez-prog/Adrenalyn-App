'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { cn } from '@/lib/utils';

const tabs = [
  { name: 'Ingresos', href: '/finanzas/ingresos' },
  { name: 'Gastos', href: '/finanzas/gastos' },
  { name: 'Presupuesto', href: '/finanzas/presupuesto' },
  { name: 'Ahorro', href: '/finanzas/ahorro' },
];

export default function FinanzasLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();

  return (
    <div className="flex flex-col h-full w-full pb-20">
      <header className="pt-2 pb-2">
        <h1 className="text-2xl font-bold text-zinc-900 dark:text-white tracking-tight">Finanzas</h1>
      </header>

      {/* Scrollable Tabs */}
      <div className="flex overflow-x-auto hide-scrollbar space-x-2 pb-2 mb-4">
        {tabs.map((tab) => {
          const isActive = pathname.startsWith(tab.href);
          return (
            <Link 
              key={tab.href}
              href={tab.href}
              className={cn(
                "px-4 py-2 rounded-full text-sm font-semibold whitespace-nowrap transition-colors",
                isActive 
                  ? "bg-blue-600 dark:bg-blue-500 text-white shadow-sm"
                  : "bg-white dark:bg-zinc-800 text-zinc-600 dark:text-zinc-300 border border-zinc-200 dark:border-zinc-700 hover:bg-zinc-50 dark:hover:bg-zinc-700"
              )}
            >
              {tab.name}
            </Link>
          );
        })}
      </div>

      <div className="flex-1 w-full">
        {children}
      </div>
    </div>
  );
}
