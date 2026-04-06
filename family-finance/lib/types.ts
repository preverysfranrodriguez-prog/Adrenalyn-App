export type MemberType = 'person' | 'dog';

export interface FamilyMember {
  id: string;
  name: string;
  type: MemberType;
  color: string;
  avatarUrl?: string;
}

export interface Category {
  id: string;
  name: string;
  type: 'income' | 'expense';
  icon?: string;
  color: string;
}

export interface Subcategory {
  id: string;
  categoryId: string;
  name: string;
}

export interface Account {
  id: string;
  name: string;
  type: 'cash' | 'bank' | 'card' | 'wallet';
  balance: number;
}

export type ExpenseMainType = 'facturas' | 'deudas' | 'gastos' | 'inversiones';
export type PaymentMethod = 'efectivo' | 'transferencia' | 'bizum' | 'tarjeta' | 'domiciliacion' | 'ingreso_bancario' | 'otro';
export type Periodicity = 'diario' | 'semanal' | 'mensual' | 'trimestral' | 'anual' | 'personalizada';

export interface Transaction {
  id: string;
  date: string; // ISO string
  amount: number;
  concept: string;
  type: 'income' | 'expense';
  categoryId: string;
  subcategoryId?: string;
  memberId: string;
  method: PaymentMethod;
  accountId: string;
  
  // Specific to Expense
  mainType?: ExpenseMainType; // required for expense
  isFixed?: boolean; // fixed or variable expense

  // Recurrency
  isRecurrent: boolean;
  frequency?: Periodicity;
  
  notes?: string;
  tags?: string[];
  receiptUrl?: string;
}

export interface Budget {
  id: string;
  period: 'mensual' | 'trimestral' | 'anual';
  amount: number;
  categoryId?: string; 
  memberId?: string;
  isTotalFamily?: boolean;
}

export interface SavingsGoal {
  id: string;
  name: string;
  targetAmount: number;
  currentAmount: number;
  deadline?: string;
  color: string;
}

export interface Investment {
  id: string;
  date: string;
  amount: number;
  type: 'acciones' | 'fondos' | 'etf' | 'inmuebles' | 'criptomonedas' | 'pensiones' | 'cartera' | 'otros';
  memberId: string; // titular
  notes?: string;
}

export interface Task {
  id: string;
  title: string;
  description?: string;
  priority: 'low' | 'medium' | 'high';
  status: 'pendiente' | 'en_curso' | 'hecho';
  dueDate?: string;
  assigneeId?: string;
  category?: string;
  reminder?: boolean;
  repeat?: boolean;
  notes?: string;
}

export interface ShoppingItem {
  id: string;
  name: string;
  quantity: number;
  unit: string;
  category?: string;
  isBought: boolean;
  addedById: string;
  notes?: string;
  store?: string;
  priority?: 'low' | 'medium' | 'high';
}

export interface FamilyEvent {
  id: string;
  title: string;
  date: string;
  startTime?: string;
  endTime?: string;
  isAllDay: boolean;
  memberIds: string[]; // can be multiple or single (including dogs)
  location?: string;
  description?: string;
  category?: string;
  repeat?: boolean;
  reminder?: boolean;
  color?: string;
}
