'use client';
import { Plus } from 'lucide-react';
import Link from 'next/link';

export default function FAB() {
  return (
    <Link href="/finanzas/nuevo" aria-label="Añadir transacción" className="fixed bottom-20 right-4 md:bottom-8 md:right-8 bg-blue-600 text-white p-3 rounded-full shadow-lg hover:bg-blue-700 transition-transform active:scale-95 z-50 flex items-center justify-center">
      <Plus size={28} />
    </Link>
  );
}
