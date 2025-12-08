const express = require('express');
const SensorData = require('../models/SensorData');
const { getWeather } = require('../utils/weather');
const authenticate = require('../middleware/auth');
const router = express.Router();

// POST: Arduino sends sensor data (no auth for Arduino simplicity)
router.post('/data', async (req, res) => {
  try {
    const { temperature, humidity, soilMoisture, rainLevel } = req.body;
    const newData = new SensorData({ temperature, humidity, soilMoisture, rainLevel });
    await newData.save();
    
    const weather = await getWeather(37.7749, -122.4194); // Replace with dynamic lat/lon
    res.json({ success: true, data: { ...req.body, weather } });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// GET: App fetches latest data (protected)
router.get('/latest', authenticate, async (req, res) => {
  try {
    const latest = await SensorData.findOne().sort({ timestamp: -1 });
    const weather = await getWeather(37.7749, -122.4194);
    res.json({ ...latest.toObject(), weather });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;