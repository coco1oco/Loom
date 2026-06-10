import React, { useState } from 'react';
import { View, Text, ScrollView, TouchableOpacity, TextInput, SafeAreaView } from 'react-native';
import { useApp } from '@/context/AppContext';

export default function ExpensesScreen() {
  const { expenses, members, currentProfile, addExpense, settleSplit } = useApp();

  const [showAddForm, setShowAddForm] = useState(false);
  const [title, setTitle] = useState('');
  const [amount, setAmount] = useState('');

  // Settle calculations
  let userOwes = 0;
  let userIsOwed = 0;

  expenses.forEach((exp) => {
    if (exp.paid_by === currentProfile?.id) {
      exp.splits.forEach((split) => {
        if (!split.settled) {
          userIsOwed += split.amount;
        }
      });
    } else {
      exp.splits.forEach((split) => {
        if (split.user_id === currentProfile?.id && !split.settled) {
          userOwes += split.amount;
        }
      });
    }
  });

  const handleAddExpense = () => {
    const numericAmount = parseFloat(amount);
    if (!title.trim() || isNaN(numericAmount) || numericAmount <= 0) return;

    // Split equally among all members
    const splitCount = members.length;
    const splitAmount = parseFloat((numericAmount / splitCount).toFixed(2));
    
    // The splits array includes everyone EXCEPT the payer
    const splitsData = members
      .filter((m) => m.id !== currentProfile?.id)
      .map((m) => ({
        user_id: m.id,
        amount: splitAmount,
      }));

    addExpense(title, numericAmount, splitsData);

    // Reset
    setTitle('');
    setAmount('');
    setShowAddForm(false);
  };

  return (
    <SafeAreaView className="flex-1 bg-slate-50 dark:bg-slate-950">
      <ScrollView className="flex-1 px-5 pt-4">
        {/* Header */}
        <View className="flex-row justify-between items-center mb-6">
          <View>
            <Text className="text-xs font-semibold uppercase tracking-wider text-slate-400 dark:text-slate-500">
              Ledger
            </Text>
            <Text className="text-2xl font-bold text-slate-800 dark:text-white">
              Shared Expenses
            </Text>
          </View>
          <TouchableOpacity
            onPress={() => setShowAddForm(!showAddForm)}
            className="bg-indigo-500 px-4 py-2.5 rounded-2xl shadow-sm shadow-indigo-200 dark:shadow-none"
          >
            <Text className="color-white font-semibold">
              {showAddForm ? 'Cancel' : '＋ Add Expense'}
            </Text>
          </TouchableOpacity>
        </View>

        {/* Financial Summary */}
        <View className="flex-row gap-4 mb-6">
          <View className="flex-1 bg-emerald-50 dark:bg-emerald-950/20 p-4 rounded-3xl border border-emerald-100 dark:border-emerald-900/30">
            <Text className="text-xs font-semibold text-emerald-600 dark:text-emerald-400 uppercase tracking-wider">
              You are owed
            </Text>
            <Text className="text-2xl font-bold text-emerald-700 dark:text-emerald-300 mt-1">
              ${userIsOwed.toFixed(2)}
            </Text>
          </View>
          <View className="flex-1 bg-rose-50 dark:bg-rose-950/20 p-4 rounded-3xl border border-rose-100 dark:border-rose-900/30">
            <Text className="text-xs font-semibold text-rose-600 dark:text-rose-400 uppercase tracking-wider">
              You owe
            </Text>
            <Text className="text-2xl font-bold text-rose-700 dark:text-rose-300 mt-1">
              ${userOwes.toFixed(2)}
            </Text>
          </View>
        </View>

        {/* Add Expense Form */}
        {showAddForm && (
          <View className="bg-white dark:bg-slate-900 p-5 rounded-3xl border border-slate-100 dark:border-slate-800 mb-6 gap-3">
            <Text className="font-bold text-slate-800 dark:text-white text-base">New Expense Details</Text>
            <TextInput
              placeholder="Expense Description (e.g., Laundry Detergent)"
              placeholderTextColor="#94a3b8"
              value={title}
              onChangeText={setTitle}
              className="bg-slate-50 dark:bg-slate-950 text-slate-800 dark:text-white p-3.5 rounded-xl border border-slate-100 dark:border-slate-800"
            />
            <TextInput
              placeholder="Amount ($)"
              placeholderTextColor="#94a3b8"
              keyboardType="numeric"
              value={amount}
              onChangeText={setAmount}
              className="bg-slate-50 dark:bg-slate-950 text-slate-800 dark:text-white p-3.5 rounded-xl border border-slate-100 dark:border-slate-800"
            />
            <Text className="text-xs text-slate-400 dark:text-slate-500 font-medium px-1">
              * This expense will be split equally among all {members.length} roommates.
            </Text>
            <TouchableOpacity
              onPress={handleAddExpense}
              className="bg-indigo-500 p-3.5 rounded-xl mt-2 items-center"
            >
              <Text className="color-white font-bold">Log & Split</Text>
            </TouchableOpacity>
          </View>
        )}

        {/* Expense List */}
        {expenses.length === 0 ? (
          <View className="items-center py-12">
            <Text className="text-4xl mb-2">💸</Text>
            <Text className="text-slate-400 font-semibold">No expenses logged yet.</Text>
          </View>
        ) : (
          <View className="mb-10">
            <Text className="text-base font-bold text-slate-800 dark:text-white mb-3">Ledger History</Text>
            {expenses.map((exp) => {
              const payer = members.find((m) => m.id === exp.paid_by);
              const isCurrentUserPayer = exp.paid_by === currentProfile?.id;

              return (
                <View
                  key={exp.id}
                  className="bg-white dark:bg-slate-900 p-4 rounded-3xl mb-4 border border-slate-100 dark:border-slate-800"
                >
                  <View className="flex-row justify-between items-start mb-3">
                    <View>
                      <Text className="font-bold text-slate-800 dark:text-white text-base">
                        {exp.title}
                      </Text>
                      <Text className="text-xs text-slate-400 dark:text-slate-500">
                        Paid by {payer?.name || 'Unknown'} • {new Date(exp.created_at).toLocaleDateString()}
                      </Text>
                    </View>
                    <Text className="text-lg font-extrabold text-slate-800 dark:text-white">
                      ${exp.amount.toFixed(2)}
                    </Text>
                  </View>

                  {/* Splits Details */}
                  <View className="bg-slate-50 dark:bg-slate-950/60 p-3 rounded-2xl border border-slate-100/50 dark:border-slate-800/40">
                    <Text className="text-[11px] font-bold uppercase tracking-wider text-slate-400 mb-2">Splits</Text>
                    {exp.splits.map((split) => {
                      const splitUser = members.find((m) => m.id === split.user_id);
                      const isCurrentUserOwes = split.user_id === currentProfile?.id;

                      return (
                        <View
                          key={split.id}
                          className="flex-row justify-between items-center py-1.5 border-b border-slate-100 dark:border-slate-800/40 last:border-b-0"
                        >
                          <Text className="text-xs text-slate-600 dark:text-slate-400">
                            {splitUser?.name || 'Unknown'} owes ${split.amount.toFixed(2)}
                          </Text>

                          <View className="flex-row items-center">
                            {split.settled ? (
                              <View className="bg-emerald-100 dark:bg-emerald-950/40 px-2.5 py-0.5 rounded-full">
                                <Text className="text-[10px] font-bold text-emerald-600 dark:text-emerald-400">
                                  Settled
                                </Text>
                              </View>
                            ) : (
                              <>
                                <View className="bg-amber-100 dark:bg-amber-950/40 px-2.5 py-0.5 rounded-full mr-2">
                                  <Text className="text-[10px] font-bold text-amber-600 dark:text-amber-400">
                                    Unpaid
                                  </Text>
                                </View>
                                {isCurrentUserOwes && (
                                  <TouchableOpacity
                                    onPress={() => settleSplit(exp.id, split.user_id)}
                                    className="bg-indigo-500 px-3 py-1 rounded-lg"
                                  >
                                    <Text className="text-[10px] font-bold color-white">Settle</Text>
                                  </TouchableOpacity>
                                )}
                              </>
                            )}
                          </View>
                        </View>
                      );
                    })}
                  </View>
                </View>
              );
            })}
          </View>
        )}
      </ScrollView>
    </SafeAreaView>
  );
}
