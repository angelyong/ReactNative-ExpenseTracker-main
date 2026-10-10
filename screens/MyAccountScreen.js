import React, { useEffect, useState } from 'react';
import {
    View,
    Text,
    TextInput,
    StyleSheet,
    TouchableOpacity,
    SafeAreaView,
    Alert,
    Image,
    KeyboardAvoidingView,
    Platform,
} from 'react-native';
import Ionicons from '@expo/vector-icons/Ionicons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import * as ImagePicker from 'expo-image-picker';
import { Theme } from '../constants/theme';

export default function MyAccountScreen({ navigation }) {
    const [username, setUsername] = useState('');
    const [phoneNumber, setPhoneNumber] = useState('');
    const [email, setEmail] = useState('');
    const [image, setImage] = useState(null);

    useEffect(() => {
        async function loadUserData() {
            const data = await AsyncStorage.getItem('userData');
            const savedImage = await AsyncStorage.getItem('profileImage');

            if (data) {
                const user = JSON.parse(data);
                setUsername(user.name || '');
                setPhoneNumber(user.phoneNumber || '');
                setEmail(user.email || '');
            }

            if (savedImage) {
                setImage(savedImage);
            }
        }

        loadUserData();
    }, []);

    async function pickImage() {
        const result = await ImagePicker.launchImageLibraryAsync({
            mediaTypes: ImagePicker.MediaTypeOptions.Images,
            allowsEditing: true,
            aspect: [1, 1],
            quality: 0.5,
        });

        if (!result.canceled) {
            const uri = result.assets[0].uri;
            setImage(uri);
            await AsyncStorage.setItem('profileImage', uri);
        }
    }

    async function saveUserData() {
        const userData = {
            name: username,
            phoneNumber,
            email,
        };

        await AsyncStorage.setItem('userData', JSON.stringify(userData));

        if (image) {
            await AsyncStorage.setItem('profileImage', image);
        }

        Alert.alert('Saved', 'Your account information has been updated.');
        navigation.goBack();
    }

    return (
        <SafeAreaView style={styles.screen}>
            <KeyboardAvoidingView
                style={styles.keyboardView}
                behavior={Platform.OS === 'ios' ? 'padding' : undefined}
            >
                <View style={styles.container}>
                    <View style={styles.profileCard}>
                        <TouchableOpacity style={styles.avatarOuter} onPress={pickImage}>
                            {image ? (
                                <Image source={{ uri: image }} style={styles.avatar} />
                            ) : (
                                <Ionicons name="person" size={42} color={Theme.colors.ink} />
                            )}

                            <View style={styles.cameraButton}>
                                <Ionicons name="camera" size={15} color={Theme.colors.ink} />
                            </View>
                        </TouchableOpacity>

                        <Text style={styles.profileTitle}>Edit Profile</Text>
                        <Text style={styles.profileSubtitle}>
                            Tap the photo to change your profile picture
                        </Text>
                    </View>

                    <View style={styles.formCard}>
                        <View style={styles.inputGroup}>
                            <Text style={styles.label}>Username</Text>
                            <View style={styles.inputBox}>
                                <Ionicons name="person-outline" size={18} color={Theme.colors.ink} />
                                <TextInput
                                    style={styles.input}
                                    placeholder="Enter username"
                                    placeholderTextColor="#9aa7b8"
                                    value={username}
                                    onChangeText={setUsername}
                                />
                            </View>
                        </View>

                        <View style={styles.inputGroup}>
                            <Text style={styles.label}>Phone Number</Text>
                            <View style={styles.inputBox}>
                                <Ionicons name="call-outline" size={18} color={Theme.colors.ink} />
                                <TextInput
                                    style={styles.input}
                                    placeholder="Enter phone number"
                                    placeholderTextColor="#9aa7b8"
                                    value={phoneNumber}
                                    onChangeText={setPhoneNumber}
                                    keyboardType="phone-pad"
                                />
                            </View>
                        </View>

                        <View style={styles.inputGroup}>
                            <Text style={styles.label}>Email</Text>
                            <View style={styles.inputBox}>
                                <Ionicons name="mail-outline" size={18} color={Theme.colors.ink} />
                                <TextInput
                                    style={styles.input}
                                    placeholder="Enter email"
                                    placeholderTextColor="#9aa7b8"
                                    value={email}
                                    onChangeText={setEmail}
                                    keyboardType="email-address"
                                    autoCapitalize="none"
                                />
                            </View>
                        </View>
                    </View>

                    <View style={styles.footer}>
                        <TouchableOpacity style={styles.saveButton} onPress={saveUserData}>
                            <Text style={styles.saveButtonText}>Save Changes</Text>
                        </TouchableOpacity>
                    </View>
                </View>
            </KeyboardAvoidingView>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    screen: {
        flex: 1,
        backgroundColor: Theme.colors.paper,
    },
    keyboardView: {
        flex: 1,
    },
    container: {
        flex: 1,
        paddingHorizontal: 18,
        paddingTop: 18,
        backgroundColor: Theme.colors.paper,
    },
    profileCard: {
        alignItems: 'center',
        paddingVertical: 24,
        borderRadius: 24,
        backgroundColor: Theme.colors.blue,
        borderWidth: 3,
        borderColor: Theme.colors.ink,
        marginBottom: 18,
    },
    avatarOuter: {
        width: 104,
        height: 104,
        borderRadius: 52,
        borderWidth: 4,
        borderColor: Theme.colors.ink,
        backgroundColor: Theme.colors.white,
        justifyContent: 'center',
        alignItems: 'center',
        marginBottom: 12,
    },
    avatar: {
        width: 92,
        height: 92,
        borderRadius: 46,
    },
    cameraButton: {
        position: 'absolute',
        right: -2,
        bottom: 4,
        width: 30,
        height: 30,
        borderRadius: 15,
        backgroundColor: Theme.colors.yellow,
        justifyContent: 'center',
        alignItems: 'center',
        borderWidth: 2,
        borderColor: Theme.colors.ink,
    },
    profileTitle: {
        fontSize: 22,
        fontWeight: '700',
        color: Theme.colors.ink,
    },
    profileSubtitle: {
        fontSize: 13,
        color: Theme.colors.muted,
        marginTop: 6,
    },
    formCard: {
        borderRadius: 24,
        backgroundColor: Theme.colors.white,
        borderWidth: 3,
        borderColor: Theme.colors.ink,
        padding: 16,
        shadowColor: '#000000',
        shadowOffset: {
            width: 0,
            height: 4,
        },
        shadowOpacity: 0.06,
        shadowRadius: 10,
        elevation: 3,
    },
    inputGroup: {
        marginBottom: 16,
    },
    label: {
        fontSize: 13,
        fontWeight: '700',
        color: Theme.colors.ink,
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
        flexDirection: 'row',
        alignItems: 'center',
    },
    input: {
        flex: 1,
        fontSize: 14,
        color: Theme.colors.ink,
        marginLeft: 10,
    },
    footer: {
        marginTop: 'auto',
        paddingBottom: 22,
    },
    saveButton: {
        height: 52,
        borderRadius: 16,
        backgroundColor: Theme.colors.green,
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
    saveButtonText: {
        color: Theme.colors.ink,
        fontSize: 15,
        fontWeight: '700',
    },
});
