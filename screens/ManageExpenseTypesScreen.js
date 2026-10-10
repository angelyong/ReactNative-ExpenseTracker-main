import { useEffect, useState } from 'react';
import { View, Text, TextInput, Pressable, FlatList, Alert, StyleSheet } from 'react-native';
import {
  getDBConnection,
  getExpenseTypes,
  addExpenseType,
  updateExpenseType,
  deleteExpenseType,
  createExpenseTypeTable,
} from '../utils/db-service';
import { Theme } from '../constants/theme';

export default function ManageExpenseTypesScreen() {
  const [types, setTypes] = useState([]);
  const [newType, setNewType] = useState('');
  const [editingId, setEditingId] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [initError, setInitError] = useState(null);

  useEffect(() => {
    init();
  }, []);

  async function init() {
    try {
      setIsLoading(true);
      setInitError(null);
      const db = getDBConnection();
      await createExpenseTypeTable(db);
      await loadTypes();
    } catch (err) {
      console.error('Init error:', err);
      setInitError('Failed to initialize database');
    } finally {
      setIsLoading(false);
    }
  }

  async function loadTypes() {
    try {
      const db = await getDBConnection();
      const data = await getExpenseTypes(db);
      setTypes(data);
    } catch (err) {
      console.error('Load types error:', err);
    }
  }

  async function handleAddOrUpdate() {
    if (!newType.trim()) return;

    try {
      const db = await getDBConnection();

      if (editingId !== null) {
        await updateExpenseType(db, editingId, newType.trim());
        setEditingId(null);
      } else {
        await addExpenseType(db, newType.trim());
      }

      setNewType('');
      await loadTypes();
    } catch (err) {
      Alert.alert('Error', 'Type already exists or an error occurred');
    }
  }

  async function handleDelete(id) {
    Alert.alert('Delete', 'Are you sure?', [
      { text: 'Cancel', style: 'cancel' },
      {
        text: 'Delete',
        style: 'destructive',
        onPress: async () => {
          try {
            const db = await getDBConnection();
            await deleteExpenseType(db, id);
            await loadTypes();
          } catch (err) {
            Alert.alert('Error', 'Could not delete type');
          }
        },
      },
    ]);
  }

  function startEdit(item) {
    setNewType(item.name);
    setEditingId(item.id);
  }

  function cancelEdit() {
    setNewType('');
    setEditingId(null);
  }

  if (isLoading) {
    return (
      <View style={styles.centered}>
        <Text style={styles.loadingText}>Loading your categories...</Text>
      </View>
    );
  }

  if (initError) {
    return (
      <View style={styles.centered}>
        <Text style={styles.errorText}>{initError}</Text>
        <Pressable onPress={init} style={styles.retryButton}>
          <Text style={styles.retryText}>Retry</Text>
        </Pressable>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Text style={styles.eyebrow}>Make your money diary feel like yours</Text>
      <Text style={styles.title}>Expense categories</Text>
      <Text style={styles.subtitle}>Add, rename, or remove the labels used on your transactions.</Text>

      <TextInput
        value={newType}
        onChangeText={setNewType}
        placeholder="Enter new expense type..."
        placeholderTextColor={Theme.colors.muted}
        style={styles.input}
      />

      <View style={styles.buttonRow}>
        <Pressable
          onPress={handleAddOrUpdate}
          style={[styles.addButton, { flex: editingId !== null ? 0.7 : 1 }]}
        >
          <Text style={styles.buttonText}>
            {editingId !== null ? 'Update Type' : 'Add Type'}
          </Text>
        </Pressable>

        {editingId !== null && (
          <Pressable onPress={cancelEdit} style={styles.cancelButton}>
            <Text style={styles.buttonText}>Cancel</Text>
          </Pressable>
        )}
      </View>

      <FlatList
        data={types}
        keyExtractor={(item) => item.id.toString()}
        renderItem={({ item }) => (
          <View style={styles.typeRow}>
            <View style={styles.typeNameWrap}><View style={styles.typeDot} /><Text style={styles.typeName}>{item.name}</Text></View>

            <View style={styles.actionButtons}>
              <Pressable onPress={() => startEdit(item)} style={styles.editButton} accessibilityLabel={`Edit ${item.name}`}>
                <Text style={styles.editText}>Edit</Text>
              </Pressable>

              <Pressable onPress={() => handleDelete(item.id)} style={styles.deleteButton} accessibilityLabel={`Delete ${item.name}`}>
                <Text style={styles.deleteText}>Delete</Text>
              </Pressable>
            </View>
          </View>
        )}
        ListEmptyComponent={
          <Text style={styles.emptyText}>No types yet. Add one above!</Text>
        }
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20, backgroundColor: Theme.colors.paper },
  centered: { flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: Theme.colors.paper },
  loadingText: { color: Theme.colors.ink, fontWeight: '700' },
  eyebrow: { color: Theme.colors.muted, fontSize: 13, marginTop: 4 },
  title: { fontSize: 28, fontWeight: '800', color: Theme.colors.ink, marginTop: 3 },
  subtitle: { fontSize: 14, lineHeight: 20, color: Theme.colors.muted, marginTop: 6, marginBottom: 18 },
  input: {
    minHeight: 54,
    borderWidth: 3,
    borderColor: Theme.colors.ink,
    borderRadius: 16,
    backgroundColor: Theme.colors.white,
    color: Theme.colors.ink,
    paddingHorizontal: 14,
    marginBottom: 10,
  },
  buttonRow: { flexDirection: 'row', gap: 8, marginBottom: 18 },
  addButton: {
    backgroundColor: Theme.colors.green,
    padding: 13,
    borderRadius: 14,
    borderWidth: 3,
    borderColor: Theme.colors.ink,
    alignItems: 'center',
  },
  cancelButton: {
    flex: 0.3,
    backgroundColor: Theme.colors.coral,
    padding: 13,
    borderRadius: 14,
    borderWidth: 3,
    borderColor: Theme.colors.ink,
    alignItems: 'center',
  },
  buttonText: { color: Theme.colors.ink, fontWeight: '800' },
  typeRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 14,
    paddingHorizontal: 14,
    marginBottom: 10,
    minHeight: 62,
    borderRadius: 17,
    borderWidth: 3,
    borderColor: Theme.colors.ink,
    backgroundColor: Theme.colors.white,
  },
  typeNameWrap: { flex: 1, flexDirection: 'row', alignItems: 'center', gap: 10 },
  typeDot: { width: 16, height: 16, borderRadius: 8, backgroundColor: Theme.colors.yellow, borderWidth: 2, borderColor: Theme.colors.ink },
  typeName: { fontSize: 16, fontWeight: '800', color: Theme.colors.ink },
  actionButtons: { flexDirection: 'row', gap: 12 },
  editButton: { paddingHorizontal: 10, paddingVertical: 7, borderRadius: 10, backgroundColor: Theme.colors.blue, borderWidth: 2, borderColor: Theme.colors.ink },
  editText: { color: Theme.colors.ink, fontWeight: '800' },
  deleteButton: { paddingHorizontal: 10, paddingVertical: 7, borderRadius: 10, backgroundColor: Theme.colors.coral, borderWidth: 2, borderColor: Theme.colors.ink },
  deleteText: { color: Theme.colors.ink, fontWeight: '800' },
  errorText: { color: Theme.colors.danger, marginBottom: 12 },
  retryButton: { backgroundColor: Theme.colors.green, padding: 12, borderRadius: 12, borderWidth: 2, borderColor: Theme.colors.ink },
  retryText: { color: Theme.colors.ink, fontWeight: '800' },
  emptyText: { textAlign: 'center', color: Theme.colors.muted, marginTop: 20 },
});
