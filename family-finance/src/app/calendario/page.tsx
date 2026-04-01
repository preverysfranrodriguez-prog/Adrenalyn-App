'use client';
import { useFamilyContext } from '@/context/FamilyContext';
import { useState } from 'react';
import { ChevronLeft, ChevronRight, Plus, X, Calendar as CalIcon, Flag, User } from 'lucide-react';
import { startOfMonth, endOfMonth, startOfWeek, endOfWeek, eachDayOfInterval, format, isSameMonth, isSameDay, addMonths, subMonths } from 'date-fns';
import { es } from 'date-fns/locale';
import Link from 'next/link';

export default function CalendarioPage() {
  const { events, tasks, members } = useFamilyContext();
  
  const [currentDate, setCurrentDate] = useState(new Date());
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);

  const taskEvents = tasks.filter(t => t.dueDate && t.status !== 'hecho').map(t => ({
    id: t.id,
    title: t.title,
    isTask: true,
    taskRef: t,
    date: t.dueDate!,
    isAllDay: t.dueDate?.includes('T00:00:00.000Z'),
    startTime: (!t.dueDate?.includes('T00:00:00.000Z') && t.dueDate?.includes('T')) 
                 ? new Date(t.dueDate).toLocaleTimeString('es-ES', {hour: '2-digit', minute:'2-digit'}) 
                 : undefined,
    endTime: undefined,
    memberIds: t.assigneeId ? [t.assigneeId] : [],
    color: t.priority === 'high' ? '#e11d48' : '#3b82f6',
    description: `Prioridad: ${t.priority === 'high' ? 'Alta' : t.priority === 'low' ? 'Baja' : 'Normal'}`,
    location: undefined
  }));

  const standardEvents = events.map(e => ({ ...e, isTask: false, color: e.color || '#10b981' }));
  const allAgendaItems = [...standardEvents, ...taskEvents];

  // Calendar Math
  const monthStart = startOfMonth(currentDate);
  const monthEnd = endOfMonth(monthStart);
  const startDate = startOfWeek(monthStart, { weekStartsOn: 1 });
  const endDate = endOfWeek(monthEnd, { weekStartsOn: 1 });
  const calendarDays = eachDayOfInterval({ start: startDate, end: endDate });

  const nextMonth = () => setCurrentDate(addMonths(currentDate, 1));
  const prevMonth = () => setCurrentDate(subMonths(currentDate, 1));

  const weekDays = ['L', 'M', 'X', 'J', 'V', 'S', 'D'];

  // Selected Day Items
  const selectedDayEvents = selectedDate ? allAgendaItems.filter(e => isSameDay(new Date(e.date), selectedDate)) : [];

  return (
    <div className="space-y-4 animate-in fade-in slide-in-from-bottom-2 duration-300 pb-20 p-4 max-w-md mx-auto md:max-w-4xl transition-colors">
      <header className="pt-2 pb-2 flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-zinc-900 dark:text-white tracking-tight">Calendario</h1>
          <p className="text-sm text-zinc-500 dark:text-zinc-400 capitalize">{format(currentDate, 'MMMM yyyy', { locale: es })}</p>
        </div>
      </header>

      <div className="bg-white dark:bg-zinc-900 rounded-2xl shadow-sm border border-zinc-200 dark:border-zinc-800 overflow-hidden transition-colors relative">
        {/* Header Controls */}
        <div className="flex items-center justify-between p-4 border-b border-zinc-100 dark:border-zinc-800">
          <button onClick={prevMonth} className="p-2 hover:bg-zinc-100 dark:hover:bg-zinc-800 rounded-full transition-colors">
            <ChevronLeft className="w-5 h-5 text-zinc-600 dark:text-zinc-300" />
          </button>
          <h2 className="font-bold text-lg text-zinc-800 dark:text-zinc-100 capitalize">
            {format(currentDate, 'MMMM yyyy', { locale: es })}
          </h2>
          <button onClick={nextMonth} className="p-2 hover:bg-zinc-100 dark:hover:bg-zinc-800 rounded-full transition-colors">
            <ChevronRight className="w-5 h-5 text-zinc-600 dark:text-zinc-300" />
          </button>
        </div>

        {/* Days of week header */}
        <div className="grid grid-cols-7 border-b border-zinc-100 dark:border-zinc-800 bg-zinc-50/50 dark:bg-zinc-800/50">
          {weekDays.map(day => (
            <div key={day} className="py-2 text-center text-[10px] font-bold text-zinc-500 dark:text-zinc-400 uppercase">
              {day}
            </div>
          ))}
        </div>

        {/* Calendar Grid */}
        <div className="grid grid-cols-7 gap-px bg-zinc-100 dark:bg-zinc-700/50">
          {calendarDays.map((day) => {
            const isCurrentMonth = isSameMonth(day, monthStart);
            const isToday = isSameDay(day, new Date());
            const dayEvents = allAgendaItems.filter(e => isSameDay(new Date(e.date), day));
            const isSelected = selectedDate && isSameDay(day, selectedDate);
            
            return (
              <div 
                key={day.toISOString()} 
                onClick={() => setSelectedDate(day)}
                className={`min-h-[80px] p-1 bg-white dark:bg-zinc-900 flex flex-col cursor-pointer transition-colors duration-200
                  ${!isCurrentMonth ? 'opacity-40' : ''} 
                  ${isSelected ? 'ring-2 ring-inset ring-blue-500 bg-blue-50/10 dark:bg-blue-900/10' : 'hover:bg-zinc-50 dark:hover:bg-zinc-800/50'}
                `}
              >
                <div className="flex justify-end mb-1">
                  <span className={`text-xs font-semibold w-6 h-6 flex items-center justify-center rounded-full ${isToday ? 'bg-blue-600 text-white' : 'text-zinc-700 dark:text-zinc-300'}`}>
                    {format(day, 'd')}
                  </span>
                </div>
                
                <div className="flex-1 overflow-y-auto space-y-1">
                  {dayEvents.slice(0, 3).map(e => (
                    <div 
                      key={e.id}
                      className="text-[9px] font-medium px-1 py-0.5 rounded truncate text-white shadow-sm flex items-center"
                      style={{ backgroundColor: e.color }}
                      title={e.title}
                    >
                      {e.isTask && '📝 '}{e.title}
                    </div>
                  ))}
                  {dayEvents.length > 3 && (
                    <div className="text-[9px] font-bold text-center text-zinc-500 dark:text-zinc-400">
                      +{dayEvents.length - 3} más
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Selected Date Modal */}
      {selectedDate && (
        <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center bg-black/50 backdrop-blur-sm sm:p-4 animate-in fade-in duration-200">
          <div className="bg-white dark:bg-zinc-900 w-full sm:max-w-md rounded-t-3xl sm:rounded-3xl shadow-2xl overflow-hidden animate-in slide-in-from-bottom-5">
            <div className="p-4 border-b border-zinc-100 dark:border-zinc-800 flex justify-between items-center bg-zinc-50/50 dark:bg-zinc-800/50">
              <h3 className="font-bold text-lg text-zinc-900 dark:text-white capitalize flex items-center">
                <CalIcon className="w-5 h-5 mr-2 text-blue-500" />
                {format(selectedDate, 'EEEE d, MMMM', { locale: es })}
              </h3>
              <button 
                onClick={() => setSelectedDate(null)} 
                className="w-8 h-8 flex items-center justify-center rounded-full bg-zinc-200 dark:bg-zinc-700 text-zinc-500 dark:text-zinc-300 hover:bg-zinc-300 dark:hover:bg-zinc-600 transition-colors"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
            
            <div className="p-4 max-h-[50vh] overflow-y-auto space-y-3">
              {selectedDayEvents.length > 0 ? selectedDayEvents.map(e => {
                const isTask = (e as any).isTask;
                const membersAssigned = members.filter(m => e.memberIds?.includes(m.id));
                return (
                  <div key={e.id} className="flex flex-col p-3 rounded-xl border border-zinc-100 dark:border-zinc-800 bg-white dark:bg-zinc-900 shadow-sm border-l-4" style={{borderLeftColor: e.color}}>
                    <div className="flex justify-between items-start">
                      <h4 className="text-sm font-bold text-zinc-900 dark:text-white flex items-center">
                        {isTask && '📝 '}{e.title}
                      </h4>
                      <span className="text-[10px] bg-zinc-100 dark:bg-zinc-800 text-zinc-500 dark:text-zinc-400 px-2 py-0.5 rounded font-mono">
                        {e.startTime || 'Todo el día'}
                      </span>
                    </div>
                    {e.description && (
                      <p className="text-xs text-zinc-500 dark:text-zinc-400 mt-1">{e.description}</p>
                    )}
                    {membersAssigned.length > 0 && (
                      <div className="flex items-center mt-2 space-x-1">
                        {membersAssigned.map(m => (
                          <span key={m.id} className="text-[9px] text-white px-2 py-0.5 rounded-full font-medium" style={{backgroundColor: m.color}}>
                            {m.name}
                          </span>
                        ))}
                      </div>
                    )}
                  </div>
                );
              }) : (
                <div className="py-8 text-center text-zinc-500 dark:text-zinc-400">
                  <p className="text-sm">No hay eventos ni tareas para este día.</p>
                </div>
              )}
            </div>

            <div className="p-4 border-t border-zinc-100 dark:border-zinc-800 bg-zinc-50/50 dark:bg-zinc-800/50 flex space-x-2">
               <Link href="/tareas" onClick={() => setSelectedDate(null)} className="flex-1 text-center bg-white dark:bg-zinc-800 text-zinc-700 dark:text-zinc-200 border border-zinc-200 dark:border-zinc-700 shadow-sm py-2.5 rounded-xl text-sm font-bold hover:bg-zinc-50 dark:hover:bg-zinc-700 transition-colors">
                 + Tarea
               </Link>
               <button className="flex-1 text-center bg-blue-600 text-white shadow-sm shadow-blue-500/30 py-2.5 rounded-xl text-sm font-bold hover:bg-blue-700 transition-colors">
                 + Evento
               </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
