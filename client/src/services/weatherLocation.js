export const getWeatherLocation = () => new Promise((resolve) => {
  const requestedCity = new URLSearchParams(window.location.search).get('city');

  if (requestedCity) {
    resolve({ city: requestedCity });
    return;
  }

  if (!navigator.geolocation) {
    resolve(null);
    return;
  }

  navigator.geolocation.getCurrentPosition(
    ({ coords }) => resolve({ lat: coords.latitude, lon: coords.longitude }),
    () => resolve(null),
    { enableHighAccuracy: false, timeout: 10000, maximumAge: 0 },
  );
});