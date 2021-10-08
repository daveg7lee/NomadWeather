import * as Location from 'expo-location';
import React, { useEffect, useState } from 'react';
import {
  View,
  StyleSheet,
  Text,
  ScrollView,
  Dimensions,
  ActivityIndicator,
} from 'react-native';

const { width } = Dimensions.get('window');

const API_KEY = 'c38a798c60de0a8957230c8ba2ad1101';

export default function App() {
  const [city, setCity] = useState('Loading');
  const [days, setDays] = useState([]);
  const [ok, setOk] = useState(true);

  useEffect(() => {
    ask();
    if (ok) {
      getLocation();
    }
  }, []);

  const ask = async () => {
    const { granted } = await Location.requestForegroundPermissionsAsync();
    if (!granted) {
      setOk(false);
    }
  };

  const getLocation = async () => {
    const {
      coords: { latitude, longitude },
    } = await Location.getCurrentPositionAsync({ accuracy: 6 });
    getWeather(latitude, longitude);
    getCityName(latitude, longitude);
  };

  const getCityName = async (latitude, longitude) => {
    const location = await Location.reverseGeocodeAsync(
      {
        latitude,
        longitude,
      },
      { useGoogleMaps: false }
    );
    setCity(location[0].city);
  };

  const getWeather = async (lat, lon) => {
    const url = `https://api.openweathermap.org/data/2.5/onecall?lat=${lat}&lon=${lon}&exclude=alerts&appid=${API_KEY}&units=metric`;
    const res = await fetch(url);
    const json = await res.json();
    setDays(json.daily);
  };

  return (
    <View style={styles.container}>
      {ok ? (
        <>
          <View style={styles.city}>
            <Text style={styles.cityName}>{city}</Text>
          </View>
          <ScrollView
            contentContainerStyle={styles.weather}
            horizontal
            pagingEnabled
            showsHorizontalScrollIndicator={false}
          >
            {days.length === 0 ? (
              <View style={styles.day}>
                <ActivityIndicator
                  color="white"
                  size="large"
                  style={{ marginTop: 10 }}
                />
              </View>
            ) : (
              days.map((day, index) => (
                <View style={styles.day} key={index}>
                  <Text style={styles.temp}>
                    {parseFloat(day.temp.day).toFixed(1)}
                  </Text>
                  <Text style={styles.description}>{day.weather[0].main}</Text>
                  <Text style={styles.tinyText}>
                    {day.weather[0].description}
                  </Text>
                </View>
              ))
            )}
          </ScrollView>
        </>
      ) : (
        <View>
          <Text>We need permission...</Text>
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'tomato',
  },
  city: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  cityName: {
    fontSize: 48,
    fontWeight: '500',
  },
  weather: {},
  day: {
    width,
    alignItems: 'center',
  },
  temp: {
    marginTop: 50,
    fontSize: 158,
  },
  description: {
    marginTop: -20,
    fontSize: 48,
  },
  tinyText: {
    fontSize: 20,
  },
});
