'use client';
import { useFamilyContext } from '@/context/FamilyContext';
import { Plus, Circle, CheckCircle2, Calendar as CalIcon, User, Flag } from 'lucide-react';
import { useState } from 'react';
import Link from 'next/link';
import { Task } from '@/lib/types';

export default function TareasPage() {
  const { tasks, members, toggleTask, addTask } = useFamilyContext();
  const [filter, setFilter] = useState<'all' | 'pending' | 'done'>('all');
  
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [newTaskTitle, setNewTaskTitle] = useState('');
  const [priority, setPriority] = useState<'low'|'medium'|'high'>('medium');
  const [assigneeId, setAssigneeId] = useState(members[0]?.id || '');
  const [dueDate, setDueDate] = useState('');
  const [dueTime, setDueTime] = useState('');

  const filteredTasks = tasks.filter(t => {
    if (filter === 'pending') return t.status !== 'hecho';
    if (filter === 'done') return t.status === 'hecho';
    return true;
  });

  const handleAdd = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTaskTitle.trim()) return;
    
    let isoDate = undefined;
    if (dueDate) {
      if (dueTime) {
        isoDate = new Date(`${dueDate}T${dueTime}:00`).toISOString();
      } else {
        isoDate = new Date(`${dueDate}T00:00:00`).toISOString();
      }
    }
    
    const newTask: Task = {
      id: Math.random().toString(36).substr(2, 9),
      title: newTaskTitle.trim(),
      priority,
      status: 'pendiente',
      assigneeId: assigneeId || undefined,
      dueDate: isoDate
    };
    
    addTask(newTask);
    setNewTaskTitle('');
    setDueDate('');
    setDueTime('');
    setPriority('medium');
    setIsFormOpen(false);
  };

  return (
    <div className="space-y-4 animate-in fade-in slide-in-from-bottom-2 duration-300 pb-20 p-4 max-w-md mx-auto md:max-w-4xl transition-colors">
      <header className="pt-2 pb-2 flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-zinc-900 dark:text-white tracking-tight">Tareas</h1>
          <p className="text-sm text-zinc-500 dark:text-zinc-400">Organización familiar</p>
        </div>
        <Link href="/compra" className="text-xs bg-orange-50 dark:bg-orange-900/30 text-orange-700 dark:text-orange-400 px-3 py-1.5 rounded-full font-semibold border border-orange-100 dark:border-orange-900/50 flex items-center shadow-sm cursor-pointer hover:bg-orange-100 dark:hover:bg-orange-800/50 transition-colors">
          Ir a La Compra
        </Link>
      </header>

      {/* Creation Form */}
      <div className="bg-white dark:bg-zinc-900 rounded-2xl shadow-sm border border-zinc-200 dark:border-zinc-700 mb-4 overflow-hidden transition-colors">
        {!isFormOpen ? (
          <button 
            onClick={() => setIsFormOpen(true)}
            className="w-full flex items-center space-x-2 p-3 sm:p-4 text-zinc-500 dark:text-zinc-400 hover:bg-zinc-50 dark:hover:bg-zinc-800 transition-colors"
          >
            <Plus className="w-5 h-5 text-blue-600 dark:text-blue-400" />
            <span className="text-sm font-medium">Añadir nueva tarea...</span>
          </button>
        ) : (
          <form onSubmit={handleAdd} className="p-4 space-y-4 bg-blue-50/30 dark:bg-zinc-800/50 transition-colors">
            <input 
              type="text" 
              autoFocus
              value={newTaskTitle}
              onChange={(e) => setNewTaskTitle(e.target.value)}
              placeholder="¿Qué hay que hacer?" 
              className="w-full bg-transparent text-zinc-900 dark:text-white font-semibold text-lg outline-none placeholder:text-zinc-400 dark:placeholder:text-zinc-500"
            />
            
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-[10px] font-bold text-zinc-500 dark:text-zinc-400 uppercase mb-1 flex items-center"><User className="w-3 h-3 mr-1"/>Asignar a</label>
                <select value={assigneeId} onChange={e => setAssigneeId(e.target.value)} className="w-full text-xs p-2 rounded-lg border border-zinc-200 dark:border-zinc-700 bg-white dark:bg-zinc-900 dark:text-zinc-200 outline-none transition-colors">
                  {members.map(m => <option key={m.id} value={m.id}>{m.name}</option>)}
                </select>
              </div>
              
              <div>
                <label className="block text-[10px] font-bold text-zinc-500 dark:text-zinc-400 uppercase mb-1 flex items-center"><Flag className="w-3 h-3 mr-1"/>Urgencia</label>
                <select value={priority} onChange={e => setPriority(e.target.value as any)} className="w-full text-xs p-2 rounded-lg border border-zinc-200 dark:border-zinc-700 bg-white dark:bg-zinc-900 dark:text-zinc-200 outline-none transition-colors">
                  <option value="low">Mínima</option>
                  <option value="medium">Normal</option>
                  <option value="high">🔴 Alta / Urgente</option>
                </select>
              </div>

              <div>
                <label className="block text-[10px] font-bold text-zinc-500 dark:text-zinc-400 uppercase mb-1 flex items-center"><CalIcon className="w-3 h-3 mr-1"/>Fecha límite</label>
                <input type="date" value={dueDate} onChange={e => setDueDate(e.target.value)} className="w-full text-xs p-2 rounded-lg border border-zinc-200 dark:border-zinc-700 bg-white dark:bg-zinc-900 dark:text-zinc-200 outline-none transition-colors" />
              </div>
              
              <div>
                <label className="block text-[10px] font-bold text-zinc-500 dark:text-zinc-400 uppercase mb-1">Hora (Opcional)</label>
                <input type="time" value={dueTime} onChange={e => setDueTime(e.target.value)} disabled={!dueDate} className="w-full text-xs p-2 rounded-lg border border-zinc-200 dark:border-zinc-700 bg-white dark:bg-zinc-900 dark:text-zinc-200 outline-none disabled:opacity-50 transition-colors" />
              </div>
            </div>

            <div className="flex justify-end space-x-2 pt-2">
              <button type="button" onClick={() => setIsFormOpen(false)} className="px-4 py-2 text-xs font-semibold text-zinc-500 dark:text-zinc-400 hover:text-zinc-800 dark:hover:text-white transition-colors">Cancelar</button>
              <button type="submit" disabled={!newTaskTitle.trim()} className="px-4 py-2 text-xs font-bold bg-blue-600 text-white rounded-lg shadow-sm hover:bg-blue-700 disabled:opacity-50 transition-colors">Guardar Tarea</button>
            </div>
          </form>
        )}
      </div>

      <div className="flex space-x-2">
        <button onClick={() => setFilter('all')} className={`px-4 py-1.5 rounded-full text-xs font-semibold transition-colors ${filter === 'all' ? 'bg-zinc-800 dark:bg-zinc-200 text-white dark:text-zinc-900' : 'bg-zinc-100 dark:bg-zinc-800 text-zinc-600 dark:text-zinc-400'}`}>Todas</button>
        <button onClick={() => setFilter('pending')} className={`px-4 py-1.5 rounded-full text-xs font-semibold transition-colors ${filter === 'pending' ? 'bg-zinc-800 dark:bg-zinc-200 text-white dark:text-zinc-900' : 'bg-zinc-100 dark:bg-zinc-800 text-zinc-600 dark:text-zinc-400'}`}>Pendientes</button>
        <button onClick={() => setFilter('done')} className={`px-4 py-1.5 rounded-full text-xs font-semibold transition-colors ${filter === 'done' ? 'bg-zinc-800 dark:bg-zinc-200 text-white dark:text-zinc-900' : 'bg-zinc-100 dark:bg-zinc-800 text-zinc-600 dark:text-zinc-400'}`}>Hechas</button>
      </div>

      <div className="space-y-2 mt-4">
        {filteredTasks.length > 0 ? filteredTasks.map(t => {
          const assignee = members.find(m => m.id === t.assigneeId);
          const isDone = t.status === 'hecho';
          
          let dateStr = '';
          if (t.dueDate) {
             const d = new Date(t.dueDate);
             dateStr = d.toLocaleDateString('es-ES');
             if (t.dueDate.includes('T') && !t.dueDate.endsWith('T00:00:00.000Z')) {
                dateStr += ` ${d.toLocaleTimeString('es-ES', {hour: '2-digit', minute:'2-digit'})}`;
             }
          }

          return (
            <div key={t.id} onClick={() => toggleTask(t.id)} className={`flex items-start p-4 bg-white dark:bg-zinc-900 rounded-xl shadow-sm border border-zinc-100 dark:border-zinc-800 transition-all cursor-pointer hover:shadow dark:hover:shadow-none hover:border-blue-200 dark:hover:border-blue-500/50 ${isDone ? 'opacity-60 bg-zinc-50 dark:bg-zinc-900/50' : 'opacity-100'}`}>
              <div className="mt-0.5 mr-3 shrink-0 text-zinc-400 dark:text-zinc-500 hover:text-blue-500 dark:hover:text-blue-400 transition-colors">
                {isDone ? <CheckCircle2 className="w-6 h-6 text-blue-500 dark:text-blue-400" /> : <Circle className="w-6 h-6" />}
              </div>
              <div className="flex-1">
                <h4 className={`text-sm font-semibold transition-colors ${isDone ? 'line-through text-zinc-500 dark:text-zinc-500' : 'text-zinc-900 dark:text-zinc-100'}`}>{t.title}</h4>
                <div className="flex items-center space-x-3 mt-1.5 flex-wrap">
                  {t.dueDate && (
                    <span suppressHydrationWarning className="flex items-center text-[10px] text-zinc-500 dark:text-zinc-400 bg-zinc-50 dark:bg-zinc-800 px-2 py-0.5 rounded border border-zinc-100 dark:border-zinc-700 mt-1 transition-colors">
                      <CalIcon className="w-3 h-3 mr-1" />
                      {dateStr}
                    </span>
                  )}
                  {assignee && (
                    <span className="flex items-center text-[10px] font-medium px-2 py-0.5 rounded-full text-white mt-1" style={{backgroundColor: assignee.color}}>
                      {assignee.name}
                    </span>
                  )}
                  {t.priority === 'high' && (
                    <span className="text-[10px] text-rose-600 dark:text-rose-400 bg-rose-50 dark:bg-rose-900/30 px-2 py-0.5 rounded font-bold border border-rose-100 dark:border-rose-900/50 mt-1 transition-colors">🔥 Urgente</span>
                  )}
                  {t.priority === 'low' && (
                    <span className="text-[10px] text-zinc-500 dark:text-zinc-400 bg-zinc-100 dark:bg-zinc-800 px-2 py-0.5 rounded mt-1 transition-colors">Mínima</span>
                  )}
                </div>
              </div>
            </div>
          );
        }) : (
          <div className="p-8 text-center text-zinc-400 dark:text-zinc-500 text-sm bg-zinc-50 dark:bg-zinc-800/30 rounded-xl border border-zinc-100 dark:border-zinc-800 transition-colors">
            No hay tareas en esta vista.
          </div>
        )}
      </div>
    </div>
  );
}
