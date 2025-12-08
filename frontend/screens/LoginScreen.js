import React, { useState } from 'react';
import { View, Text, StyleSheet, Alert } from 'react-native';
import { TextInput, Button, Provider as PaperProvider } from 'react-native-paper';
import { LinearGradient } from 'expo-linear-gradient';
import { login, register } from '../services/api';
import AsyncStorage from '@react-native-async-storage/async-storage'; // Updated import
import { MaterialCommunityIcons } from '@expo/vector-icons';

const LoginScreen = ({ navigation }) => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [isLogin, setIsLogin] = useState(true);

  const handleSubmit = async () => {
    if (!username || !password) {
      Alert.alert('Error', 'Please fill all fields');
      return;
    }

    try {
      const action = isLogin ? login : register;
      const response = await action(username, password);
      if (response.success) {
        if (isLogin) {
          await AsyncStorage.setItem('token', response.token); // Using default export
          navigation.reset({
            index: 0,
            routes: [{ name: 'Dashboard' }],
          });
        } else {
          Alert.alert('Success', 'Registered! Please log in.');
          setIsLogin(true);
        }
      }
    } catch (err) {
      console.error('Auth Error:', err.message, err.response?.data); // Enhanced logging
      Alert.alert('Error', err.response?.data?.error || `Authentication failed: ${err.message}`);
    }
  };

  return (
    <PaperProvider>
      <LinearGradient colors={['#4CAF50', '#81C784']} style={styles.container}>
        <View style={styles.logoContainer}>
          <MaterialCommunityIcons name="sprout" size={80} color="#FFF" />
          <Text style={styles.title}>Smart Irrigation</Text>
        </View>
        <TextInput
          label="Username"
          value={username}
          onChangeText={setUsername}
          style={styles.input}
          mode="outlined"
          left={<TextInput.Icon icon="account" />}
          theme={{ colors: { primary: '#4CAF50' } }}
        />
        <TextInput
          label="Password"
          value={password}
          onChangeText={setPassword}
          secureTextEntry
          style={styles.input}
          mode="outlined"
          left={<TextInput.Icon icon="lock" />}
          theme={{ colors: { primary: '#4CAF50' } }}
        />
        <Button mode="contained" onPress={handleSubmit} style={styles.button} icon={isLogin ? 'login' : 'account-plus'}>
          {isLogin ? 'Login' : 'Register'}
        </Button>
        <Button
          mode="text"
          onPress={() => setIsLogin(!isLogin)}
          style={styles.switchButton}
          labelStyle={styles.switchButtonText}
        >
          {isLogin ? 'Need an account? Register' : 'Have an account? Login'}
        </Button>
      </LinearGradient>
    </PaperProvider>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: 'center', padding: 20 },
  logoContainer: { alignItems: 'center', marginBottom: 30 },
  title: { fontSize: 28, fontWeight: 'bold', color: '#FFF', marginTop: 10 },
  input: { marginBottom: 15, backgroundColor: '#FFF' },
  button: { marginTop: 10, backgroundColor: '#388E3C', paddingVertical: 5 },
  switchButton: { marginTop: 10 },
  switchButtonText: { color: '#FFF', fontSize: 16 }
});

export default LoginScreen;