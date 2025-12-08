import React, { useState, useEffect } from 'react';
import { View } from 'react-native';
import SensorDisplay from '../components/SensorDisplay';
import ControlPanel from '../components/ControlPanel';
import { fetchSensorData } from '../services/api';

const HomeScreen = () => {
  const [data, setData] = useState(null);

  useEffect(() => {
    const loadData = async () => {
      const sensorData = await fetchSensorData();
      setData(sensorData);
    };
    loadData();
    const interval = setInterval(loadData, 10000);  // Refresh every 10s
    return () => clearInterval(interval);
  }, []);

  return (
    <View style={{ flex: 1 }}>
      <SensorDisplay data={data} />
      <ControlPanel />
    </View>
  );
};

export default HomeScreen;