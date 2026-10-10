import { View, Text, Pressable } from 'react-native';
import { getFormattedDate } from '../../utils/date';
import { DateTimePickerAndroid } from '@react-native-community/datetimepicker';
import { Theme } from '../../constants/theme';

export default function DateInput({ onChange, date }) {
  function showDatePicker() {
    DateTimePickerAndroid.open({
      value: date,
      mode: 'date',
      onChange: (_, selectedDate) => onChange(selectedDate),
    });
  }

  return (
    <View>
      <Text style={{ color: Theme.colors.ink, fontSize: 13, fontWeight: '800', marginBottom: 7 }}>Date</Text>
      <View style={{ minHeight: 52, borderRadius: 15, borderWidth: 2, borderColor: Theme.colors.ink, backgroundColor: Theme.colors.paper, justifyContent: 'center' }}>
        <Pressable
          className="p-3"
          android_ripple={{ color: '#ccc', borderless: true }}
          onPress={showDatePicker}
        >
          <Text style={{ color: Theme.colors.ink, fontSize: 15 }}>{getFormattedDate(date)}</Text>
        </Pressable>
      </View>
    </View>
  );
}
