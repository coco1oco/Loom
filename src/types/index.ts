export interface Profile {
  id: string;
  name: string;
  avatar_url?: string;
  house_id?: string;
  created_at: string;
}

export interface House {
  id: string;
  name: string;
  invite_code: string;
  created_at: string;
}

export interface Chore {
  id: string;
  house_id: string;
  title: string;
  description?: string;
  assigned_to?: string; // Profile ID
  interval_days: number; // For rotating frequency
  due_date: string;
  last_completed_by?: string; // Profile ID
  last_completed_at?: string;
  status: 'pending' | 'completed' | 'overdue';
}

export interface Expense {
  id: string;
  house_id: string;
  title: string;
  amount: number;
  paid_by: string; // Profile ID
  created_at: string;
  splits: ExpenseSplit[];
}

export interface ExpenseSplit {
  id: string;
  expense_id: string;
  user_id: string; // Profile ID
  amount: number;
  settled: boolean;
}
