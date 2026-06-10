// Supabase Client and Service layer placeholder
// Once credentials are ready, we will run: npm install @supabase/supabase-js

export const supabase = {
  // Placeholder client
  auth: {
    getUser: async () => ({ data: { user: null }, error: null }),
    signOut: async () => ({ error: null }),
  },
  from: (table: string) => {
    return {
      select: () => ({
        eq: () => ({
          single: async () => ({ data: null, error: null }),
        }),
      }),
      insert: async () => ({ data: null, error: null }),
      update: async () => ({ data: null, error: null }),
      delete: async () => ({ data: null, error: null }),
    };
  },
};

// Database queries will go here
export const db = {
  fetchHouseMembers: async (houseId: string) => {
    console.log('Fetching members for house:', houseId);
    return [];
  },
  fetchChores: async (houseId: string) => {
    console.log('Fetching chores for house:', houseId);
    return [];
  },
  fetchExpenses: async (houseId: string) => {
    console.log('Fetching expenses for house:', houseId);
    return [];
  },
};
