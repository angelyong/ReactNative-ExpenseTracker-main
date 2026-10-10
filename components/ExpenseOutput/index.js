import { Text, View, Modal, Pressable } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { useSelector } from 'react-redux';
import ExpenseSummary from './ExpenseSummary';
import ExpenseList from './ExpenseList';
import { useState, useEffect } from 'react';

import Loading from '../UI/Loading';
import Button from '../UI/Button';
import Error from '../UI/Error';
import { Theme } from '../../constants/theme';

export default function ExpenseOutput({
  period,
  isLoading,
  error,
  selectedMonth,
  selectedYear,
  setSelectedMonth,
  setSelectedYear,
  currency,
}) {
  const navigation = useNavigation();

  // MODAL STATE
  const [showFilterModal, setShowFilterModal] = useState(false);
  const [tempMonth, setTempMonth] = useState(selectedMonth);
  const [tempYear, setTempYear] = useState(selectedYear);

  useEffect(() => {
    setTempMonth(selectedMonth);
    setTempYear(selectedYear);
  }, [selectedMonth, selectedYear]);

  // GET EXPENSES
  let expenses = useSelector((state) => state.expenses.expenses);

  // Recent screen (7 days)
  if (period) {
    const periodDaysAgo = new Date(
      new Date().getTime() - period * 86400000
    );

    expenses = expenses.filter(
      (expense) => new Date(expense.date) >= periodDaysAgo
    );
  }

  // All expenses (month/year)
  else if (selectedMonth !== undefined && selectedYear !== undefined) {
    expenses = expenses.filter((expense) => {
      const date = new Date(expense.date);
      return (
        date.getMonth() === selectedMonth &&
        date.getFullYear() === selectedYear
      );
    });
  }

  let content = <ExpenseList expenses={expenses} period={period} currency={currency} />;

  if (error && !isLoading) {
    content = <Error message={error} />;
  }

  if (isLoading) {
    content = <Loading />;
  }

  const monthNames = [
    'Jan','Feb','Mar','Apr','May','Jun',
    'Jul','Aug','Sep','Oct','Nov','Dec'
  ];

  const years = [2023, 2024, 2025, 2026, 2027];

  return (
    <View className="flex-1 p-5">

      {/* ADD BUTTON */}
      <Button
        classes="my-2"
        style={{ backgroundColor: Theme.colors.green, borderWidth: 3, borderColor: Theme.colors.ink }}
        onPress={() => navigation.navigate('ManageExpenseScreen')}
      >
        Add new Expense
      </Button>

      {/* SUMMARY */}
      <ExpenseSummary
        expenses={expenses}
        period={period}
        currency={currency}
        selectedMonth={selectedMonth}
        selectedYear={selectedYear}
        showFilter={!period}
        onFilterPress={() => setShowFilterModal(true)}
      />

      {/* LIST */}
      {content}

      {/* =======================
          FILTER MODAL
      ======================= */}
      <Modal visible={showFilterModal} transparent animationType="fade">
        <View className="flex-1 justify-center items-center bg-black/50">
          <View className="bg-white w-4/5 p-5 rounded-xl">

            {/* MONTH */}
            <Text className="text-lg font-bold mb-2">
              Select Month
            </Text>

            <View className="flex-row flex-wrap">
              {monthNames.map((m, i) => (
                <Pressable
                  key={i}
                  onPress={() => setTempMonth(i)}
                  style={{
                    padding: 8,
                    margin: 4,
                    borderRadius: 8,
                    backgroundColor:
                      tempMonth === i ? '#ff4da6' : '#ddd',
                  }}
                >
                  <Text
                    style={{
                      color: tempMonth === i ? 'white' : 'black',
                    }}
                  >
                    {m}
                  </Text>
                </Pressable>
              ))}
            </View>

            {/* YEAR */}
            <Text className="text-lg font-bold mt-4 mb-2">
              Select Year
            </Text>

            <View className="flex-row flex-wrap">
              {years.map((y) => (
                <Pressable
                  key={y}
                  onPress={() => setTempYear(y)}
                  style={{
                    padding: 8,
                    margin: 4,
                    borderRadius: 8,
                    backgroundColor:
                      tempYear === y ? '#ff4da6' : '#ddd',
                  }}
                >
                  <Text
                    style={{
                      color:
                        tempYear === y ? 'white' : 'black',
                    }}
                  >
                    {y}
                  </Text>
                </Pressable>
              ))}
            </View>

            {/* BUTTONS */}
            <View className="flex-row justify-end mt-4">

              <Pressable
                onPress={() => setShowFilterModal(false)}
                className="mr-4"
              >
                <Text>Cancel</Text>
              </Pressable>

              <Pressable
                onPress={() => {
                  setSelectedMonth(tempMonth);
                  setSelectedYear(tempYear);
                  setShowFilterModal(false);
                }}
                style={{
                  backgroundColor: '#ff4da6',
                  paddingHorizontal: 12,
                  paddingVertical: 6,
                  borderRadius: 8,
                }}
              >
                <Text style={{ color: 'white' }}>Apply</Text>
              </Pressable>
            </View>
          </View>
        </View>
      </Modal>
    </View>
  );
}
