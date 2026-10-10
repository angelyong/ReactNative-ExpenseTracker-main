import { useCallback, useMemo, useState } from 'react';
import { Pressable, SafeAreaView, ScrollView, StyleSheet, Text, View } from 'react-native';
import { useFocusEffect } from '@react-navigation/native';
import { Ionicons } from '@expo/vector-icons';
import { useSelector } from 'react-redux';
import useCurrency from '../components/UI/currency';
import { Theme, categoryColor } from '../constants/theme';
import { readJson, STORAGE_KEYS } from '../utils/localStorage';

const CATEGORIES = ['Food & Drinks', 'Transportation', 'Shopping', 'Bills', 'Entertainment', 'Others'];
function money(value, currency) { return `${currency || '₹'}${Number(value || 0).toFixed(2)}`; }

export default function BudgetScreen({ navigation }) {
  const expenses = useSelector((state) => state.expenses.expenses);
  const currency = useCurrency();
  const [budget, setBudget] = useState(0);
  useFocusEffect(useCallback(() => { readJson(STORAGE_KEYS.budget, 0).then((value) => setBudget(Number(value) || 0)); }, []));
  const monthExpenses = useMemo(() => expenses.filter((item) => { const date = new Date(item.date); const now = new Date(); return item.kind !== 'income' && date.getMonth() === now.getMonth() && date.getFullYear() === now.getFullYear(); }), [expenses]);
  const spent = monthExpenses.reduce((sum, item) => sum + Number(item.price || 0), 0);
  const remaining = budget - spent;
  const spentByCategory = CATEGORIES.map((category) => {
    const amount = monthExpenses.filter((item) => {
      const type = (item.type || 'Others').toLowerCase();
      if (category === 'Food & Drinks') return type.includes('food') || type.includes('drink');
      if (category === 'Transportation') return type.includes('transport');
      if (category === 'Shopping') return type.includes('shop');
      if (category === 'Bills') return type.includes('bill');
      if (category === 'Entertainment') return type.includes('entertain');
      return !type.includes('food') && !type.includes('drink') && !type.includes('transport') && !type.includes('shop') && !type.includes('bill') && !type.includes('entertain');
    }).reduce((sum, item) => sum + Number(item.price || 0), 0);
    return { category, amount };
  });
  const categoryBudget = budget > 0 ? budget / CATEGORIES.length : 0;

  return <SafeAreaView style={styles.screen}><ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
    <View style={styles.header}><View><Text style={styles.eyebrow}>A gentle spending guide</Text><Text style={styles.title}>Budget</Text></View><Pressable style={styles.settings} onPress={() => navigation.navigate('SetBudget')}><Ionicons name="options-outline" size={23} color={Theme.colors.ink} /></Pressable></View>
    <View style={styles.overview}><View style={styles.overviewTop}><View><Text style={styles.overviewLabel}>Monthly budget</Text><Text style={styles.overviewAmount}>{budget ? money(budget, currency) : 'Not set yet'}</Text></View><View style={styles.pig}><Ionicons name="wallet-outline" size={32} color={Theme.colors.ink} /></View></View><View style={styles.overviewRow}><Text style={styles.overviewSmall}>Spent {money(spent, currency)}</Text><Text style={[styles.overviewSmall, remaining < 0 && styles.overBudget]}>Remaining {money(remaining, currency)}</Text></View><View style={styles.progressTrack}><View style={[styles.progressFill, { width: `${budget ? Math.min(100, (spent / budget) * 100) : 0}%`, backgroundColor: remaining < 0 ? Theme.colors.coral : Theme.colors.green }]} /></View></View>
    <Text style={styles.sectionTitle}>Category budgets</Text><Text style={styles.helper}>{budget ? 'Each category uses an equal share of your monthly budget for now.' : 'Set a monthly budget to see category progress.'}</Text>
    <View style={styles.card}>{spentByCategory.map(({ category, amount }) => { const almost = categoryBudget > 0 && amount / categoryBudget >= 0.8; const percent = categoryBudget ? Math.min(100, (amount / categoryBudget) * 100) : 0; return <View key={category} style={styles.categoryRow}><View style={styles.categoryHeader}><View style={styles.categoryNameWrap}><View style={[styles.dot, { backgroundColor: categoryColor(category) }]} /><Text style={styles.categoryName}>{category}</Text></View>{almost && <Text style={styles.almost}>Almost Reached</Text>}</View><View style={styles.categoryValues}><Text style={styles.spent}>{money(amount, currency)} spent</Text><Text style={styles.limit}>{categoryBudget ? `${money(Math.max(0, categoryBudget - amount), currency)} left` : 'No limit'}</Text></View><View style={styles.progressTrackSmall}><View style={[styles.progressFill, { width: `${percent}%`, backgroundColor: categoryColor(category) }]} /></View></View>; })}</View>
    <Pressable style={styles.button} onPress={() => navigation.navigate('SetBudget')}><Ionicons name="pencil-outline" size={18} color={Theme.colors.ink} /><Text style={styles.buttonText}>{budget ? 'Adjust monthly budget' : 'Set monthly budget'}</Text></Pressable>
  </ScrollView></SafeAreaView>;
}

