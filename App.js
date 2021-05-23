import React, { Component } from 'react';
import { StyleSheet, View, Button, Text } from 'react-native';
// import MapView from 'react-native-maps'
import MapView, { Marker, Callout } from 'react-native-maps'
import * as Location from 'expo-location';
import GestureRecognizer, { swipeDirections } from 'react-native-swipe-gestures';
import {mapRetro, mapAubergine, mapBlack} from './mapStyles'


export default class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      latitude: -36.88083800623871,
      longitude: 174.70746492207425,
      result: '',
      delta: 0.1,
      containerSwipeMargin: 680,
      // markers: [],
    }
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
    let result = await fetch(
      'https://api.openweathermap.org/data/2.5/weather?lat=' + this.state.latitude + '&lon=' + this.state.longitude + '&appid=d9b7491733da14e804ae98f8a6cfdf7b&units=metric'
    ).then((response) => response.json()).catch(error => {
      console.log('found error', error)
    })
    this.setState({ result: result })
  }


  changeTheme = () => {
    // console.log(mapStyle)
    if (mapStyle.length == 0) {
      mapStyle = mapBlack;
    } else if (mapStyle == mapBlack){
      mapStyle = mapRetro;
    }else if (mapStyle == mapRetro) {
      mapStyle = mapAubergine;
    }
    else if (mapStyle == mapAubergine){
      mapStyle = [];
    }
    this.forceUpdate();
  }

  mapPressed = (e) => {
    // this.setState({ markers: [...this.state.markers, { latlng: e.nativeEvent.coordinate }] })

    this.setState({
      latitude: e.nativeEvent.coordinate.latitude,
      longitude: e.nativeEvent.coordinate.longitude,
    })
  }

  changeZoom = (value) => {
    let delta = 0;
    if (value == "increase") {
      delta = this.state.delta + 0.05;
    }
    else {
      delta = this.state.delta - 0.05;
    }
    this.setState({
      delta: delta,
    })
  }


  onSwipeUp(gestureState) {
    console.log('You swiped up!');
    this.setState({ containerSwipeMargin: 680 })
  }

  onSwipeDown(gestureState) {
    console.log('You swiped down!');
    this.setState({ containerSwipeMargin: 860 })
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
          style={{ ...StyleSheet.absoluteFillObject, ...styles.mapView }}
          onPress={(e) => this.mapPressed(e)}
          initialRegion={{
            latitude: latitude,
            longitude: longitude,
            latitudeDelta: .005,
            longitudeDelta: .005
          }} region={{
            latitude: latitude,
            longitude: longitude,
            latitudeDelta: this.state.delta,
            longitudeDelta: this.state.delta
          }} >

          <Marker
            coordinate={{ latitude: latitude, longitude: longitude }}
            title='Flatiron School Atlanta'
            description='This is where the magic happens!'
          ></Marker>
          {/* {
            this.state.markers.map((marker, i) => (
              <MapView.Marker key={i} coordinate={marker.latlng} />
            ))
          } */}

        </MapView>
        <View style={styles.zoomWrapper}>
          <View style={styles.zoom}>
            <Button onPress={() => this.changeZoom("decrease")} title="+" />
          </View>
          <View style={styles.zoom}>
            <Button onPress={() => this.changeZoom("increase")} title="-" />
          </View>
        </View>
        <GestureRecognizer
          onSwipeUp={(state) => this.onSwipeUp(state)}
          onSwipeDown={(state) => this.onSwipeDown(state)}
          style={{
            backgroundColor: "white",
            marginTop: this.state.containerSwipeMargin,
            padding: 10,
            borderRadius: 25,
            paddingBottom: 50,
          }}
        >
          <View>
            <Text style={styles.bar}></Text>
            <View style={styles.buttonView}>
              <Button onPress={this.getLocation} title="Get My Location" />
            </View>
            <View style={styles.buttonView}>
              <Button onPress={this.getWeather} title="Get Weather" />
            </View>
            <View style={styles.buttonView}>
              <Button onPress={this.changeTheme} title="Change Theme" />
            </View>
            {this.state.result ? (
              <View style={styles.weatherContainer}>
                <Text style={{ ...styles.white, ...styles.wDescription }}>{result.name}</Text>
                <Text style={{ ...styles.white, ...styles.wDescription }}>{weather.description}</Text>
                <Text style={{ ...styles.white, ...styles.wDescription, ...styles.celcius }}>{result.main.temp}°C</Text>
              </View>
            ) : (
              <View style={styles.weatherContainer}>

              </View>
            )}
          </View>
        </GestureRecognizer>
      </>
    );
  }
}

const styles = StyleSheet.create({
  mapView: { backgroundColor: 'black' },
  bar: {
    backgroundColor: "#dedede",
    width: "96%",
    marginLeft: "2%",
    height: 8,
    borderRadius: 5,
    marginBottom: 20,
  },
  buttonView: {
    backgroundColor: "black",
    width: "40%",
    marginLeft: "2%",
    marginTop: "2%",
    borderRadius: 5,
  },
  zoomWrapper: {
    position: 'absolute',
    marginLeft: "75%",
    marginTop: 580,

  },
  zoom: {
    width: "45%",
    marginLeft: "50%",
    marginTop: "3%",
    marginBottom: "3%"
  },
  weatherContainer: {
    backgroundColor: "#333",
    height: 140,
    borderRadius: 5,
    width: "50%",
    position: 'absolute',
    top: 32,
    left: "46%",
    paddingTop: 15,
  },
  white: {
    color: "white",
  },
  wDescription: {
    textAlign: 'center',
    margin: 2,
  },
  celcius: {
    fontSize: 40,
  }
})

let mapStyle = []