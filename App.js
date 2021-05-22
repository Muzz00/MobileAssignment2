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
    if (result != "") {
      console.log(result.coord.lon);

      weather = result.weather[0];
      console.log(result.name);
    }



    return (
      <>
        <MapView
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
