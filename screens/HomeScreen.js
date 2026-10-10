import { useEffect, useMemo, useState } from 'react';
import {
  AccessibilityInfo,
  Pressable,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useSelector } from 'react-redux';
import useCurrency from '../components/UI/currency';
import { Theme, categoryColor, categoryLabel } from '../constants/theme';
import { readJson, STORAGE_KEYS, writeJson } from '../utils/localStorage';

const DEFAULT_TASKS = [
  { id: 'pay-bills', title: 'Pay bills', done: false },
  { id: 'review-expenses', title: 'Review monthly expenses', done: false },
  { id: 'set-budget', title: "Set next month's budget", done: false },
  { id: 'subscriptions', title: 'Track subscriptions', done: false },
];

function money(value, currency) {
  return `${currency || '₹'}${Number(value || 0).toFixed(2)}`;
}

function Illustration() {
  return (
    <View style={styles.illustration} accessibilityLabel="A wallet and coins illustration">
      <View style={styles.sun} />
      <View style={styles.wallet}>
        <View style={styles.walletFlap} />
        <View style={styles.walletButton} />
      </View>
      <View style={[styles.coin, styles.coinOne]}><Text style={styles.coinText}>$</Text></View>
      <View style={[styles.coin, styles.coinTwo]}><Text style={styles.coinText}>$</Text></View>
    </View>
  );
}

