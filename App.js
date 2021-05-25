import React, { Component } from 'react';
import { StyleSheet, View, Button, Text, Image, TouchableHighlight } from 'react-native';
// import MapView from 'react-native-maps'
import MapView, { Marker, Callout } from 'react-native-maps'
import * as Location from 'expo-location';
import GestureRecognizer, { swipeDirections } from 'react-native-swipe-gestures';
import { mapRetro, mapAubergine, mapBlack } from './mapStyles'


export default class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      latitude: -36.88083800623871,
      longitude: 174.70746492207425,
      result: '',
      delta: 0.1,
      containerSwipeMargin: 680,
      currentLocation: {
        show: false,
      },
      showSettings: false,
      settings: {
        theme: 'Default',
        updating: false,
        updatingMarkerTitle: ''
      },
      markers: [],
      msgShow: false,
      msg: 'Updated Home',
    }
  }

  getLocation = async () => {
    try { // Added
      let { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== 'granted') {
        setErrorMsg('Permission to access location was denied');
        return;
      }

      let location = await Location.getCurrentPositionAsync({});
      this.setState({
        latitude: location.coords.latitude,
        longitude: location.coords.longitude,
        currentLocation: {
          show: true,
          latitude: location.coords.latitude,
          longitude: location.coords.longitude,
        }
      })
      return; // Added 
    } catch { this.getLocation(); } // Added

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
    let theme = ''
    if (mapStyle.length == 0) {
      mapStyle = mapBlack;
      theme = 'Black'
    } else if (mapStyle == mapBlack) {
      mapStyle = mapRetro;
      theme = 'Retro'
    } else if (mapStyle == mapRetro) {
      mapStyle = mapAubergine;
      theme = 'Aubergine'
    }
    else if (mapStyle == mapAubergine) {
      mapStyle = [];
      theme = 'Default'
    }
    this.setState({ settings: { ...this.state.settings, theme: theme } })
  }

  mapPressed = (e) => {
    let lat = e.nativeEvent.coordinate.latitude;
    let long = e.nativeEvent.coordinate.longitude;
    let updatingMarkerTitle = this.state.settings.updatingMarkerTitle;
    if (this.state.settings.updating) {
      // Check if the tag (e.g. Home) already exists in marker and remove it if it does exist
      let tempMarkers = [...this.state.markers]
      let markers = [] 
      for (var i = 0; i < tempMarkers.length; i++) {
        if (tempMarkers[i].title != updatingMarkerTitle) {
          markers.push(tempMarkers[i])
        }
      }

      // Create obj and add it to the settings
      markers.push(
      {
        latitude: lat, longitude: long, title: updatingMarkerTitle,
        des: 'This is your ' + updatingMarkerTitle
      })
      this.setState({ settings: { ...this.state.settings, updating: false }, markers: markers });
      this.setMsg('Sucessfully updated ' + updatingMarkerTitle);
    }
    else {
      // By default it should just update the marker on the map on press
      this.setState({ latitude: lat, longitude: long, });
    }

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

  toggleSettings = () => {
    this.setState({ showSettings: !(this.state.showSettings) });
  }

  changeMarker = (value) => {
    this.setMsg('Drop the pin by touching the map to update ' + value)
    this.setState({ showSettings: false, settings: { ...this.state.settings, updating: true, updatingMarkerTitle: value } });
  }

  setMsg = (msg) => {
    this.setState({ msgShow: true, msg: msg })
    let timeout = setTimeout(() => {
      // Add your logic for the transition
      this.setState({ msgShow: false })
    }, 5000);
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
      weather = result.weather[0];
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
          {
            this.state.markers.map((marker, i) => (
              <MapView.Marker title={marker.title} description={marker.des} key={i} coordinate={{ latitude: marker.latitude, longitude: marker.longitude }} />
            ))
          }

        </MapView>
        {this.state.msgShow ? (<View style={styles.msg}>
          <Text>{this.state.msg}</Text>
        </View>) : (<View></View>)}
        <View style={styles.mapTool}>
          <TouchableHighlight onPress={() => this.getLocation()} style={styles.mapToolSub}>
            <Image style={{ marginLeft: 2, marginBottom: 3, width: 40, height: 38, marginTop: 10 }} source={require('./location.png')} />
          </TouchableHighlight>
          <View style={styles.mapToolSub}>
            <Button onPress={() => this.changeZoom("decrease")} title="+" />
          </View>
          <View style={styles.mapToolSub}>
            <Button onPress={() => this.changeZoom("increase")} title="-" />
          </View>
        </View>
        <GestureRecognizer
          onSwipeUp={() => this.setState({ containerSwipeMargin: 680 })}
          onSwipeDown={() => this.setState({ containerSwipeMargin: 860 })}
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
              <Button title="Add to Fav" />
            </View>
            <View style={styles.buttonView}>
              <Button onPress={this.getWeather} title="View Favourites" />
            </View>
            <View style={styles.buttonView}>
              <Button onPress={this.getWeather} title="Get Weather" />
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
        {this.state.currentLocation.show ? (
          <Text style={{ position: 'absolute', marginTop: 30, marginLeft: 60 }}>Current location: {this.state.currentLocation.latitude}, {this.state.currentLocation.longitude}</Text>
        ) : (<Text></Text>)}

        {/* Settings */}
        <TouchableHighlight onPress={() => this.toggleSettings()} style={{ position: 'absolute', marginLeft: 10, alignItems: 'center', marginTop: 20, height: 50, width: 50, }}>
          <Image style={{ width: 30, height: 30, marginTop: 10 }} source={require('./settings.png')} />
        </TouchableHighlight>
        {this.state.showSettings ? (
          <View style={{ backgroundColor: 'white', position: 'absolute', width: '100%', height: "100%", zIndex: 1, paddingTop: "9%" }}>
            <View style={{ position: 'absolute', top: '98%', left: 10, width: 100, backgroundColor: 'green', }}>
              <Button onPress={() => this.toggleSettings()} title="Back">Back</Button>
            </View>
            <View style={styles.settingsElemWrapper}>
              <View style={styles.settingsElemLabel}><Text>{this.state.settings.theme}</Text></View>
              <View style={styles.settingsElemButton} ><Button onPress={this.changeTheme} title="Change Theme" /></View>
            </View>
            <View style={styles.settingsElemWrapper}>
              <View style={{ marginLeft: "5%", width: 150, height: 40 }} ><Button onPress={() => this.changeMarker("Home")} title="Change Home" /></View>
              <View style={styles.settingsElemButton} ><Button onPress={() => this.changeMarker("Work")} title="Change Work" /></View>
            </View>
          </View>
        ) : (
          <View>

          </View>
        )}
      </>
    );
  }
}

const styles = StyleSheet.create({
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
  settingsElemWrapper: {
    width: "40%",
    marginLeft: "6%",
    marginTop: "7%",
    borderRadius: 5,
    flexDirection: 'row',
  },
  settingsElemLabel: {
    backgroundColor: "#888",
    borderRadius: 10,
    width: 150,
    height: 38,
    marginLeft: '5%',
    alignItems: 'center',
    paddingTop: 8
  },
  settingsElemButton: {
    marginLeft: '20%',
    width: 150,
    height: 40
  },
  mapTool: {
    position: 'absolute',
    marginLeft: "75%",
    marginTop: 480,
    zIndex: 0,
  },
  mapToolSub: {
    width: "45%",
    marginLeft: "50%",
    marginTop: "3%",
    marginBottom: "3%",
    backgroundColor: 'rgba(217, 208, 184, 0.5)',
    borderRadius: 5
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
  },
  msg: {
    position: 'absolute',
    marginTop: 70,
    width: '100%',
    height: 50,
    backgroundColor: "rgba(217, 208, 184, 0.8)",
    alignItems: 'center',
  }
})

let mapStyle = []