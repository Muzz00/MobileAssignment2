import React, { Component } from 'react';
import { StyleSheet, View, Button, Text } from 'react-native';
// import MapView from 'react-native-maps'
import MapView, { Marker, Callout } from 'react-native-maps'
import * as Location from 'expo-location';
import { Directions } from 'react-native-gesture-handler';



export default class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      latitude: -32.88083800623871,
      longitude: 172.70746492207425,
      result: '',
    }
  }

  componentDidMount() {
    this.updateLocation();
  }




  updateLocation = () => {
    this.setState({
      latitude: -36.88083800623871,
      longitude: 174.70746492207425,
    })
  }

  getLocation = async () => {

    let { status } = await Location.requestForegroundPermissionsAsync();
    if (status !== 'granted') {
      setErrorMsg('Permission to access location was denied');
      return;
    }

    let location = await Location.getCurrentPositionAsync({});
    console.log(location)
    console.log(location.coords.longitude)
    this.setState({ latitude: location.coords.latitude, longitude: location.coords.longitude })
  }

  getWeather = async () => {
    // try {
    //   console.log('fetching')
    let result = await fetch(
      'https://api.openweathermap.org/data/2.5/weather?lat=' + this.state.latitude + '&lon=' + this.state.longitude + '&appid=d9b7491733da14e804ae98f8a6cfdf7b&units=metric'
    ).then((response) => response.json()).catch(error => {
      console.log('found error', error)
    })
    // console.log(result.coord.lon + "this");
    this.setState({ result: result })
  }


  darkMode = () =>{
    if (mapStyle.length == 0){
      mapStyle = mapBlack;
    }else{
      mapStyle = []
    }
    this.forceUpdate();
  }

  render() {
    // Location
    let latitude = 33.7872131;
    let longitude = -84.381931;

    // If the lat or long has changed update it 
    if (this.state.latitude != 0) {
      latitude = this.state.latitude;
      longitude = this.state.longitude;
    }

    // Weather
    let weather = {};
    let result = this.state.result;
    if (result != "") { // Check if there state is updated
      console.log(result.coord.lon);
      weather = result.weather[0];
      console.log(result.name);
    }



    return (
      <>
        <MapView
          customMapStyle={mapStyle}
          style={{ ...StyleSheet.absoluteFillObject,...styles.mapView }}
          initialRegion={{
            // latitude: 33.7872131,
            // longitude: -84.381931,
            latitude: latitude,
            longitude: longitude,
            latitudeDelta: .005,
            longitudeDelta: .005
          }} region={{
            latitude: latitude,
            longitude: longitude,
            latitudeDelta: .005,
            longitudeDelta: .005
          }} >

          <Marker
            // coordinate={{ latitude: 33.7872131, longitude: -84.381931 }}
            coordinate={{ latitude: latitude, longitude: longitude }}
            title='Flatiron School Atlanta'
            description='This is where the magic happens!'
          ></Marker>

        </MapView>
        <View style={styles.container}>
          <Text style={styles.txt}>{latitude} -- {longitude}</Text>
          <View style={styles.getLocButton}>
            <Button onPress={this.getLocation} title="Get My Location" />
          </View>
          <View style={styles.getLocButton}>
            <Button onPress={this.getWeather} title="Get Weather" />
          </View>
          <View style={styles.getLocButton}>
            <Button onPress={this.darkMode} title="Dark Mode" />
          </View>
          {this.state.result ? (
            <View style={styles.weatherContainer}>
              <Text style={{...styles.white, ...styles.wDescription}}>{result.name}</Text>
              <Text style={{...styles.white, ...styles.wDescription}}>{weather.description}</Text>
              <Text style={{...styles.white, ...styles.wDescription, ...styles.celcius}}>{result.main.temp}°C</Text>
            </View>
          ) : (
            <View style={styles.weatherContainer}>

            </View>
          )}
        </View>
      </>
    );
  }
}

const styles = StyleSheet.create({
  mapView: {backgroundColor: 'black'},
  container: {
    marginTop: 700,
    backgroundColor: "white",
    padding: 10,
    height: 190,
    borderRadius: 10,
  },
  txt: {
    backgroundColor: "#dedede",
    width: "96%",
    marginLeft: "2%"
  },
  getLocButton: {
    backgroundColor: "black",
    width: "40%",
    marginLeft: "2%",
    marginTop: "2%",
    borderRadius: 5,
  },
  weatherContainer: {
    backgroundColor: "#333",
    height: 140,
    borderRadius: 5,
    width: "50%",
    position: 'absolute',
    top: 40,
    left: "50%",
    paddingTop: 15,
  },
  white: {
    color: "white",
  },
  wDescription:{
    textAlign: 'center',
    margin: 2,
  },
  celcius:{
    fontSize:40,
  }
})

