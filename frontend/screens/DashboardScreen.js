import React, { useState, useEffect } from 'react';
import { View, ScrollView, StyleSheet } from 'react-native';
import { Appbar, Button, Provider as PaperProvider } from 'react-native-paper';
import { LinearGradient } from 'expo-linear-gradient';
import SensorCard from '../components/SensorCard';
import WeatherCard from '../components/WeatherCard';
import { fetchSensorData } from '../services/api';

const DashboardScreen = ({ navigation }) => {
  const [data, setData] = useState(null);

  useEffect(() => {
    const loadData = async () => {
      try {
        const sensorData = await fetchSensorData();
        setData(sensorData);
      } catch (err) {
        console.error('Error fetching sensor data:', err);
      }
    };
    loadData();
    const interval = setInterval(loadData, 10000);
    return () => clearInterval(interval);
  }, []);

  return (
    <PaperProvider>
      <LinearGradient colors={['#2196F3', '#81C784']} style={styles.container}>
        <Appbar.Header style={styles.appbar}>
          <Appbar.Content title="Irrigation Dashboard" titleStyle={styles.appbarTitle} />
        </Appbar.Header>
        <ScrollView>
          <WeatherCard weather={data?.weather} />
          <SensorCard
            title="Temperature"
            value={data?.temperature ? `${data.temperature}°C` : 'N/A'}
            icon="thermometer"
            color="#FF5722"
          />
          <SensorCard
            title="Humidity"
            value={data?.humidity ? `${data.humidity}%` : 'N/A'}
            icon="water-percent"
            color="#2196F3"
          />
          <SensorCard
            title="Soil Moisture"
            value={data?.soilMoisture || 0}
            icon="sprout"
            color="#4CAF50"
            isProgress
            max={1023}
          />
          <SensorCard
            title="Rain Level"
            value={data?.rainLevel ? `${data.rainLevel}` : 'N/A'}
            icon="weather-rainy"
            color="#607D8B"
          />
        </ScrollView>
      </LinearGradient>
    </PaperProvider>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1 },
  appbar: { backgroundColor: '#388E3C' },
  appbarTitle: { color: '#FFF', fontWeight: 'bold' },
  button: { margin: 20, backgroundColor: '#4CAF50', paddingVertical: 5 }
});

export default DashboardScreen;