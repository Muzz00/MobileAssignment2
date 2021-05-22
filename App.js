import React, { Component } from 'react';
import { StyleSheet, View, Button, Text } from 'react-native';
// import MapView from 'react-native-maps'
import MapView, { Marker, Callout } from 'react-native-maps'
import * as Location from 'expo-location';



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
    // this._getLocation();
    console.log("hello")
    this.updateLocation();
    this.forceUpdate();
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
    let latitude = -36.88083800623871;
    let longitude = 174.70746492207425;
    // try {
    //   console.log('fetching')
      let result = await fetch(
        'https://api.openweathermap.org/data/2.5/weather?lat=-36.88083800623871&lon=174.70746492207425&appid=d9b7491733da14e804ae98f8a6cfdf7b'
      ).then((response)=>response.json()).catch(error => {
        console.log('found error', error)
      })
    console.log(result.coord.lon + "this");
    this.setState({result: result})      
      // console.log(response);
      // let json = await response.json();
  
  

  }
  render() {
    console.log('sfad');
    let latitude = 33.7872131;
    let longitude = -84.381931;

    // If the lat or long has changed update it 
    if (this.state.latitude != 0) {
      latitude = this.state.latitude;
      longitude = this.state.longitude;
    }

    let result = this.state.result;
    if (result !=""){
      console.log(result.coord.lon);
    }
    


    return (
      <>
        <MapView
          style={{ ...StyleSheet.absoluteFillObject }}
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
        </View>
      </>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    marginTop: 750,
    backgroundColor: "white",
    padding: 10,
  },
  txt: {
    backgroundColor: "#dedede",
  },
  getLocButton: {
    // position: absolute,
    backgroundColor: "black",
    width: "40%",
    marginLeft: 10,
    marginTop: 10,
    borderRadius: 5,
  }
})