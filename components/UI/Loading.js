import { View, ActivityIndicator } from 'react-native';
import { Theme } from '../../constants/theme';

export default function Loading() {
  return (
    <View className="flex-1 items-center justify-center" style={{ backgroundColor: Theme.colors.paper }}>
      <ActivityIndicator size="large" color={Theme.colors.ink} />
    </View>
  );
}