const styles = StyleSheet.create({ screen: { flex: 1, backgroundColor: Theme.colors.paper }, content: { padding: 20, paddingBottom: 40 }, header: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }, eyebrow: { color: Theme.colors.muted, fontSize: 13 }, title: { color: Theme.colors.ink, fontSize: 29, fontWeight: '800', marginTop: 2 }, settings: { width: 48, height: 48, borderRadius: 17, borderWidth: 3, borderColor: Theme.colors.ink, backgroundColor: Theme.colors.yellow, alignItems: 'center', justifyContent: 'center' }, overview: { borderRadius: Theme.radius.card, borderWidth: 3, borderColor: Theme.colors.ink, backgroundColor: Theme.colors.blue, padding: 18, marginTop: 18 }, overviewTop: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }, overviewLabel: { color: Theme.colors.ink, fontWeight: '700' }, overviewAmount: { color: Theme.colors.ink, fontSize: 28, fontWeight: '800', marginTop: 5 }, pig: { width: 64, height: 64, borderRadius: 24, backgroundColor: Theme.colors.white, borderWidth: 3, borderColor: Theme.colors.ink, alignItems: 'center', justifyContent: 'center' }, overviewRow: { flexDirection: 'row', justifyContent: 'space-between', marginTop: 20 }, overviewSmall: { color: Theme.colors.ink, fontSize: 12, fontWeight: '700' }, overBudget: { color: Theme.colors.danger }, progressTrack: { backgroundColor: Theme.colors.white, height: 12, borderWidth: 2, borderColor: Theme.colors.ink, borderRadius: 10, marginTop: 8, overflow: 'hidden' }, progressFill: { height: '100%', borderRadius: 8 }, sectionTitle: { color: Theme.colors.ink, fontSize: 21, fontWeight: '800', marginTop: 25 }, helper: { color: Theme.colors.muted, lineHeight: 18, marginTop: 4, marginBottom: 12 }, card: { backgroundColor: Theme.colors.white, borderWidth: 3, borderColor: Theme.colors.ink, borderRadius: Theme.radius.card, padding: 16 }, categoryRow: { marginBottom: 17 }, categoryRowLast: { marginBottom: 0 }, categoryHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }, categoryNameWrap: { flexDirection: 'row', alignItems: 'center', gap: 8 }, dot: { width: 14, height: 14, borderRadius: 7, borderWidth: 2, borderColor: Theme.colors.ink }, categoryName: { color: Theme.colors.ink, fontWeight: '800', fontSize: 13 }, almost: { color: Theme.colors.ink, backgroundColor: Theme.colors.yellow, borderRadius: 8, paddingHorizontal: 6, paddingVertical: 3, fontSize: 10, fontWeight: '800' }, categoryValues: { flexDirection: 'row', justifyContent: 'space-between', marginTop: 7 }, spent: { color: Theme.colors.muted, fontSize: 11 }, limit: { color: Theme.colors.muted, fontSize: 11 }, progressTrackSmall: { height: 9, backgroundColor: Theme.colors.paper, borderRadius: 8, borderWidth: 1, borderColor: Theme.colors.line, marginTop: 7, overflow: 'hidden' }, button: { minHeight: 54, borderRadius: 17, borderWidth: 3, borderColor: Theme.colors.ink, backgroundColor: Theme.colors.green, flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 8, marginTop: 16 }, buttonText: { color: Theme.colors.ink, fontWeight: '800', fontSize: 15 } });
