import React, { createContext, useContext, useState, useEffect } from 'react';
import { Profile, House, Chore, Expense, ExpenseSplit } from '../types';

interface AppContextType {
  currentProfile: Profile | null;
  currentHouse: House | null;
  members: Profile[];
  chores: Chore[];
  expenses: Expense[];
  loading: boolean;
  createHouse: (name: string) => void;
  joinHouse: (inviteCode: string) => boolean;
  addChore: (chore: Omit<Chore, 'id' | 'house_id' | 'status'>) => void;
  completeChore: (choreId: string) => void;
  addExpense: (title: string, amount: number, splits: { user_id: string; amount: number }[]) => void;
  settleSplit: (expenseId: string, userId: string) => void;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

// Sample Mock Data
const MOCK_PROFILES: Profile[] = [
  { id: '1', name: 'Alex Johnson', avatar_url: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=150&q=80', house_id: 'house-123', created_at: new Date().toISOString() },
  { id: '2', name: 'Sam Rivera', avatar_url: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=150&q=80', house_id: 'house-123', created_at: new Date().toISOString() },
  { id: '3', name: 'Taylor Chen', avatar_url: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=150&q=80', house_id: 'house-123', created_at: new Date().toISOString() },
];

const MOCK_HOUSE: House = {
  id: 'house-123',
  name: 'Suite 404',
  invite_code: 'SUITE404',
  created_at: new Date().toISOString(),
};

const MOCK_CHORES: Chore[] = [
  {
    id: 'chore-1',
    house_id: 'house-123',
    title: 'Take out the trash & recycling',
    description: 'Empty bins in kitchen and bathrooms, move cans to the curb on Tuesday nights.',
    assigned_to: '1',
    interval_days: 7,
    due_date: new Date(Date.now() + 1000 * 60 * 60 * 24).toISOString(), // Tomorrow
    status: 'pending',
  },
  {
    id: 'chore-2',
    house_id: 'house-123',
    title: 'Clean the kitchen counters & stove',
    description: 'Wipe down surfaces, scrub the stove, empty the drying rack.',
    assigned_to: '2',
    interval_days: 3,
    due_date: new Date(Date.now() - 1000 * 60 * 60 * 12).toISOString(), // 12 hours ago (Overdue)
    status: 'overdue',
  },
  {
    id: 'chore-3',
    house_id: 'house-123',
    title: 'Vacuum the living room rug',
    description: 'Give the shared space a thorough vacuuming.',
    assigned_to: '3',
    interval_days: 7,
    due_date: new Date(Date.now() + 1000 * 60 * 60 * 24 * 3).toISOString(), // 3 days from now
    status: 'pending',
  },
];

const MOCK_EXPENSES: Expense[] = [
  {
    id: 'exp-1',
    house_id: 'house-123',
    title: 'Internet Bill (June)',
    amount: 75.0,
    paid_by: '1', // Paid by Alex
    created_at: new Date(Date.now() - 1000 * 60 * 60 * 24 * 2).toISOString(), // 2 days ago
    splits: [
      { id: 'split-1-1', expense_id: 'exp-1', user_id: '2', amount: 25.0, settled: false },
      { id: 'split-1-2', expense_id: 'exp-1', user_id: '3', amount: 25.0, settled: true },
    ],
  },
  {
    id: 'exp-2',
    house_id: 'house-123',
    title: 'Dish soap and sponges',
    amount: 15.0,
    paid_by: '2', // Paid by Sam
    created_at: new Date(Date.now() - 1000 * 60 * 60 * 4).toISOString(), // 4 hours ago
    splits: [
      { id: 'split-2-1', expense_id: 'exp-2', user_id: '1', amount: 5.0, settled: false },
      { id: 'split-2-2', expense_id: 'exp-2', user_id: '3', amount: 5.0, settled: false },
    ],
  },
];

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [currentProfile, setCurrentProfile] = useState<Profile | null>(MOCK_PROFILES[0]);
  const [currentHouse, setCurrentHouse] = useState<House | null>(MOCK_HOUSE);
  const [members, setMembers] = useState<Profile[]>(MOCK_PROFILES);
  const [chores, setChores] = useState<Chore[]>(MOCK_CHORES);
  const [expenses, setExpenses] = useState<Expense[]>(MOCK_EXPENSES);
  const [loading, setLoading] = useState<boolean>(false);

  // Auto-verify overdue status on mount or when chores change
  useEffect(() => {
    const now = new Date();
    setChores((prev) =>
      prev.map((c) => {
        if (c.status === 'pending' && new Date(c.due_date) < now) {
          return { ...c, status: 'overdue' };
        }
        return c;
      })
    );
  }, []);

  const createHouse = (name: string) => {
    const newHouse: House = {
      id: `house-${Math.random().toString(36).substr(2, 9)}`,
      name,
      invite_code: name.replace(/\s+/g, '').toUpperCase().slice(0, 8),
      created_at: new Date().toISOString(),
    };
    setCurrentHouse(newHouse);
    if (currentProfile) {
      const updatedProfile = { ...currentProfile, house_id: newHouse.id };
      setCurrentProfile(updatedProfile);
      setMembers([updatedProfile]);
    }
  };

  const joinHouse = (inviteCode: string): boolean => {
    // For demo purposes, we will mock joining Suite 404 if the code matches
    if (inviteCode.toUpperCase() === 'SUITE404') {
      setCurrentHouse(MOCK_HOUSE);
      setMembers(MOCK_PROFILES);
      if (currentProfile) {
        setCurrentProfile({ ...currentProfile, house_id: MOCK_HOUSE.id });
      }
      return true;
    }
    return false;
  };

  const addChore = (choreData: Omit<Chore, 'id' | 'house_id' | 'status'>) => {
    if (!currentHouse) return;
    const newChore: Chore = {
      ...choreData,
      id: `chore-${Math.random().toString(36).substr(2, 9)}`,
      house_id: currentHouse.id,
      status: new Date(choreData.due_date) < new Date() ? 'overdue' : 'pending',
    };
    setChores((prev) => [newChore, ...prev]);
  };

  const completeChore = (choreId: string) => {
    setChores((prev) =>
      prev.map((c) => {
        if (c.id === choreId) {
          const nextDueDate = new Date();
          nextDueDate.setDate(nextDueDate.getDate() + c.interval_days);

          // Return completed status and reset/rotate chore to next assignee
          return {
            ...c,
            last_completed_by: currentProfile?.id || undefined,
            last_completed_at: new Date().toISOString(),
            due_date: nextDueDate.toISOString(),
            status: 'pending',
          };
        }
        return c;
      })
    );
  };

  const addExpense = (title: string, amount: number, splitsData: { user_id: string; amount: number }[]) => {
    if (!currentHouse || !currentProfile) return;
    const newExpenseId = `exp-${Math.random().toString(36).substr(2, 9)}`;
    const splits: ExpenseSplit[] = splitsData.map((s, idx) => ({
      id: `split-${newExpenseId}-${idx}`,
      expense_id: newExpenseId,
      user_id: s.user_id,
      amount: s.amount,
      settled: false,
    }));

    const newExpense: Expense = {
      id: newExpenseId,
      house_id: currentHouse.id,
      title,
      amount,
      paid_by: currentProfile.id,
      created_at: new Date().toISOString(),
      splits,
    };
    setExpenses((prev) => [newExpense, ...prev]);
  };

  const settleSplit = (expenseId: string, userId: string) => {
    setExpenses((prev) =>
      prev.map((e) => {
        if (e.id === expenseId) {
          const updatedSplits = e.splits.map((s) => {
            if (s.user_id === userId) {
              return { ...s, settled: true };
            }
            return s;
          });
          return { ...e, splits: updatedSplits };
        }
        return e;
      })
    );
  };

  return (
    <AppContext.Provider
      value={{
        currentProfile,
        currentHouse,
        members,
        chores,
        expenses,
        loading,
        createHouse,
        joinHouse,
        addChore,
        completeChore,
        addExpense,
        settleSplit,
      }}>
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => {
  const context = useContext(AppContext);
  if (context === undefined) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
};
