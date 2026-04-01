'use client';
import { useFamilyContext } from '@/context/FamilyContext';
import { Plus, Check, Trash2 } from 'lucide-react';
import { useState, useEffect } from 'react';

export default function CompraPage() {
  const { shoppingItems, members, addShoppingItem, toggleShoppingItem, clearBoughtShoppingItems } = useFamilyContext();
  const [newItemName, setNewItemName] = useState('');
  const [addedById, setAddedById] = useState('');
  
  useEffect(() => {
    if (members.length > 0 && !addedById) setAddedById(members[0].id);
  }, [members, addedById]);

  const pendientes = shoppingItems.filter(s => !s.isBought);
  const comprados = shoppingItems.filter(s => s.isBought);

  const handleAdd = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (newItemName.trim() && addedById) {
      addShoppingItem(newItemName.trim(), addedById);
      setNewItemName('');
    }
  };

  return (
    <div className="space-y-4 animate-in fade-in slide-in-from-bottom-2 duration-300 pb-20 p-4 max-w-md mx-auto md:max-w-4xl transition-colors">
      <header className="pt-2 pb-2 flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-zinc-900 dark:text-white tracking-tight">La Compra</h1>
          <p className="text-sm text-zinc-500 dark:text-zinc-400">{pendientes.length} artículos por comprar</p>
        </div>
        <button 
          onClick={clearBoughtShoppingItems}
          className="text-[10px] bg-rose-50 dark:bg-rose-900/30 text-rose-600 dark:text-rose-400 px-3 py-2 rounded-lg font-semibold border border-rose-100 dark:border-rose-900/50 flex items-center shadow-sm hover:bg-rose-100 dark:hover:bg-rose-800/50 transition-colors"
        >
          <Trash2 className="w-3 h-3 mr-1" />
          Vaciar
        </button>
      </header>

      {/* Quick Add Form */}
      <form onSubmit={handleAdd} className="flex bg-white dark:bg-zinc-900 p-1.5 rounded-full shadow-sm border border-zinc-200 dark:border-zinc-700 overflow-hidden transition-colors">
        <select value={addedById} onChange={e => setAddedById(e.target.value)} className="bg-zinc-50 dark:bg-zinc-800 border-r border-zinc-200 dark:border-zinc-700 text-xs font-semibold text-zinc-700 dark:text-zinc-300 outline-none pl-3 pr-2 cursor-pointer transition-colors">
           {members.map(m => <option key={m.id} value={m.id}>{m.name.split(' ')[0]}</option>)}
        </select>
        <input 
          type="text" 
          value={newItemName}
          onChange={(e) => setNewItemName(e.target.value)}
          placeholder="Añadir..." 
          className="flex-1 bg-transparent px-3 py-2 outline-none text-sm text-zinc-900 dark:text-white placeholder:text-zinc-400 dark:placeholder:text-zinc-500"
        />
        <button type="submit" disabled={!newItemName.trim() || !addedById} className="bg-orange-500 disabled:opacity-50 hover:bg-orange-600 text-white w-10 h-10 rounded-full transition-colors flex items-center justify-center shrink-0">
          <Plus className="w-5 h-5" />
        </button>
      </form>

      <div className="space-y-6 mt-6">
        <div>
          <h3 className="text-xs font-bold uppercase tracking-wider text-zinc-500 dark:text-zinc-400 mb-3 ml-1">Para Comprar</h3>
          <ul className="space-y-2">
            {pendientes.length > 0 ? pendientes.map(s => {
              const member = members.find(m => m.id === s.addedById);
              return (
                <li onClick={() => toggleShoppingItem(s.id)} key={s.id} className="flex justify-between items-center bg-white dark:bg-zinc-900 p-3 sm:p-4 rounded-xl shadow-sm border border-zinc-100 dark:border-zinc-800 cursor-pointer hover:border-orange-300 dark:hover:border-orange-500 hover:shadow transition-all group">
                  <div className="flex items-center space-x-3 w-full">
                    <div className="w-6 h-6 rounded-full border-2 border-zinc-300 dark:border-zinc-600 group-hover:border-orange-500 transition-colors"></div>
                    <div className="flex-1">
                      <span className="text-sm font-semibold text-zinc-900 dark:text-white block">{s.name}</span>
                      <span className="text-xs text-zinc-500 dark:text-zinc-400">{s.quantity} {s.unit} • Añadido por {member?.name}</span>
                    </div>
                  </div>
                </li>
              );
            }) : <p className="text-sm text-zinc-400 dark:text-zinc-500 p-6 bg-zinc-50 dark:bg-zinc-800/50 rounded-xl text-center border border-dashed border-zinc-200 dark:border-zinc-700">Todo comprado 🎉</p>}
          </ul>
        </div>

        {comprados.length > 0 && (
          <div>
            <h3 className="text-xs font-bold uppercase tracking-wider text-zinc-500 dark:text-zinc-400 mb-3 ml-1">En el carrito / Comprados</h3>
            <ul className="space-y-2 opacity-60">
              {comprados.map(s => (
                <li onClick={() => toggleShoppingItem(s.id)} key={s.id} className="flex justify-between items-center bg-white dark:bg-zinc-900 p-3 sm:p-4 rounded-xl shadow-sm border border-zinc-100 dark:border-zinc-800 cursor-pointer transition-colors">
                  <div className="flex items-center space-x-3 w-full">
                    <div className="w-6 h-6 rounded-full bg-emerald-500 text-white flex items-center justify-center">
                      <Check className="w-4 h-4" />
                    </div>
                    <div className="flex-1">
                      <span className="text-sm font-semibold text-zinc-900 dark:text-white line-through decoration-zinc-400 dark:decoration-zinc-500">{s.name}</span>
                      <span className="text-xs text-zinc-500 dark:text-zinc-400">{s.quantity} {s.unit}</span>
                    </div>
                  </div>
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>
    </div>
  );
}
