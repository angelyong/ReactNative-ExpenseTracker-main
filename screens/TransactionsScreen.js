import { useMemo, useState } from 'react';
import {
  FlatList,
  Pressable,
  SafeAreaView,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useSelector } from 'react-redux';
import useCurrency from '../components/UI/currency';
import { Theme, categoryColor, categoryLabel } from '../constants/theme';

function dayKey(date) {
  const value = new Date(date);
  return `${value.getFullYear()}-${value.getMonth()}-${value.getDate()}`;
}

function money(value, currency) { return `${currency || '₹'}${Number(value || 0).toFixed(2)}`; }

export default function TransactionsScreen({ navigation }) {
  const expenses = useSelector((state) => state.expenses.expenses);
  const currency = useCurrency();
  const [selectedDate, setSelectedDate] = useState(new Date());
  const dates = useMemo(() => Array.from({ length: 14 }, (_, index) => {
    const value = new Date();
    value.setDate(value.getDate() - (13 - index));
    return value;
  }), []);
  const selectedExpenses = useMemo(() => expenses
    .filter((item) => dayKey(item.date) === dayKey(selectedDate))
    .sort((a, b) => new Date(a.date) - new Date(b.date)), [expenses, selectedDate]);

  return (
    <SafeAreaView style={styles.screen}>
      <View style={styles.header}>
        <View><Text style={styles.eyebrow}>Your money diary</Text><Text style={styles.title}>Transactions</Text></View>
        <View style={styles.headerActions}><Pressable style={styles.filterCircle} onPress={() => navigation.navigate('AllExpenses')} accessibilityLabel="Filter by month"><Ionicons name="calendar-outline" size={21} color={Theme.colors.ink} /></Pressable><Pressable style={styles.addCircle} onPress={() => navigation.navigate('ManageExpenseScreen')} accessibilityLabel="Add transaction"><Ionicons name="add" size={26} color={Theme.colors.ink} /></Pressable></View>
      </View>
      <Text style={styles.helper}>Choose a day to see what happened.</Text>
      <FlatList
        horizontal
        data={dates}
        keyExtractor={(item) => dayKey(item)}
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.dateList}
        renderItem={({ item }) => {
          const selected = dayKey(item) === dayKey(selectedDate);
          return <Pressable onPress={() => setSelectedDate(item)} style={[styles.dateItem, selected && styles.dateItemSelected]}><Text style={[styles.dateWeek, selected && styles.selectedText]}>{item.toLocaleDateString(undefined, { weekday: 'short' })}</Text><Text style={[styles.dateNumber, selected && styles.selectedText]}>{item.getDate()}</Text></Pressable>;
        }}
      />
      <View style={styles.dayHeading}><Text style={styles.dayTitle}>{selectedDate.toLocaleDateString(undefined, { weekday: 'long', month: 'long', day: 'numeric' })}</Text><Text style={styles.dayTotal}>{money(selectedExpenses.reduce((sum, item) => sum + Number(item.price || 0), 0), currency)}</Text></View>
      {selectedExpenses.length === 0 ? <View style={styles.emptyCard}><View style={styles.emptyIcon}><Ionicons name="sunny-outline" size={30} color={Theme.colors.ink} /></View><Text style={styles.emptyTitle}>A quiet spending day</Text><Text style={styles.emptyText}>No transactions recorded for this date.</Text></View> : <FlatList data={selectedExpenses} keyExtractor={(item) => item.id} contentContainerStyle={styles.transactionList} renderItem={({ item }) => <TransactionRow item={item} currency={currency} onPress={() => navigation.navigate('ManageExpenseScreen', { id: item.id })} />} />}
    </SafeAreaView>
  );
}

function TransactionRow({ item, currency, onPress }) {
  const type = categoryLabel(item.type);
  const isIncome = item.kind === 'income';
  return <Pressable onPress={onPress} style={({ pressed }) => [styles.transactionCard, pressed && styles.pressed]}><View style={[styles.transactionIcon, { backgroundColor: isIncome ? Theme.colors.green : categoryColor(type) }]}><Ionicons name={isIncome ? "arrow-down-outline" : "receipt-outline"} size={21} color={Theme.colors.ink} /></View><View style={styles.transactionBody}><Text style={styles.transactionTitle}>{item.title}</Text><View style={styles.metaRow}><Text style={styles.categoryTag}>{isIncome ? 'Income' : type}</Text>{item.recurring && <Text style={styles.recurringTag}>Recurring</Text>}<Text style={styles.time}>{new Date(item.date).toLocaleTimeString([], { hour: 'numeric', minute: '2-digit' })}</Text></View></View><Text style={[styles.transactionAmount, isIncome && styles.incomeAmount]}>{isIncome ? '+' : '-'}{money(item.price, currency)}</Text></Pressable>;
}

