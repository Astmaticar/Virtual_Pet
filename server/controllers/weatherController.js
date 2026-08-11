const axios = require('axios');

exports.getWeather = async (req, res) => {
  try {
    const city = req.query.city || 'Zagreb';
    const apiKey = process.env.WEATHER_API_KEY;

    if (!apiKey) {
      return res.status(500).json({ message: 'WEATHER_API_KEY is not configured' });
    }

    const response = await axios.get('https://api.openweathermap.org/data/2.5/weather', {
      params: {
        q: city,
        appid: apiKey,
        units: 'metric',
      },
    });

    const weatherData = response.data;

    const condition = weatherData.weather?.[0]?.main;
    const dt = weatherData.dt;
    const sunrise = weatherData.sys?.sunrise;
    const sunset = weatherData.sys?.sunset;

    const isDay = typeof dt === 'number' && typeof sunrise === 'number' && typeof sunset === 'number'
      ? dt >= sunrise && dt <= sunset
      : false;

    res.status(200).json({
      city: weatherData.name,
      temperature: weatherData.main?.temp,
      description: weatherData.weather?.[0]?.description,
      condition,
      isDay,
    });
  } catch (error) {
    console.error('Weather API error:', error.message);
    res.status(500).json({ message: 'Failed to fetch weather data' });
  }
};
