import { View, Text, TextInput } from 'react-native';
import { Theme } from '../../constants/theme';

export default function Input({ label, textInputConfig }) {
  return (
    <View style={{ marginBottom: 16 }}>
      <Text style={{ color: Theme.colors.ink, fontSize: 13, fontWeight: '800', marginBottom: 7 }}>{label}</Text>
      <TextInput
        {...textInputConfig}
        placeholderTextColor={Theme.colors.muted}
        style={{ minHeight: 52, borderRadius: 15, borderWidth: 2, borderColor: Theme.colors.ink, backgroundColor: Theme.colors.paper, paddingHorizontal: 14, color: Theme.colors.ink, fontSize: 15 }}
      />
    </View>
  );
}
