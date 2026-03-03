const express = require('express');
const router = express.Router();
const SensorData = require('../models/SensorData');
const authMiddleware = require('../middleware/auth');

router.get('/latest', authMiddleware, async (req, res) => {
  try {
    const latest = await SensorData.findOne().sort({ createdAt: -1 });

    if (!latest) {
      return res.json({
        temperature: 0,
        moisture: 0,
        humidity: 0
      });
    }

    res.json(latest);
  } catch (error) {
    console.error("Sensor fetch error:", error);
    res.status(500).json({ message: "Server error" });
  }
});

module.exports = router;
