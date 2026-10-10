import { useState } from "react";
import {
  View,
  Text,
  TextInput,
  Alert,
  StyleSheet,
  SafeAreaView,
  TouchableOpacity,
} from "react-native";
import Ionicons from "@expo/vector-icons/Ionicons";
import axios from "axios";
import { API_URL, USER_ID } from "../socket";
import { STORAGE_KEYS, writeJson } from "../utils/localStorage";
import { Theme } from "../constants/theme";

export default function SetBudgetScreen({ navigation }) {
  const [monthlyBudget, setMonthlyBudget] = useState("");

  async function saveBudget() {
    if (!monthlyBudget || Number(monthlyBudget) <= 0) {
      Alert.alert("Invalid Budget", "Please enter a valid monthly budget.");
      return;
    }

    try {
      await axios.post(`${API_URL}/budget`, {
        userId: USER_ID,
        monthlyBudget: Number(monthlyBudget),
      });

      await writeJson(STORAGE_KEYS.budget, Number(monthlyBudget));

      Alert.alert("Success", "Monthly budget saved.");
      navigation.goBack();
    } catch (error) {
      Alert.alert("Error", "Failed to save monthly budget.");
    }
  }

  return (
    <SafeAreaView style={styles.screen}>
      <View style={styles.container}>
        <View style={styles.headerCard}>
          <View style={styles.headerIcon}>
            <Ionicons name="wallet-outline" size={30} color="#7d71ff" />
          </View>

          <Text style={styles.title}>Set Monthly Budget</Text>
          <Text style={styles.subtitle}>
            Set a monthly spending limit. You will receive a notification when your expenses exceed this budget.
          </Text>
        </View>

        <View style={styles.formCard}>
          <Text style={styles.label}>Monthly Budget</Text>

          <View style={styles.inputBox}>
            <Text style={styles.currencyText}>RM</Text>
            <TextInput
              style={styles.input}
              placeholder="Enter amount"
              placeholderTextColor="#9aa7b8"
              value={monthlyBudget}
              keyboardType="numeric"
              onChangeText={setMonthlyBudget}
            />
          </View>
        </View>

        <View style={styles.footer}>
          <TouchableOpacity style={styles.saveButton} onPress={saveBudget}>
            <Text style={styles.saveButtonText}>Save Budget</Text>
          </TouchableOpacity>
        </View>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: Theme.colors.paper,
  },
  container: {
    flex: 1,
    paddingHorizontal: 18,
    paddingTop: 18,
    backgroundColor: Theme.colors.paper,
  },
  headerCard: {
    alignItems: "center",
    paddingVertical: 24,
    paddingHorizontal: 16,
    borderRadius: 24,
    backgroundColor: Theme.colors.blue,
    borderWidth: 3,
    borderColor: Theme.colors.ink,
    marginBottom: 18,
  },
  headerIcon: {
    width: 64,
    height: 64,
    borderRadius: 32,
    backgroundColor: Theme.colors.white,
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 12,
  },
  title: {
    fontSize: 22,
    fontWeight: "700",
    color: Theme.colors.ink,
  },
  subtitle: {
    fontSize: 13,
    color: Theme.colors.muted,
    textAlign: "center",
    marginTop: 6,
    lineHeight: 18,
  },
  formCard: {
    borderRadius: 24,
    backgroundColor: Theme.colors.white,
    borderWidth: 3,
    borderColor: Theme.colors.ink,
    padding: 16,
    elevation: 3,
  },
  label: {
    fontSize: 13,
    fontWeight: "700",
    color: "#556b89",
    marginBottom: 8,
    marginLeft: 4,
  },
  inputBox: {
    height: 54,
    borderRadius: 16,
    backgroundColor: Theme.colors.paper,
    borderWidth: 2,
    borderColor: Theme.colors.ink,
    paddingHorizontal: 14,
    flexDirection: "row",
    alignItems: "center",
  },
  currencyText: {
    fontSize: 15,
    fontWeight: "700",
    color: Theme.colors.ink,
    marginRight: 10,
  },
  input: {
    flex: 1,
    fontSize: 14,
    color: Theme.colors.ink,
  },
  footer: {
    marginTop: "auto",
    paddingBottom: 22,
  },
  saveButton: {
    height: 52,
    borderRadius: 16,
    backgroundColor: Theme.colors.green,
    justifyContent: "center",
    alignItems: "center",
    elevation: 4,
  },
  saveButtonText: {
    color: Theme.colors.ink,
    fontSize: 15,
    fontWeight: "700",
  },
});
