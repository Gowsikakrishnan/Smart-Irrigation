import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Card } from 'react-native-paper';
import { MaterialCommunityIcons } from '@expo/vector-icons';

const WeatherCard = ({ weather }) => {
  if (!weather) {
    return (
      <Card style={styles.card}>
        <Card.Content>
          <Text style={styles.text}>Loading weather...</Text>
        </Card.Content>
      </Card>
    );
  }

  const getWeatherIcon = (description) => {
    if (description.includes('rain')) return 'weather-rainy';
    if (description.includes('cloud')) return 'weather-cloudy';
    return 'weather-sunny';
  };

  return (
    <Card style={styles.card}>
      <Card.Content>
        <View style={styles.header}>
          <MaterialCommunityIcons name={getWeatherIcon(weather.description)} size={40} color="#FFD700" />
          <Text style={styles.title}>Weather</Text>
        </View>
        <Text style={styles.text}>Temperature: {weather.temp}°C</Text>
        <Text style={styles.text}>Humidity: {weather.humidity}%</Text>
        <Text style={styles.text}>Rain: {weather.rain}</Text>
        <Text style={styles.description}>{weather.description}</Text>
      </Card.Content>
    </Card>
  );
};

const styles = StyleSheet.create({
  card: { margin: 10, borderRadius: 10, elevation: 4, backgroundColor: '#E0F7FA' },
  header: { flexDirection: 'row', alignItems: 'center', marginBottom: 10 },
  title: { fontSize: 20, fontWeight: 'bold', marginLeft: 10, color: '#333' },
  text: { fontSize: 16, marginBottom: 5, color: '#333' },
  description: { fontStyle: 'italic', color: '#555', fontSize: 14 }
});

export default WeatherCard;