const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: Theme.colors.paper, paddingTop: 10 }, incomeAmount: { color: '#638F56' },
  header: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingHorizontal: 20 }, headerActions: { flexDirection: 'row', alignItems: 'center', gap: 8 }, eyebrow: { color: Theme.colors.muted, fontSize: 13 }, title: { color: Theme.colors.ink, fontSize: 29, fontWeight: '800', marginTop: 2 }, helper: { color: Theme.colors.muted, marginHorizontal: 20, marginTop: 5 }, filterCircle: { backgroundColor: Theme.colors.yellow, width: 44, height: 44, borderRadius: 16, borderWidth: 3, borderColor: Theme.colors.ink, alignItems: 'center', justifyContent: 'center' }, addCircle: { backgroundColor: Theme.colors.green, width: 50, height: 50, borderRadius: 18, borderWidth: 3, borderColor: Theme.colors.ink, alignItems: 'center', justifyContent: 'center' },
  dateList: { paddingHorizontal: 20, gap: 9, paddingVertical: 20 }, dateItem: { width: 52, height: 72, borderRadius: 17, borderWidth: 2, borderColor: Theme.colors.line, backgroundColor: Theme.colors.white, alignItems: 'center', justifyContent: 'center' }, dateItemSelected: { backgroundColor: Theme.colors.coral, borderColor: Theme.colors.ink, borderWidth: 3 }, dateWeek: { color: Theme.colors.muted, fontSize: 12, fontWeight: '700' }, dateNumber: { color: Theme.colors.ink, fontSize: 21, fontWeight: '800', marginTop: 5 }, selectedText: { color: Theme.colors.ink }, dayHeading: { borderTopWidth: 2, borderBottomWidth: 2, borderColor: Theme.colors.line, paddingHorizontal: 20, paddingVertical: 13, flexDirection: 'row', justifyContent: 'space-between' }, dayTitle: { color: Theme.colors.ink, fontWeight: '800' }, dayTotal: { color: Theme.colors.ink, fontWeight: '800' },
  transactionList: { padding: 20, paddingBottom: 30, gap: 10 }, transactionCard: { backgroundColor: Theme.colors.white, borderRadius: 20, borderWidth: 3, borderColor: Theme.colors.ink, padding: 13, flexDirection: 'row', alignItems: 'center', gap: 12 }, pressed: { transform: [{ scale: 0.98 }] }, transactionIcon: { width: 44, height: 44, borderRadius: 15, borderWidth: 2, borderColor: Theme.colors.ink, alignItems: 'center', justifyContent: 'center' }, transactionBody: { flex: 1 }, transactionTitle: { color: Theme.colors.ink, fontSize: 15, fontWeight: '800' }, metaRow: { flexDirection: 'row', alignItems: 'center', gap: 5, flexWrap: 'wrap', marginTop: 6 }, categoryTag: { color: Theme.colors.ink, backgroundColor: Theme.colors.paper, borderRadius: 8, paddingHorizontal: 6, paddingVertical: 2, fontSize: 10, fontWeight: '700' }, recurringTag: { color: Theme.colors.ink, backgroundColor: Theme.colors.yellow, borderRadius: 8, paddingHorizontal: 6, paddingVertical: 2, fontSize: 10, fontWeight: '800' }, time: { color: Theme.colors.muted, fontSize: 11 }, transactionAmount: { color: Theme.colors.ink, fontSize: 14, fontWeight: '800' }, emptyCard: { margin: 20, padding: 28, borderRadius: Theme.radius.card, borderWidth: 3, borderColor: Theme.colors.ink, backgroundColor: Theme.colors.white, alignItems: 'center' }, emptyIcon: { width: 58, height: 58, borderRadius: 20, backgroundColor: Theme.colors.yellow, borderWidth: 2, borderColor: Theme.colors.ink, alignItems: 'center', justifyContent: 'center' }, emptyTitle: { color: Theme.colors.ink, fontSize: 18, fontWeight: '800', marginTop: 14 }, emptyText: { color: Theme.colors.muted, marginTop: 5, textAlign: 'center' },
});
