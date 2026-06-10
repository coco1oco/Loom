import React, { useState } from 'react';
import { View, Text, ScrollView, TouchableOpacity, TextInput, Image, SafeAreaView } from 'react-native';
import { useApp } from '@/context/AppContext';

export default function SettingsScreen() {
  const { currentProfile, currentHouse, members, createHouse, joinHouse } = useApp();

  const [houseName, setHouseName] = useState('');
  const [inviteCode, setInviteCode] = useState('');
  const [joinError, setJoinError] = useState(false);

  const handleCreateHouse = () => {
    if (!houseName.trim()) return;
    createHouse(houseName);
    setHouseName('');
  };

  const handleJoinHouse = () => {
    if (!inviteCode.trim()) return;
    const success = joinHouse(inviteCode);
    if (success) {
      setInviteCode('');
      setJoinError(false);
    } else {
      setJoinError(true);
    }
  };

  return (
    <SafeAreaView className="flex-1 bg-slate-50 dark:bg-slate-950">
      <ScrollView className="flex-1 px-5 pt-4">
        {/* Header */}
        <View className="mb-6">
          <Text className="text-xs font-semibold uppercase tracking-wider text-slate-400 dark:text-slate-500">
            System
          </Text>
          <Text className="text-2xl font-bold text-slate-800 dark:text-white">
            Settings
          </Text>
        </View>

        {/* Profile Details */}
        <View className="bg-white dark:bg-slate-900 p-5 rounded-3xl border border-slate-100 dark:border-slate-800 mb-6 flex-row items-center gap-4">
          <Image
            source={{ uri: currentProfile?.avatar_url || 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150' }}
            className="w-16 h-16 rounded-full border-2 border-indigo-500"
          />
          <View>
            <Text className="text-lg font-bold text-slate-800 dark:text-white">{currentProfile?.name}</Text>
            <Text className="text-sm text-slate-400 dark:text-slate-500">Active Roommate</Text>
          </View>
        </View>

        {/* Roommate Simulator Switcher (Excellent for testing) */}
        <View className="bg-white dark:bg-slate-900 p-5 rounded-3xl border border-slate-100 dark:border-slate-800 mb-6">
          <Text className="text-base font-bold text-slate-800 dark:text-white mb-2">Roommate Simulator</Text>
          <Text className="text-xs text-slate-400 dark:text-slate-500 mb-4">
            (Demo only) Select a different roommate to test splits and chores from their perspective:
          </Text>
          <View className="flex-row gap-3">
            {members.map((m) => (
              <View
                key={m.id}
                className={`flex-1 p-2 rounded-2xl border items-center ${
                  currentProfile?.id === m.id
                    ? 'border-indigo-500 bg-indigo-50/20 dark:bg-indigo-950/20'
                    : 'border-slate-100 dark:border-slate-800'
                }`}
              >
                <Image
                  source={{ uri: m.avatar_url }}
                  className="w-10 h-10 rounded-full mb-1"
                />
                <Text className="text-[11px] font-semibold text-slate-850 dark:text-slate-350">
                  {m.name.split(' ')[0]}
                </Text>
                {currentProfile?.id === m.id && (
                  <View className="mt-1 bg-indigo-500 px-1.5 py-0.5 rounded-full">
                    <Text className="text-[8px] font-bold text-white uppercase">Active</Text>
                  </View>
                )}
              </View>
            ))}
          </View>
        </View>

        {/* House Setup */}
        <View className="bg-white dark:bg-slate-900 p-5 rounded-3xl border border-slate-100 dark:border-slate-800 mb-6 gap-4">
          <Text className="text-base font-bold text-slate-800 dark:text-white">Household Administration</Text>
          
          {currentHouse ? (
            <View className="bg-slate-50 dark:bg-slate-950 p-4 rounded-2xl border border-slate-100 dark:border-slate-850/60">
              <Text className="text-xs text-slate-400 dark:text-slate-500 font-semibold">House Name</Text>
              <Text className="text-lg font-bold text-slate-850 dark:text-white mb-3">{currentHouse.name}</Text>
              
              <Text className="text-xs text-slate-400 dark:text-slate-500 font-semibold">Invite Code</Text>
              <View className="flex-row items-center justify-between bg-white dark:bg-slate-900 p-3 rounded-xl border border-slate-100 dark:border-slate-800 mt-1">
                <Text className="font-mono text-base font-bold text-indigo-500">{currentHouse.invite_code}</Text>
                <Text className="text-xs text-slate-400">Share with roommates</Text>
              </View>
            </View>
          ) : (
            <Text className="text-xs text-rose-500 font-medium">You are currently independent. Create or join a house.</Text>
          )}

          <View className="border-t border-slate-100 dark:border-slate-800 my-1" />

          {/* Join House Form */}
          <View className="gap-2">
            <Text className="text-xs font-semibold text-slate-400">Join a House</Text>
            <View className="flex-row gap-3">
              <TextInput
                placeholder="Enter Invite Code (e.g. SUITE404)"
                placeholderTextColor="#94a3b8"
                value={inviteCode}
                onChangeText={setInviteCode}
                className="flex-1 bg-slate-50 dark:bg-slate-950 text-slate-800 dark:text-white p-3 rounded-xl border border-slate-100 dark:border-slate-800"
              />
              <TouchableOpacity
                onPress={handleJoinHouse}
                className="bg-indigo-500 px-4 justify-center rounded-xl"
              >
                <Text className="color-white font-bold">Join</Text>
              </TouchableOpacity>
            </View>
            {joinError && (
              <Text className="text-xs font-semibold text-rose-500">Invalid invite code. Try 'SUITE404'.</Text>
            )}
          </View>

          {/* Create House Form */}
          <View className="gap-2">
            <Text className="text-xs font-semibold text-slate-400">Create New House</Text>
            <View className="flex-row gap-3">
              <TextInput
                placeholder="New House Name (e.g. Apt 3B)"
                placeholderTextColor="#94a3b8"
                value={houseName}
                onChangeText={setHouseName}
                className="flex-1 bg-slate-50 dark:bg-slate-950 text-slate-800 dark:text-white p-3 rounded-xl border border-slate-100 dark:border-slate-800"
              />
              <TouchableOpacity
                onPress={handleCreateHouse}
                className="bg-indigo-500 px-4 justify-center rounded-xl"
              >
                <Text className="color-white font-bold">Create</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}
