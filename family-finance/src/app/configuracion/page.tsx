'use client';
import { useFamilyContext } from '@/context/FamilyContext';
import { User, Dog, Moon, Tags, CreditCard, Plus, Trash2 } from 'lucide-react';
import { useState, useEffect } from 'react';

export default function ConfiguracionPage() {
  const { members, categories, accounts, addMember, removeMember, addCategory, removeCategory, addAccount, removeAccount, getAccountBalance } = useFamilyContext();
  
  const [isDark, setIsDark] = useState(false);
  const [activeTab, setActiveTab] = useState<'members'|'categories'|'accounts'>('members');

  // New Member State
  const [newMemberName, setNewMemberName] = useState('');
  const [newMemberType, setNewMemberType] = useState<'person' | 'dog'>('person');
  const [newMemberColor, setNewMemberColor] = useState('#3b82f6');

  // New Category State
  const [newCategoryName, setNewCategoryName] = useState('');
  const [newCategoryType, setNewCategoryType] = useState<'income' | 'expense'>('expense');

  // New Account State
  const [newAccountName, setNewAccountName] = useState('');

  useEffect(() => {
    setIsDark(document.documentElement.classList.contains('dark'));
  }, []);

  const toggleDarkMode = () => {
    document.documentElement.classList.toggle('dark');
    setIsDark(document.documentElement.classList.contains('dark'));
  };

  const handleAddMember = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newMemberName.trim()) return;
    addMember({
      id: Math.random().toString(36).substr(2, 9),
      name: newMemberName.trim(),
      type: newMemberType,
      color: newMemberColor
    });
    setNewMemberName('');
  };

  const handleAddCategory = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newCategoryName.trim()) return;
    addCategory({
      id: Math.random().toString(36).substr(2, 9),
      name: newCategoryName.trim(),
      type: newCategoryType,
      color: '#94a3b8' // default generic color
    });
    setNewCategoryName('');
  };

  const handleAddAccount = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newAccountName.trim()) return;
    addAccount({
      id: Math.random().toString(36).substr(2, 9),
      name: newAccountName.trim(),
      type: 'bank',
      balance: 0
    });
    setNewAccountName('');
  };

  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-2 duration-300 pb-20 p-4 max-w-md mx-auto md:max-w-4xl">
      <header className="pt-2 pb-2">
        <h1 className="text-2xl font-bold text-zinc-900 tracking-tight dark:text-white">Ajustes</h1>
        <p className="text-sm text-zinc-500 dark:text-zinc-400">Configura tu grupo familiar</p>
      </header>

      {/* General Settings */}
      <section className="bg-white dark:bg-zinc-800 rounded-2xl shadow-sm border border-zinc-200 dark:border-zinc-700 overflow-hidden">
        <div className="p-4 flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="bg-zinc-100 dark:bg-zinc-700 p-2 rounded-lg"><Moon className="w-5 h-5 text-zinc-600 dark:text-zinc-300" /></div>
            <div>
              <p className="text-sm font-semibold text-zinc-900 dark:text-white">Modo Oscuro</p>
              <p className="text-xs text-zinc-500 dark:text-zinc-400">Activar colores oscuros</p>
            </div>
          </div>
          <button onClick={toggleDarkMode} className={`w-12 h-6 rounded-full transition-colors relative ${isDark ? 'bg-blue-600' : 'bg-zinc-200'}`}>
            <div className={`w-4 h-4 rounded-full bg-white absolute top-1 transition-transform ${isDark ? 'translate-x-7' : 'translate-x-1'}`}></div>
          </button>
        </div>
      </section>

      {/* Tabs Navigation */}
      <div className="flex p-1 bg-zinc-200/50 dark:bg-zinc-800 rounded-xl space-x-1">
        <button onClick={() => setActiveTab('members')} className={`flex-1 py-2 text-xs font-semibold rounded-lg transition-all ${activeTab === 'members' ? 'bg-white dark:bg-zinc-600 text-zinc-900 dark:text-white shadow-sm' : 'text-zinc-500 dark:text-zinc-400'}`}>Miembros</button>
        <button onClick={() => setActiveTab('categories')} className={`flex-1 py-2 text-xs font-semibold rounded-lg transition-all ${activeTab === 'categories' ? 'bg-white dark:bg-zinc-600 text-zinc-900 dark:text-white shadow-sm' : 'text-zinc-500 dark:text-zinc-400'}`}>Categorías</button>
        <button onClick={() => setActiveTab('accounts')} className={`flex-1 py-2 text-xs font-semibold rounded-lg transition-all ${activeTab === 'accounts' ? 'bg-white dark:bg-zinc-600 text-zinc-900 dark:text-white shadow-sm' : 'text-zinc-500 dark:text-zinc-400'}`}>Cuentas</button>
      </div>

      {/* TAB: MEMBERS */}
      {activeTab === 'members' && (
        <section className="space-y-4">
          <ul className="bg-white dark:bg-zinc-800 rounded-2xl shadow-sm border border-zinc-200 dark:border-zinc-700 divide-y divide-zinc-50 dark:divide-zinc-700">
            {members.map(m => (
              <li key={m.id} className="p-4 flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <div className="w-10 h-10 rounded-full flex items-center justify-center text-white font-bold" style={{ backgroundColor: m.color }}>
                    {m.type === 'dog' ? <Dog className="w-5 h-5"/> : m.name.charAt(0)}
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-zinc-900 dark:text-white">{m.name}</p>
                    <p className="text-xs text-zinc-500 capitalize">{m.type === 'dog' ? 'Mascota' : 'Humano'}</p>
                  </div>
                </div>
                <button onClick={() => removeMember(m.id)} className="p-2 text-zinc-400 hover:text-rose-500 bg-zinc-50 dark:bg-zinc-700 hover:bg-rose-50 rounded-lg transition-colors">
                  <Trash2 className="w-4 h-4" />
                </button>
              </li>
            ))}
            {members.length === 0 && <li className="p-4 text-center text-sm text-zinc-500">Sin miembros.</li>}
          </ul>

          <form onSubmit={handleAddMember} className="bg-zinc-50 dark:bg-zinc-800/50 p-4 rounded-2xl border border-zinc-200 dark:border-zinc-700 space-y-3">
            <h4 className="text-xs font-bold text-zinc-500 uppercase tracking-wider">Añadir Miembro</h4>
            <div className="flex space-x-2">
              <input type="text" placeholder="Nombre..." value={newMemberName} onChange={e => setNewMemberName(e.target.value)} className="flex-1 bg-white dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-600 rounded-xl px-3 text-sm outline-none dark:text-white" />
              <input type="color" value={newMemberColor} onChange={e => setNewMemberColor(e.target.value)} className="w-10 h-10 rounded-xl border-none cursor-pointer bg-white" />
            </div>
            <div className="flex space-x-2">
              <select value={newMemberType} onChange={e => setNewMemberType(e.target.value as 'person'|'dog')} className="flex-1 bg-white dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-600 rounded-xl px-3 py-2 text-sm outline-none dark:text-white">
                <option value="person">Persona</option>
                <option value="dog">Perro / Mascota</option>
              </select>
              <button type="submit" className="bg-blue-600 text-white p-2 rounded-xl flex items-center justify-center hover:bg-blue-700 "><Plus className="w-5 h-5" /></button>
            </div>
          </form>
        </section>
      )}

      {/* TAB: CATEGORIES */}
      {activeTab === 'categories' && (
        <section className="space-y-4">
          <ul className="bg-white dark:bg-zinc-800 rounded-2xl shadow-sm border border-zinc-200 dark:border-zinc-700 divide-y divide-zinc-50 dark:divide-zinc-700">
            {categories.map(c => (
              <li key={c.id} className="p-4 flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center ${c.type === 'income' ? 'bg-emerald-100 text-emerald-600' : 'bg-rose-100 text-rose-600'}`}>
                    <Tags className="w-4 h-4"/>
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-zinc-900 dark:text-white">{c.name}</p>
                    <p className="text-xs text-zinc-500 uppercase tracking-wider">{c.type === 'income' ? 'Ingreso' : 'Gasto'}</p>
                  </div>
                </div>
                <button onClick={() => removeCategory(c.id)} className="p-2 text-zinc-400 hover:text-rose-500 bg-zinc-50 dark:bg-zinc-700 hover:bg-rose-50 rounded-lg transition-colors">
                  <Trash2 className="w-4 h-4" />
                </button>
              </li>
            ))}
          </ul>
          <form onSubmit={handleAddCategory} className="bg-zinc-50 dark:bg-zinc-800/50 p-4 rounded-2xl border border-zinc-200 dark:border-zinc-700 flex space-x-2">
            <select value={newCategoryType} onChange={e => setNewCategoryType(e.target.value as 'income'|'expense')} className="w-24 bg-white dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-600 rounded-xl px-2 text-xs outline-none dark:text-white">
              <option value="expense">Gasto</option>
              <option value="income">Ingreso</option>
            </select>
            <input type="text" placeholder="Categoría..." value={newCategoryName} onChange={e => setNewCategoryName(e.target.value)} className="flex-1 bg-white dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-600 rounded-xl px-3 py-2 text-sm outline-none dark:text-white" />
            <button type="submit" className="bg-blue-600 text-white p-2 rounded-xl flex items-center justify-center hover:bg-blue-700"><Plus className="w-5 h-5" /></button>
          </form>
        </section>
      )}

      {/* TAB: ACCOUNTS */}
      {activeTab === 'accounts' && (
        <section className="space-y-4">
          <ul className="bg-white dark:bg-zinc-800 rounded-2xl shadow-sm border border-zinc-200 dark:border-zinc-700 divide-y divide-zinc-50 dark:divide-zinc-700">
            {accounts.map(a => (
              <li key={a.id} className="p-4 flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <div className="w-8 h-8 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center">
                    <CreditCard className="w-4 h-4"/>
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-zinc-900 dark:text-white">{a.name}</p>
                    <p className="text-xs font-mono text-zinc-500">{getAccountBalance(a.id).toFixed(2)} €</p>
                  </div>
                </div>
                <button onClick={() => removeAccount(a.id)} className="p-2 text-zinc-400 hover:text-rose-500 bg-zinc-50 dark:bg-zinc-700 hover:bg-rose-50 rounded-lg transition-colors">
                  <Trash2 className="w-4 h-4" />
                </button>
              </li>
            ))}
          </ul>
          <form onSubmit={handleAddAccount} className="bg-zinc-50 dark:bg-zinc-800/50 p-4 rounded-2xl border border-zinc-200 dark:border-zinc-700 flex space-x-2">
            <input type="text" placeholder="Nombre de la cuenta o tarjeta..." value={newAccountName} onChange={e => setNewAccountName(e.target.value)} className="flex-1 bg-white dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-600 rounded-xl px-3 py-2 text-sm outline-none dark:text-white" />
            <button type="submit" className="bg-blue-600 text-white p-2 rounded-xl flex items-center justify-center hover:bg-blue-700"><Plus className="w-5 h-5" /></button>
          </form>
        </section>
      )}

    </div>
  );
}
