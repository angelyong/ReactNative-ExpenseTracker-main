import React, { useCallback, useState } from 'react';
import {
    View,
    Text,
    StyleSheet,
    Image,
    TouchableOpacity,
    SafeAreaView,
    ScrollView,
} from 'react-native';
import Ionicons from '@expo/vector-icons/Ionicons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useFocusEffect } from '@react-navigation/native';
import { Theme } from '../constants/theme';

export default function MyProfileScreen({ navigation }) {
    const [name, setName] = useState('User Name');
    const [image, setImage] = useState(null);

    useFocusEffect(
        useCallback(() => {
            async function loadUser() {
                const data = await AsyncStorage.getItem('userData');
                const savedImage = await AsyncStorage.getItem('profileImage');

                if (data) {
                    const parsed = JSON.parse(data);
                    setName(parsed.name || 'User Name');
                } else {
                    setName('User Name');
                }

                if (savedImage) {
                    setImage(savedImage);
                } else {
                    setImage(null);
                }
            }

            loadUser();
        }, [])
    );

    return (
        <SafeAreaView style={styles.screen}>
            <ScrollView
                style={styles.scrollView}
                contentContainerStyle={styles.scrollContent}
                showsVerticalScrollIndicator={false}
            >
                <View style={styles.avatarSection}>
                    <View style={styles.avatarOuter}>
                        {image ? (
                            <Image source={{ uri: image }} style={styles.avatar} />
                        ) : (
                            <Ionicons name="person" size={50} color="#999" />
                        )}
                    </View>
                </View>

                <Text style={styles.name}>{name}</Text>

                <View style={styles.menuList}>
                    <TouchableOpacity
                        style={styles.menuCard}
                        onPress={() => navigation.navigate('MyAccount')}
                    >
                        <View style={styles.menuIconCircle}>
                            <Ionicons name="person" size={14} color={Theme.colors.ink} />
                        </View>

                        <View style={styles.menuTextBox}>
                            <Text style={styles.menuText}>My Account</Text>
                            <Text style={styles.menuSubText}>Edit profile information</Text>
                        </View>
                    </TouchableOpacity>

                    <TouchableOpacity
                        style={styles.menuCard}
                        onPress={() => navigation.navigate('CurrencySetting')}
                    >
                        <View style={styles.menuIconCircle}>
                            <Ionicons name="cash-outline" size={14} color={Theme.colors.ink} />
                        </View>

                        <View style={styles.menuTextBox}>
                            <Text style={styles.menuText}>Currency Setting</Text>
                            <Text style={styles.menuSubText}>Change expense currency symbol</Text>
                        </View>
                    </TouchableOpacity>

                    <TouchableOpacity
                        style={styles.menuCard}
                        onPress={() => navigation.navigate('SetBudget')}
                    >
                        <View style={styles.menuIconCircle}>
                            <Ionicons name="wallet-outline" size={14} color={Theme.colors.ink} />
                        </View>

                        <View style={styles.menuTextBox}>
                            <Text style={styles.menuText}>Set Budget</Text>
                            <Text style={styles.menuSubText}>Set your monthly spending limit</Text>
                        </View>
                    </TouchableOpacity>

                    <TouchableOpacity
                        style={styles.menuCard}
                        onPress={() => navigation.navigate('Notifications')}
                    >
                        <View style={styles.menuIconCircle}>
                            <Ionicons name="notifications-outline" size={14} color={Theme.colors.ink} />
                        </View>

                        <View style={styles.menuTextBox}>
                            <Text style={styles.menuText}>Notifications</Text>
                            <Text style={styles.menuSubText}>View budget alert notifications</Text>
                        </View>
                    </TouchableOpacity>

                    <TouchableOpacity
                        style={styles.menuCard}
                        onPress={() => navigation.navigate('HelpCenter')}
                    >
                        <View style={styles.menuIconCircle}>
                            <Ionicons name="help-circle" size={14} color={Theme.colors.ink} />
                        </View>

                        <View style={styles.menuTextBox}>
                            <Text style={styles.menuText}>Help Center</Text>
                            <Text style={styles.menuSubText}>Get help and support</Text>
                        </View>
                    </TouchableOpacity>
                </View>
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
    scrollContent: {
        paddingHorizontal: 24,
        paddingTop: 70,
        paddingBottom: 120,
        backgroundColor: Theme.colors.paper,
    },
    avatarSection: {
        alignItems: 'center',
        justifyContent: 'center',
        marginBottom: 12,
    },
    avatarOuter: {
        width: 120,
        height: 120,
        borderRadius: 60,
        borderWidth: 4,
        borderColor: Theme.colors.ink,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: Theme.colors.blue,
    },
    avatar: {
        width: 106,
        height: 106,
        borderRadius: 53,
    },
    name: {
        textAlign: 'center',
        fontSize: 22,
        fontWeight: '700',
        color: Theme.colors.ink,
        marginBottom: 28,
    },
    menuList: {
        gap: 16,
    },
    menuCard: {
        minHeight: 76,
        borderRadius: 18,
        backgroundColor: Theme.colors.white,
        borderWidth: 3,
        borderColor: Theme.colors.ink,
        flexDirection: 'row',
        alignItems: 'center',
        paddingHorizontal: 18,
    },
    menuIconCircle: {
        width: 32,
        height: 32,
        borderRadius: 16,
        backgroundColor: Theme.colors.green,
        justifyContent: 'center',
        alignItems: 'center',
        marginRight: 14,
    },
    menuTextBox: {
        flex: 1,
    },
    menuText: {
        fontSize: 15,
        fontWeight: '700',
        color: Theme.colors.ink,
    },
    menuSubText: {
        fontSize: 12,
        color: Theme.colors.muted,
        marginTop: 3,
    },
});
