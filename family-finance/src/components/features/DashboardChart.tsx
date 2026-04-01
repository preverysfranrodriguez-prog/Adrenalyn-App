'use client';

import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip, Legend } from 'recharts';

interface ChartData {
  name: string;
  value: number;
  color: string;
}

export default function DashboardChart({ title, data }: { title: string, data: ChartData[] }) {
  if (data.length === 0) {
    return (
      <div className="bg-white dark:bg-zinc-900 p-4 rounded-xl shadow-sm border border-zinc-100 dark:border-zinc-800 flex flex-col items-center justify-center h-64 text-zinc-400 dark:text-zinc-500 transition-colors">
        <p>No hay datos suficientes</p>
      </div>
    );
  }

  return (
    <div className="bg-white dark:bg-zinc-900 p-4 rounded-xl shadow-sm border border-zinc-100 dark:border-zinc-800 flex flex-col transition-colors">
      <h3 className="text-sm font-semibold text-zinc-700 dark:text-zinc-200 mb-4">{title}</h3>
      <div className="h-56 w-full">
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Pie
              data={data}
              cx="50%"
              cy="50%"
              innerRadius={50}
              outerRadius={80}
              paddingAngle={2}
              dataKey="value"
            >
              {data.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={entry.color} />
              ))}
            </Pie>
            <Tooltip 
              formatter={(value: any) => new Intl.NumberFormat('es-ES', { style: 'currency', currency: 'EUR' }).format(Number(value))}
              contentStyle={{ borderRadius: '8px', border: '1px solid #3f3f46', backgroundColor: '#18181b', color: '#fafafa', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.5)' }}
            />
            <Legend verticalAlign="bottom" height={36} iconType="circle" wrapperStyle={{ fontSize: '12px' }} />
          </PieChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
