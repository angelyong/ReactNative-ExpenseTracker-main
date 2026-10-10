import { View, Text, Pressable } from 'react-native';
import { Theme } from '../../constants/theme';

export default function Button({ children, style, classes, onPress }) {
  return (
    <View
      className={`rounded-3xl ${classes}`}
      style={[{ elevation: 4, borderWidth: 3, borderColor: Theme.colors.ink }, style]}
    >
      <Pressable
        className="px-3 py-2"
        android_ripple={{ color: '#ccc', borderless: true }}
        onPress={onPress}
      >
        <View className="justify-center items-center">
          <Text style={{ color: Theme.colors.ink, fontSize: 16, textAlign: 'center', fontWeight: '800' }}>
            {children}
          </Text>
        </View>
      </Pressable>
    </View>
  );
}
