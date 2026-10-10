import { useNavigation } from '@react-navigation/native';
import { View, Text, Pressable } from 'react-native';
import { getFormattedDate } from '../../utils/date';
import { Theme, categoryColor, categoryLabel } from '../../constants/theme';

export default function ExpenseItem({ item, currency }) {
  if (!item) return null;

  const { id, title, price, date } = item;
  const navigation = useNavigation();
  const displayCurrency = currency || '₹';

  return (
    <View
      className="my-3 rounded-lg"
      style={{
        elevation: 4,
        backgroundColor: Theme.colors.white,
        borderWidth: 3,
        borderColor: Theme.colors.ink,
      }}
    >
      <Pressable
        className="px-4 py-3"
        android_ripple={{ color: '#dbe2ec', borderless: true }}
        onPress={() => navigation.navigate('ManageExpenseScreen', { id })}
      >
        <View className="flex-row justify-between items-center">
          <View>
            <Text style={{ color: Theme.colors.ink, fontWeight: '800' }}>{title}</Text>
            <Text style={{ color: Theme.colors.muted, marginTop: 4 }}>
              {getFormattedDate(new Date(date))}
            </Text>
            <Text style={{ color: Theme.colors.ink, backgroundColor: categoryColor(item.type), alignSelf: 'flex-start', borderRadius: 8, paddingHorizontal: 6, paddingVertical: 2, marginTop: 5, fontSize: 11, fontWeight: '700' }}>{categoryLabel(item.type)}</Text>
          </View>

          <Text style={{ color: Theme.colors.ink, fontSize: 16, fontWeight: '800' }}>
            {displayCurrency}{price.toFixed(2)}
          </Text>
        </View>
      </Pressable>
    </View>
  );
}
