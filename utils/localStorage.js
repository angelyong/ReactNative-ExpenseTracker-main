import AsyncStorage from '@react-native-async-storage/async-storage';

export const STORAGE_KEYS = {
  budget: 'ui_monthly_budget',
  tasks: 'ui_financial_tasks',
};

export async function readJson(key, fallback) {
  try {
    const value = await AsyncStorage.getItem(key);
    return value ? JSON.parse(value) : fallback;
  } catch (error) {
    return fallback;
  }
}

export async function writeJson(key, value) {
  try {
    await AsyncStorage.setItem(key, JSON.stringify(value));
  } catch (error) {
    // Local persistence is best effort; the UI remains usable offline.
  }
}