let mapStyle = []

let mapBlack = [
  {
    "elementType": "geometry",
    "stylers": [
      {
        "color": "#1d2c4d"
      }
    ]
  },
  {
    "elementType": "labels.text.fill",
    "stylers": [
      {
        "color": "#8ec3b9"
      }
    ]
  },
  {
    "elementType": "labels.text.stroke",
    "stylers": [
      {
        "color": "#1a3646"
      }
    ]
  },
  {
    "featureType": "administrative.country",
    "elementType": "geometry.stroke",
    "stylers": [
      {
        "color": "#4b6878"
      }
    ]
  },
  {
    "featureType": "administrative.land_parcel",
    "elementType": "labels.text.fill",
    "stylers": [
      {
        "color": "#64779e"
      }
    ]
  },
  {
    "featureType": "administrative.province",
    "elementType": "geometry.stroke",
    "stylers": [
      {
        "color": "#4b6878"
      }
    ]
  },
  {
    "featureType": "landscape.man_made",
    "elementType": "geometry.stroke",
    "stylers": [
      {
        "color": "#334e87"
      }
    ]
  },
  {
    "featureType": "landscape.natural",
    "elementType": "geometry",
    "stylers": [
      {
        "color": "#023e58"
      }
    ]
  },
  {
    "featureType": "poi",
    "elementType": "geometry",
    "stylers": [
      {
        "color": "#283d6a"
      }
    ]
  },
  {
    "featureType": "poi",
    "elementType": "labels.text.fill",
    "stylers": [
      {
        "color": "#6f9ba5"
      }
    ]
  },
  {
    "featureType": "poi",
    "elementType": "labels.text.stroke",
    "stylers": [
      {
        "color": "#1d2c4d"
      }
    ]
  },
  {
    "featureType": "poi.park",
    "elementType": "geometry.fill",
    "stylers": [
      {
        "color": "#023e58"
      }
    ]
  },
  {
    "featureType": "poi.park",
    "elementType": "labels.text.fill",
    "stylers": [
      {
        "color": "#3C7680"
      }
    ]
  },
  {
    "featureType": "road",
    "elementType": "geometry",
    "stylers": [
      {
        "color": "#304a7d"
      }
    ]
  },
  {
    "featureType": "road",
    "elementType": "labels.text.fill",
    "stylers": [
      {
        "color": "#98a5be"
      }
    ]
  },
  {
    "featureType": "road",
    "elementType": "labels.text.stroke",
    "stylers": [
      {
        "color": "#1d2c4d"
      }
    ]
  },
  {
    "featureType": "road.highway",
    "elementType": "geometry",
    "stylers": [
      {
        "color": "#2c6675"
      }
    ]
  },
  {
    "featureType": "road.highway",
    "elementType": "geometry.stroke",
    "stylers": [
      {
        "color": "#255763"
      }
    ]
  },
  {
    "featureType": "road.highway",
    "elementType": "labels.text.fill",
    "stylers": [
      {
        "color": "#b0d5ce"
      }
    ]
  },
  {
    "featureType": "road.highway",
    "elementType": "labels.text.stroke",
    "stylers": [
      {
        "color": "#023e58"
      }
    ]
  },
  {
    "featureType": "transit",
    "elementType": "labels.text.fill",
    "stylers": [
      {
        "color": "#98a5be"
      }
    ]
  },
  {
    "featureType": "transit",
    "elementType": "labels.text.stroke",
    "stylers": [
      {
        "color": "#1d2c4d"
      }
    ]
  },
  {
    "featureType": "transit.line",
    "elementType": "geometry.fill",
    "stylers": [
      {
        "color": "#283d6a"
      }
    ]
  },
  {
    "featureType": "transit.station",
    "elementType": "geometry",
    "stylers": [
      {
        "color": "#3a4762"
      }
    ]
  },
  {
    "featureType": "water",
    "elementType": "geometry",
    "stylers": [
      {
        "color": "#0e1626"
      }
    ]
  },
  {
    "featureType": "water",
    "elementType": "labels.text.fill",
    "stylers": [
      {
        "color": "#4e6d70"
      }
    ]
  }
]