const axios = require('axios');
require('dotenv').config();

const getWeather = async (lat, lon) => {  // User provides location in app
  try {
    const response = await axios.get(`https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${process.env.WEATHER_API_KEY}&units=metric`);
    return {
      temp: response.data.main.temp,
      humidity: response.data.main.humidity,
      rain: response.data.weather[0].main === 'Rain' ? 'Yes' : 'No',
      description: response.data.weather[0].description
    };
  } catch (err) {
    console.error('Weather API error:', err);
    return null;
  }
};

module.exports = { getWeather };