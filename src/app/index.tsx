import React from 'react';
import { View, Text, ScrollView, Image, TouchableOpacity, SafeAreaView } from 'react-native';
import { useApp } from '@/context/AppContext';

export default function Dashboard() {
  const { currentProfile, currentHouse, members, chores, expenses } = useApp();

  // Chore calculations
  const pendingChores = chores.filter((c) => c.status === 'pending');
  const overdueChores = chores.filter((c) => c.status === 'overdue');
  const userChores = chores.filter((c) => c.assigned_to === currentProfile?.id);
  const userPendingChores = userChores.filter((c) => c.status === 'pending' || c.status === 'overdue');

  // Financial calculations
  let userOwes = 0;
  let userIsOwed = 0;

  expenses.forEach((exp) => {
    if (exp.paid_by === currentProfile?.id) {
      // Current user paid, they are owed money by others
      exp.splits.forEach((split) => {
        if (!split.settled) {
          userIsOwed += split.amount;
        }
      });
    } else {
      // Someone else paid, check if current user owes money
      exp.splits.forEach((split) => {
        if (split.user_id === currentProfile?.id && !split.settled) {
          userOwes += split.amount;
        }
      });
    }
  });

  return (
    <SafeAreaView className="flex-1 bg-slate-50 dark:bg-slate-950">
      <ScrollView className="flex-1 px-5 pt-4">
        {/* Header Section */}
        <View className="flex-row justify-between items-center mb-6">
          <View>
            <Text className="text-xs font-semibold uppercase tracking-wider text-slate-400 dark:text-slate-500">
              Co-Living Space
            </Text>
            <Text className="text-2xl font-bold text-slate-800 dark:text-white">
              {currentHouse?.name || 'Create or Join a House'}
            </Text>
          </View>
          {currentProfile?.avatar_url && (
            <Image
              source={{ uri: currentProfile.avatar_url }}
              className="w-12 h-12 rounded-full border-2 border-indigo-500"
            />
          )}
        </View>

        {/* Overview Stats Cards */}
        <View className="flex-row gap-4 mb-6">
          {/* Chores Summary Card */}
          <View className="flex-1 bg-white dark:bg-slate-900 p-4 rounded-3xl shadow-sm border border-slate-100 dark:border-slate-800">
            <Text className="text-3xl mb-1">🧹</Text>
            <Text className="text-sm font-semibold text-slate-500 dark:text-slate-400">Chores</Text>
            <Text className="text-xl font-bold text-slate-800 dark:text-white mt-1">
              {userPendingChores.length} Assigned
            </Text>
            {overdueChores.length > 0 && (
              <Text className="text-xs font-semibold text-rose-500 mt-1">
                ⚠️ {overdueChores.length} overdue total
              </Text>
            )}
          </View>

          {/* Finances Summary Card */}
          <View className="flex-1 bg-white dark:bg-slate-900 p-4 rounded-3xl shadow-sm border border-slate-100 dark:border-slate-800">
            <Text className="text-3xl mb-1">💰</Text>
            <Text className="text-sm font-semibold text-slate-500 dark:text-slate-400">Expenses</Text>
            <View className="mt-1">
              {userIsOwed > 0 && (
                <Text className="text-sm font-bold text-emerald-600 dark:text-emerald-400">
                  Owed: +${userIsOwed.toFixed(2)}
                </Text>
              )}
              {userOwes > 0 && (
                <Text className="text-sm font-bold text-rose-500 dark:text-rose-400">
                  You owe: -${userOwes.toFixed(2)}
                </Text>
              )}
              {userIsOwed === 0 && userOwes === 0 && (
                <Text className="text-sm font-semibold text-slate-400 dark:text-slate-500">
                  All settled up!
                </Text>
              )}
            </View>
          </View>
        </View>

        {/* Quick Actions Title */}
        <Text className="text-lg font-bold text-slate-800 dark:text-white mb-3">Quick Actions</Text>
        
        {/* Quick Actions List */}
        <View className="flex-row flex-wrap gap-4 mb-6">
          <TouchableOpacity 
            className="flex-row items-center w-[47%] bg-indigo-500 p-4 rounded-2xl shadow-sm shadow-indigo-200 dark:shadow-none"
            activeOpacity={0.8}
          >
            <Text className="text-xl mr-2">➕</Text>
            <Text className="font-semibold text-white">Add Expense</Text>
          </TouchableOpacity>

          <TouchableOpacity 
            className="flex-row items-center w-[47%] bg-sky-500 p-4 rounded-2xl shadow-sm shadow-sky-200 dark:shadow-none"
            activeOpacity={0.8}
          >
            <Text className="text-xl mr-2">✏️</Text>
            <Text className="font-semibold text-white">New Chore</Text>
          </TouchableOpacity>
        </View>

        {/* Roommate Status */}
        <View className="bg-white dark:bg-slate-900 p-5 rounded-3xl shadow-sm border border-slate-100 dark:border-slate-800 mb-6">
          <Text className="text-lg font-bold text-slate-800 dark:text-white mb-3">Roommates</Text>
          <View className="flex-row gap-4">
            {members.map((member) => (
              <View key={member.id} className="items-center">
                <View className="relative">
                  <Image
                    source={{ uri: member.avatar_url || 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150' }}
                    className="w-12 h-12 rounded-full"
                  />
                  <View className="absolute bottom-0 right-0 w-3.5 h-3.5 bg-emerald-500 rounded-full border-2 border-white dark:border-slate-900" />
                </View>
                <Text className="text-xs text-slate-600 dark:text-slate-400 mt-1 font-medium">
                  {member.name.split(' ')[0]}
                </Text>
              </View>
            ))}
          </View>
        </View>

        {/* Active House Ledger Snippet */}
        <View className="mb-8">
          <Text className="text-lg font-bold text-slate-800 dark:text-white mb-3">Recent Expenses</Text>
          {expenses.slice(0, 2).map((exp) => {
            const payer = members.find((m) => m.id === exp.paid_by);
            return (
              <View 
                key={exp.id} 
                className="flex-row justify-between items-center bg-white dark:bg-slate-900 p-4 rounded-2xl mb-3 border border-slate-100 dark:border-slate-800"
              >
                <View>
                  <Text className="font-semibold text-slate-800 dark:text-white">{exp.title}</Text>
                  <Text className="text-xs text-slate-400 dark:text-slate-500">
                    Paid by {payer?.name || 'Unknown'} • {new Date(exp.created_at).toLocaleDateString()}
                  </Text>
                </View>
                <Text className="font-bold text-slate-800 dark:text-white">
                  ${exp.amount.toFixed(2)}
                </Text>
              </View>
            );
          })}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}
