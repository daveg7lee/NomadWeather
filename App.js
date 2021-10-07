import * as Location from 'expo-location';
import React, { useEffect, useState } from 'react';
import { View, StyleSheet, Text, ScrollView, Dimensions } from 'react-native';

const { width } = Dimensions.get('window');

export default function App() {
  const [city, setCity] = useState('Loading');
  const [location, setLocation] = useState();
  const [ok, setOk] = useState(true);
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
    setLocation({ longitude, latitude });
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

  useEffect(() => {
    ask();
    if (ok) {
      getLocation();
    }
  }, []);
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
            <View style={styles.day}>
              <Text style={styles.temp}>27</Text>
              <Text style={styles.description}>Sunny</Text>
            </View>
            <View style={styles.day}>
              <Text style={styles.temp}>27</Text>
              <Text style={styles.description}>Sunny</Text>
            </View>
            <View style={styles.day}>
              <Text style={styles.temp}>27</Text>
              <Text style={styles.description}>Sunny</Text>
            </View>
            <View style={styles.day}>
              <Text style={styles.temp}>27</Text>
              <Text style={styles.description}>Sunny</Text>
            </View>
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
});
