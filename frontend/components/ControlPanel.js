import React, { useState } from 'react';
import { View, TextInput, Button, Alert, StyleSheet } from 'react-native';
import { startPump } from '../services/api';

const ControlPanel = () => {
  const [duration, setDuration] = useState('60');  // Default 1 min in seconds

  const handleStartPump = async () => {
    try {
      await startPump(parseInt(duration));
      Alert.alert('Success', `Pump started for ${duration} seconds`);
    } catch (err) {
      Alert.alert('Error', 'Failed to start pump');
    }
  };

  return (
    <View style={styles.container}>
      <TextInput
        style={styles.input}
        placeholder="Duration in seconds"
        value={duration}
        onChangeText={setDuration}
        keyboardType="numeric"
      />
      <Button title="Start Pump" onPress={handleStartPump} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: { padding: 20 },
  input: { borderWidth: 1, padding: 10, marginBottom: 10 }
});

export default ControlPanel;