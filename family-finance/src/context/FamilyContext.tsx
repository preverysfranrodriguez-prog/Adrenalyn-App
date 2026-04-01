'use client';
import { createContext, useContext, useState, ReactNode, useEffect } from 'react';
import { FamilyMember, Category, Account, Transaction, Budget, SavingsGoal, Task, ShoppingItem, FamilyEvent } from '@/lib/types';
import { useAuth } from './AuthContext';
import { db } from '@/lib/firebase';
import { collection, doc, onSnapshot, setDoc, deleteDoc } from 'firebase/firestore';

interface FamilyContextType {
  members: FamilyMember[];
  categories: Category[];
  accounts: Account[];
  transactions: Transaction[];
  budgets: Budget[];
  savingsGoals: SavingsGoal[];
  tasks: Task[];
  shoppingItems: ShoppingItem[];
  events: FamilyEvent[];
  
  // Actions
  addTransaction: (t: Transaction) => void;
  addTask: (t: Task) => void;
  addShoppingItem: (name: string, addedById: string) => void;
  toggleShoppingItem: (id: string) => void;
  clearBoughtShoppingItems: () => void;
  toggleTask: (id: string) => void;
  
  // Settings CRUD
  addMember: (m: FamilyMember) => void;
  removeMember: (id: string) => void;
  addCategory: (c: Category) => void;
  removeCategory: (id: string) => void;
  addAccount: (a: Account) => void;
  removeAccount: (id: string) => void;
  
  getAccountBalance: (accountId: string) => number;
}

const FamilyContext = createContext<FamilyContextType | undefined>(undefined);

export const FamilyProvider = ({ children }: { children: ReactNode }) => {
  const { user } = useAuth();
  
  const [members, setMembers] = useState<FamilyMember[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [accounts, setAccounts] = useState<Account[]>([]);
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [budgets, setBudgets] = useState<Budget[]>([]);
  const [savingsGoals, setSavingsGoals] = useState<SavingsGoal[]>([]);
  const [tasks, setTasks] = useState<Task[]>([]);
  const [shoppingItems, setShoppingItems] = useState<ShoppingItem[]>([]);
  const [events, setEvents] = useState<FamilyEvent[]>([]);

  useEffect(() => {
    if (!user) {
      setMembers([]); setCategories([]); setAccounts([]); setTransactions([]);
      setBudgets([]); setSavingsGoals([]); setTasks([]); setShoppingItems([]); setEvents([]);
      return;
    }

    const familyRef = doc(db, 'families', user.uid);
    const unsubs: any[] = [];

    const bindCollection = <T extends { id: string }>(collName: string, setter: React.Dispatch<React.SetStateAction<T[]>>) => {
      const colRef = collection(familyRef, collName);
      return onSnapshot(colRef, (snap) => {
        setter(snap.docs.map(d => d.data() as T));
      }, (err) => console.error(`Error on ${collName}:`, err));
    };

    unsubs.push(
      bindCollection<FamilyMember>('members', setMembers),
      bindCollection<Category>('categories', setCategories),
      bindCollection<Account>('accounts', setAccounts),
      bindCollection<Transaction>('transactions', setTransactions),
      bindCollection<Budget>('budgets', setBudgets),
      bindCollection<SavingsGoal>('savingsGoals', setSavingsGoals),
      bindCollection<Task>('tasks', setTasks),
      bindCollection<ShoppingItem>('shoppingItems', setShoppingItems),
      bindCollection<FamilyEvent>('events', setEvents)
    );

    return () => unsubs.forEach(unsub => unsub());
  }, [user]);

  // Helper to write data to Firestore
  const writeToDb = async (col: string, id: string, data: any) => {
    if (!user) return;
    try {
      await setDoc(doc(db, `families/${user.uid}/${col}`, id), data);
    } catch (e) {
      console.error('Error writing document: ', e);
    }
  };

  const deleteFromDb = async (col: string, id: string) => {
    if (!user) return;
    try {
      await deleteDoc(doc(db, `families/${user.uid}/${col}`, id));
    } catch (e) {
      console.error('Error deleting document: ', e);
    }
  };

  const addTransaction = (t: Transaction) => writeToDb('transactions', t.id, t);
  
  const addTask = (t: Task) => writeToDb('tasks', t.id, t);
  
  const addShoppingItem = (name: string, addedById: string) => {
    const newItem: ShoppingItem = { id: Math.random().toString(36).substr(2, 9), name, quantity: 1, unit: 'ud', isBought: false, addedById };
    writeToDb('shoppingItems', newItem.id, newItem);
  };
  
  const toggleShoppingItem = (id: string) => {
    const item = shoppingItems.find(s => s.id === id);
    if (item) writeToDb('shoppingItems', id, { ...item, isBought: !item.isBought });
  };
  
  const clearBoughtShoppingItems = () => {
    shoppingItems.filter(s => s.isBought).forEach(s => deleteFromDb('shoppingItems', s.id));
  };
  
  const toggleTask = (id: string) => {
    const item = tasks.find(t => t.id === id);
    if (item) writeToDb('tasks', id, { ...item, status: item.status === 'hecho' ? 'pendiente' : 'hecho' });
  };

  // CRUD Settings
  const addMember = (m: FamilyMember) => writeToDb('members', m.id, m);
  const removeMember = (id: string) => deleteFromDb('members', id);
  
  const addCategory = (c: Category) => writeToDb('categories', c.id, c);
  const removeCategory = (id: string) => deleteFromDb('categories', id);
  
  const addAccount = (a: Account) => writeToDb('accounts', a.id, a);
  const removeAccount = (id: string) => deleteFromDb('accounts', id);

  const getAccountBalance = (accountId: string) => {
    const acc = accounts.find(a => a.id === accountId);
    if (!acc) return 0;
    const related = transactions.filter(t => t.accountId === accountId);
    const inc = related.filter(t => t.type === 'income').reduce((s, t) => s + t.amount, 0);
    const exp = related.filter(t => t.type === 'expense').reduce((s, t) => s + t.amount, 0);
    return acc.balance + inc - exp;
  };

  return (
    <FamilyContext.Provider value={{
      members, categories, accounts, transactions, budgets, savingsGoals, tasks, shoppingItems, events,
      addTransaction, addTask, addShoppingItem, toggleShoppingItem, clearBoughtShoppingItems, toggleTask,
      addMember, removeMember, addCategory, removeCategory, addAccount, removeAccount, getAccountBalance
    }}>
      {children}
    </FamilyContext.Provider>
  );
};

export const useFamilyContext = () => {
  const context = useContext(FamilyContext);
  if (context === undefined) {
    throw new Error('useFamilyContext must be used within a FamilyProvider');
  }
  return context;
};
