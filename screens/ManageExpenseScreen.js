import { useLayoutEffect } from "react";
import { Text, View } from "react-native";
import { ExpenseForm } from "../components";
import { useSelector } from "react-redux";
import { Theme } from "../constants/theme";

export default function ManageExpenseScreen({ route, navigation }) {
  const id = route.params?.id;

  const expenses = useSelector((state) => state.expenses.expenses);

  const expense = id
    ? expenses.find((expense) => expense.id === id)
    : undefined;

  useLayoutEffect(() => {
    navigation.setOptions({
      title: id ? "Edit expense" : "Add New Expense",
    });
  }, [navigation, id]);

  if (id && !expense) {
    return (
      <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center', backgroundColor: Theme.colors.paper }}>
        <Text>Expense not found</Text>
      </View>
    );
  }

  return (
    <View style={{ flex: 1, backgroundColor: Theme.colors.paper }}>
      <ExpenseForm id={id} defaultValues={expense ?? undefined} />
    </View>
  );
}
