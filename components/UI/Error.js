import { View, Text } from 'react-native';
import Button from './Button';
import { GlobalStyles } from '../../constants/styles';
import { Theme } from '../../constants/theme';

export default function Error({ message, onConfirm }) {
  return (
    <View className="flex-1 items-center justify-center" style={{ backgroundColor: Theme.colors.paper, padding: 20 }}>
      <Text style={{ color: Theme.colors.ink, fontSize: 18, fontWeight: '800' }}>
        Something Wrong Happened!
      </Text>
      <Text style={{ color: Theme.colors.muted, marginTop: 6 }}>{message}</Text>
      {onConfirm && (
        <Button
          onPress={onConfirm}
          classes="w-28 mt-4"
          style={{ backgroundColor: GlobalStyles.colors.secondaryButton }}
        >
          Okay
        </Button>
      )}
    </View>
  );
}
