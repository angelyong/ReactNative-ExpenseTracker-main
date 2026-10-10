import { useState, useCallback } from 'react';
import { Text, View, Alert, Pressable, Switch, StyleSheet } from 'react-native';
import { useNavigation, useFocusEffect } from '@react-navigation/native';
import { useDispatch } from 'react-redux';

import {
  addToExpenses,
  updateInExpenses,
  removeFromExpenses,
} from "../../store/expenses-slice";

import {
  storeExpense,
  updateExpense,
  deleteExpense,
} from "../../utils/http";

import {
  getDBConnection,
  getExpenseTypes,
  createExpenseTypeTable,
} from '../../utils/db-service';

import ActionButtons from "./ActionButtons";
import Input from "./Input";
import DateInput from "./DateInput";
import Loading from "../UI/Loading";
import Error from "../UI/Error";
import { Theme, categoryColor } from '../../constants/theme';

export default function ExpenseForm({ id, defaultValues }) {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState();

  const [types, setTypes] = useState([]);

  const [inputValues, setInputValues] = useState({
    title: defaultValues ? defaultValues.title : "",
    price: defaultValues ? defaultValues.price.toString() : "",
    type: defaultValues ? defaultValues.type : "Food",
    date: defaultValues ? new Date(defaultValues.date) : new Date(),
    recurring: defaultValues ? Boolean(defaultValues.recurring) : false,
    kind: defaultValues ? (defaultValues.kind || 'expense') : 'expense',
  });

  const dispatch = useDispatch();
  const navigation = useNavigation();

  // LOAD TYPES EVERY TIME SCREEN FOCUSED
  useFocusEffect(
    useCallback(() => {
      async function loadTypes() {
        try {
          const db = getDBConnection();
          await createExpenseTypeTable(db);
          const data = await getExpenseTypes(db);
          setTypes(data);
        } catch (err) {
          console.log("Error loading types:", err);
        }
      }

      loadTypes();
    }, [])
  );

  function inputValuesHandler(inputIdentifier, value) {
    setInputValues((prev) => ({
      ...prev,
      [inputIdentifier]: value,
    }));
  }

  async function submitHandler() {
    if (inputValues.title.trim() === "" || inputValues.price.trim() === "") {
      Alert.alert("Inputs Missing", "Please fill all fields", [
        { text: "OK", style: "destructive" },
      ]);
      return;
    }

    if (isNaN(+inputValues.price) || +inputValues.price <= 0) {
      Alert.alert("Invalid Price", "Price should be valid number", [
        { text: "OK", style: "destructive" },
      ]);
      return;
    }

    const expense = {
      title: inputValues.title,
      price: +inputValues.price,
      date: inputValues.date.toISOString(),
      type: inputValues.type,
      recurring: inputValues.recurring,
      kind: inputValues.kind,
    };

    setIsLoading(true);
    setError(null);

    if (id) {
      try {
        await updateExpense(id, expense);
        dispatch(updateInExpenses({ ...expense, id }));
        navigation.goBack();
      } catch (err) {
        console.log(err);
        setError("Couldn't update the expense");
      }
    } else {
      try {
        const expenseId = await storeExpense(expense);
        dispatch(addToExpenses({ ...expense, id: expenseId }));
        navigation.goBack();
      } catch (err) {
        console.log(err);
        setError("Couldn't add the expense");
      }
    }

    setIsLoading(false);
  }

  function deleteHandler() {
    Alert.alert(
      "Delete Expense",
      "Are you sure you want to delete this expense?",
      [
        { text: "Cancel", style: "cancel" },
        {
          text: "Delete",
          style: "destructive",
          onPress: async () => {
            setIsLoading(true);
            setError(null);

            try {
              await deleteExpense(id);
              dispatch(removeFromExpenses({ id }));
              navigation.goBack();
            } catch (err) {
              console.log(err);
              setError("Couldn't delete the expense");
            }

            setIsLoading(false);
          },
        },
      ]
    );
  }

  if (error && !isLoading) {
    return <Error message={error} onConfirm={() => navigation.goBack()} />;
  }

  if (isLoading) {
    return <Loading />;
  }

  return (
    <View style={styles.screen}>
      <View style={styles.card}>
        
        {/* TITLE */}
        <Input
          label="Title"
          textInputConfig={{
            value: inputValues.title,
            onChangeText: inputValuesHandler.bind(this, "title"),
          }}
        />

        <Text style={styles.sectionLabel}>Transaction kind</Text>
        <View style={styles.kindRow}>
          {['expense', 'income'].map((kind) => (
            <Pressable
              key={kind}
              onPress={() => inputValuesHandler('kind', kind)}
              style={[styles.kindButton, inputValues.kind === kind && styles.kindButtonSelected]}
            >
              <Text style={styles.kindText}>{kind}</Text>
            </Pressable>
          ))}
        </View>

        {/* PRICE */}
        <Input
          label="Price"
          textInputConfig={{
            value: inputValues.price,
            onChangeText: inputValuesHandler.bind(this, "price"),
            keyboardType: "number-pad",
          }}
        />

        {/* TYPE */}
        <View style={styles.typeSection}>
          <Text style={styles.sectionLabel}>Category</Text>

          {/* Dynamic Types */}
          <View style={styles.typeRow}>
            {types.map((t) => (
              <Pressable
                key={t.id}
                onPress={() => inputValuesHandler("type", t.name)}
                style={[styles.typeButton, { backgroundColor: inputValues.type === t.name ? categoryColor(t.name) : Theme.colors.paper }]}
              >
                <Text style={styles.typeText}>{t.name}</Text>
              </Pressable>
            ))}
          </View>

          {/* Manage Button */}
          <Pressable
            onPress={() => navigation.navigate("ManageExpenseTypes")}
            style={styles.manageTypesButton}
          >
            <Text style={styles.manageTypesText}>
              Manage Types
            </Text>
          </Pressable>
        </View>

        {/* DATE */}
        <DateInput
          onChange={inputValuesHandler.bind(this, "date")}
          date={inputValues.date}
        />

        <View style={styles.recurringRow}>
          <View>
            <Text style={styles.sectionLabel}>Recurring payment</Text>
            <Text style={styles.helper}>Show a reminder label for this transaction</Text>
          </View>
          <Switch
            value={inputValues.recurring}
            onValueChange={(value) => inputValuesHandler('recurring', value)}
            trackColor={{ false: Theme.colors.line, true: Theme.colors.green }}
            thumbColor={Theme.colors.ink}
          />
        </View>
      </View>

      {/* BUTTONS */}
      <ActionButtons
        id={id}
        onSubmit={submitHandler}
        onDelete={deleteHandler}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: Theme.colors.paper, padding: 20 },
  card: { backgroundColor: Theme.colors.white, borderWidth: 3, borderColor: Theme.colors.ink, borderRadius: 24, padding: 18, marginTop: 4 },
  sectionLabel: { color: Theme.colors.ink, fontSize: 13, fontWeight: '800' },
  kindRow: { flexDirection: 'row', gap: 8, marginTop: 8, marginBottom: 14 },
  kindButton: { flex: 1, paddingVertical: 11, borderRadius: 12, borderWidth: 2, borderColor: Theme.colors.ink, backgroundColor: Theme.colors.paper, alignItems: 'center' },
  kindButtonSelected: { backgroundColor: Theme.colors.green },
  kindText: { color: Theme.colors.ink, fontWeight: '800', textTransform: 'capitalize' },
  typeSection: { marginTop: 2, marginBottom: 13 },
  typeRow: { flexDirection: 'row', flexWrap: 'wrap', gap: 8, marginTop: 8 },
  typeButton: { paddingHorizontal: 12, paddingVertical: 9, borderRadius: 12, borderWidth: 2, borderColor: Theme.colors.ink },
  typeText: { color: Theme.colors.ink, fontWeight: '700', fontSize: 12 },
  manageTypesButton: { backgroundColor: Theme.colors.yellow, paddingVertical: 10, borderRadius: 12, marginTop: 12, borderWidth: 2, borderColor: Theme.colors.ink },
  manageTypesText: { color: Theme.colors.ink, textAlign: 'center', fontWeight: '800' },
  recurringRow: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginTop: 16, paddingTop: 14, borderTopWidth: 2, borderTopColor: Theme.colors.line },
  helper: { color: Theme.colors.muted, fontSize: 12, marginTop: 4 },
});
