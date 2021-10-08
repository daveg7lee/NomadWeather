import * as Location from 'expo-location';
import { StatusBar } from 'expo-status-bar';
import React, { useEffect, useState } from 'react';
import { Fontisto } from '@expo/vector-icons';
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

const icons = {
  Clouds: 'cloudy',
  Thunderstorm: 'lightnings',
  Drizzle: 'rain',
  Rain: 'rain',
  Snow: 'snow',
  Clear: 'day-sunny',
};

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
    } = await Location.getCurrentPositionAsync({ accuracy: 5 });
    getCityName(latitude, longitude);
    getWeather(latitude, longitude);
  };

  const getCityName = async (lat, lon) => {
    const location = await Location.reverseGeocodeAsync(
      {
        latitude: lat,
        longitude: lon,
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
              <View style={styles.loadingContainer}>
                <ActivityIndicator
                  color="white"
                  size="large"
                  style={{ marginTop: 10 }}
                />
              </View>
            ) : (
              days.map((day, index) => (
                <View style={styles.day} key={index}>
                  <View
                    style={{
                      flexDirection: 'row',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                      width: '100%',
                    }}
                  >
                    <Text style={styles.temp}>
                      {parseFloat(day.temp.day).toFixed(1)}
                    </Text>
                    <Fontisto
                      name={icons[day.weather[0].main]}
                      size={68}
                      color="white"
                    />
                  </View>
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
      <StatusBar style="light" />
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
    color: 'white',
  },
  weather: {},
  day: {
    width,
    alignItems: 'flex-start',
    padding: '0.5% 0%',
  },
  temp: {
    marginTop: 50,
    fontSize: 100,
    color: 'white',
  },
  description: {
    marginTop: -20,
    fontSize: 38,
    color: 'white',
  },
  tinyText: {
    fontSize: 18,
    color: 'white',
  },
  loadingContainer: {
    width,
    alignItems: 'center',
  },
});
