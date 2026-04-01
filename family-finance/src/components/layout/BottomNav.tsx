'use client';

import { Home, PieChart, CalendarCheck2, Settings } from 'lucide-react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

export default function BottomNav() {
  const pathname = usePathname();

  const getTabClass = (path: string) => {
    const isActive = pathname === path || (path !== '/' && pathname.startsWith(path));
    return `flex flex-col items-center justify-center w-full h-full space-y-1 transition-colors ${
      isActive ? 'text-blue-600 dark:text-blue-400 font-bold' : 'text-zinc-400 dark:text-zinc-500 hover:text-zinc-600 dark:hover:text-zinc-300'
    }`;
  };

  return (
    <nav className="fixed bottom-0 w-full bg-white dark:bg-zinc-900 border-t border-zinc-200 dark:border-zinc-800 pb-safe z-50 transition-colors">
      <div className="flex justify-around items-center h-16 px-2">
        <Link href="/" className={getTabClass('/')}>
          <Home className="w-6 h-6" />
          <span className="text-[10px]">Inicio</span>
        </Link>
        <Link href="/finanzas" className={getTabClass('/finanzas')}>
          <PieChart className="w-6 h-6" />
          <span className="text-[10px]">Finanzas</span>
        </Link>
        <Link href="/calendario" className={getTabClass('/calendario')}>
          <CalendarCheck2 className="w-6 h-6" />
          <span className="text-[10px]">Agenda</span>
        </Link>
        <Link href="/configuracion" className={getTabClass('/configuracion')}>
          <Settings className="w-6 h-6" />
          <span className="text-[10px]">Ajustes</span>
        </Link>
      </div>
    </nav>
  );
}
