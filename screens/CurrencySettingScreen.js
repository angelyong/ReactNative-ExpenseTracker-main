import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  Pressable,
  Alert,
  ScrollView,
} from 'react-native';
import Ionicons from '@expo/vector-icons/Ionicons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Theme } from '../constants/theme';

const currencyOptions = [
  {
    name: 'Malaysian Ringgit',
    code: 'MYR',
    symbol: 'RM',
  },
  {
    name: 'Indian Rupee',
    code: 'INR',
    symbol: '₹',
  },
  {
    name: 'US Dollar',
    code: 'USD',
    symbol: '$',
  },
  {
    name: 'Euro',
    code: 'EUR',
    symbol: '€',
  },
  {
    name: 'British Pound',
    code: 'GBP',
    symbol: '£',
  },
  {
    name: 'Japanese Yen',
    code: 'JPY',
    symbol: '¥',
  },
  {
    name: 'Chinese Yuan',
    code: 'CNY',
    symbol: '¥',
  },
  {
    name: 'Singapore Dollar',
    code: 'SGD',
    symbol: 'S$',
  },
];

export default function CurrencySettingScreen({ navigation }) {
  const [selectedCurrency, setSelectedCurrency] = useState('₹');

  useEffect(() => {
    async function loadCurrency() {
      const savedCurrency = await AsyncStorage.getItem('currencySymbol');
      setSelectedCurrency(savedCurrency || '₹');
    }

    loadCurrency();
  }, []);

  async function saveCurrency() {
    await AsyncStorage.setItem('currencySymbol', selectedCurrency);
    Alert.alert('Saved', 'Currency symbol has been updated.');
    navigation.goBack();
  }

  return (
    <SafeAreaView style={styles.screen}>
      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.container}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.headerCard}>
          <View style={styles.headerIcon}>
            <Ionicons name="cash-outline" size={30} color={Theme.colors.ink} />
          </View>

          <Text style={styles.title}>Currency Setting</Text>
          <Text style={styles.subtitle}>
            Select the currency symbol used in your expense records
          </Text>
        </View>

        <View style={styles.list}>
          {currencyOptions.map((currency) => {
            const isSelected = selectedCurrency === currency.symbol;

            return (
              <Pressable
                key={`${currency.code}-${currency.symbol}`}
                style={[
                  styles.currencyCard,
                  isSelected && styles.selectedCard,
                ]}
                onPress={() => setSelectedCurrency(currency.symbol)}
              >
                <View style={styles.currencyLeft}>
                  <View
                    style={[
                      styles.symbolCircle,
                      isSelected && styles.selectedSymbolCircle,
                    ]}
                  >
                    <Text
                      style={[
                        styles.symbolText,
                        isSelected && styles.selectedSymbolText,
                      ]}
                    >
                      {currency.symbol}
                    </Text>
                  </View>

                  <View style={styles.currencyTextBox}>
                    <Text
                      style={[
                        styles.currencyName,
                        isSelected && styles.selectedText,
                      ]}
                    >
                      {currency.name}
                    </Text>
                    <Text
                      style={[
                        styles.currencyCode,
                        isSelected && styles.selectedCode,
                      ]}
                    >
                      {currency.code}
                    </Text>
                  </View>
                </View>

                {isSelected && (
                  <Ionicons
                    name="checkmark-circle"
                    size={24}
                    color={Theme.colors.ink}
                  />
                )}
              </Pressable>
            );
          })}
        </View>

        <Pressable
          style={({ pressed }) => [
            styles.saveButton,
            pressed && styles.saveButtonPressed,
          ]}
          onPress={saveCurrency}
        >
          <Text style={styles.saveButtonText}>Save Currency</Text>
        </Pressable>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
        backgroundColor: Theme.colors.paper,
  },
  scrollView: {
    flex: 1,
        backgroundColor: Theme.colors.paper,
  },
  container: {
    paddingHorizontal: 18,
    paddingTop: 18,
    paddingBottom: 36,
        backgroundColor: Theme.colors.paper,
  },
  headerCard: {
    alignItems: 'center',
    paddingVertical: 22,
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
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 12,
  },
  title: {
    fontSize: 22,
    fontWeight: '700',
        color: Theme.colors.ink,
  },
  subtitle: {
    fontSize: 13,
        color: Theme.colors.muted,
    textAlign: 'center',
    marginTop: 6,
    lineHeight: 18,
  },
  list: {
    marginBottom: 10,
  },
  currencyCard: {
    minHeight: 68,
    borderRadius: 18,
        backgroundColor: Theme.colors.white,
        borderWidth: 3,
        borderColor: Theme.colors.ink,
    paddingHorizontal: 14,
    paddingVertical: 12,
    marginBottom: 12,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  selectedCard: {
    backgroundColor: Theme.colors.yellow,
    borderColor: Theme.colors.ink,
  },
  currencyLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  currencyTextBox: {
    flex: 1,
  },
  symbolCircle: {
    width: 42,
    height: 42,
    borderRadius: 21,
        backgroundColor: Theme.colors.paper,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  selectedSymbolCircle: {
    backgroundColor: Theme.colors.coral,
  },
  symbolText: {
    fontSize: 15,
    fontWeight: '700',
        color: Theme.colors.ink,
  },
  selectedSymbolText: {
        color: Theme.colors.ink,
  },
  currencyName: {
    fontSize: 15,
    fontWeight: '700',
        color: Theme.colors.ink,
  },
  currencyCode: {
    fontSize: 12,
        color: Theme.colors.muted,
    marginTop: 3,
  },
  selectedText: {
        color: Theme.colors.ink,
  },
  selectedCode: {
        color: Theme.colors.ink,
  },
  saveButton: {
    height: 52,
    borderRadius: 16,
        backgroundColor: Theme.colors.green,
    borderWidth: 3,
    borderColor: Theme.colors.ink,
    justifyContent: 'center',
    alignItems: 'center',
        shadowColor: Theme.colors.ink,
    shadowOffset: {
      width: 0,
      height: 6,
    },
    shadowOpacity: 0.25,
    shadowRadius: 10,
    elevation: 4,
  },
  saveButtonPressed: {
        backgroundColor: Theme.colors.coral,
    transform: [{ scale: 0.98 }],
  },
  saveButtonText: {
        color: Theme.colors.ink,
    fontSize: 15,
    fontWeight: '700',
  },
});
