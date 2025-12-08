import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Card } from 'react-native-paper';
import * as Progress from 'react-native-progress';
import { MaterialCommunityIcons } from '@expo/vector-icons';

const SensorCard = ({ title, value, icon, color, isProgress = false, max = 100 }) => {
  const normalizedValue = isProgress ? Math.min(value / max, 1) : value; // Prevent >100%

  return (
    <Card style={styles.card}>
      <Card.Content>
        <View style={styles.header}>
          <MaterialCommunityIcons name={icon} size={24} color={color} />
          <Text style={styles.title}>{title}</Text>
        </View>
        {isProgress ? (
          <View style={styles.progressContainer}>
            <Progress.Circle
              size={80}
              progress={normalizedValue}
              color={color}
              showsText
              textStyle={styles.progressText}
              formatText={() => `${Math.round(normalizedValue * 100)}%`}
            />
          </View>
        ) : (
          <Text style={[styles.value, { color }]}>{value}</Text>
        )}
      </Card.Content>
    </Card>
  );
};

const styles = StyleSheet.create({
  card: { margin: 10, borderRadius: 10, elevation: 4, backgroundColor: '#FFFFFF' },
  header: { flexDirection: 'row', alignItems: 'center', marginBottom: 10 },
  title: { fontSize: 16, fontWeight: 'bold', marginLeft: 10, color: '#333' },
  value: { fontSize: 24, fontWeight: 'bold', textAlign: 'center', color: '#333' },
  progressContainer: { alignItems: 'center', marginTop: 10 },
  progressText: { fontSize: 14, color: '#333' }
});

export default SensorCard;