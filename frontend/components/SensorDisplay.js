import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Card } from 'react-native-elements';

const SensorDisplay = ({ data }) => {
  if (!data) return <Text>Loading...</Text>;

  return (
    <View style={styles.container}>
      <Card title="Sensors">
        <Text>Temperature: {data.temperature}°C</Text>
        <Text>Humidity: {data.humidity}%</Text>
        <Text>Soil Moisture: {data.soilMoisture}%</Text>
        <Text>Rain Level: {data.rainLevel}</Text>
      </Card>
      <Card title="Weather">
        <Text>Temp: {data.weather?.temp}°C</Text>
        <Text>Humidity: {data.weather?.humidity}%</Text>
        <Text>Rain: {data.weather?.rain}</Text>
        <Text>{data.weather?.description}</Text>
      </Card>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, padding: 10 }
});

export default SensorDisplay;