export default function HomeScreen({ navigation }) {
  const expenses = useSelector((state) => state.expenses.expenses);
  const currency = useCurrency();
  const [tasks, setTasks] = useState(DEFAULT_TASKS);
  const [monthlyBudget, setMonthlyBudget] = useState(0);
  const [reduceMotion, setReduceMotion] = useState(false);
  const now = new Date();

  useEffect(() => {
    readJson(STORAGE_KEYS.tasks, DEFAULT_TASKS).then(setTasks);
    readJson(STORAGE_KEYS.budget, 0).then((value) => setMonthlyBudget(Number(value) || 0));
    AccessibilityInfo.isReduceMotionEnabled().then(setReduceMotion);
    const subscription = AccessibilityInfo.addEventListener('reduceMotionChanged', setReduceMotion);
    return () => subscription?.remove?.();
  }, []);

  const monthExpenses = useMemo(() => expenses.filter((item) => {
    const date = new Date(item.date);
    return date.getMonth() === now.getMonth() && date.getFullYear() === now.getFullYear();
  }), [expenses, now]);

  const totals = useMemo(() => {
    const expenseTotal = monthExpenses.filter((item) => item.kind !== 'income').reduce((sum, item) => sum + Number(item.price || 0), 0);
    const income = monthExpenses.filter((item) => item.kind === 'income')
      .reduce((sum, item) => sum + Number(item.price || 0), 0);
    return { expenseTotal, income, balance: income - expenseTotal };
  }, [monthExpenses]);

  const breakdown = useMemo(() => {
    const byCategory = {};
    monthExpenses.filter((item) => item.kind !== 'income').forEach((item) => {
      const name = categoryLabel(item.type);
      byCategory[name] = (byCategory[name] || 0) + Number(item.price || 0);
    });
    return Object.entries(byCategory).sort((a, b) => b[1] - a[1]);
  }, [monthExpenses]);

  async function toggleTask(id) {
    const next = tasks.map((task) => task.id === id ? { ...task, done: !task.done } : task);
    setTasks(next);
    await writeJson(STORAGE_KEYS.tasks, next);
  }

  const monthName = now.toLocaleDateString(undefined, { month: 'long' });
  const remaining = monthlyBudget - totals.expenseTotal;

  return (
    <SafeAreaView style={styles.screen}>
      <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
        <View style={styles.topRow}>
          <View>
            <Text style={styles.eyebrow}>A little check-in</Text>
            <Text style={styles.title}>Hello, friend! <Text style={styles.wave}>✦</Text></Text>
            <Text style={styles.subtitle}>{monthName} spending overview</Text>
          </View>
          <View style={styles.monthBadge}><Text style={styles.monthBadgeText}>{now.toLocaleDateString(undefined, { month: 'short' })}</Text></View>
        </View>

        <Illustration />

        <View style={styles.summaryGrid}>
          <SummaryCard label="Total Balance" value={money(totals.balance, currency)} color={Theme.colors.blue} icon="wallet-outline" />
          <SummaryCard label="Monthly Income" value={money(totals.income, currency)} color={Theme.colors.green} icon="arrow-down-outline" />
          <SummaryCard label="Monthly Expenses" value={money(totals.expenseTotal, currency)} color={Theme.colors.coral} icon="arrow-up-outline" />
          <SummaryCard label="Remaining Budget" value={monthlyBudget ? money(remaining, currency) : 'Set budget'} color={Theme.colors.yellow} icon="pie-chart-outline" />
        </View>

        <Pressable style={({ pressed }) => [styles.addButton, pressed && !reduceMotion && styles.pressed]} onPress={() => navigation.navigate('ManageExpenseScreen')}>
          <Ionicons name="add" size={24} color={Theme.colors.ink} />
          <Text style={styles.addButtonText}>Add a transaction</Text>
          <Ionicons name="arrow-forward" size={20} color={Theme.colors.ink} />
        </Pressable>

        <SectionTitle title="Where did it go?" action="See transactions" onPress={() => navigation.navigate('Transactions')} />
        <View style={styles.card}>
          {breakdown.length === 0 ? <Text style={styles.empty}>Your spending story will appear here.</Text> : breakdown.slice(0, 6).map(([name, amount], index) => {
            const highest = index === 0;
            const max = breakdown[0][1] || 1;
            return (
              <View key={name} style={styles.breakdownRow}>
                <View style={[styles.categoryDot, { backgroundColor: categoryColor(name) }]} />
                <View style={styles.breakdownMain}>
                  <View style={styles.breakdownLabelRow}><Text style={styles.categoryName}>{name}</Text>{highest && <Text style={styles.topSpending}>Top Spending</Text>}</View>
                  <View style={styles.track}><View style={[styles.trackFill, { width: `${Math.max(8, (amount / max) * 100)}%`, backgroundColor: categoryColor(name) }]} /></View>
                </View>
                <Text style={styles.amount}>{money(amount, currency)}</Text>
              </View>
            );
          })}
        </View>

        <SectionTitle title="Tiny money tasks" />
        <View style={styles.card}>
          {tasks.map((task) => (
            <Pressable key={task.id} onPress={() => toggleTask(task.id)} style={styles.taskRow} accessibilityRole="checkbox" accessibilityState={{ checked: task.done }}>
              <View style={[styles.checkbox, task.done && styles.checkboxDone]}>{task.done && <Ionicons name="checkmark" size={15} color={Theme.colors.ink} />}</View>
              <Text style={[styles.taskText, task.done && styles.taskDone]}>{task.title}</Text>
            </Pressable>
          ))}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

function SummaryCard({ label, value, color, icon }) {
  return <View style={[styles.summaryCard, { backgroundColor: color }]}><Ionicons name={icon} size={19} color={Theme.colors.ink} /><Text style={styles.summaryLabel}>{label}</Text><Text style={styles.summaryValue} numberOfLines={1}>{value}</Text></View>;
}

function SectionTitle({ title, action, onPress }) {
  return <View style={styles.sectionTitleRow}><Text style={styles.sectionTitle}>{title}</Text>{action && <Pressable onPress={onPress}><Text style={styles.sectionAction}>{action} ›</Text></Pressable>}</View>;
}

const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: Theme.colors.paper },
  content: { padding: 20, paddingBottom: 40 },
  topRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start' },
  eyebrow: { color: Theme.colors.muted, fontSize: 13, fontFamily: Theme.fontFamily },
  title: { color: Theme.colors.ink, fontSize: 28, fontWeight: '800', marginTop: 2, fontFamily: Theme.fontFamily },
  wave: { color: Theme.colors.coral },
  subtitle: { color: Theme.colors.muted, fontSize: 14, marginTop: 5, fontFamily: Theme.fontFamily },
  monthBadge: { borderWidth: 3, borderColor: Theme.colors.ink, backgroundColor: Theme.colors.yellow, borderRadius: 16, paddingHorizontal: 12, paddingVertical: 8 },
  monthBadgeText: { color: Theme.colors.ink, fontWeight: '800' },
  illustration: { height: 145, backgroundColor: Theme.colors.blue, borderColor: Theme.colors.ink, borderWidth: 3, borderRadius: Theme.radius.card, marginTop: 18, marginBottom: 16, overflow: 'hidden', position: 'relative' },
  sun: { width: 72, height: 72, borderRadius: 36, backgroundColor: Theme.colors.yellow, position: 'absolute', right: 24, top: 18 },
  wallet: { position: 'absolute', left: 42, bottom: 21, width: 158, height: 78, borderRadius: 18, backgroundColor: Theme.colors.coral, borderWidth: 3, borderColor: Theme.colors.ink, transform: [{ rotate: '-6deg' }] },
  walletFlap: { position: 'absolute', top: 17, left: -3, right: -3, height: 25, borderTopWidth: 3, borderBottomWidth: 3, borderColor: Theme.colors.ink, backgroundColor: '#EE968B' },
  walletButton: { position: 'absolute', right: 18, top: 28, width: 14, height: 14, borderRadius: 7, backgroundColor: Theme.colors.yellow, borderWidth: 2, borderColor: Theme.colors.ink },
  coin: { width: 34, height: 34, borderRadius: 17, backgroundColor: Theme.colors.yellow, borderWidth: 3, borderColor: Theme.colors.ink, position: 'absolute', alignItems: 'center', justifyContent: 'center' },
  coinOne: { left: 190, bottom: 28 }, coinTwo: { left: 218, bottom: 48 }, coinText: { fontWeight: '800', color: Theme.colors.ink },
  summaryGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: 10 },
  summaryCard: { width: '48%', minHeight: 112, borderRadius: Theme.radius.small, borderWidth: 3, borderColor: Theme.colors.ink, padding: 13 },
  summaryLabel: { color: Theme.colors.ink, fontSize: 12, marginTop: 13, fontWeight: '600' }, summaryValue: { color: Theme.colors.ink, fontSize: 18, fontWeight: '800', marginTop: 3 },
  addButton: { minHeight: 56, borderRadius: 18, borderWidth: 3, borderColor: Theme.colors.ink, backgroundColor: Theme.colors.green, marginTop: 14, paddingHorizontal: 16, flexDirection: 'row', alignItems: 'center', gap: 10 },
  addButtonText: { flex: 1, color: Theme.colors.ink, fontSize: 16, fontWeight: '800' }, pressed: { transform: [{ scale: 0.98 }] },
  sectionTitleRow: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginTop: 24, marginBottom: 10 }, sectionTitle: { color: Theme.colors.ink, fontSize: 20, fontWeight: '800' }, sectionAction: { color: Theme.colors.muted, fontSize: 13, fontWeight: '700' },
  card: { backgroundColor: Theme.colors.white, borderWidth: 3, borderColor: Theme.colors.ink, borderRadius: Theme.radius.card, padding: 16 }, empty: { color: Theme.colors.muted, paddingVertical: 8 },
  breakdownRow: { flexDirection: 'row', alignItems: 'center', marginVertical: 7, gap: 10 }, categoryDot: { width: 14, height: 14, borderRadius: 7, borderWidth: 2, borderColor: Theme.colors.ink }, breakdownMain: { flex: 1 }, breakdownLabelRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }, categoryName: { color: Theme.colors.ink, fontWeight: '700', fontSize: 13 }, topSpending: { color: Theme.colors.ink, fontSize: 10, fontWeight: '800', backgroundColor: Theme.colors.yellow, borderRadius: 8, paddingHorizontal: 6, paddingVertical: 2 }, track: { height: 8, backgroundColor: Theme.colors.paper, borderRadius: 8, borderWidth: 1, borderColor: Theme.colors.line, marginTop: 6, overflow: 'hidden' }, trackFill: { height: '100%', borderRadius: 8 }, amount: { width: 72, color: Theme.colors.ink, textAlign: 'right', fontWeight: '800', fontSize: 12 },
  taskRow: { flexDirection: 'row', alignItems: 'center', paddingVertical: 8, gap: 12 }, checkbox: { width: 24, height: 24, borderRadius: 8, borderWidth: 3, borderColor: Theme.colors.ink, alignItems: 'center', justifyContent: 'center' }, checkboxDone: { backgroundColor: Theme.colors.green }, taskText: { color: Theme.colors.ink, fontSize: 14, fontWeight: '600' }, taskDone: { textDecorationLine: 'line-through', color: Theme.colors.muted },
});
