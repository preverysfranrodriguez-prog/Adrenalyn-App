import { 
  FamilyMember, 
  Category, 
  Subcategory, 
  Account, 
  Transaction, 
  Budget, 
  SavingsGoal, 
  Task, 
  ShoppingItem, 
  FamilyEvent 
} from './types';

export const mockMembers: FamilyMember[] = [
  { id: 'm1', name: 'Mamá', type: 'person', color: '#ec4899', avatarUrl: 'https://i.pravatar.cc/150?u=m1' },
  { id: 'm2', name: 'Papá', type: 'person', color: '#3b82f6', avatarUrl: 'https://i.pravatar.cc/150?u=m2' },
  { id: 'm3', name: 'Hijo Mayor', type: 'person', color: '#10b981', avatarUrl: 'https://i.pravatar.cc/150?u=m3' },
  { id: 'm4', name: 'Hija Menor', type: 'person', color: '#8b5cf6', avatarUrl: 'https://i.pravatar.cc/150?u=m4' },
  { id: 'm5', name: 'Abuelo', type: 'person', color: '#f59e0b', avatarUrl: 'https://i.pravatar.cc/150?u=m5' },
  { id: 'd1', name: 'Max', type: 'dog', color: '#a8a29e' },
  { id: 'd2', name: 'Luna', type: 'dog', color: '#78716c' }
];

export const mockAccounts: Account[] = [
  { id: 'a1', name: 'Cuenta Conjunta', type: 'bank', balance: 5400.50 },
  { id: 'a2', name: 'Cuenta Ahorro', type: 'bank', balance: 12050.00 },
  { id: 'a3', name: 'Efectivo en casa', type: 'cash', balance: 350.00 },
];

export const mockCategories: Category[] = [
  { id: 'ci1', name: 'Nómina', type: 'income', color: '#10b981', icon: 'wallet' },
  { id: 'ci2', name: 'Autónomo', type: 'income', color: '#34d399', icon: 'briefcase' },
  { id: 'ci3', name: 'Alquileres', type: 'income', color: '#059669', icon: 'home' },
  { id: 'ce1', name: 'Hogar', type: 'expense', color: '#f87171', icon: 'home' },
  { id: 'ce2', name: 'Supermercado', type: 'expense', color: '#fb923c', icon: 'shopping-cart' },
  { id: 'ce3', name: 'Transporte', type: 'expense', color: '#60a5fa', icon: 'car' },
  { id: 'ce4', name: 'Mascotas', type: 'expense', color: '#a78bfa', icon: 'dog' },
  { id: 'ce5', name: 'Ocio', type: 'expense', color: '#fbbf24', icon: 'smile' },
];

export const mockTransactions: Transaction[] = [
  {
    id: 't1',
    date: '2026-04-01T10:00:00.000Z',
    amount: 2500,
    concept: 'Nómina Papá',
    type: 'income',
    categoryId: 'ci1',
    memberId: 'm2',
    method: 'transferencia',
    accountId: 'a1',
    isRecurrent: true,
    frequency: 'mensual',
  },
  {
    id: 't2',
    date: '2026-03-31T15:30:00.000Z',
    amount: 150.45,
    concept: 'Compra Mercadona',
    type: 'expense',
    mainType: 'gastos',
    categoryId: 'ce2',
    memberId: 'm1',
    method: 'tarjeta',
    accountId: 'a1',
    isRecurrent: false,
    isFixed: false,
  },
  {
    id: 't3',
    date: '2026-03-30T09:00:00.000Z',
    amount: 850.00,
    concept: 'Alquiler',
    type: 'expense',
    mainType: 'facturas',
    categoryId: 'ce1',
    memberId: 'm1',
    method: 'transferencia',
    accountId: 'a1',
    isRecurrent: true,
    frequency: 'mensual',
    isFixed: true,
  },
  {
    id: 't4',
    date: '2026-03-29T18:45:00.000Z',
    amount: 60.00,
    concept: 'Veterinario vacunas',
    type: 'expense',
    mainType: 'gastos',
    categoryId: 'ce4',
    memberId: 'm2',
    method: 'tarjeta',
    accountId: 'a1',
    isRecurrent: false,
    isFixed: false,
  }
];

export const mockBudgets: Budget[] = [
  { id: 'b1', period: 'mensual', amount: 3500, categoryId: undefined, isTotalFamily: true },
  { id: 'b2', period: 'mensual', amount: 600, categoryId: 'ce2' }, // supermercado
];

export const mockSavingsGoals: SavingsGoal[] = [
  { id: 's1', name: 'Fondo de Emergencia', targetAmount: 15000, currentAmount: 12050, color: '#10b981' },
  { id: 's2', name: 'Viaje a Japón', targetAmount: 6000, currentAmount: 1500, deadline: '2027-06-01', color: '#f43f5e' },
];

export const mockTasks: Task[] = [
  { id: 'tk1', title: 'Renovar seguro coche', priority: 'high', status: 'pendiente', dueDate: '2026-04-05T10:00:00.000Z', assigneeId: 'm2' },
  { id: 'tk2', title: 'Llevar a Max al veterinario', priority: 'medium', status: 'pendiente', assigneeId: 'm1' },
];

export const mockShoppingItems: ShoppingItem[] = [
  { id: 'sh1', name: 'Leche entera', quantity: 6, unit: 'litros', isBought: false, addedById: 'm1' },
  { id: 'sh2', name: 'Pienso perros', quantity: 1, unit: 'saco 15kg', isBought: false, addedById: 'm2' },
];

export const mockEvents: FamilyEvent[] = [
  { id: 'ev1', title: 'Partido de fútbol', date: '2026-04-01T15:00:00.000Z', isAllDay: false, startTime: '18:00', endTime: '20:00', memberIds: ['m3'], color: '#3b82f6' },
  { id: 'ev2', title: 'Cita peluquería canina Luna', date: '2026-04-03T10:00:00.000Z', isAllDay: false, startTime: '10:00', memberIds: ['d2', 'm1'], color: '#ec4899' },
];
