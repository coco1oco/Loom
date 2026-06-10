import React, { useState } from 'react';
import { View, Text, ScrollView, TouchableOpacity, TextInput, SafeAreaView } from 'react-native';
import { useApp } from '@/context/AppContext';

export default function ChoresScreen() {
  const { chores, members, currentProfile, addChore, completeChore } = useApp();
  
  // State for new chore form
  const [showAddForm, setShowAddForm] = useState(false);
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [assignedTo, setAssignedTo] = useState(currentProfile?.id || '');
  const [intervalDays, setIntervalDays] = useState('7');

  const handleAddChore = () => {
    if (!title.trim()) return;

    // Set due date to today plus 1 day as baseline
    const dueDate = new Date();
    dueDate.setDate(dueDate.getDate() + 1);

    addChore({
      title,
      description: description.trim() || undefined,
      assigned_to: assignedTo || undefined,
      interval_days: parseInt(intervalDays) || 7,
      due_date: dueDate.toISOString(),
    });

    // Reset form
    setTitle('');
    setDescription('');
    setShowAddForm(false);
  };

  return (
    <SafeAreaView className="flex-1 bg-slate-50 dark:bg-slate-950">
      <ScrollView className="flex-1 px-5 pt-4">
        {/* Header */}
        <View className="flex-row justify-between items-center mb-6">
          <View>
            <Text className="text-xs font-semibold uppercase tracking-wider text-slate-400 dark:text-slate-500">
              Household
            </Text>
            <Text className="text-2xl font-bold text-slate-800 dark:text-white">
              Chore Wheel
            </Text>
          </View>
          <TouchableOpacity
            onPress={() => setShowAddForm(!showAddForm)}
            className="bg-indigo-500 px-4 py-2.5 rounded-2xl shadow-sm shadow-indigo-200 dark:shadow-none"
          >
            <Text className="color-white font-semibold">
              {showAddForm ? 'Cancel' : '＋ Add'}
            </Text>
          </TouchableOpacity>
        </View>

        {/* New Chore Form */}
        {showAddForm && (
          <View className="bg-white dark:bg-slate-900 p-5 rounded-3xl border border-slate-100 dark:border-slate-800 mb-6 gap-3">
            <Text className="font-bold text-slate-800 dark:text-white text-base">New Chore Details</Text>
            
            <TextInput
              placeholder="Chore Title (e.g. Wash bathroom rug)"
              placeholderTextColor="#94a3b8"
              value={title}
              onChangeText={setTitle}
              className="bg-slate-50 dark:bg-slate-950 text-slate-800 dark:text-white p-3.5 rounded-xl border border-slate-100 dark:border-slate-800"
            />

            <TextInput
              placeholder="Description/Notes (optional)"
              placeholderTextColor="#94a3b8"
              value={description}
              onChangeText={setDescription}
              className="bg-slate-50 dark:bg-slate-950 text-slate-800 dark:text-white p-3.5 rounded-xl border border-slate-100 dark:border-slate-800"
            />

            <View className="flex-row gap-3">
              {/* Assignee Selection */}
              <View className="flex-1">
                <Text className="text-xs font-semibold text-slate-400 mb-1">Assignee</Text>
                <View className="bg-slate-50 dark:bg-slate-950 rounded-xl border border-slate-100 dark:border-slate-800 overflow-hidden">
                  {/* Basic interactive dropdown mapping using standard React style for cross-platform */}
                  <ScrollView horizontal showsHorizontalScrollIndicator={false} className="p-2 flex-row gap-2">
                    {members.map((m) => (
                      <TouchableOpacity
                        key={m.id}
                        onPress={() => setAssignedTo(m.id)}
                        className={`px-3 py-1.5 rounded-lg ${assignedTo === m.id ? 'bg-indigo-500' : 'bg-slate-200 dark:bg-slate-800'}`}
                      >
                        <Text className={`text-xs font-medium ${assignedTo === m.id ? 'text-white' : 'text-slate-700 dark:text-slate-300'}`}>
                          {m.name.split(' ')[0]}
                        </Text>
                      </TouchableOpacity>
                    ))}
                  </ScrollView>
                </View>
              </View>

              {/* Interval Selection */}
              <View className="w-28">
                <Text className="text-xs font-semibold text-slate-400 mb-1">Frequency</Text>
                <TextInput
                  placeholder="Days (e.g. 7)"
                  placeholderTextColor="#94a3b8"
                  keyboardType="numeric"
                  value={intervalDays}
                  onChangeText={setIntervalDays}
                  className="bg-slate-50 dark:bg-slate-950 text-slate-800 dark:text-white p-3 rounded-xl border border-slate-100 dark:border-slate-800 text-center"
                />
              </View>
            </View>

            <TouchableOpacity
              onPress={handleAddChore}
              className="bg-indigo-500 p-3.5 rounded-xl mt-2 items-center"
            >
              <Text className="color-white font-bold">Create & Rotate</Text>
            </TouchableOpacity>
          </View>
        )}

        {/* Chore List Sections */}
        {chores.length === 0 ? (
          <View className="items-center py-12">
            <Text className="text-4xl mb-2">🎉</Text>
            <Text className="text-slate-400 font-semibold">No chores defined for this house.</Text>
          </View>
        ) : (
          <View className="mb-10">
            {chores.map((chore) => {
              const assignee = members.find((m) => m.id === chore.assigned_to);
              const isOverdue = chore.status === 'overdue';
              const isCurrentUser = chore.assigned_to === currentProfile?.id;

              return (
                <View
                  key={chore.id}
                  className={`bg-white dark:bg-slate-900 p-4 rounded-3xl mb-4 border ${
                    isOverdue 
                      ? 'border-rose-100 dark:border-rose-950/40 bg-rose-50/20 dark:bg-rose-950/10' 
                      : 'border-slate-100 dark:border-slate-800'
                  }`}
                >
                  <View className="flex-row justify-between items-start">
                    <View className="flex-1 pr-3">
                      <View className="flex-row items-center gap-2 mb-1">
                        <Text className="font-bold text-slate-800 dark:text-white text-base">
                          {chore.title}
                        </Text>
                        {isOverdue && (
                          <View className="bg-rose-100 dark:bg-rose-950/50 px-2 py-0.5 rounded-full">
                            <Text className="text-[10px] font-extrabold text-rose-600 dark:text-rose-400 uppercase tracking-wider">
                              Overdue
                            </Text>
                          </View>
                        )}
                      </View>

                      {chore.description && (
                        <Text className="text-slate-500 dark:text-slate-400 text-sm mb-3">
                          {chore.description}
                        </Text>
                      )}

                      <View className="flex-row flex-wrap items-center gap-3">
                        {/* Assignee Tag */}
                        <View className="bg-slate-100 dark:bg-slate-800 px-2.5 py-1 rounded-lg">
                          <Text className="text-xs text-slate-600 dark:text-slate-300">
                            👤 {assignee?.name || 'Unassigned'}
                          </Text>
                        </View>
                        {/* Frequency Tag */}
                        <View className="bg-slate-100 dark:bg-slate-800 px-2.5 py-1 rounded-lg">
                          <Text className="text-xs text-slate-600 dark:text-slate-300">
                            🔄 Every {chore.interval_days} days
                          </Text>
                        </View>
                        {/* Due Date Tag */}
                        <Text className="text-xs text-slate-400 dark:text-slate-500 font-medium">
                          Due: {new Date(chore.due_date).toLocaleDateString()}
                        </Text>
                      </View>
                    </View>

                    {/* Completion Checkbox */}
                    <TouchableOpacity
                      onPress={() => completeChore(chore.id)}
                      className={`w-10 h-10 rounded-2xl items-center justify-center border-2 ${
                        isCurrentUser
                          ? 'border-indigo-500 bg-indigo-50 dark:bg-indigo-950/20'
                          : 'border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-850'
                      }`}
                    >
                      <Text className="text-lg">✓</Text>
                    </TouchableOpacity>
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
